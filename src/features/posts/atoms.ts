import { atomStore } from "@/state/state";
import { AppBskyFeedDefs } from "@atproto/api";
import { atomWithStorage } from "jotai/utils";

export const postsCacheAtom = atomWithStorage("posts", {});

export const updatePostAtom = (
	postUri: string,
	postData: Partial<AppBskyFeedDefs.PostView>,
) => {
	console.log("updating cache for post", postUri);
	return atomStore.set(postsCacheAtom, (prev) => ({
		...prev,
		[postUri]: postData,
	}));
};
