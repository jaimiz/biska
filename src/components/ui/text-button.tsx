import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ForwardedRef } from "react";
import { forwardRef } from "react";

type TextButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
export function TextButtonFn(
	props: TextButtonProps,
	innerRef: ForwardedRef<HTMLButtonElement>,
) {
	const { className, type = "button", ...rest } = props;
	return (
		<button
			ref={innerRef}
			type={type}
			className={cn("text-pink-600 hover:text-pink-800", className)}
			{...rest}
		/>
	);
}

export const TextButton = forwardRef<HTMLButtonElement, TextButtonProps>(
	TextButtonFn,
);
