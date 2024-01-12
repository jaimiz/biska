import { getAgent } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export function useTimelineQuery() {
	return useQuery({
		queryKey: ["timeline"],
		queryFn: async () => {
			const res = await getAgent().getTimeline();
			return res;
		},
	});
}
