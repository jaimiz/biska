import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent } from "./ui/sheet";

export function Drawer({
	children,
	open,
	onClose,
}: PropsWithChildren<{ open: boolean; onClose?: () => void }>) {
	const navigate = useNavigate();

	return (
		<Sheet
			open={open}
			onOpenChange={(isOpening) => {
				if (!isOpening) {
					navigate("/");
					if (onClose && typeof onClose === "function") {
						onClose();
					}
				}
			}}
		>
			<SheetContent
				side={"right"}
				className={cn(
					"p-0 w-full md:max-w-[600px] overflow-y-auto overflow-x-visible sm:max-w-none transition-all",
				)}
			>
				{children}
			</SheetContent>
		</Sheet>
	);
}
