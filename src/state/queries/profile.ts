import {
	AppBskyFeedDefs,
	AppBskyFeedGetAuthorFeed,
	AppBskyFeedPost,
} from "@atproto/api";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Did } from "../persisted/schema";
import { getAgent } from "../session";

export const RQKEY = (did?: Did) => ["profile", did ?? ""];

export function useProfileQuery({ did }: { did: Did | undefined }) {
	return useQuery({
		queryKey: RQKEY(did),
		queryFn: async () => {
			const res = await getAgent().getProfile({ actor: did ?? "" });
			return res.data;
		},
		enabled: !!did,
	});
}

type TimelineEntry = {
	item: AuthorFeedItem;
	hasReply: boolean;
	filter: AuthorFeedFilters;
};

type AuthorFeedItem = {
	uri: string;
	post: AppBskyFeedDefs.PostView;
	record: AppBskyFeedPost.Record;
	reason?: AppBskyFeedDefs.ReasonRepost;
};

type AuthorFeedFilters = AppBskyFeedGetAuthorFeed.QueryParams["filter"];

async function fetchUserPosts(params: AppBskyFeedGetAuthorFeed.QueryParams) {
	const res = await getAgent().getAuthorFeed({
		...params,
	});
	if (!res.success) {
		return { posts: [], cursor: undefined };
	}
	const { cursor, feed } = res.data;
	return { cursor, feed } as const;
}

export const useProfilePosts = (
	handle?: string,
	filter: AuthorFeedFilters = "posts_no_replies",
) => {
	const agent = getAgent();

	const actor = handle ?? agent.session?.did;

	const profilePostsQuery = useInfiniteQuery<
		Awaited<ReturnType<typeof fetchUserPosts>>
	>({
		initialPageParam: undefined,
		getPreviousPageParam: (firstPage) => firstPage.cursor,
		getNextPageParam: (lastPage) => lastPage.cursor,
		queryKey: ["profile", actor, "feed", filter],
		queryFn: async ({ pageParam }): ReturnType<typeof fetchUserPosts> => {
			if (!actor) throw new Error("Not logged in");
			return await fetchUserPosts({
				actor,
				filter,
				cursor: (pageParam as string) ?? undefined,
			});
		},
	});

	const profilePostsData = useMemo(() => {
		if (!profilePostsQuery.data) return [];
		const flat = profilePostsQuery.data.pages
			.flatMap((page) => page.feed as AppBskyFeedDefs.FeedViewPost[])
			.filter((item) => {
				console.log({ item });
				return item !== undefined;
			});
		return flat.flatMap<TimelineEntry>((item) => {
			return [
				{
					item: {
						record: item.post.record as AppBskyFeedPost.Record,
						post: item.post,
						uri: item.post.uri,
						reason: item.reason as AppBskyFeedDefs.ReasonRepost,
					},
					hasReply: false,
					filter,
				},
			];
		});
	}, [profilePostsQuery, filter]);

	return { profilePostsQuery, profilePostsData };
};
