import { cn } from "@/lib/utils";
import { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { ClassValue } from "clsx";
import { atom, useSetAtom } from "jotai";
import { SmartLink } from "../ui/link";

type ProfileDisplayNameProps = {
	profile: ProfileViewDetailed;
	className?: ClassValue;
	showUsername?: boolean;
};

export const peekProfileAtom = atom<ProfileViewDetailed | null>(null);
export function ProfileDisplayName(props: ProfileDisplayNameProps) {
	const { profile, className, showUsername = true } = props;
	const setPeekProfile = useSetAtom(peekProfileAtom);
	return (
		<SmartLink
			onClick={() => {
				setPeekProfile(profile);
			}}
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
		</SmartLink>
	);
}
