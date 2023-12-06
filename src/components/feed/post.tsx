import { type SkylineSliceItem } from "@/state/queries/profile";
import { RichText as RichTextAPI } from "@atproto/api";
import { MessageSquareDashedIcon, MessageSquareIcon, MessagesSquareIcon, Repeat2Icon, StarIcon } from "lucide-react";
import { FC, PropsWithChildren, useMemo } from "react";
import { RichText } from "../text";
import { TimeElapsed } from "../text/time-elapsed";
import { UserAvatar } from "../user/avatar";
import { ProfileDisplayName } from "../user/profile-display-name";

type PostProps = SkylineSliceItem;
export function Post({ post, record }: PostProps) {
	const postText = useMemo(() => {
		const rt = new RichTextAPI({
			text: record.text,
		});
		rt.detectFacetsWithoutResolution();
		return rt;
	}, [record]);

	return (
		<div
			key={post.cid}
			className="flex text border-primary border-solid border-y-2 -mt-[2px] py-4 px-2 gap-x-4"
		>
			<div>
				<UserAvatar className="w-12 h-12" profile={post.author} />
			</div>
			<div className="flex-1">
				<div className="flex">
					<ProfileDisplayName profile={post.author} />
					<TimeElapsed timestamp={post.indexedAt}>
						{({ timeElapsed }) => <span className="text-zinc-500">{" "}&middot;{" "}{timeElapsed}</span>}
					</TimeElapsed>
				</div>
				<RichText richText={postText} />
				<div className="flex justify-between">
					<PostActions post={post} />
				</div>
			</div>
		</div>
	);
}

type ActionIconProps = {
	icon: "reply" | "repost" | "like"
	count: number
}
function ActionIcon({ icon, count }: ActionIconProps) {
	const Wrapper: FC<PropsWithChildren> = ({ children }) => <div className="flex flex-1 items-center gap-x-1 text-base">{children}</div>
	const IconClass = "w-4 h-4"
	switch (icon) {
		case "reply":
			if (count > 4) {
				return <Wrapper><MessagesSquareIcon className={IconClass} /> {count}</Wrapper>
			}
			if (count > 0 && count < 5) {
				return <Wrapper><MessageSquareIcon className={IconClass} /> {count} </Wrapper>
			}
			return <Wrapper><MessageSquareDashedIcon className={IconClass} /> {count}</Wrapper>
		case "repost":
			return <Wrapper><Repeat2Icon className={IconClass} /> {count}</Wrapper>
		case "like":
			return <Wrapper><StarIcon className={IconClass} /> {count}</Wrapper>
	}
}

function PostActions({ post }: Pick<SkylineSliceItem, "post">) {
	return <>
		<ActionIcon icon="reply" count={Number(post.replyCount)} />
		<ActionIcon icon="repost" count={Number(post.repostCount)} />
		<ActionIcon icon="like" count={Number(post.likeCount)} />
	</>
}

export function PostConnector() {
	return <div className="h-full w-[2px] bg-secondary m-auto" />;
}
