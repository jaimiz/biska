import { Preferences } from "@/state/schema";
import { memoryAppStateAtom, storageAppStateAtom } from "@/state/state";
import { WritableAtom, atom } from "jotai";

export const preferencesAtom = atom(
	(get) => {
		return get(memoryAppStateAtom).preferences;
	},
	(get, set, update: Partial<Preferences>) => {
		const prev = get(memoryAppStateAtom);
		const prefs = prev.preferences;
		set(storageAppStateAtom, {
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
