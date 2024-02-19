import { DeckColumn, columnsAtom } from "@/components/panes/columns";
import { useAtomValue } from "jotai";

export function DeckView() {
	const columns = useAtomValue(columnsAtom);

	return (
		<div className="h-screen overflow-y-auto flex">
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
