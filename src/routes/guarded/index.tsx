import { Deck } from "@/components/deck";
import { useMatch } from "react-router-dom";

export function IndexRoute() {
	const isRoot = useMatch("/");
	return <Deck openDrawer={isRoot === null} />;
}
