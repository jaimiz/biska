import { setSessionAndPersist } from "@/lib/agent";
import { AppSchema, PersistedAccount, Session } from "@/state/schema";
import { appStateAtom } from "@/state/state";
import { atom } from "jotai";

const sessionAtom = atom(
	(get): Session => {
		const appstate = get(appStateAtom);
		const { session } = appstate;
		return session;
	},
	(get, set, update: AppSchema["session"]) => {
		const prev = get(appStateAtom);
		set(appStateAtom, {
			...prev,
			session: update,
		});
	},
);

export const accountsAtom = atom(
	(get) => get(sessionAtom).accounts,
	(get, set, accounts: Session["accounts"]) => {
		const prev = get(sessionAtom);
		set(sessionAtom, {
			...prev,
			accounts,
		});
	},
);

export const upsertAccountAtom = atom(
	null,
	(_, __, account: PersistedAccount, expired = false) => {
		setSessionAndPersist((prev) => ({
			...prev,
			currentAccount: expired ? undefined : account,
			accounts: [
				account,
				...prev.accounts.filter((a) => a.did !== account.did),
			],
		}));
	},
);

export const removeAccountAtom = atom(
	null,
	(get, set, account: PersistedAccount) => {
		const accounts = get(accountsAtom);
		const next = accounts.filter((a) => a.did !== account.did);
		set(accountsAtom, next);
		// if no more accounts, also clear the current account (and logout)
		if (next.length === 0) {
			set(upsertAccountAtom, account, true);
		}
	},
);

export const maybeAccountAtom = atom((get) => {
	return get(sessionAtom).currentAccount;
});

export const isLoggedInAtom = atom((get) => {
	return get(sessionAtom).currentAccount !== undefined;
});

export const requireAccountAtom = atom((get) => {
	const account = get(sessionAtom).currentAccount;
	if (!account) {
		throw new Error("User not logged in");
	}
	return account;
});
