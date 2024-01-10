import * as localforage from "localforage";
import { AppSchema } from "./schema";

const BISKA_STORAGE_VERSION = "0.0.0";

localforage.config({
	name: `BISKA_v${BISKA_STORAGE_VERSION}`,
});

export const BISKA_STORAGE_KEY = "BISKA";

export async function write(value: AppSchema) {
	try {
		AppSchema.parse(value);
		await localforage.setItem(BISKA_STORAGE_KEY, value);
	} catch (e) {
		console.log("error writing to persistent storage");
	}
}

export async function read(): Promise<AppSchema | undefined> {
	const rawData = await localforage.getItem<unknown>(BISKA_STORAGE_KEY);
	if (AppSchema.safeParse(rawData).success) {
		return rawData as AppSchema;
	}
}
