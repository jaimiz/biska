import { useQuery } from "@tanstack/react-query";
import { getAgent } from "../session";

export function useTimelineQuery() {
	return useQuery({
		queryKey: ["timeline"],
		queryFn: async () => {
			const res = await getAgent().getTimeline();
			return res;
		},
	});
}
