import { atomStore } from "@/state/state";
import { AppBskyFeedDefs } from "@atproto/api";
import { atom } from "jotai";
import { focusAtom } from "jotai-optics";

type PostsCache = Record<string, AppBskyFeedDefs.PostView>;
const postsCache = atom<PostsCache>({});

export const getPostAtom = (postDid: string) => {
	return focusAtom(postsCache, (optic) => optic.prop(postDid)) ?? undefined;
};

export const updatePostAtom = (
	postDid: string,
	postData: Partial<AppBskyFeedDefs.PostView>,
) => {
	const postCacheAtom = getPostAtom(postDid);
	console.log("updating cache for post", postDid);
	return atomStore.set(postCacheAtom, (prev) => ({
		...prev,
		[postDid]: postData,
	}));
};
