import {
	usePostLikeMutation,
	usePostRepostMutation,
	usePostUnlikeMutation,
	usePostUnrepostMutation,
} from "@/features/posts/queries";
import { SkylineSliceItem } from "@/features/user/profileQueries";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import {
	LucideIcon,
	MessageSquareDashedIcon,
	MessageSquareIcon,
	MessagesSquareIcon,
	Repeat2Icon,
	StarIcon,
} from "lucide-react";
import { useState } from "react";

type CounterIconProps = {
	count?: number;
	Icon: LucideIcon;
	className?: ClassValue;
};
function CounterIcon({ Icon, count, className }: CounterIconProps) {
	const IconClass = "w-4 h-4";
	return (
		<div className={cn("flex flex-1 items-center gap-x-1 text-current")}>
			<Icon className={cn(IconClass, className)} /> {Number(count)}
		</div>
	);
}

export function PostControls({ post }: { post: SkylineSliceItem["post"] }) {
	const replyCount = post.replyCount ?? 0;
	const MessagesIcon =
		replyCount > 4
			? MessagesSquareIcon
			: replyCount > 0
			? MessageSquareIcon
			: MessageSquareDashedIcon;

	const [hasReposted, setHasReposted] = useState(Boolean(post.viewer?.repost));
	const [hasLiked, setHasLiked] = useState(Boolean(post.viewer?.like));
	const [repostCount, setRepostCount] = useState(post.repostCount ?? 0);
	const [likeCount, setLikeCount] = useState(post.likeCount ?? 0);
	const repost = usePostRepostMutation();
	const like = usePostLikeMutation(post);
	const unrepost = usePostUnrepostMutation();
	const unlike = usePostUnlikeMutation(post);
	return (
		<>
			<button type="button" className="flex hover:text-blue-500">
				<CounterIcon count={replyCount} Icon={MessagesIcon} />
			</button>
			<button
				type="button"
				onClick={() => {
					if (hasReposted) {
						setHasReposted(false);
						setRepostCount((c) => c - 1);
						try {
							// FIXME: If the user doesn't refresh the page, this will be null
							// and we can't unlike/unrepost
							// biome-ignore lint/style/noNonNullAssertion: <explanation>
							unrepost.mutate(post.viewer!.repost as string);
						} catch {
							setRepostCount((c) => c + 1);
							setHasReposted(true);
						}
						return;
					}
					setRepostCount((c) => c + 1);
					setHasReposted(true);
					repost.mutate(post);
				}}
				className={cn(
					"flex",
					hasReposted && ["text-green-700"],
					!hasReposted && ["text-inherit", "hover:text-green-700"],
				)}
			>
				<CounterIcon Icon={Repeat2Icon} count={repostCount} />
			</button>
			<button
				type="button"
				onClick={() => {
					if (hasLiked) {
						setHasLiked(false);
						setLikeCount((c) => c - 1);
						try {
							// FIXME: If the user doesn't refresh the page, this will be null
							// and we can't unlike/unrepost
							// biome-ignore lint/style/noNonNullAssertion: <explanation>
							unlike.mutate(post.viewer!.like as string);
						} catch {
							setHasLiked(true);
							setLikeCount((c) => c + 1);
						}
						return;
					}
					setHasLiked(true);
					setLikeCount((c) => c + 1);
					like.mutate(post);
				}}
				className={cn(
					"flex group",
					hasLiked && ["text-goldenrod-400"],
					!hasLiked && ["text-base", "hover:text-goldenrod-400"],
				)}
			>
				<CounterIcon
					className={cn("group-hover:fill-none", {
						"fill-current": hasLiked,
						"stroke-current": hasLiked,
					})}
					Icon={StarIcon}
					count={likeCount}
				/>
			</button>
		</>
	);
}
