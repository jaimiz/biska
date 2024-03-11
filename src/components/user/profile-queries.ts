import { useCurrentAgent } from "@/lib/agent";
import { isBlockedByError, isBlockingError } from "@/lib/errors";
import { Did } from "@/state/schema";
import { AppBskyFeedDefs, AppBskyFeedGetAuthorFeed } from "@atproto/api";
import { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const RQKEY = (did?: Did) => ["profile", did ?? ""];

export const profileKeys = {
	all: ["profile"] as const,
	details: () => [...profileKeys.all, "detail"],
	detail: (did: Did) => [...profileKeys.details(), did] as const,
	feeds: () => [...profileKeys.all, "feeds"] as const,
	actorFeeds: (actor: string) => [...profileKeys.feeds(), actor] as const,
	actorFeed: (actor: string, filter: AuthorFeedFilters) =>
		[...profileKeys.actorFeeds(actor), filter] as const,
};

export function useProfileQuery({ did }: { did: Did }) {
	const agent = useCurrentAgent();
	return useQuery({
		queryKey: profileKeys.detail(did),
		queryFn: async () => {
			const res = await agent.getProfile({
				actor: did ?? "",
			});
			return res.data as ProfileViewDetailed;
		},
		enabled: !!did,
	});
}

export type SkylineSliceItem = {
	post: AppBskyFeedDefs.PostView;
	reason?: AppBskyFeedDefs.ReasonRepost;
};

export type AuthorFeedFilters = AppBskyFeedGetAuthorFeed.QueryParams["filter"];

export const useProfilePosts = (
	actor: string,
	filter: AuthorFeedFilters = "posts_no_replies",
) => {
	const agent = useCurrentAgent();
	const profilePostsQuery = useInfiniteQuery<{
		cursor?: string;
		feed: AppBskyFeedDefs.FeedViewPost[];
	}>({
		getNextPageParam: (lastPage) => lastPage.cursor,
		getPreviousPageParam: (firstPage) => firstPage.cursor,
		initialPageParam: undefined,
		queryKey: profileKeys.actorFeed(actor, filter),
		queryFn: async ({ pageParam }) => {
			const res = await agent.getAuthorFeed({
				actor,
				filter,
				cursor: (pageParam as string) ?? undefined,
			});
			const { cursor, feed } = res.data;
			return { cursor, feed } as const;
		},
		retry: (count, error) => {
			if (isBlockedByError(error) || isBlockingError(error)) {
				return false;
			}

			return count < 2;
		},
	});

	const profilePostsData = useMemo(() => {
		if (!profilePostsQuery.data) return [];
		const flat = profilePostsQuery.data.pages.flatMap((page) => page.feed);
		return flat.flatMap<SkylineSliceItem>((item) => {
			return {
				post: item.post,
				reason: item.reason as AppBskyFeedDefs.ReasonRepost,
			};
		});
	}, [profilePostsQuery]);

	return { profilePostsQuery, profilePostsData };
};
