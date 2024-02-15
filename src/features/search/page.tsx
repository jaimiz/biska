import { AutocompleteUsers } from "@/components/autocomplete";
import { Drawer } from "@/components/drawer";
import { Post } from "@/components/feed/post";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextButton } from "@/components/ui/text-button";
import { ProfileDisplayName } from "@/components/user/profile-display-name";
import { buildSearchQuery, parseSearchQuery } from "@/lib/search-parser";
import { bskyApi } from "@/services/api";
import { AppBskyActorDefs } from "@atproto/api";
import { useAtom, useAtomValue } from "jotai";
import { ExternalLinkIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Form, Outlet, useMatch, useSearchParams } from "react-router-dom";
import { behaviorPreferencesAtom } from "../preferences/atoms";
import { useProfileQuery } from "../user/profileQueries";
import { requireAccountAtom } from "../user/sessionAtoms";
import { useSearchPostsQuery } from "./queries";

function SearchResults({ query }: { query: string }) {
	const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetching } =
		useSearchPostsQuery({ query });
	if (!data) {
		return null;
	}
	const pages = data.pages.flatMap((page) => page.posts);
	const posts = pages.map((post) => {
		return <Post key={post.cid} post={post} />;
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
	const currentUser = useAtomValue(requireAccountAtom);
	const currentUserProfile = useProfileQuery({ did: currentUser.did });
	const [searchTerms, setSearchTerms] = useState("");
	const [query, setQuery] = useState("");
	const [searchType, setSearchType] = useState<"all" | "me" | "user">("all");
	const [userToSearch, setUserToSearch] = useState("");
	const isClearingUser = useRef(false);
	const isRoot = useMatch("/");
	const [searchParams] = useSearchParams();

	function readQueryFromUrl() {
		const q = searchParams.get("q");
		if (!q) {
			return;
		}
		const searchQuery = q.split(" ") ?? [];
		if (searchQuery.length < 1) {
			return;
		}
		const { terms, from } = parseSearchQuery(q);
		if (from === currentUser?.handle) {
			setSearchType("me");
		} else if (from && from !== currentUser?.handle) {
			setSearchType("user");
			setUserToSearch(from);
		}
		setSearchTerms(terms);
		setQuery(q);
		return;
	}

	useEffect(readQueryFromUrl, []);

	if (!currentUserProfile.data) {
		return null;
	}

	return (
		<div className="flex flex-col items-center w-full justify-start pt-4 h-screen overflow-auto bg-gray-100 dark:bg-gray-900">
			<div className="flex justify-between w-full max-w-[1000px] my-6 m-auto">
				<h2 className="text-3xl">Biska</h2>
				<div className="flex gap-x-2 items-center">
					Logado como{" "}
					<ProfileDisplayName
						className="inline-flex"
						profile={
							currentUserProfile.data as AppBskyActorDefs.ProfileViewDetailed
						}
					/>{" "}
					&middot; <PreferencesDrawer /> |
					<button
						type="button"
						onClick={() => {
							bskyApi.logout();
						}}
						className="text-sm text-purple-400 hover:text-purple-600"
					>
						Sair
					</button>
				</div>
			</div>

			<Form method="get" action="/">
				<div className="flex w-full max-w-[1000px] justify-center items-center gap-x-4">
					<input type="hidden" name="q" value={query} />
					<Input
						value={searchTerms}
						onChange={(e) => setSearchTerms(e.target.value)}
						type="search"
						placeholder="Buscar no Bluesky"
					/>{" "}
					<Button
						type="submit"
						onClick={() => {
							if (searchType === "me" && searchTerms !== "") {
								setQuery(
									buildSearchQuery({
										terms: searchTerms,
										from: currentUser?.handle as string,
									}),
								);
								return;
							}
							if (
								searchType === "user" &&
								searchTerms !== "" &&
								userToSearch !== ""
							) {
								setQuery(
									buildSearchQuery({
										terms: searchTerms,
										from: userToSearch,
									}),
								);
								return;
							}
							setQuery(buildSearchQuery({ terms: searchTerms }));
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
						<TabsTrigger
							className="data-[state=active]:bg-purple-300"
							value="me"
						>
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
									value={userToSearch}
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
			</Form>

			{query ? (
				<>
					<div className="text-sm text-right max-w-prose w-full">
						<a
							href={`https://bsky.app/search?q=${query}`}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-1"
						>
							Abrir no Bsky.app
							<ExternalLinkIcon className="w-3 h-3" />
						</a>
					</div>
					<div className="max-w-prose">
						<SearchResults query={query} />
					</div>
				</>
			) : null}

			<Drawer open={isRoot === null}>
				<Outlet />
			</Drawer>

			<div className="flex self-center mt-auto text-xs text-purple-300">
				versão{" "}
				<a
					target="_blank"
					rel="noopener noreferrer"
					href={`https://github.com/jaimiz/biska/commit/${BISKA_VERSION_OBJECT.commit}`}
				>
					{BISKA_VERSION}
				</a>
			</div>
		</div>
	);
}

function PreferencesDrawer() {
	const [behavior, setBehavior] = useAtom(behaviorPreferencesAtom);
	return (
		<Sheet>
			<div className="flex items-center text-xs">
				<SheetTrigger className="flex gap-x-1" asChild>
					<TextButton className="text-sm text-purple-400 hover:text-purple-600">
						Preferências
					</TextButton>
				</SheetTrigger>
			</div>
			<SheetContent
				side={"right"}
				className="w-full max-w-none overflow-y-auto sm:max-w-none lg:w-1/3"
			>
				<SheetTitle>Preferências</SheetTitle>
				<SheetDescription>
					<div className="flex justify-between w-full">
						<Tabs
							value={behavior.openProfileIn}
							className="flex items-center w-full"
							onValueChange={(value) => {
								setBehavior({
									openProfileIn: value as "app" | "bsky",
								});
							}}
						>
							<TabsList className="h-auto items-stretch gap-x-2 w-full">
								<TabsTrigger
									className="data-[state=active]:bg-purple-300 flex-1"
									value="app"
								>
									Abrir o perfil no Biska
								</TabsTrigger>
								<TabsTrigger
									className="data-[state=active]:bg-purple-300 flex-1"
									value="bsky"
								>
									Abrir o perfil no Bluesky
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>
					<p className="text-sm text-muted-foreground">
						{behavior.openProfileIn === "app"
							? "Quando você clicar num perfil, ele vai aparecer na parte direita da tela, da mesma forma que o painel de preferências está aparecendo agora."
							: "Quando você clicar num perfil, ele vai abrir o perfil do usuário no bsky.app. O perfil será aberto numa nova aba, pra que você não perca o resultado da busca."}
					</p>
				</SheetDescription>
			</SheetContent>
		</Sheet>
	);
}
