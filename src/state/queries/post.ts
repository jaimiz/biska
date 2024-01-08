import { useMutation, useQuery } from "@tanstack/react-query";
import { Did } from "../persisted/schema";
import { getAgent } from "../session";
import { SkylineSliceItem } from "./profile";

const RQKEY = (repo: string, rkey: string) => ["post", repo, rkey];

export const usePostQuery = ({ rkey, repo }: { rkey: string; repo: Did }) => {
	const agent = getAgent();

	return useQuery({
		queryKey: RQKEY(repo, rkey),
		queryFn: async () => {
			const res = await agent.getPost({
				repo,
				rkey,
			});
			console.log({ res });
			return res;
		},
	});
};

export function usePostLikeMutation() {
	return useMutation<
		{ uri: string }, // responds with the uri of the like
		Error,
		{ uri: string; cid: string; likeCount: number } // the post's uri, cid, and likes
	>({
		mutationFn: (post) => getAgent().like(post.uri, post.cid),
	});
}

export function usePostUnlikeMutation() {
	return useMutation<
		unknown,
		Error,
		{ postUri: string; likeUri: string; likeCount: number }
	>({
		mutationFn: async ({ likeUri }) => {
			await getAgent().deleteLike(likeUri);
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
	});
}

export function usePostUnrepostMutation() {
	return useMutation<
		unknown,
		Error,
		{ postUri: string; repostUri: string; repostCount: number }
	>({
		mutationFn: async ({ repostUri }) => {
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
