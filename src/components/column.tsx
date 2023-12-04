import { Button } from "@/components/ui/button";
import { CloudIcon, Settings2Icon } from "lucide-react";

export function DeckColumn() {
	return (
		<div className="min-w-[400px] px-4 py-2 flex flex-col w-[400px] border border-gray-200 dark:border-gray-700">
			<div className="flex justify-between items-center mb-4">
				<h2 className="font-semibold text-sm flex items-center gap-2">
					<CloudIcon />
					Skyline
				</h2>
				<Button size="icon" variant="ghost">
					<Settings2Icon />
					<span className="sr-only">Settings</span>
				</Button>
			</div>
			<div className="flex border border-gray-200 dark:border-gray-700 w-full">
				A Post goes here
			</div>
		</div>
	);
}
