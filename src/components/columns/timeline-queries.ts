import { useCurrentAgent } from "@/lib/agent";
import { Did } from "@/state/schema";
import { AppBskyFeedDefs } from "@atproto/api";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const timelineKeys = {
	all: ["timeline"] as const,
	accounts: () => [...timelineKeys.all, "accounts"] as const,
	account: (did: Did) => [...timelineKeys.accounts(), did] as const,
};

export function useTimelineQuery(did: Did) {
	const agent = useCurrentAgent();
	return useQuery({
		queryKey: timelineKeys.account(did),
		queryFn: async () => {
			const res = await agent.getTimeline({
				limit: 1,
			});
			return res.data.feed[0];
		},
	});
}

export function useHomeQuery(did: Did) {
	const agent = useCurrentAgent();
	return useInfiniteQuery({
		queryKey: timelineKeys.account(did),
		queryFn: async ({ pageParam }: { pageParam: string | undefined }) => {
			const res = await agent.getTimeline({
				cursor: pageParam,
				limit: 50,
			});
			if (res.success) {
				return {
					cursor: res.data.cursor,
					posts: res.data.feed,
				};
			}
			return {
				cursor: undefined,
				posts: [],
			};
		},
		initialPageParam: undefined,
		getNextPageParam: (lastPage) => lastPage.cursor,
	});
}

export const useTimeline = (did: Did) => {
	const agent = useCurrentAgent();

	const timeline = useInfiniteQuery({
		queryKey: timelineKeys.account(did),
		queryFn: async ({ pageParam }: { pageParam: string | undefined }) => {
			const timeline = await agent.getTimeline({
				cursor: pageParam,
			});
			if (timeline.success) {
				return { posts: timeline.data.feed, cursor: timeline.data.cursor };
			}
			return { posts: [], cursor: undefined };
		},
		initialPageParam: undefined,
		getNextPageParam: (lastPage) => lastPage.cursor,
	});

	const data = useMemo(() => {
		if (!timeline.data) return [];
		const flattened = timeline.data.pages.flatMap((page) => page.posts);
		return flattened.flatMap((item) => {
			if (
				item.reply &&
				(AppBskyFeedDefs.isBlockedPost(item.reply.parent) ||
					AppBskyFeedDefs.isBlockedPost(item.reply.root))
			) {
				return [];
			}

			// mini threads

			return [{ ...item }];
		});
	}, [timeline.data]);

	return { timeline, data };
};
