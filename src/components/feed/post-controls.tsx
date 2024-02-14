import { postsFamily } from "@/features/posts/atoms";
import {
	usePostLikeMutation,
	usePostRepostMutation,
	usePostUnlikeMutation,
	usePostUnrepostMutation,
} from "@/features/posts/queries";
import { SkylineSliceItem } from "@/features/user/profileQueries";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import { useAtomValue } from "jotai";
import {
	LucideIcon,
	MessageSquareDashedIcon,
	MessageSquareIcon,
	MessagesSquareIcon,
	Repeat2Icon,
	StarIcon,
} from "lucide-react";

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
	const postAtom = useAtomValue(postsFamily(post));
	const replyCount = postAtom.replyCount ?? 0;
	const MessagesIcon =
		replyCount > 4
			? MessagesSquareIcon
			: replyCount > 0
			? MessageSquareIcon
			: MessageSquareDashedIcon;

	console.log({ postAtom });
	const hasReposted = Boolean(postAtom.viewer?.repost);
	const hasLiked = Boolean(postAtom.viewer?.like);
	const repost = usePostRepostMutation(post);
	const like = usePostLikeMutation(post);
	const unrepost = usePostUnrepostMutation(post);
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
						unrepost.mutate(postAtom.viewer?.repost as string);
						return;
					}
					repost.mutate(post);
				}}
				className={cn(
					"flex",
					hasReposted && ["text-green-700"],
					!hasReposted && ["text-inherit", "hover:text-green-700"],
				)}
			>
				<CounterIcon Icon={Repeat2Icon} count={postAtom.repostCount} />
			</button>
			<button
				type="button"
				onClick={() => {
					if (hasLiked) {
						unlike.mutate(postAtom.viewer?.like as string);
						return;
					}
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
					count={postAtom.likeCount}
				/>
			</button>
		</>
	);
}
