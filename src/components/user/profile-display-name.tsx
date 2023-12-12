import { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { AppLink } from "../link";
import { ClassValue } from "clsx";
import { cn } from "@/lib/utils";

type ProfileDisplayNameProps = {
	profile: ProfileViewDetailed;
	className?: ClassValue;
	showUsername?: boolean;
};

export function ProfileDisplayName(props: ProfileDisplayNameProps) {
	const { profile, className, showUsername = true } = props;
	return (
		<AppLink
			to={`/profile/${profile.handle}`}
			className={cn(
				"flex items-center gap-x-1 whitespace-nowrap max-w-[80%] overflow-hidden",
				className,
			)}
		>
			{profile.displayName ? (
				<div className="font-medium">{`${profile.displayName}`}</div>
			) : null}
			{(showUsername || !profile.displayName) && (
				<div className="text-zinc-500 dark:text-zinc-400 text-ellipsis overflow-hidden">
					{" "}
					@{profile.handle}
				</div>
			)}
		</AppLink>
	);
}
