import { getAgent } from "@/services/api";
import { AppBskyFeedSearchPosts } from "@atproto/api";
import {
	InfiniteData,
	QueryKey,
	useInfiniteQuery,
} from "@tanstack/react-query";
import { updatePostAtom } from "../posts/atoms";
import { postKeys } from "../posts/queries";

export function useSearchPostsQuery({ query }: { query: string }) {
	return useInfiniteQuery<
		AppBskyFeedSearchPosts.OutputSchema,
		Error,
		InfiniteData<AppBskyFeedSearchPosts.OutputSchema>,
		QueryKey,
		string | undefined
	>({
		queryKey: postKeys.search(query),
		queryFn: async ({ pageParam }) => {
			const res = await getAgent().app.bsky.feed.searchPosts({
				q: query,
				limit: 25,
				cursor: pageParam,
			});
			if (res.data.posts.length > 0) {
				for (const post of res.data.posts) {
					updatePostAtom(post.cid, post);
				}
			}
			return res.data;
		},
		initialPageParam: undefined,
		getNextPageParam: (lastPage) => lastPage.cursor,
	});
}
