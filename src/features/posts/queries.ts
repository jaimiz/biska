import { useMutation, useQuery } from "@tanstack/react-query";

import { getAgent } from "@/services/api";
import { AppBskyFeedDefs } from "@atproto/api";
import { Did } from "@/state/schema";
import { SkylineSliceItem } from "../user/profileQueries";
import { updatePostAtom } from "./atoms";

export const postKeys = {
	all: ["posts"] as const,
	details: () => [...postKeys.all, "single"] as const,
	detail: ({ repo, rkey }: { repo: string; rkey: string }) =>
		[...postKeys.details(), { repo, rkey }] as const,
	searches: () => [...postKeys.all, "search"] as const,
	search: (query: string) => [...postKeys.searches(), { query }] as const,
};

export const usePostQuery = ({ rkey, repo }: { rkey: string; repo: Did }) => {
	const agent = getAgent();

	return useQuery({
		queryKey: postKeys.detail({ repo, rkey }),
		queryFn: async () => {
			const res = await agent.getPost({
				repo,
				rkey,
			});
			return res;
		},
	});
};

export function usePostLikeMutation(post: AppBskyFeedDefs.PostView) {
	return useMutation<
		{ uri: string }, // responds with the uri of the like
		Error,
		SkylineSliceItem["post"]
	>({
		mutationFn: (post) => getAgent().like(post.uri, post.cid),
		onSuccess: (data) => {
			updatePostAtom(post.cid, {
				viewer: {
					...post.viewer,
					like: data.uri,
				},
			});
		},
	});
}

export function usePostUnlikeMutation(post: AppBskyFeedDefs.PostView) {
	return useMutation<unknown, Error, string>({
		mutationFn: async (likeUri) => {
			await getAgent().deleteLike(likeUri);
		},
		onSuccess: () => {
			updatePostAtom(post.cid, {
				viewer: {
					...post.viewer,
					like: undefined,
				},
			});
		},
	});
}

export function usePostRepostMutation() {
	return useMutation<
		{ uri: string }, // responds with the uri of the repost
		Error,
		SkylineSliceItem["post"]
	>({
		mutationFn: (post) => getAgent().repost(post.uri, post.cid),
		onSuccess: (data) => {
			console.log("post reposted", data);
		},
	});
}

export function usePostUnrepostMutation() {
	return useMutation<unknown, Error, string>({
		mutationFn: async (repostUri) => {
			await getAgent().deleteRepost(repostUri);
		},
	});
}

export function usePostDeleteMutation() {
	return useMutation<unknown, Error, { uri: string }>({
		mutationFn: async ({ uri }) => {
			await getAgent().deletePost(uri);
		},
	});
}
