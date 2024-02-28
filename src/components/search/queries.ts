import { useCurrentAgent } from "@/lib/agent";
import { AppBskyFeedSearchPosts } from "@atproto/api";
import {
	InfiniteData,
	QueryKey,
	useInfiniteQuery,
} from "@tanstack/react-query";
import { postKeys } from "../feed/post-queries";

export function useSearchPostsQuery({ query }: { query: string }) {
	const agent = useCurrentAgent();
	return useInfiniteQuery<
		AppBskyFeedSearchPosts.OutputSchema,
		Error,
		InfiniteData<AppBskyFeedSearchPosts.OutputSchema>,
		QueryKey,
		string | undefined
	>({
		queryKey: postKeys.search(query),
		queryFn: async ({ pageParam }) => {
			const res = await agent.app.bsky.feed.searchPosts({
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
