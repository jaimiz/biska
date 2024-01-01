import { Post } from "@/components/feed/post";
import { Checkbox } from "@/components/ui/checkbox";
import { ProfileDisplayName } from "@/components/user/profile-display-name";
import { useProfileQuery } from "@/state/queries/profile";
import { useSearchPostsQuery } from "@/state/queries/search";
import { api, currentAccountAtom } from "@/state/session";
import { AppBskyFeedPost } from "@atproto/api";
import { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { useAtomValue } from "jotai";
import { useState } from "react";

function SearchResults({ query }: { query: string }) {
	const { data, isLoading, isError } = useSearchPostsQuery({ query });
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

	return isLoading ? "Buscando…" : isError ? "Erro" : posts;
}

export function Search() {
	const currentUser = useAtomValue(currentAccountAtom);
	const currentUserProfile = useProfileQuery({ did: currentUser?.did });
	const [search, setSearch] = useState("");
	const [query, setQuery] = useState("");
	const [searchMine, setSearchMine] = useState(false);
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
						if (searchMine && search !== "") {
							setQuery(`${search} from:${currentUserProfile.data.handle}`);
							return;
						}
						setQuery(search);
					}}
				>
					Buscar
				</button>
			</div>
			<div className="flex items-center gap-x-2">
				<Checkbox
					checked={searchMine}
					onCheckedChange={(e) => {
						setSearchMine(e !== false);
					}}
					id="search-my-posts"
				/>
				<label htmlFor="search-my-posts">Buscar nos meus posts</label>
			</div>
			{query ? (
				<div className="max-w-[600px]">
					<SearchResults query={query} />
				</div>
			) : (
				""
			)}
		</div>
	);
}
