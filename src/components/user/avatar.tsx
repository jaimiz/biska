import { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { getInitials } from "@/lib/strings";
import { ClassValue } from "clsx";
import { cn } from "@/lib/utils";

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
