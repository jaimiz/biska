import { useCurrentAgent } from "@/lib/agent";
import { useQuery } from "@tanstack/react-query";

const timelineKeys = {
	all: ["timeline"] as const,
};

export function useTimelineQuery() {
	const agent = useCurrentAgent();
	return useQuery({
		queryKey: timelineKeys.all,
		queryFn: async () => {
			const res = await agent.getTimeline();
			return res;
		},
	});
}
