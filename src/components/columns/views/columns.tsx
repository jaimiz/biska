import { Did } from "@/state/schema";
import { atomStore } from "@/state/state";
import { atomWithStorage } from "jotai/utils";
import { SearchColumn } from "./search-column";
import { HomeColumn } from "./home-column";

export const COLUMN_TYPE_HOME = "home";
export const COLUMN_TYPE_NOTIFICATIONS = "notifications";
export const COLUMN_TYPE_PROFILE = "profile";
export const COLUMN_TYPE_FEED = "feed";
export const COLUMN_TYPE_LIST = "list";
export const COLUMN_TYPE_SEARCH = "search";
export const COLUMN_TYPE_THREAD = "thread";

export type ColumnType =
	| typeof COLUMN_TYPE_HOME
	| typeof COLUMN_TYPE_NOTIFICATIONS
	| typeof COLUMN_TYPE_PROFILE
	| typeof COLUMN_TYPE_FEED
	| typeof COLUMN_TYPE_LIST
	| typeof COLUMN_TYPE_SEARCH
	| typeof COLUMN_TYPE_THREAD;

export enum COLUMN_SIZE {
	AUTO = "auto",
	SMALL = "sm",
	MEDIUM = "md",
	LARGE = "lg",
}

export interface BaseColumnConfig {
	readonly id: string;
	readonly type: ColumnType;
	title: string;
	size: COLUMN_SIZE;
}

export interface SearchColumnConfig extends BaseColumnConfig {
	readonly type: typeof COLUMN_TYPE_SEARCH;
	query: string;
}

export interface HomeColumnConfig extends BaseColumnConfig {
	readonly type: typeof COLUMN_TYPE_HOME;
}

type ColumnConfig = SearchColumnConfig | HomeColumnConfig;

export const columnsAtom = atomWithStorage<ColumnConfig[]>("columns", []);

export const createColumn = {
	[COLUMN_TYPE_SEARCH]: ({
		query,
		account,
		id,
	}: {
		id: string;
		query: string;
		account: Did;
	}) => ({
		id,
		type: "search" as const,
		title: "Busca",
		size: COLUMN_SIZE.AUTO,
		query,
		account,
	}),
};

export const addColumn = (config: ColumnConfig) => {
	atomStore.set(columnsAtom, (columns) => [...columns, config]);
};

export const removeColumn = (index: number) => {
	atomStore.set(columnsAtom, (columns) => {
		const newColumns = [...columns];
		newColumns.splice(index, 1);
		return newColumns;
	});
};

const COLUMN_COMPONENTS = {
	search: SearchColumn,
	home: HomeColumn,
} as const;

export function ColumnSelector(props: { columnConfig: ColumnConfig }) {
	const ColumnComponent = COLUMN_COMPONENTS[props.columnConfig.type];
	if (!ColumnComponent) return null;
	return <ColumnComponent />;
}
