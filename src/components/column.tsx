import { Button } from "@/components/ui/button";
import { CloudIcon, SearchIcon, Settings2Icon } from "lucide-react";
import { PropsWithChildren } from "react";

const ColumnIcons = {
	interactiveSearch: CloudIcon,
	search: SearchIcon,
};
type ColumnIcons = keyof typeof ColumnIcons;
function ColumnIcon({ icon }: { icon: ColumnIcons }) {
	const Icon = ColumnIcons[icon];
	return <Icon />;
}

type ColumnHeaderProps = {
	title: string;
	icon?: ColumnIcons;
};
export function ColumnHeader(props: ColumnHeaderProps) {
	const { title, icon } = props;
	return (
		<div className="flex justify-between items-center mb-4">
			<h2 className="font-semibold text-sm flex items-center gap-2">
				<ColumnIcon icon={icon ?? "search"} />
				{title}
			</h2>
			<Button size="icon" variant="ghost">
				<Settings2Icon />
				<span className="sr-only">Settings</span>
			</Button>
		</div>
	);
}

export function ColumnContent({ children }: PropsWithChildren) {
	return (
		<div className="flex shrink-0 flex-col bg-background w-96 p-4">
			{children}
		</div>
	);
}

export function Column({ children }: PropsWithChildren) {
	return (
		<div className="relative">
			<div className="flex h-full">
				<div className="relative min-h-0 grow">{children}</div>
			</div>
		</div>
	);
}
