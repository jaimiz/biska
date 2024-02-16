import { atomStore } from "@/state/state";
import { WritableAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const cacheAtoms: Record<
	string,
	WritableAtom<Record<string, unknown>, unknown[], Record<string, unknown>>
> = {};
export const makeCache = (cacheKey: string) => {
	return {
		read: getFromCache(cacheKey),
		write: updateCache(cacheKey),
		get atom() {
			return (
				cacheAtoms[cacheKey as keyof typeof cacheAtoms] ??
				atomWithStorage(cacheKey, {})
			);
		},
	};
};

const getFromCache = (cacheKey: string) => (propKey: string) => {
	const currentCacheAtom =
		cacheAtoms[cacheKey as keyof typeof cacheAtoms] ??
		atomWithStorage(cacheKey, {});
	const currentCache = atomStore.get(currentCacheAtom);
	return currentCache[propKey] ?? undefined;
};
const updateCache =
	(cacheKey: string) => (propKey: string, propValue: unknown) => {
		const currentCacheAtom =
			cacheAtoms[cacheKey as keyof typeof cacheAtoms] ??
			atomWithStorage(cacheKey, {});
		return atomStore.set(currentCacheAtom, (prev: Record<string, unknown>) => ({
			...prev,
			[propKey]: propValue,
		}));
	};

const postsCache = makeCache("posts");
export const { atom: postsCacheAtom } = postsCache;
export const { write: updatePostAtom } = postsCache;
