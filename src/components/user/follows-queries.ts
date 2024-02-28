import { useCurrentAgent } from "@/lib/agent";
import { STALE } from "@/lib/queries";
import { AppBskyActorDefs } from "@atproto/api";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { requireAccountAtom } from "./sessionAtoms";

// sanity limit is SANITY_PAGE_LIMIT*PAGE_SIZE total records
const SANITY_PAGE_LIMIT = 1000;
const PAGE_SIZE = 100;
// ...which comes 10,000k follows

const myfollowsKeys = {
	all: ["myfollows"] as const,
};

export function useMyFollowsQuery() {
	const currentAccount = useAtomValue(requireAccountAtom);
	const agent = useCurrentAgent();
	return useQuery<AppBskyActorDefs.ProfileViewBasic[]>({
		staleTime: STALE.MINUTES.ONE,
		queryKey: myfollowsKeys.all,
		async queryFn() {
			let cursor: string | undefined = undefined;
			let arr: AppBskyActorDefs.ProfileViewBasic[] = [];
			for (let i = 0; i < SANITY_PAGE_LIMIT; i++) {
				const res = await agent.getFollows({
					actor: currentAccount.did,
					cursor,
					limit: PAGE_SIZE,
				});
				// TODO
				// res.data.follows = res.data.follows.filter(
				//   profile =>
				//     !moderateProfile(profile, this.rootStore.preferences.moderationOpts)
				//       .account.filter,
				// )
				arr = arr.concat(res.data.follows);
				if (!res.data.cursor) {
					break;
				}
				cursor = res.data.cursor;
			}
			return arr;
		},
	});
}
