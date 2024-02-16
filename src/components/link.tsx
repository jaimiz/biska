import { behaviorPreferencesAtom } from "@/features/preferences/atoms";
import { cn } from "@/lib/utils";
import { useAtomValue } from "jotai";
import { ExternalLinkIcon } from "lucide-react";
import { RefAttributes } from "react";
import {
	Link as RouterLink,
	LinkProps as RouterLinkProps,
} from "react-router-dom";

type LinkProps = RouterLinkProps & RefAttributes<HTMLAnchorElement>;

export function NavLink(props: LinkProps) {
	return <RouterLink {...props} />;
}

export function BskyAppLink(props: LinkProps) {
	const bskyLink = props.to?.toString().startsWith("http")
		? props.to
		: `https://bsky.app${props.to}`;

	const { children, ...rest } = props;
	return (
		<RouterLink {...rest} to={bskyLink} target="_blank">
			{children}
			<ExternalLinkIcon className="w-3 h-3" />
		</RouterLink>
	);
}

export function SmartLink(props: LinkProps) {
	const { openProfileIn } = useAtomValue(behaviorPreferencesAtom);
	if (openProfileIn === "bsky") {
		return <BskyAppLink {...props} />;
	}
	return <RouterLink {...props} />;
}

export function ContainerLink({ children, className, ...rest }: LinkProps) {
	return (
		<div className={cn("relative [&_a]:z-[1]", className)}>
			<BskyAppLink
				className={
					"static before:absolute before:top-0 before:bottom-0 before:left-0 before:right-0 before:content-[''] before:z-0"
				}
				{...rest}
			/>
			{children}
		</div>
	);
}
