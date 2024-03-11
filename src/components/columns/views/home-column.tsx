import { Post } from "@/components/feed/post";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useColumnContext } from "@/views/DeckView";
import { useState } from "react";
import { useTimeline } from "../timeline-queries";
import { Column, ColumnBody, ColumnHeader } from "./column";
import { HomeColumnConfig } from "./columns";
import { GenericSettings } from "./search-column";

export function HomeColumn() {
	const columnContext = useColumnContext<HomeColumnConfig>();
	const [isSettingsOpen, toggleSettings] = useState(false);
	return (
		<>
			<Column size="lg">
				<ColumnHeader
					title={"Home"}
					icon="home"
					settingsClick={() => toggleSettings(!isSettingsOpen)}
				/>
				<ColumnBody>
					<HomePosts />
				</ColumnBody>
			</Column>
			{isSettingsOpen && <GenericSettings index={columnContext.index} />}
		</>
	);
}

function HomePosts() {
	const columnContext = useColumnContext<HomeColumnConfig>();
	const { data, timeline } = useTimeline(columnContext.column.account);
	const { isLoading, isError, hasNextPage, isFetching, fetchNextPage } =
		timeline;

	if (isLoading) {
		return (
			<div className="flex mx-auto my-3 text-purple-400">
				<Spinner />
			</div>
		);
	}

	if (!data) {
		return null;
	}
	const posts = data.map((item) => {
		return <Post key={item.post.cid} post={item.post} />;
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
