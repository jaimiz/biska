import { atom, getDefaultStore } from "jotai";
import * as localforage from "localforage";
import { AppSchema, defaultAppSchema } from "./schema.ts";

export const BISKA_STORAGE_VERSION = "0.0.0";
export const BISKA_STORAGE_KEY = "BISKA";
localforage.config({
	name: `${BISKA_STORAGE_KEY}_v${BISKA_STORAGE_VERSION}`,
});

export const atomStore = getDefaultStore();

const stateAtom = atom(defaultAppSchema);
type StateUpdate = Partial<AppSchema> | ((prev: AppSchema) => AppSchema);

/*
 * This atom handles both in memory state and persistent storage all in one
 * Whenever you `get` from it, it will return the current memory state.
 * Whenever you `set`, it updates the in-memory state and writes to persistent storage
 * If writing fails, it logs but does not fail as we don't want to break the app
 * in this case
 */
export const appStateAtom = atom(
	(get) => {
		return get(stateAtom);
	},
	(get, set, update: StateUpdate) => {
		const prev = get(stateAtom);
		const next =
			typeof update === "function" ? update(prev) : { ...prev, ...update };
		const parsed = AppSchema.parse(next);
		set(stateAtom, {
			...parsed,
		});
		localforage.setItem(BISKA_STORAGE_KEY, parsed).catch((e) => {
			console.error("Error writing to persistent storage", e);
			console.error(update);
		});
	},
);
