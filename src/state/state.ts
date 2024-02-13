import { atom, getDefaultStore } from "jotai";
import * as localforage from "localforage";
import {
	AppSchema,
	StorageSchema,
	StorageSchemaKey,
	defaultAppSchema,
} from "./schema.ts";

export const atomStore = getDefaultStore();
export const appStateAtom = atom(defaultAppSchema);

export const initializeStoredState = (state: StorageSchema | undefined) => {
	return {
		...defaultAppSchema,
		...state,
	};
};

const BISKA_STORAGE_VERSION = "0.0.0";
export const BISKA_STORAGE_KEY = "BISKA";
localforage.config({
	name: `${BISKA_STORAGE_KEY}_v${BISKA_STORAGE_VERSION}`,
});

const storage = {
	async write(value: AppSchema) {
		try {
			// We parse using StorageSchema to ensure that extraneous keys are removed
			const parsed = StorageSchema.parse(value);
			await localforage.setItem(BISKA_STORAGE_KEY, parsed);
		} catch (e) {
			console.error(e);
			console.log("error writing to persistent storage");
		}
	},

	async read(): Promise<StorageSchema | undefined> {
		const rawData = await localforage.getItem<unknown>(BISKA_STORAGE_KEY);
		if (StorageSchema.safeParse(rawData).success) {
			return rawData as AppSchema;
		}
	},
};

export const persisted = {
	async init() {
		try {
			const stored = await storage.read(); // check for new store
			if (!stored) await storage.write(defaultAppSchema); // opt: init new store
			atomStore.set(appStateAtom, initializeStoredState(stored));
			return atomStore.get(appStateAtom);
		} catch (e) {
			console.error("persisted state: failed to load root state from storage", {
				error: e,
			});
			// AsyncStorage failured, but we can still continue in memory
			return defaultAppSchema;
		}
	},

	get<K extends StorageSchemaKey>(key: K) {
		return atomStore.get(appStateAtom)[key];
	},

	write<K extends StorageSchemaKey>(key: K, value: StorageSchema[K]) {
		try {
			atomStore.set(appStateAtom, (prevState) => ({
				...prevState,
				[key]: value,
			}));
			storage.write({ ...atomStore.get(appStateAtom) });
		} catch (e) {
			console.error("error persisting state to store", { e });
		}
	},
};
