import {
	AppBskyFeedDefs,
	AppBskyFeedGetAuthorFeed,
	AppBskyFeedPost,
} from "@atproto/api";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Did } from "../persisted/schema";
import { getAgent } from "../session";
import { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";

export const RQKEY = (did?: Did) => ["profile", did ?? ""];

export function useProfileQuery({ did }: { did: Did | undefined }) {
	return useQuery({
		queryKey: RQKEY(did),
		queryFn: async () => {
			const res = await getAgent().getProfile({ actor: did ?? "" });
			return res.data as ProfileViewDetailed;
		},
		enabled: !!did,
	});
}

export type SkylineSliceItem = {
	record: AppBskyFeedPost.Record;
	post: AppBskyFeedDefs.PostView;
	reason: AppBskyFeedDefs.ReasonRepost;
};

export type AuthorFeedFilters = AppBskyFeedGetAuthorFeed.QueryParams["filter"];

export const useProfilePosts = (
	handle?: string,
	filter: AuthorFeedFilters = "posts_no_replies",
) => {
	const agent = getAgent();

	const actor = handle ?? agent.session?.did;

	if (!actor) throw new Error("Not logged in");

	const profilePostsQuery = useInfiniteQuery<{
		cursor?: string;
		feed: AppBskyFeedDefs.FeedViewPost[];
	}>({
		getNextPageParam: (lastPage) => lastPage.cursor,
		getPreviousPageParam: (firstPage) => firstPage.cursor,
		initialPageParam: undefined,
		queryKey: ["profile", actor, "feed", filter],
		queryFn: async ({ pageParam }) => {
			const res = await getAgent().getAuthorFeed({
				actor,
				filter,
				cursor: (pageParam as string) ?? undefined,
			});
			const { cursor, feed } = res.data;
			return { cursor, feed } as const;
		},
	});

	const profilePostsData = useMemo(() => {
		if (!profilePostsQuery.data) return [];
		const flat = profilePostsQuery.data.pages.flatMap((page) => page.feed);
		return flat.flatMap<SkylineSliceItem>((item) => {
			return {
				record: item.post.record as AppBskyFeedPost.Record,
				post: item.post,
				reason: item.reason as AppBskyFeedDefs.ReasonRepost,
			};
		});
	}, [profilePostsQuery]);

	return { profilePostsQuery, profilePostsData };
};
