import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { Preferences } from "@/state/schema";
import { atomStore } from "@/state/state";
import { ClassValue } from "clsx";
import { CloudIcon, ScanSearch, SearchIcon, Settings2Icon } from "lucide-react";
import { PropsWithChildren, createContext, useContext } from "react";
import { interfacePreferencesAtom } from "../../preferences/atoms";

const ColumnSizeContext = createContext<ColumnSizes | null>(null);

const useColumnSize = () => {
	const context = useContext(ColumnSizeContext);
	if (context === undefined) {
		throw new Error("useColumnSize must be used within a Column");
	}
	if (context === null) {
		return atomStore.get(interfacePreferencesAtom).columnSize;
	}
	return context;
};
const ColumnIcons = {
	interactiveSearch: ScanSearch,
	home: CloudIcon,
	search: SearchIcon,
};
type ColumnIcons = keyof typeof ColumnIcons;
function ColumnIcon({ icon }: { icon: ColumnIcons }) {
	const Icon = ColumnIcons[icon] ?? ColumnIcons.home;
	return <Icon />;
}

type ColumnHeaderProps = {
	title: string;
	icon?: ColumnIcons;
	settingsClick?: () => void;
};
export function ColumnHeader(props: ColumnHeaderProps) {
	const { title, icon, settingsClick } = props;
	const columnSize = useColumnSize();

	return (
		<div
			className={cn(
				"flex justify-between items-center",
				getColumnSpacing(columnSize),
			)}
		>
			<h2 className="font-semibold text-sm flex items-center gap-2">
				<ColumnIcon icon={icon ?? "search"} />
				{title}
			</h2>
			{settingsClick && (
				<Button size="icon" variant="ghost" onClick={settingsClick}>
					<Settings2Icon />
					<span className="sr-only">Settings</span>
				</Button>
			)}
		</div>
	);
}

export function ColumnBody({
	children,
	className,
}: PropsWithChildren<{
	className?: ClassValue;
}>) {
	return (
		<div
			className={cn(
				className,
				"flex min-h-0 grow relative flex-col bg-background w-full overflow-y-auto",
			)}
		>
			{children}
		</div>
	);
}

export function ColumnAside(props: PropsWithChildren) {
	return (
		<div className={cn("flex justify-between items-center")}>
			{props.children}
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
	return (
		<ColumnSizeContext.Provider value={size ?? null}>
			<div
				className={cn(
					"flex shrink-0 flex-col",
					getColumnSpacing(size)[0],
					className,
				)}
			>
				{children}
			</div>
		</ColumnSizeContext.Provider>
	);
}
