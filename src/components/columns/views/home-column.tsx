import { Column, ColumnBody, ColumnHeader } from "./column";

export function HomeColumn() {
	return (
		<Column size="lg">
			<ColumnHeader title={"Home"} icon="home" />
			<ColumnBody>This is a home pane</ColumnBody>
		</Column>
	);
}
