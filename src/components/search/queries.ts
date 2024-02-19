import { AppBskyFeedSearchPosts } from "@atproto/api";
import {
	InfiniteData,
	QueryKey,
	useInfiniteQuery,
} from "@tanstack/react-query";
import { postKeys } from "../feed/post-queries";
import { getAgent } from "@/lib/api";

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
			return res.data;
		},
		initialPageParam: undefined,
		getNextPageParam: (lastPage) => lastPage.cursor,
	});
}
