import { useAtom, useAtomValue } from "jotai";
import { Outlet } from "react-router-dom";
import { DeckColumn } from "./column";
import { Drawer } from "./drawer";
import { requireAccountAtom } from "@/features/user/sessionAtoms";
import { columnsAtom } from "@/features/dashboard/columns";

export type DeckProps = {
	openDrawer?: boolean;
};
export function Deck(props: DeckProps) {
	const currentAccount = useAtomValue(requireAccountAtom);
	const [columns, setColumns] = useAtom(columnsAtom);
	if (!columns.length) {
		setColumns([
			{
				type: "skyline",
				account: currentAccount.did,
				settings: {
					name: "Skyline",
				},
			},
		]);
	}

	const addColumn = () => {
		setColumns([
			...columns,
			{
				type: "skyline",
				account: currentAccount.did,
				settings: {
					name: "New Skyline",
				},
			},
		]);
	};
	return (
		<main className="flex-1 overflow-auto w-full">
			<div className="h-screen overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700 flex">
				{columns.map((_, index) => {
					return <DeckColumn key={`columns-${index}`} />;
				})}
				<div
					onClick={addColumn}
					onKeyUp={addColumn}
					className="opacity-20 w-5 hover:w-[300px] group duration-100 ease-in-out transition-[width] flex items-center justify-center text-4xl text-gray-500 dark:text-gray-400 cursor-pointer bg-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
				>
					<span className="block group-hover:hidden text-lg">&raquo;</span>
					<span className="hidden group-hover:block text-lg">+ Add column</span>
				</div>
			</div>
			<Drawer open={Boolean(props.openDrawer)}>
				<Outlet />
			</Drawer>
		</main>
	);
}
