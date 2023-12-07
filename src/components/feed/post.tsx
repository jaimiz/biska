import { cn } from "@/lib/utils";
import { type SkylineSliceItem } from "@/state/queries/profile";
import {
	AppBskyEmbedExternal,
	AppBskyEmbedImages,
	AppBskyEmbedRecord,
	AppBskyEmbedRecordWithMedia,
	AppBskyFeedDefs,
	AppBskyFeedPost,
	AppBskyGraphDefs,
	AtUri,
	RichText as RichTextAPI,
} from "@atproto/api";
import { ClassValue } from "clsx";
import {
	MessageSquareDashedIcon,
	MessageSquareIcon,
	MessagesSquareIcon,
	Repeat2Icon,
	StarIcon,
} from "lucide-react";
import { useMemo } from "react";
import { RichText } from "../text";
import { TimeElapsed } from "../text/time-elapsed";
import { UserAvatar } from "../user/avatar";
import { ProfileDisplayName } from "../user/profile-display-name";
import { makeWrapper } from "../util/wrapper-factory";
import { makeHandleLink } from "@/lib/strings/handle";
import { AppLink } from "../link";

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
			<div className="flex flex-col flex-1 gap-2">
				<div className="flex">
					<ProfileDisplayName profile={post.author} />
					<TimeElapsed timestamp={post.indexedAt}>{TimeDisplay}</TimeElapsed>
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
function TimeDisplay({ timeElapsed }: { timeElapsed: string }) {
	return <span className="text-zinc-500">&nbsp;&middot; {timeElapsed}</span>;
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
	if (AppBskyEmbedRecordWithMedia.isView(embed)) {
		return (
			<div className="my-4 gap-4">
				<PostEmbed embed={embed.media} />
				<MaybeQuoteEmbed embed={embed.record} />
			</div>
		);
	}

	if (AppBskyEmbedRecord.isView(embed)) {
		// custom feed embed (i.e. generator view)
		// =
		if (AppBskyFeedDefs.isGeneratorView(embed.record)) {
			return "Feed Embed";
			// return (
			//   <FeedSourceCard
			//     feedUri={embed.record.uri}
			//     style={[pal.view, pal.border, styles.customFeedOuter]}
			//     showLikes
			//   />
			// )
		}

		// list embed
		if (AppBskyGraphDefs.isListView(embed.record)) {
			return "List Embed";
			// return <ListEmbed item={embed.record} />
		}

		// quote post
		// =
		return <MaybeQuoteEmbed embed={embed} />;
	}

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
								<div className="aspect-square" key={`gallery-thumb-${index}`}>
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

type QuoteEmbedProps = {
	quote: ComposerOptsQuote;
};

type ComposerOptsQuote = {
	uri: string;
	cid: string;
	text: string;
	indexedAt: string;
	author: {
		did: string;
		handle: string;
		displayName?: string;
		avatar?: string;
	};
	embeds?: AppBskyEmbedRecord.ViewRecord["embeds"];
};

type MaybeQuoteEmbedProps = {
	embed: AppBskyEmbedRecord.View;
};
function MaybeQuoteEmbed({ embed }: MaybeQuoteEmbedProps) {
	console.log({ embed });
	if (
		AppBskyEmbedRecord.isViewRecord(embed.record) &&
		AppBskyFeedPost.isRecord(embed.record.value) &&
		AppBskyFeedPost.validateRecord(embed.record.value).success
	) {
		return (
			<QuoteEmbed
				quote={{
					author: embed.record.author,
					cid: embed.record.cid,
					uri: embed.record.uri,
					indexedAt: embed.record.indexedAt,
					text: embed.record.value.text,
					embeds: embed.record.embeds,
				}}
			/>
		);
	} else if (AppBskyEmbedRecord.isViewBlocked(embed.record)) {
		return "Blocked";
	} else if (AppBskyEmbedRecord.isViewNotFound(embed.record)) {
		return "Deleted";
	}
	return null;
}

export function QuoteEmbed({ quote }: QuoteEmbedProps) {
	const itemUrip = new AtUri(quote.uri);
	const itemHref = makeHandleLink(quote.author, "post", itemUrip.rkey);
	const itemTitle = `Post by ${quote.author.handle}`;
	const isEmpty = useMemo(() => quote.text.trim().length === 0, [quote.text]);
	const imagesEmbed = useMemo(
		() =>
			quote.embeds?.find(
				(embed) =>
					AppBskyEmbedImages.isView(embed) ||
					AppBskyEmbedRecordWithMedia.isView(embed),
			),
		[quote.embeds],
	);
	const postText = useMemo(() => {
		const rt = new RichTextAPI({
			text: quote.text,
		});
		return rt;
	}, [quote.text]);

	return (
		<AppLink
			className="border flex p-2 rounded-lg flex-col"
			to={itemHref}
			title={itemTitle}
		>
			<div className="flex gap-2 items-center">
				<UserAvatar profile={quote.author} className="w-4 h-4" />
				<ProfileDisplayName profile={quote.author} />
				<TimeElapsed timestamp={quote.indexedAt}>{TimeDisplay}</TimeElapsed>
			</div>
			{!isEmpty ? <RichText richText={postText} /> : null}
			{AppBskyEmbedImages.isView(imagesEmbed) && (
				<PostEmbed embed={imagesEmbed} />
			)}
			{AppBskyEmbedRecordWithMedia.isView(imagesEmbed) && (
				<PostEmbed embed={imagesEmbed.media} />
			)}
		</AppLink>
	);
}
