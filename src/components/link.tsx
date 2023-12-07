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

export function ExpandOrShrinkLink({ to, ...props }: LinkProps) {
	return <RouterLink to={generateExpandOrShrinkLink(to)} {...props} />;
}
