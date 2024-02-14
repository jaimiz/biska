import { atomStore } from "@/state/state";
import { AppBskyFeedDefs } from "@atproto/api";
import { atomFamily, atomWithStorage } from "jotai/utils";

export const postsFamily = atomFamily(
	(post: Partial<AppBskyFeedDefs.PostView> & { uri: string }) =>
		atomWithStorage(post.uri, post),
	(a, b) => {
		return a.uri === b.uri;
	},
);

export const updatePostAtom = (
	postUri: string,
	postData: Partial<AppBskyFeedDefs.PostView>,
) => {
	const postCacheAtom = postsFamily({ uri: postUri });
	console.log("updating cache for post", postUri);
	return atomStore.set(postCacheAtom, (prev) => ({
		...prev,
		...postData,
	}));
};
