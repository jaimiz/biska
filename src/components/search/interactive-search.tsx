import { Post } from "@/components/feed/post";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { buildSearchQuery } from "@/lib/search-parser";
import { useState } from "react";
import { useSearchPostsQuery } from "./queries";
import { BskyAppLink } from "../ui/link";
import { Column, ColumnContent, ColumnHeader } from "../panes/column";
import { cn } from "@/lib/utils";
import { atom, useAtomValue } from "jotai";
import { isLoggedInAtom } from "../user/sessionAtoms";

function SearchResults({ query }: { query: string }) {
	const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetching } =
		useSearchPostsQuery({ query });
	if (isLoading) {
		return "Buscando…";
	}

	if (!data) {
		return null;
	}
	const pages = data.pages.flatMap((page) => page.posts);
	const posts = pages.map((post) => {
		return <Post key={post.cid} post={post} />;
	});

	return isError ? (
		"Erro"
	) : (
		<div className="flex flex-col items-center gap-4">
			<div className="max-w-full">{posts}</div>
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

const interactiveSearchOpenAtom = atom(true);
export const interactiveSearchAtom = atom(
	(get) => {
		const isLogged = get(isLoggedInAtom);
		return isLogged && get(interactiveSearchOpenAtom);
	},
	(get, set, update?: boolean) => {
		const prev = get(interactiveSearchOpenAtom);
		set(interactiveSearchOpenAtom, update ?? !prev);
	},
);

export function InteractiveSearch() {
	const isOpen = useAtomValue(interactiveSearchAtom);
	const [searchTerms, setSearchTerms] = useState("");
	const [query, setQuery] = useState("");
	const [searchType] = useState<"all" | "me" | "user">("all");

	return (
		<Column
			size="lg"
			className={cn("w-0 overflow-hidden transition-[width]", {
				"w-120": isOpen,
			})}
		>
			<ColumnHeader title="Buscar" icon="interactiveSearch" />
			<ColumnContent>
				<div className="flex w-full justify-center items-center gap-x-4">
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
									}),
								);
								return;
							}
							if (searchType === "user" && searchTerms !== "") {
								setQuery(
									buildSearchQuery({
										terms: searchTerms,
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

				{query ? (
					<>
						<div className="text-sm text-right max-w-full">
							<BskyAppLink
								to={`/search?q=${query}`}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-1"
							>
								Abrir busca no Bsky.app
							</BskyAppLink>
						</div>
						<SearchResults query={query} />
					</>
				) : null}
			</ColumnContent>
		</Column>
	);
}
