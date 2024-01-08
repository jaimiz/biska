import { cn } from "@/lib/utils";
import { usePostRepostMutation } from "@/state/queries/post";
import { SkylineSliceItem } from "@/state/queries/profile";
import { ClassValue } from "clsx";
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
	const replyCount = post.replyCount ?? 0;
	const MessagesIcon =
		replyCount > 4
			? MessagesSquareIcon
			: replyCount > 0
			? MessageSquareIcon
			: MessageSquareDashedIcon;

	const hasReposted = Boolean(post.viewer?.repost);
	const hasLiked = Boolean(post.viewer?.like);
	const repostPost = usePostRepostMutation();
	return (
		<>
			<button type="button" className="flex hover:text-blue-500">
				<CounterIcon count={replyCount} Icon={MessagesIcon} />
			</button>
			<button
				type="button"
				onClick={() => {
					repostPost.mutate(post);
				}}
				className={cn(
					"flex",
					hasReposted && ["hover:text-inherit", "text-green-700"],
					!hasReposted && ["text-inherit", "hover:text-green-700"],
				)}
			>
				<CounterIcon Icon={Repeat2Icon} count={Number(post.repostCount)} />
			</button>
			<button
				type="button"
				className={cn(
					"flex group",
					hasLiked && ["hover:text-inherit", "text-goldenrod-400"],
					!hasLiked && ["text-base", "hover:text-goldenrod-400"],
				)}
			>
				<CounterIcon
					className={cn("group-hover:fill-current", {
						"group-hover:fill-none": hasLiked,
						"fill-current": hasLiked,
					})}
					Icon={StarIcon}
					count={Number(post.likeCount)}
				/>
			</button>
		</>
	);
}
