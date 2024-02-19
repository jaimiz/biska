import { Did } from "@/state/schema";
import { atomWithStorage } from "jotai/utils";
import { InteractiveSearch } from "../search/interactive-search";
import { Column, ColumnContent, ColumnHeader } from "./column";

type CommonColumn = {
	account: Did;
};

type InteractiveSearchColumn = CommonColumn & {
	type: "interactiveSearch";
	title: "Busca";
};

export type ColumnConfig = InteractiveSearchColumn;
export const columnsAtom = atomWithStorage<ColumnConfig[]>("columns", [
	{ type: "interactiveSearch", title: "Busca", account: "did:plc:test" },
]);

export const createColumn = {
	interactiveSearch: (account: Did): InteractiveSearchColumn => ({
		type: "interactiveSearch",
		title: "Busca",
		account: account,
	}),
};

const columnComponents = {
	interactiveSearch: InteractiveSearchColumn,
};

function InteractiveSearchColumn(_: InteractiveSearchColumn) {
	return <InteractiveSearch />;
}

type DeckColumnProps = {
	settings: ColumnConfig;
};
export function DeckColumn(props: DeckColumnProps) {
	const ColumnComponent = columnComponents[props.settings.type](props.settings);
	return (
		<Column>
			<ColumnHeader title={props.settings.title} icon={props.settings.type} />
			<ColumnContent>{ColumnComponent}</ColumnContent>
		</Column>
	);
}
