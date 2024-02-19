import { atom, getDefaultStore } from "jotai";
import * as localforage from "localforage";
import { AppSchema, StorageSchema, defaultAppSchema } from "./schema.ts";

const BISKA_STORAGE_VERSION = "0.0.0";
export const BISKA_STORAGE_KEY = "BISKA";
localforage.config({
	name: `${BISKA_STORAGE_KEY}_v${BISKA_STORAGE_VERSION}`,
});

export const atomStore = getDefaultStore();
export const memoryAppStateAtom = atom<AppSchema>(defaultAppSchema);

export const storageAppStateAtom = atom(
	async (get) => {
		const rawData = await localforage.getItem<unknown>(BISKA_STORAGE_KEY);
		if (StorageSchema.safeParse(rawData).success) {
			return rawData as AppSchema;
		}
		return get(memoryAppStateAtom);
	},
	(get, set, update: Partial<AppSchema>) => {
		const prev = get(memoryAppStateAtom);
		const next = {
			...prev,
			...update,
		};
		const parsed = StorageSchema.parse(next);
		set(memoryAppStateAtom, parsed);
		localforage
			.setItem(BISKA_STORAGE_KEY, { ...prev, ...update })
			.catch((e) => {
				console.error("Error writing to persistent storage", e);
				console.error(update);
			});
	},
);

export const initializeStoredState = (state: StorageSchema | undefined) => {
	return {
		...defaultAppSchema,
		...state,
	};
};
