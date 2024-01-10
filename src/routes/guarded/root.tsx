import { NavLink } from "@/components/link";
import { CurrentUserCard } from "@/components/session/current-user-card";
import { api } from "@/state/session";
import {
	BellIcon,
	HomeIcon,
	LogOutIcon,
	NewspaperIcon,
	PencilLineIcon,
	SearchIcon,
	UserIcon,
	WrenchIcon,
} from "lucide-react";
import { Link, Outlet } from "react-router-dom";

export function RootRoute() {
	return (
		<div key="1" className="flex h-screen bg-gray-100 dark:bg-gray-900">
			<div className="border-r w-80 bg-white dark:bg-gray-800 overflow-auto flex flex-col">
				<CurrentUserCard />

				<nav className="space-y-2 text-sm font-medium px-6">
					<Link
						className="flex items-center gap-3 px-2 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 rounded-lg"
						to="/"
					>
						<HomeIcon />
						Home
					</Link>
					<NavLink
						className="flex items-center gap-3 px-2 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 rounded-lg"
						to="/search"
					>
						<SearchIcon />
						Search
					</NavLink>
					<a
						className="flex items-center gap-3 px-2 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 rounded-lg"
						href="?feeds"
					>
						<NewspaperIcon />
						Feeds
					</a>
					<a
						className="flex items-center gap-3 px-2 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 rounded-lg"
						href="?notifications"
					>
						<BellIcon />
						Notifications
					</a>
					<Link
						className="flex items-center gap-3 px-2 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 rounded-lg"
						to="#"
					>
						<UserIcon />
						Profile
					</Link>
					<Link
						className="flex items-center gap-3 px-2 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 rounded-lg"
						to="#"
					>
						<PencilLineIcon />
						Drafts
					</Link>
				</nav>
				<div className="mt-auto px-6 py-4">
					<Link
						className="flex items-center gap-3 px-2 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 rounded-lg"
						to="#"
					>
						<WrenchIcon />
						Settings
					</Link>

					<button
						type="button"
						className="w-full flex items-center gap-3 px-2 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 rounded-lg"
						onClick={() => {
							api.logout();
						}}
					>
						<LogOutIcon />
						Sair
					</button>
					<span className="text-xs text-purple-300">
						version {BISKA_VERSION}
					</span>
				</div>
			</div>

			<Outlet />
		</div>
	);
}
