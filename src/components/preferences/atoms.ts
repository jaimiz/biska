import { Preferences } from "@/state/schema";
import { appStateAtom } from "@/state/state";
import { WritableAtom, atom } from "jotai";
import { atomEffect } from "jotai-effect";
import { isLoggedInAtom } from "../user/sessionAtoms";

export const preferencesAtom = atom(
	(get) => {
		return get(appStateAtom).preferences;
	},
	(get, set, update: Partial<Preferences>) => {
		const prev = get(appStateAtom);
		const prefs = prev.preferences;
		set(appStateAtom, {
			preferences: {
				...prefs,
				...update,
			},
		});
	},
);

const deriveAtomProperty = <
	T extends Record<string, unknown>,
	K extends keyof T,
>(
	baseAtom: WritableAtom<T, [Partial<T>], void>,
	propName: K,
) => {
	return atom(
		(get) => get(baseAtom)[propName],
		(get, set, update) => {
			const prevValue = get(baseAtom);
			const nextValue =
				typeof update === "function" ? update(prevValue[propName]) : update;
			set(baseAtom, {
				...prevValue,
				[propName]: nextValue,
			});
		},
	);
};

export const behaviorPreferencesAtom = deriveAtomProperty(
	preferencesAtom,
	"behavior",
);

export const interfacePreferencesAtom = deriveAtomProperty(
	preferencesAtom,
	"interface",
);

export const prefsPaneIsOpenAtom = atom(false);

export const effectResetPrefsPaneOnLogout = atomEffect((get, set) => {
	const loggedIn = get(isLoggedInAtom);
	if (!loggedIn) {
		set(prefsPaneIsOpenAtom, false);
	}
});
