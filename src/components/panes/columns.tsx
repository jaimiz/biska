import { Did } from "@/state/schema";
import { atomStore } from "@/state/state";
import { atomWithStorage } from "jotai/utils";
import { SearchPane } from "./search-column";

type CommonColumn = {
	account: Did;
	title: string;
};

export type SearchColumn = CommonColumn & {
	type: "search";
	query: string;
};

export type ColumnConfig = SearchColumn;
export const columnsAtom = atomWithStorage<ColumnConfig[]>("columns", []);

export const createColumn = {
	search: ({ query, account }: { query: string; account: Did }) => ({
		type: "search" as const,
		title: "Busca",
		query,
		account,
	}),
};

export const addColumn = (config: ColumnConfig) => {
	atomStore.set(columnsAtom, (columns) => [...columns, config]);
};

const columnComponents = {
	search: SearchPane,
};

type DeckColumnProps = {
	settings: ColumnConfig;
};
export function DeckColumn(props: DeckColumnProps) {
	const ColumnComponent = columnComponents[props.settings.type];
	if (!ColumnComponent) return null;
	return <ColumnComponent {...props.settings} />;
}
