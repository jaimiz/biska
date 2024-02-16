import { ColumnContent, ColumnHeader } from "@/components/column";
import { Post } from "@/components/feed/post";
import { BskyAppLink } from "@/components/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { buildSearchQuery } from "@/lib/search-parser";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import { useState } from "react";
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

export function InteractiveSearch({ className }: { className?: ClassValue }) {
	// const [interactiveSearch, setInteractiveSearch] = useAtom(
	// 	interactiveSearchAtom,
	// );
	const [searchTerms, setSearchTerms] = useState("");
	const [query, setQuery] = useState("");
	const [searchType] = useState<"all" | "me" | "user">("all");

	//  className="z-0 -translate-x-full"
	return (
		<div className={cn(className)}>
			<ColumnHeader title="Busca" icon="interactiveSearch" />
			<ColumnContent>
				<div className="">
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
							<div className="text-sm text-right max-w-prose w-full mt-2">
								<BskyAppLink
									to={`/search?q=${query}`}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1"
								>
									Abrir busca no Bsky.app
								</BskyAppLink>
							</div>
							<div className="max-w-prose">
								<SearchResults query={query} />
							</div>
						</>
					) : null}
				</div>
			</ColumnContent>
		</div>
	);
}
