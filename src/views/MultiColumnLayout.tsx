import { Drawer } from "@/components/columns/drawer";
import {
	effectResetPrefsPaneOnLogout,
	prefsPaneIsOpenAtom,
} from "@/components/preferences/atoms";
import { PreferencesDrawer } from "@/components/preferences/pane";
import {
	InteractiveSearch,
	interactiveSearchAtom,
} from "@/components/search/interactive-search";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { isLoggedInAtom } from "@/components/user/sessionAtoms";
import { bskyApi } from "@/lib/agent";
import { cn } from "@/lib/utils";
import { atom, useAtom, useAtomValue } from "jotai";
import {
	ArrowRightLeft,
	LogOutIcon,
	SearchIcon,
	WrenchIcon,
} from "lucide-react";
import { ButtonHTMLAttributes, forwardRef, useCallback } from "react";
import { Outlet, useMatch } from "react-router-dom";
import { DeckView } from "./DeckView";
import { LoginScreen } from "./login-screen";

export const dashboardSidebarExpanded = atom(false);
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
			if (props.hidden) return null;
			return (
				<button
					ref={ref}
					className={cn(
						"group/button flex items-center justify-center gap-3 p-4 text-gray-600 dark:text-gray-400",
						{
							"cursor-not-allowed": props.disabled,
						},
						{
							"dark:hover:text-white dark:hover:bg-gray-700 hover:text-gray-900 hover:bg-gray-100 hover:justify-start cursor-pointer":
								!props.disabled,
						},
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

	useAtom(effectResetPrefsPaneOnLogout);
	const [expanded, setExpanded] = useAtom(dashboardSidebarExpanded);

	const toggleExpanded = useCallback(() => {
		setExpanded(!expanded);
	}, [expanded, setExpanded]);

	const [, setInteractiveSearchOpen] = useAtom(interactiveSearchAtom);

	const toggleInteractiveSearch = useCallback(() => {
		setInteractiveSearchOpen();
	}, [setInteractiveSearchOpen]);

	const isLoggedIn = useAtomValue(isLoggedInAtom);
	const [isPrefsPaneOpen, setPrefPaneOpen] = useAtom(prefsPaneIsOpenAtom);

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
					hidden={!isLoggedIn}
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
			<div
				className={cn("bg-transparent mt-auto", {
					"hover:w-auto": isLoggedIn,
				})}
			>
				<Sheet
					open={isLoggedIn && isPrefsPaneOpen}
					onOpenChange={setPrefPaneOpen}
				>
					<SheetTrigger asChild>
						<SidebarButton
							disabled={!isLoggedIn}
							className={cn({ "w-full justify-start": expanded })}
						>
							<WrenchIcon />
							<span
								className={cn("sr-only ", {
									"group-hover/button:not-sr-only": isLoggedIn,
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
					disabled={!isLoggedIn}
					onClick={() => {
						bskyApi.logout();
					}}
				>
					<LogOutIcon />
					<span
						className={cn("sr-only ", {
							"group-hover/button:not-sr-only": isLoggedIn,
							"not-sr-only": expanded,
						})}
					>
						Sair
					</span>
				</SidebarButton>
			</div>
			<button
				type="button"
				onClick={toggleExpanded}
				className={cn("flex absolute right-0 translate-x-1 h-8 top-1/2 w-4", {
					hidden: !isLoggedIn,
				})}
			>
				<div className="m-auto hidden group-hover:block bg-white rounded-full border border-red-50 p-1 pointer-events-auto">
					<ArrowRightLeft size={14} />
				</div>
			</button>
		</div>
	);
}

export function MultiColumnView() {
	const isLoggedIn = useAtomValue(isLoggedInAtom);
	const isRoot = useMatch("/");
	return (
		<div className="flex h-screen w-screen overflow-hidden divide-x">
			<DashboardSidebar />
			<div
				className={cn(
					"flex grow bg-background-dark transition-transform divide-x overflow-x-auto",
				)}
			>
				{isLoggedIn && <InteractiveSearch />}
				<div className="h-screen flex grow divide-x overflow-x-auto border-r">
					{isLoggedIn ? <DeckView /> : <LoginScreen />}
				</div>
			</div>
			{isLoggedIn && (
				<Drawer open={!isRoot}>
					<Outlet />
				</Drawer>
			)}
		</div>
	);
}
