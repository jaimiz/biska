import { getInitials } from "@/lib/strings";
import { cn } from "@/lib/utils";
import { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { ClassValue } from "clsx";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type UserAvatarProps = {
	className?: ClassValue;
	profile: ProfileViewDetailed;
};
export function UserAvatar({ profile, className }: UserAvatarProps) {
	return (
		<Avatar className={cn(className)}>
			<AvatarImage
				alt={`${profile.displayName ?? profile.handle}`}
				src={profile.avatar}
			/>
			<AvatarFallback>
				{getInitials(profile.displayName ?? profile.handle)}
			</AvatarFallback>
		</Avatar>
	);
}
