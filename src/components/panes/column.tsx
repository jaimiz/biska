import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { Preferences } from "@/state/schema";
import { atomStore } from "@/state/state";
import { ClassValue } from "clsx";
import { CloudIcon, SearchIcon, Settings2Icon } from "lucide-react";
import { PropsWithChildren, createContext, useContext } from "react";
import { interfacePreferencesAtom } from "../preferences/atoms";

const ColumnConfigContext = createContext<{ size?: ColumnSizes }>({
	size: undefined,
});

const useColumnConfig = () => {
	const context = useContext(ColumnConfigContext);
	if (context === undefined) {
		throw new Error("useColumnSize must be used within a Column");
	}
	return context;
};
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
	const { size } = useColumnConfig();

	return (
		<div
			className={cn(
				"flex justify-between items-center",
				getColumnSpacing(size),
			)}
		>
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
	const { size } = useColumnConfig();
	return (
		<div
			className={cn(
				"flex shrink-0 flex-col bg-background w-full",
				getColumnSpacing(size),
			)}
		>
			{children}
		</div>
	);
}

type ColumnSizes = Preferences["interface"]["columnSize"];
const columnWidth: Record<ColumnSizes, string> = {
	sm: "w-80",
	md: "w-96",
	lg: "w-120",
};
const columnPadding: Record<ColumnSizes, string> = {
	sm: "p-2",
	md: "p-3",
	lg: "p-4",
};
const getColumnSpacing = (customSize?: ColumnSizes) => {
	if (customSize !== undefined) {
		return [columnWidth[customSize], columnPadding[customSize]];
	}
	const { columnSize } = atomStore.get(interfacePreferencesAtom);
	return [columnWidth[columnSize], columnPadding[columnSize]];
};

export function Column({
	children,
	size,
	className,
}: PropsWithChildren<{
	size?: Preferences["interface"]["columnSize"];
	className?: ClassValue;
}>) {
	const currentColumnSize = size;
	return (
		<div className="relative flex shrink-0 h-full min-h-0">
			<ColumnConfigContext.Provider value={{ size: currentColumnSize }}>
				<div className={cn(getColumnSpacing(size)[0], className)}>
					{children}
				</div>
			</ColumnConfigContext.Provider>
		</div>
	);
}
