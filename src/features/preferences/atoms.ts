import { Preferences } from "@/state/schema";
import { appStateAtom, persisted } from "@/state/state";
import { atom } from "jotai";

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

export const behaviorPreferencesAtom = atom(
	(get) => {
		return get(preferencesAtom).behavior;
	},
	(get, set, update: Preferences["behavior"]) => {
		const prev = get(behaviorPreferencesAtom);
		set(preferencesAtom, {
			behavior: {
				...prev,
				...update,
			},
		});
	},
);

export const interfacePreferencesAtom = atom(
	(get) => {
		return get(preferencesAtom).interface;
	},
	(get, set, update: Preferences["interface"]) => {
		const prev = get(interfacePreferencesAtom);
		set(preferencesAtom, {
			interface: {
				...prev,
				...update,
			},
		});
	},
);
