import { AutocompleteUsers } from "@/components/autocomplete";
import { Post } from "@/components/feed/post";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ProfileDisplayName } from "@/components/user/profile-display-name";
import { useProfileQuery } from "@/state/queries/profile";
import { useSearchPostsQuery } from "@/state/queries/search";
import { api, currentAccountAtom } from "@/state/session";
import { AppBskyFeedPost } from "@atproto/api";
import { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { useAtomValue } from "jotai";
import { RadarIcon } from "lucide-react";
import { useState } from "react";

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
								<RadarIcon className="animate-spin text-purple-100" />{" "}
								Carregando…
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
	const currentUserProfile = useProfileQuery({ did: currentUser?.did });
	const [search, setSearch] = useState("");
	const [query, setQuery] = useState("");
	const [searchType, setSearchType] = useState<"all" | "me" | "user">("all");
	const [userToSearch, setUserToSearch] = useState("");
	if (!currentUserProfile.data) {
		return null;
	}
	return (
		<div className="flex flex-col items-center w-full justify-start pt-4 h-screen overflow-auto bg-gray-100 dark:bg-gray-900">
			<div>
				<h2>YABC - Busca</h2>
				<div>
					Logado como{" "}
					<ProfileDisplayName
						className="inline-flex"
						profile={currentUserProfile.data as ProfileViewDetailed}
					/>{" "}
					-{" "}
					<button
						type="button"
						onClick={() => {
							api.logout();
						}}
					>
						Sair
					</button>
				</div>
			</div>
			<div className="flex justify-center items-center gap-x-4">
				<input
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					type="search"
					placeholder="Buscar no Bluesky"
				/>{" "}
				<button
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
				</button>
			</div>
			<RadioGroup
				onValueChange={(e: "all" | "me" | "user") => {
					setSearchType(e);
				}}
			>
				<div className="flex items-center gap-x-2">
					<RadioGroupItem
						checked={searchType === "all"}
						value="all"
						id="search-all-posts"
					/>
					<label htmlFor="search-all-posts">Buscar todos os posts</label>|
					<RadioGroupItem
						checked={searchType === "me"}
						value="me"
						id="search-my-posts"
					/>
					<label htmlFor="search-my-posts">Buscar nos meus posts</label>|
					<RadioGroupItem
						checked={searchType === "user"}
						value="user"
						id="search-user-posts"
					/>
					<label htmlFor="search-user-posts">Buscar nos posts do usuário</label>
					<AutocompleteUsers
						onSelect={(e: string) => {
							setUserToSearch(e);
						}}
					/>
				</div>
			</RadioGroup>
			{query ? (
				<div className="max-w-[600px]">
					<SearchResults query={query} />
				</div>
			) : (
				""
			)}
			<div className="flex self-center mt-auto text-xs text-purple-300">
				versão {YABC_VERSION}
			</div>
		</div>
	);
}
