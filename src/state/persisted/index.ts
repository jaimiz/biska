import { atom, getDefaultStore } from "jotai";
import { AppSchema, AppSchemaKey, defaultAppSchema } from "./schema.ts";
import * as store from "./store.ts";

const rootStateAtom = atom<AppSchema>(defaultAppSchema);
export const stateStore = getDefaultStore();

export async function init() {
	try {
		const stored = await store.read(); // check for new store
		if (!stored) await store.write(defaultAppSchema); // opt: init new store
		stateStore.set(rootStateAtom, stored || defaultAppSchema);
	} catch (e) {
		console.error("persisted state: failed to load root state from storage", {
			error: e,
		});
		// AsyncStorage failured, but we can still continue in memory
		return defaultAppSchema;
	}
}

export function get<K extends AppSchemaKey>(key: K) {
	return stateStore.get(rootStateAtom)[key];
}

export function write<K extends AppSchemaKey>(key: K, value: AppSchema[K]) {
	try {
		stateStore.set(rootStateAtom, (prevState) => ({
			...prevState,
			[key]: value,
		}));
		store.write(stateStore.get(rootStateAtom));
	} catch (e) {
		console.error("error persisting state to store");
	}
}
