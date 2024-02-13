import { useTickEveryMinute } from "@/lib/clock";
import { ago } from "@/lib/strings/time";
import { useEffect, useState } from "react";

export function TimeElapsed({
	timestamp,
	children,
}: {
	timestamp: string;
	children: ({ timeElapsed }: { timeElapsed: string }) => JSX.Element;
}) {
	const tick = useTickEveryMinute();
	const [timeElapsed, setTimeAgo] = useState(ago(timestamp));

	// biome-ignore lint/correctness/useExhaustiveDependencies: we use the tick variable to ensure the value is update whenever a new tick happend
	useEffect(() => {
		setTimeAgo(ago(timestamp));
	}, [timestamp, tick]);

	return children({ timeElapsed });
}
