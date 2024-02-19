import { Preferences } from "@/state/schema";
import { appStateAtom, persisted } from "@/state/state";
import { WritableAtom, atom } from "jotai";

export const preferencesAtom = atom(
	(get) => {
		return get(appStateAtom).preferences;
	},
	(get, set, update: Partial<Preferences>) => {
		const prev = get(appStateAtom);
		const prefs = prev.preferences;
		set(appStateAtom, {
			...prev,
			preferences: {
				...prefs,
				...update,
			},
		});
		persisted.write("preferences", {
			...prefs,
			...update,
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

// export const behaviorPreferencesAtom = atom(
// 	(get) => {
// 		return get(preferencesAtom).behavior;
// 	},
// 	(get, set, update: Preferences["behavior"]) => {
// 		const prev = get(behaviorPreferencesAtom);
// 		set(preferencesAtom, {
// 			behavior: {
// 				...prev,
// 				...update,
// 			},
// 		});
// 	},
// );
export const behaviorPreferencesAtom = deriveAtomProperty(
	preferencesAtom,
	"behavior",
);

export const interfacePreferencesAtom = atom(
	(get) => {
		return get(preferencesAtom).interface;
	},
	(get, set, update: Partial<Preferences["interface"]>) => {
		const prev = get(interfacePreferencesAtom);
		set(preferencesAtom, {
			interface: {
				...prev,
				...update,
			},
		});
	},
);
