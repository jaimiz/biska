import { ago } from "@/lib/strings/time";
import { useTickEveryMinute } from "@/state/app";
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

	useEffect(() => {
		setTimeAgo(ago(timestamp));
	}, [timestamp, setTimeAgo, tick]);

	return children({ timeElapsed });
}
