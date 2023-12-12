import { useQuery } from "@tanstack/react-query";
import { getAgent } from "../session";
import { Did } from "../persisted/schema";

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
