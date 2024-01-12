import { getAgent } from "@/services/api";
import { AppBskyFeedSearchPosts } from "@atproto/api";
import {
	QueryKey,
	InfiniteData,
	useInfiniteQuery,
} from "@tanstack/react-query";

const searchPostsQueryKey = ({ query }: { query: string }) => [
	"search-posts",
	query,
];

export function useSearchPostsQuery({ query }: { query: string }) {
	return useInfiniteQuery<
		AppBskyFeedSearchPosts.OutputSchema,
		Error,
		InfiniteData<AppBskyFeedSearchPosts.OutputSchema>,
		QueryKey,
		string | undefined
	>({
		queryKey: searchPostsQueryKey({ query }),
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
