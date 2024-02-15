import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getAgent } from "@/services/api";
import { AppBskyFeedDefs } from "@atproto/api";
import { SkylineSliceItem } from "../user/profileQueries";
import { postsCacheAtom, updatePostAtom } from "./atoms";
import { useAtomValue } from "jotai";

export const postKeys = {
	all: ["posts"] as const,
	details: () => [...postKeys.all, "single"] as const,
	detail: ({ uri }: { uri: string }) =>
		[...postKeys.details(), { uri }] as const,
	searches: () => [...postKeys.all, "search"] as const,
	search: (query: string) => [...postKeys.searches(), { query }] as const,
};

export const usePost = (uri: string) => {
	const postsCache = useAtomValue(postsCacheAtom);
	const queryClient = useQueryClient();
	if (postsCache[uri as keyof typeof postsCache]) {
		queryClient.setQueryData(
			postKeys.detail({ uri }),
			postsCache[uri as keyof typeof postsCache],
		);
	}
	return usePostQuery({ uri });
};

export const usePostQuery = ({ uri }: { uri: string }) => {
	const agent = getAgent();

	return useQuery({
		queryKey: postKeys.detail({ uri }),
		queryFn: async () => {
			const res = await agent.getPosts({
				uris: [uri],
			});
			if (res.success && res.data.posts[0]) {
				return res.data.posts[0];
			}
			throw new Error(`no data for post ${uri}`);
		},
		enabled: !!uri,
	});
};

export function usePostLikeMutation(post: AppBskyFeedDefs.PostView) {
	const queryClient = useQueryClient();
	return useMutation<
		{ uri: string }, // responds with the uri of the like
		Error,
		SkylineSliceItem["post"]
	>({
		mutationFn: (post) => getAgent().like(post.uri, post.cid),
		onSuccess: (data) => {
			queryClient.setQueryData<Partial<AppBskyFeedDefs.PostView>>(
				postKeys.detail({ uri: post.uri }),
				(oldData) => {
					const newData = {
						...oldData,
						likeCount: (oldData?.likeCount ?? 0) + 1,
						viewer: {
							...oldData?.viewer,
							like: data.uri,
						},
					};
					updatePostAtom(post.uri, newData);
					return newData;
				},
			);
		},
	});
}

export function usePostUnlikeMutation(post: AppBskyFeedDefs.PostView) {
	const queryClient = useQueryClient();
	return useMutation<unknown, Error, string>({
		mutationFn: async (likeUri) => {
			await getAgent().deleteLike(likeUri);
		},
		onSuccess: () => {
			queryClient.setQueryData<Partial<AppBskyFeedDefs.PostView>>(
				postKeys.detail({ uri: post.uri }),
				(oldData) => {
					const { like, ...viewer } = oldData?.viewer ?? {};
					const newData = {
						...oldData,
						likeCount: (oldData?.likeCount ?? 1) - 1,
						viewer: {
							...viewer,
						},
					};
					updatePostAtom(post.uri, newData);
					return newData;
				},
			);
		},
	});
}

export function usePostRepostMutation(post: AppBskyFeedDefs.PostView) {
	const queryClient = useQueryClient();
	return useMutation<
		{ uri: string }, // responds with the uri of the repost
		Error,
		SkylineSliceItem["post"]
	>({
		mutationFn: (post) => getAgent().repost(post.uri, post.cid),
		onSuccess: (data) => {
			queryClient.setQueryData<Partial<AppBskyFeedDefs.PostView>>(
				postKeys.detail({ uri: post.uri }),
				(oldData) => {
					const newData = {
						...oldData,
						repostCount: (oldData?.repostCount ?? 0) + 1,
						viewer: {
							...oldData?.viewer,
							repost: data.uri,
						},
					};
					updatePostAtom(post.uri, newData);
					return newData;
				},
			);
		},
	});
}

export function usePostUnrepostMutation(post: AppBskyFeedDefs.PostView) {
	const queryClient = useQueryClient();
	return useMutation<unknown, Error, string>({
		mutationFn: async (repostUri) => {
			await getAgent().deleteRepost(repostUri);
		},
		onSuccess: () => {
			queryClient.setQueryData<Partial<AppBskyFeedDefs.PostView>>(
				postKeys.detail({ uri: post.uri }),
				(oldData) => {
					const { repost, ...viewer } = oldData?.viewer ?? {};
					return {
						...oldData,
						repostCount: (oldData?.repostCount ?? 1) - 1,
						viewer: {
							...viewer,
						},
					};
				},
			);
		},
	});
}

export function usePostDeleteMutation(post: AppBskyFeedDefs.PostView) {
	const queryClient = useQueryClient();
	return useMutation<unknown, Error, { uri: string }>({
		mutationFn: async ({ uri }) => {
			await getAgent().deletePost(uri);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: postKeys.detail({ uri: post.uri }),
			});
		},
	});
}
