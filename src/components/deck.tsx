import { DeckColumn, columnsAtom } from "@/features/deck/columns";
import { useAtomValue } from "jotai";

export function Deck() {
	const columns = useAtomValue(columnsAtom);

	return (
		<div className="h-screen overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700 flex">
			{columns.map((column, index) => {
				return (
					<DeckColumn
						key={`column-${column.type}-${index}`}
						settings={column}
					/>
				);
			})}
		</div>
	);
}
