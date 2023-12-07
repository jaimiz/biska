import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import { FC, PropsWithChildren } from "react";

export function makeWrapper(wrapperClasses: ClassValue): FC<
	PropsWithChildren<{
		className?: ClassValue;
	}>
> {
	return ({ children, className }) => (
		<div className={cn(wrapperClasses, className)}>{children}</div>
	);
}
