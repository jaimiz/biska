import { PreferencesDrawer } from "@/components/preferences/pane";
import { InteractiveSearch } from "@/components/search/interactive-search";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { bskyApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { atom, useAtom, useAtomValue } from "jotai";
import {
	ArrowRightLeft,
	LogOutIcon,
	SearchIcon,
	WrenchIcon,
} from "lucide-react";
import { ButtonHTMLAttributes, forwardRef, useCallback, useState } from "react";
import { DeckView } from "./DeckView";

const interactiveSearchAtom = atom(true);

function DashboardSidebar() {
	const SidebarButton = forwardRef<
		HTMLButtonElement,
		ButtonHTMLAttributes<HTMLButtonElement>
	>(
		(
			{
				children,
				type,
				className,
				...props
			}: ButtonHTMLAttributes<HTMLButtonElement>,
			ref,
		) => {
			return (
				<button
					ref={ref}
					className={cn(
						"group/button flex items-center justify-center hover:justify-start gap-3 p-4 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700",
						className,
					)}
					type={type ?? "button"}
					{...props}
				>
					{children}
				</button>
			);
		},
	);
	const [expanded, setExpanded] = useState(false);

	const toggleExpanded = useCallback(() => {
		setExpanded(!expanded);
	}, [expanded]);

	const [interactiveSearchOpen, setInteractiveSearchOpen] = useAtom(
		interactiveSearchAtom,
	);

	const toggleInteractiveSearch = useCallback(() => {
		setInteractiveSearchOpen(!interactiveSearchOpen);
	}, [interactiveSearchOpen, setInteractiveSearchOpen]);

	return (
		<div
			className={cn(
				"group flex bg-white w-14 transition-[width] shrink-0 flex-col z-10 relative",
				{
					"w-80": expanded,
				},
			)}
		>
			<div>
				<SidebarButton
					onClick={toggleInteractiveSearch}
					className={cn({ "w-full justify-start": expanded })}
				>
					<SearchIcon />
					<span
						className={cn("sr-only group-hover/button:not-sr-only", {
							"not-sr-only": expanded,
						})}
					>
						Buscar
					</span>
				</SidebarButton>
			</div>
			<div className="hover:w-auto bg-transparent mt-auto">
				<Sheet>
					<SheetTrigger asChild>
						<SidebarButton className={cn({ "w-full justify-start": expanded })}>
							<WrenchIcon />
							<span
								className={cn("sr-only group-hover/button:not-sr-only", {
									"not-sr-only": expanded,
								})}
							>
								Preferências
							</span>
						</SidebarButton>
					</SheetTrigger>
					<PreferencesDrawer />
				</Sheet>

				<SidebarButton
					className={cn({ "w-full justify-start": expanded })}
					onClick={() => {
						bskyApi.logout();
					}}
				>
					<LogOutIcon />
					<span
						className={cn("sr-only group-hover/button:not-sr-only", {
							"not-sr-only": expanded,
						})}
					>
						Sair
					</span>
				</SidebarButton>
			</div>
			<div className="hidden group-hover:flex absolute right-0 translate-x-3 top-0 bottom-0">
				<button
					type="button"
					className="m-auto bg-white rounded-full border border-red-50 p-1"
					onClick={toggleExpanded}
				>
					<ArrowRightLeft size={14} />
				</button>
			</div>
		</div>
	);
}

export function MultiColumnView() {
	const interactiveSearchOpen = useAtomValue(interactiveSearchAtom);
	return (
		<div className="flex h-screen w-screen overflow-hidden divide-x">
			<DashboardSidebar />
			<div
				className={cn(
					"flex grow gap-1 overflow-x-auto bg-background-dark transition-transform divide-x",
					{
						"-translate-x-120": !interactiveSearchOpen,
					},
				)}
			>
				<InteractiveSearch />
				<DeckView />
			</div>
		</div>
	);
}
