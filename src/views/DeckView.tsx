import { DeckColumn, columnsAtom } from "@/components/panes/columns";
import { useAtomValue } from "jotai";

export function DeckView() {
	const columns = useAtomValue(columnsAtom);

	return columns.map((column, index) => {
		return (
			<DeckColumn key={`column-${column.type}-${index}`} settings={column} />
		);
	});
}
