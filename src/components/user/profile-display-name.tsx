import { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { Link } from "react-router-dom";

type ProfileDisplayNameProps = {
	profile: ProfileViewDetailed;
};

export function ProfileDisplayName(props: ProfileDisplayNameProps) {
	const { profile } = props;
	return (
		<Link to={`/profile/${profile.handle}`} className="flex items-center">
			<div className="flex gap-x-2">
				{profile.displayName ? (
					<div className="font-medium">{`${profile.displayName}`}</div>
				) : null}
				<div className="text-zinc-500 dark:text-zinc-400">
					@{profile.handle}
				</div>
			</div>
		</Link>
	);
}
