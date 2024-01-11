import { atom, getDefaultStore } from "jotai";
import * as localforage from "localforage";
import { AppSchema, AppSchemaKey, defaultAppSchema } from "./schema.ts";

const rootStateAtom = atom<AppSchema>(defaultAppSchema);
export const stateStore = getDefaultStore();
const BISKA_STORAGE_VERSION = "0.0.0";

localforage.config({
	name: `BISKA_v${BISKA_STORAGE_VERSION}`,
});

export const BISKA_STORAGE_KEY = "BISKA";

const storage = {
	async write(value: AppSchema) {
		try {
			AppSchema.parse(value);
			await localforage.setItem(BISKA_STORAGE_KEY, value);
		} catch (e) {
			console.log("error writing to persistent storage");
		}
	},

	async read(): Promise<AppSchema | undefined> {
		const rawData = await localforage.getItem<unknown>(BISKA_STORAGE_KEY);
		if (AppSchema.safeParse(rawData).success) {
			return rawData as AppSchema;
		}
	},
};

export async function init() {
	try {
		const stored = await storage.read(); // check for new store
		// TODO: check if app version has changed
		if (!stored) await storage.write(defaultAppSchema); // opt: init new store
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
		storage.write(stateStore.get(rootStateAtom));
	} catch (e) {
		console.error("error persisting state to store");
	}
}
