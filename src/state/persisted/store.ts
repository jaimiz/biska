import * as localforage from 'localforage';
import { AppSchema } from './schema';

const YABC_STORAGE_VERSION = "0.0.0";

localforage.config({
	name: `YABC_v${YABC_STORAGE_VERSION}`,
})

export const YABC_STORAGE_KEY = 'YABC';

export async function write(value: AppSchema) {
	try {
		AppSchema.parse(value);
		await localforage.setItem(YABC_STORAGE_KEY,
			value
		)
	} catch (e) {
		console.log("error writing to persistent storage")
	}
}

export async function read(): Promise<AppSchema | undefined> {
	const rawData = await localforage.getItem < unknown > (YABC_STORAGE_KEY);
	if (AppSchema.safeParse(rawData).success) {
		return rawData as AppSchema;
	}
}
