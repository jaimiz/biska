import { cn } from "@/lib/utils";
import { ExpandIcon, ShrinkIcon } from "lucide-react";
import { PropsWithChildren, useState } from "react";
import {
	Location,
	useLocation,
	useNavigate,
	useParams,
} from "react-router-dom";
import { Sheet, SheetContent } from "./ui/sheet";
import { cva } from "class-variance-authority";
import { AppLink, ExpandOrShrinkLink, generateExpandOrShrinkLink } from "./link";

const DrawerVariants = cva(
	"p-0 w-full max-w-none overflow-y-auto overflow-x-visible sm:max-w-none transition-all",
	{
		variants: {
			expanded: {
				shrunken: ["lg:w-1/3"],
				expanded: ["lg:w-full", "is-expanded"],
			},
		},
		defaultVariants: {
			expanded: "shrunken",
		},
	},
);
export function Drawer({
	children,
	open,
}: PropsWithChildren<{ open: boolean }>) {
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
					DrawerVariants({
						expanded: isExpanded ? "expanded" : "shrunken",
					}),
				)}
			>
				{children}
				<ExpandOrShrinkLink
					className="absolute p-1 text-primary-foreground left-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none bg-primary"
					to={location}
					onClick={() => {
						setPrevExpand((s) => (s ? "expand" : undefined));
					}}
				>
					{isExpanded ? (
						<ShrinkIcon className="h-4 w-4" />
					) : (
						<ExpandIcon className="h-4 w-4" />
					)}
				</ExpandOrShrinkLink>
			</SheetContent>
		</Sheet>
	);
}
