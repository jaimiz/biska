import { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { Link } from "react-router-dom";
import { UserAvatar } from "./avatar";

type ProfileCardProps = {
	profile: ProfileViewDetailed
}
export function ProfileCard(props: ProfileCardProps) {
	const { profile } = props;
	return <Link to={`/profile/${profile.handle}`} className="px-6 py-4 flex items-center gap-3">
		<UserAvatar className="h-9 w-9" profile={profile} />
		<div>
			{profile.displayName ? <div className="font-medium">{`${profile.displayName}`}</div> : null}
			<div className="text-zinc-500 dark:text-zinc-400">@{profile.handle}</div>
		</div>
	</Link>
}
