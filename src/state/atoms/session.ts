import { atom } from "jotai";
import { Session } from "../schema";
import { appStateAtom, persisted } from "../state";

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
