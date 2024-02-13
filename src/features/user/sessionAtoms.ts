import { Session } from "@/state/schema";
import { appStateAtom, persisted } from "@/state/state";
import { atom } from "jotai";

type SessionState = {
	isInitialLoad: boolean;
};
export const sessionStateAtom = atom(
	(get) => {
		return get(appStateAtom).sessionState;
	},
	(get, set, sessionState: SessionState) => {
		const prev = get(appStateAtom);
		set(appStateAtom, {
			...prev,
			sessionState,
		});
	},
);

export const sessionAtom = atom(
	(get): Session => {
		const { session } = get(appStateAtom);
		return {
			currentAccount: undefined,
			...session,
		};
	},
	(_, __, session: Session) => {
		persisted.write("session", session);
		return session;
	},
);

export const currentAccountAtom = atom((get) => {
	return get(sessionAtom).currentAccount;
});

export const requireAccountAtom = atom((get) => {
	const account = get(sessionAtom).currentAccount;
	if (!account) {
		throw new Error("User not logged in");
	}
	return account;
});
