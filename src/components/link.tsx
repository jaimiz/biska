import { cn } from "@/lib/utils";
import { RefAttributes } from "react";
import {
	Link as RouterLink,
	LinkProps as RouterLinkProps,
	To,
} from "react-router-dom";

const EXPANDED_LINK_PREFIX = "/expand";
export function generateExpandOrShrinkLink(location: To) {
	const currentLocation =
		typeof location === "string" ? location : location.pathname;
	if (!currentLocation) {
		return location;
	}
	if (currentLocation.startsWith(EXPANDED_LINK_PREFIX)) {
		return currentLocation.replace(EXPANDED_LINK_PREFIX, "");
	}
	return `${EXPANDED_LINK_PREFIX}${currentLocation}`;
}

type LinkProps = RouterLinkProps & RefAttributes<HTMLAnchorElement>;
export function AppLink(props: LinkProps) {
	return <RouterLink {...props} />;
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

export function ExpandOrShrinkLink({ to, ...props }: LinkProps) {
	return <RouterLink to={generateExpandOrShrinkLink(to)} {...props} />;
}
