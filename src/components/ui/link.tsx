import { cn } from "@/lib/utils";
import { useAtomValue } from "jotai";
import { ExternalLinkIcon } from "lucide-react";
import { RefAttributes } from "react";
import {
	Link as RouterLink,
	LinkProps as RouterLinkProps,
} from "react-router-dom";
import { behaviorPreferencesAtom } from "../preferences/atoms";

type LinkProps = RouterLinkProps & RefAttributes<HTMLAnchorElement>;

export function NavLink(props: LinkProps) {
	const { className, ...rest } = props;
	return <RouterLink className={cn("text-primary", className)} {...rest} />;
}

export function BskyAppLink(props: LinkProps) {
	const bskyLink = props.to?.toString().startsWith("http")
		? props.to
		: `https://bsky.app${props.to}`;

	const { children, className, ...rest } = props;
	return (
		<a
			className={cn("text-primary", className)}
			{...rest}
			href={bskyLink.toString()}
			target="_blank"
			rel="noreferrer"
		>
			{children}
			<ExternalLinkIcon className="w-3 h-3 inline-block" />
		</a>
	);
}

export function SmartLink(props: LinkProps) {
	const { openProfileIn } = useAtomValue(behaviorPreferencesAtom);
	if (openProfileIn === "bsky") {
		return <BskyAppLink {...props} />;
	}
	return <NavLink {...props} />;
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
