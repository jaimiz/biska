import { Column, ColumnContent, ColumnHeader } from "./column";
import { SearchColumn } from "./columns";

export function SearchPane(props: SearchColumn) {
	if (!props.query) {
		return null;
	}
	return (
		<Column>
			<ColumnHeader title={`Busca "${props.query}"`} icon="search" />
			<ColumnContent>This is a search pane</ColumnContent>
		</Column>
	);
}
