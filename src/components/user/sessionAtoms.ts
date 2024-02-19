import { Session } from "@/state/schema";
import { memoryAppStateAtom } from "@/state/state";
import { atom } from "jotai";

const sessionAtom = atom((get): Session => {
	const { session } = get(memoryAppStateAtom);
	return {
		currentAccount: undefined,
		...session,
	};
});

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
