import { cn } from "@/lib/utils";
import { RefAttributes } from "react";
import {
	Link as RouterLink,
	LinkProps as RouterLinkProps,
} from "react-router-dom";

type LinkProps = RouterLinkProps & RefAttributes<HTMLAnchorElement>;
export function AppLink(props: LinkProps) {
	const bskyLink = props.to?.toString().startsWith("http")
		? props.to
		: `https://bsky.app${props.to}`;
	return <RouterLink {...props} to={bskyLink} target="_blank" />;
}

export function ContainerLink({ children, className, ...rest }: LinkProps) {
	return (
		<div className={cn("relative [&_a]:z-[1]", className)}>
			<AppLink
				className={
					"static before:absolute before:top-0 before:bottom-0 before:left-0 before:right-0 before:content-[''] before:z-0"
				}
				{...rest}
			/>
			{children}
		</div>
	);
}
