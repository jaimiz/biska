import { cn } from "@/lib/utils";
import { type SkylineSliceItem } from "@/state/queries/profile";
import {
	AppBskyEmbedExternal,
	AppBskyEmbedImages,
	AppBskyEmbedRecord,
	AppBskyEmbedRecordWithMedia,
	RichText as RichTextAPI,
} from "@atproto/api";
import { ClassValue } from "clsx";
import { useMemo } from "react";
import { RichText } from "../text";
import { TimeElapsed } from "../text/time-elapsed";
import { UserAvatar } from "../user/avatar";
import { ProfileDisplayName } from "../user/profile-display-name";
import { makeWrapper } from "../util/wrapper-factory";
import {
	MessageSquareDashedIcon,
	MessageSquareIcon,
	MessagesSquareIcon,
	Repeat2Icon,
	StarIcon,
} from "lucide-react";

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
						{({ timeElapsed }) => (
							<span className="text-zinc-500"> &middot; {timeElapsed}</span>
						)}
					</TimeElapsed>
				</div>
				<RichText richText={postText} />
				{post.embed && <PostEmbed embed={post.embed} />}
				<div className="flex justify-between">
					<PostActions post={post} />
				</div>
			</div>
		</div>
	);
}

type ActionIconProps =
	| {
			icon: "reply";
			count: number;
			active?: undefined;
	  }
	| {
			icon: "like" | "repost";
			count: number;
			active: boolean;
	  };
function ActionIcon({ icon, count, active }: ActionIconProps) {
	const Wrapper = makeWrapper("flex flex-1 items-center gap-x-1 text-base");
	const IconClass = "w-4 h-4";
	const HoverCount = (count: number, active: boolean) => {
		return (
			<>
				<span className="group-hover:hidden">{count}</span>
				<span className="hidden group-hover:inline">
					{active ? count - 1 : count + 1}
				</span>
			</>
		);
	};
	switch (icon) {
		case "reply":
			if (count > 4) {
				return (
					<Wrapper>
						<MessagesSquareIcon className={IconClass} /> {count}
					</Wrapper>
				);
			}
			if (count > 0 && count < 5) {
				return (
					<Wrapper>
						<MessageSquareIcon className={IconClass} /> {count}{" "}
					</Wrapper>
				);
			}
			return (
				<Wrapper>
					<MessageSquareDashedIcon className={IconClass} /> {count}
				</Wrapper>
			);
		case "repost": {
			return (
				<Wrapper
					className={cn("group", "cursor-pointer", {
						"text-green-700": active,
						"font-medium": active,
						"hover:text-green-700": !active,
						"hover:text-inherit": active,
					})}
				>
					<Repeat2Icon className={IconClass} /> {HoverCount(count, active)}
				</Wrapper>
			);
		}
		case "like":
			return (
				<Wrapper>
					<div
						className={cn(
							"group cursor-pointer flex text-base gap-x-1 items-center",
							{
								"hover:text-goldenrod-400": !active,
								"hover:text-inherit": active,
								"text-goldenrod-400": active,
								"font-medium": active,
							},
						)}
					>
						<StarIcon
							className={cn(IconClass, {
								"fill-goldenrod-400": active,
								"group-hover:fill-none": active,
							})}
						/>{" "}
						{HoverCount(count, active)}
					</div>
				</Wrapper>
			);
	}
}

function PostActions({ post }: Pick<SkylineSliceItem, "post">) {
	return (
		<>
			<ActionIcon icon="reply" count={Number(post.replyCount)} />
			<ActionIcon
				icon="repost"
				count={Number(post.repostCount)}
				active={Boolean(post.viewer?.repost)}
			/>
			<ActionIcon
				icon="like"
				count={Number(post.likeCount)}
				active={Boolean(post.viewer?.like)}
			/>
		</>
	);
}

export function PostConnector() {
	return <div className="h-full w-[2px] bg-secondary m-auto" />;
}

type Embed =
	| AppBskyEmbedRecord.View
	| AppBskyEmbedImages.View
	| AppBskyEmbedExternal.View
	| AppBskyEmbedRecordWithMedia.View
	| { $type: string; [k: string]: unknown };

type PostEmbedProps = {
	embed: Embed;
};

function PostEmbed({ embed }: PostEmbedProps) {
	if (AppBskyEmbedImages.isView(embed)) {
		return <EmbedImages images={embed.images} />;
	}
	return "Embed";
}

type EmbedImageProps = {
	images: AppBskyEmbedImages.ViewImage[];
};
function EmbedImages({ images }: EmbedImageProps) {
	const count = images.length;

	const GalleryWrapper = makeWrapper("my-2");

	switch (count) {
		case 4: {
			const borders = [
				"rounded-tl-lg",
				"rounded-tr-lg",
				"rounded-bl-lg",
				"rounded-br-lg",
			];
			return (
				<GalleryWrapper>
					<div className="grid grid-cols-2 gap-1">
						{images.map((image, index) => {
							return (
								<div className="aspect-square">
									<GalleryImage
										className={cn("rounded-none", borders[index])}
										image={image}
									/>{" "}
								</div>
							);
						})}
					</div>
				</GalleryWrapper>
			);
		}
		case 3: {
			const [largeImage, topSmall, bottomSmall] = images;
			return (
				<GalleryWrapper>
					<div className="flex flex-row flex-nowrap gap-1">
						<div className="flex flex-[2]">
							<GalleryImage className="rounded-r-none" image={largeImage} />
						</div>
						<div className="flex flex-1 flex-col gap-1">
							<GalleryImage
								className="rounded-none rounded-tr-lg"
								image={topSmall}
							/>
							<GalleryImage
								className="rounded-none rounded-br-lg"
								image={bottomSmall}
							/>
						</div>
					</div>
				</GalleryWrapper>
			);
		}
		case 2: {
			const [first, second] = images;
			return (
				<GalleryWrapper>
					{" "}
					<div className="flex gap-1 my-4">
						<div className="flex-1 aspect-square">
							<GalleryImage className="rounded-r-none" image={first} />{" "}
						</div>
						<div className="flex-1 aspect-square">
							<GalleryImage className="rounded-l-none" image={second} />{" "}
						</div>
					</div>
				</GalleryWrapper>
			);
		}
		default: {
			return (
				<GalleryWrapper>
					<GalleryImage image={images[0]} />
				</GalleryWrapper>
			);
		}
	}
}

type GalleryImageProps = {
	image: AppBskyEmbedImages.ViewImage;
	className?: ClassValue;
};
function GalleryImage({ image, className }: GalleryImageProps) {
	const { alt, thumb } = image;
	return (
		<img
			alt={alt}
			className={cn("object-cover w-full rounded-lg", className)}
			src={thumb}
		/>
	);
}
