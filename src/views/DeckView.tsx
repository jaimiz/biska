import {
	BaseColumnConfig,
	ColumnSelector,
	columnsAtom,
} from "@/components/columns/views/columns";
import { useAtomValue } from "jotai";
import { PropsWithChildren, createContext, useContext } from "react";

export interface ColumnContextObject<
	T extends BaseColumnConfig = BaseColumnConfig,
> {
	column: T;
	index: number;
}
const ColumnContext = createContext<ColumnContextObject | undefined>(undefined);

export const useColumnContext = <
	T extends BaseColumnConfig = BaseColumnConfig,
>() => {
	const context = useContext(ColumnContext);
	if (context === undefined) {
		throw new Error("useColumnSize must be used within a Column");
	}
	return context as ColumnContextObject<T>;
};

export const ColumnContextProvider = (
	props: PropsWithChildren<ColumnContextObject>,
) => {
	const columnContext: ColumnContextObject = {
		column: props.column,
		index: props.index,
	};
	return (
		<ColumnContext.Provider value={columnContext}>
			<div className="relative">
				<div className="flex h-full">{props.children}</div>
			</div>
		</ColumnContext.Provider>
	);
};

export function DeckView() {
	const columns = useAtomValue(columnsAtom);

	return columns.map((column, index) => {
		return (
			<ColumnContextProvider
				index={index}
				column={column}
				key={`column-${column.type}-${index}`}
			>
				<ColumnSelector columnConfig={column} />
			</ColumnContextProvider>
		);
	});
}
