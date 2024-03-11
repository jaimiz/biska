import { Column } from "@/components/columns/views/column";
import {
	BaseColumnConfig,
	ColumnSelector,
	addColumn,
	columnsAtom,
	createColumn,
} from "@/components/columns/views/columns";
import { Button } from "@/components/ui/button";
import { requireAccountAtom } from "@/components/user/sessionAtoms";
import { getCurrentTid } from "@/lib/utils";
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

	const currentAccount = useAtomValue(requireAccountAtom);
	const DeckColumns = () => (
		<>
			{" "}
			{columns.map((column, index) => {
				return (
					<ColumnContextProvider index={index} column={column} key={column.id}>
						<ColumnSelector columnConfig={column} />
					</ColumnContextProvider>
				);
			})}
		</>
	);
	return (
		<>
			<DeckColumns />
			<Column>
				<div className="flex m-auto">
					<Button
						type="button"
						onClick={() => {
							// TODO: Implement new column modal later, for now, let's add a
							// home column
							addColumn(
								createColumn.home({
									id: getCurrentTid(),
									account: currentAccount.did,
								}),
							);
						}}
					>
						Adicionar Coluna
					</Button>
				</div>
			</Column>
		</>
	);
}
