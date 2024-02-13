import { getAgent } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

const timelineKeys = {
	all: ["timeline"] as const,
};

export function useTimelineQuery() {
	return useQuery({
		queryKey: timelineKeys.all,
		queryFn: async () => {
			const res = await getAgent().getTimeline();
			return res;
		},
	});
}
