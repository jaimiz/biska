import { SearchResults } from "@/components/search/interactive-search";
import { Button } from "@/components/ui/button";
import { useColumnContext } from "@/views/DeckView";
import { Provider } from "jotai";
import { useState } from "react";
import { Column, ColumnBody, ColumnHeader } from "./column";
import { SearchColumnConfig, removeColumn } from "./columns";

export function SearchColumn() {
	const { column, index } = useColumnContext<SearchColumnConfig>();
	const [isSettingsOpen, toggleSettings] = useState(false);
	return (
		<>
			<Column>
				<ColumnHeader
					settingsClick={() => toggleSettings(!isSettingsOpen)}
					title={`Busca • ${column.query}`}
					icon="search"
				/>
				<ColumnBody>
					<SearchResults query={column.query} />
				</ColumnBody>
			</Column>
			,
			{isSettingsOpen && (
				<Provider>
					<div className="flex w-60 border-l p-2">
						<Button
							type="button"
							variant="destructive"
							onClick={() => {
								removeColumn(index);
							}}
						>
							Delete this column
						</Button>
					</div>
				</Provider>
			)}
		</>
	);
}
