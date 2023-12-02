import { cn } from "@/lib/utils";
import { ExpandIcon, ShrinkIcon } from "lucide-react";
import { PropsWithChildren, useState } from "react";
import {
	Link,
	Location,
	useLocation,
	useNavigate,
	useParams,
} from "react-router-dom";
import { Sheet, SheetContent } from "./ui/sheet";

function generateExpandOrShrinkLink(location: Location, isExpanded = true) {
	if (isExpanded) {
		return location.pathname.replace("/expand", "");
	}
	return `/expand${location.pathname}`;
}
export function Drawer({ children, open }: PropsWithChildren<{ open: boolean }>) {
	const location = useLocation();
	const params = useParams();
	const { expand } = params;
	const navigate = useNavigate();
	const [prevExpand, setPrevExpand] = useState(expand);
	const isExpanded = prevExpand === "expand";

	if (prevExpand !== expand) {
		setPrevExpand(expand);
	}

	return (
		<Sheet
			open={open}
			onOpenChange={(isOpening) => {
				if (!isOpening) {
					navigate("/");
				}
			}}
		>
			<SheetContent
				side={"right"}
				className={cn(
					"p-0 w-full max-w-none overflow-y-auto overflow-x-visible sm:max-w-none transition-all",
					{
						"lg:w-1/3": !isExpanded,
						"lg:w-full": isExpanded,
					},
				)}
			>
				{children}
				<Link
					className="absolute p-1 text-primary-foreground left-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none bg-primary"
					to={generateExpandOrShrinkLink(location, isExpanded)}
					onClick={() => {
						setPrevExpand((s) => s ? "expand" : undefined);
					}}
				>
					{isExpanded ? (
						<ShrinkIcon className="h-4 w-4" />
					) : (
						<ExpandIcon className="h-4 w-4" />
					)}
				</Link>
			</SheetContent>
		</Sheet>
	);
}
