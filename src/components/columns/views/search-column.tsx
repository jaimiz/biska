import { SearchResults } from "@/components/search/interactive-search";
import { useColumnContext } from "@/views/DeckView";
import { Column, ColumnBody, ColumnHeader } from "./column";
import { SearchColumnConfig, removeColumn } from "./columns";
import { Provider, atom, useAtom } from "jotai";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";

export function SearchColumn() {
	const { column, index } = useColumnContext<SearchColumnConfig>();
	const [isSettingsOpen, toggleSettings] = useAtom(
		useMemo(() => atom(false), []),
	);
	return [
		<Column>
			<ColumnHeader
				settingsClick={() => toggleSettings(!isSettingsOpen)}
				title={`Busca • ${column.query}`}
				icon="search"
			/>
			<ColumnBody>
				<SearchResults query={column.query} />
			</ColumnBody>
		</Column>,
		isSettingsOpen && (
			<Provider>
				<div className="flex w-60 border-l border-divider p-2">
					<Button
						type="button"
						variant="destructive"
						onClick={() => {
							toggleSettings(false);
							removeColumn(index);
						}}
					>
						Delete this column
					</Button>
				</div>
			</Provider>
		),
	];
}
