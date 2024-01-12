import { AutocompleteUsers } from "@/components/autocomplete";
import { Drawer } from "@/components/drawer";
import { Post } from "@/components/feed/post";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileDisplayName } from "@/components/user/profile-display-name";
import { bskyApi } from "@/services/api";
import { behaviorPreferencesAtom } from "@/state/atoms/preferences";
import { currentAccountAtom } from "@/state/atoms/session";
import { useProfileQuery } from "@/state/queries/profile";
import { useSearchPostsQuery } from "@/state/queries/search";
import { AppBskyFeedPost } from "@atproto/api";
import { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { useAtom, useAtomValue } from "jotai";
import { useRef, useState } from "react";
import { Outlet, useMatch } from "react-router-dom";

function SearchResults({ query }: { query: string }) {
	const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetching } =
		useSearchPostsQuery({ query });
	if (!data) {
		return null;
	}
	const pages = data.pages.flatMap((page) => page.posts);
	const posts = pages.map((post) => {
		return (
			<Post
				key={post.cid}
				post={post}
				record={post.record as AppBskyFeedPost.Record}
			/>
		);
	});

	return isLoading ? (
		"Buscando…"
	) : isError ? (
		"Erro"
	) : (
		<div className="flex flex-col items-center gap-4">
			<div>{posts}</div>
			{hasNextPage && (
				<div>
					<Button
						disabled={isFetching}
						className="gap-2"
						onClick={() => {
							if (!isFetching) {
								fetchNextPage();
							}
						}}
					>
						{isFetching ? (
							<>
								<Spinner /> Carregando…
							</>
						) : (
							"Carregar mais posts"
						)}
					</Button>
				</div>
			)}
			{!hasNextPage && (
				<div className="w-full relative flex py-5 px-32 items-center text-purple-300">
					<div className="flex-grow border-t border-current" />
					<span className="flex-shrink mx-2 text-current">fim</span>
					<div className="flex-grow border-t border-current" />
				</div>
			)}
		</div>
	);
}

export function Search() {
	const currentUser = useAtomValue(currentAccountAtom);
	const [behavior, setBehavior] = useAtom(behaviorPreferencesAtom);
	const currentUserProfile = useProfileQuery({ did: currentUser?.did });
	const [search, setSearch] = useState("");
	const [query, setQuery] = useState("");
	const [searchType, setSearchType] = useState<"all" | "me" | "user">("all");
	const [userToSearch, setUserToSearch] = useState("");
	const isClearingUser = useRef(false);
	const isRoot = useMatch("/");

	if (!currentUserProfile.data) {
		return null;
	}
	return (
		<div className="flex flex-col items-center w-full justify-start pt-4 h-screen overflow-auto bg-gray-100 dark:bg-gray-900">
			<div className="flex justify-between w-full max-w-[1000px] my-6 m-auto">
				<h2 className="text-3xl">Biska</h2>
				<div>
					Logado como{" "}
					<ProfileDisplayName
						className="inline-flex"
						profile={currentUserProfile.data as ProfileViewDetailed}
					/>{" "}
					&middot;{" "}
					<button
						type="button"
						onClick={() => {
							bskyApi.logout();
						}}
						className="text-sm text-purple-400"
					>
						Sair
					</button>
				</div>
			</div>
			<div className="flex justify-between w-full max-w-[1000px] my-6 m-auto">
				<Tabs
					value={behavior.openProfileIn}
					className="flex items-center my-2 mx-0"
					onValueChange={(value) => {
						setBehavior({
							openProfileIn: value as "app" | "bsky",
						});
					}}
				>
					<TabsList className="h-auto items-stretch gap-x-2">
						<TabsTrigger
							className="data-[state=active]:bg-purple-300"
							value="app"
						>
							Abrir o perfil no Biska
						</TabsTrigger>
						<TabsTrigger
							className="data-[state=active]:bg-purple-300"
							value="bsky"
						>
							Abrir o perfil no Bluesky
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>
			<div className="flex w-full max-w-[1000px] justify-center items-center gap-x-4">
				<Input
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					type="search"
					placeholder="Buscar no Bluesky"
				/>{" "}
				<Button
					type="submit"
					onClick={() => {
						if (searchType === "me" && search !== "") {
							setQuery(`${search} from:${currentUserProfile.data.handle}`);
							return;
						}
						if (searchType === "user" && search !== "" && userToSearch !== "") {
							setQuery(`${search} from:${userToSearch}`);
							return;
						}
						setQuery(search);
					}}
				>
					Buscar
				</Button>
			</div>
			<Tabs
				value={searchType}
				className="flex items-center my-2 mx-0"
				onValueChange={(value) => {
					if (!isClearingUser.current) {
						setSearchType(value as "all" | "me" | "user");
						return;
					}
					isClearingUser.current = false;
				}}
			>
				<TabsList className="h-auto items-stretch gap-x-2">
					<TabsTrigger
						className="data-[state=active]:bg-purple-300"
						value="all"
					>
						Buscar em todos os posts
					</TabsTrigger>
					<TabsTrigger className="data-[state=active]:bg-purple-300" value="me">
						Buscar somente nos meus posts
					</TabsTrigger>
					<TabsTrigger
						asChild
						className="data-[state=active]:bg-purple-300"
						value="user"
					>
						<div className="gap-x-2 cursor-pointer">
							Buscar nos posts do usuário{" "}
							<AutocompleteUsers
								onSelect={(e: string) => {
									setUserToSearch(e);
									if (e === "") {
										setSearchType("all");
										isClearingUser.current = true;
									} else {
										setSearchType("user");
									}
								}}
							/>
						</div>
					</TabsTrigger>
				</TabsList>
			</Tabs>

			{query ? (
				<div className="max-w-[600px]">
					<SearchResults query={query} />
				</div>
			) : (
				""
			)}

			<Drawer open={isRoot === null}>
				<Outlet />
			</Drawer>

			<div className="flex self-center mt-auto text-xs text-purple-300">
				versão {BISKA_VERSION}
			</div>
		</div>
	);
}
