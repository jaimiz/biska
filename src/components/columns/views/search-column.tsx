import { SearchResults } from "@/components/search/interactive-search";
import { Button } from "@/components/ui/button";
import { useColumnContext } from "@/views/DeckView";
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
			,{isSettingsOpen && <GenericSettings index={index} />}
		</>
	);
}

export function GenericSettings(props: { index: number }) {
	return (
		<div className="flex w-60 border-l p-2">
			<Button
				type="button"
				variant="destructive"
				onClick={() => {
					removeColumn(props.index);
				}}
			>
				Delete this column
			</Button>
		</div>
	);
}
