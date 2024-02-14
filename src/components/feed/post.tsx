import { makeHandleLink } from "@/lib/strings/handle";
import { cn } from "@/lib/utils";
import { Did } from "@/state/schema";

import {
	SkylineSliceItem,
	useProfileQuery,
} from "@/features/user/profileQueries";
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
import { SiSpotify } from "@icons-pack/react-simple-icons";
import { ClassValue } from "clsx";
import { PlayCircleIcon, ReplyIcon } from "lucide-react";
import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { ContainerLink } from "../link";
import { RichText } from "../text";
import { TimeElapsed } from "../text/time-elapsed";
import { UserAvatar } from "../user/avatar";
import { ProfileDisplayName } from "../user/profile-display-name";
import { PostControls } from "./post-controls";
import { usePostQuery } from "@/features/posts/queries";

type PostProps = SkylineSliceItem;
export function Post({ post, record }: PostProps) {
	const { data: postData } = usePostQuery({ uri: post.uri });
	const postText = useMemo(() => {
		const rt = new RichTextAPI({
			text: record.text,
		});
		rt.detectFacetsWithoutResolution();
		return rt;
	}, [record]);

	if (!postData) return null;

	return (
		<div
			key={post.cid}
			className="first:border-t-0 last:border-b-0 flex text border-purple-200 border-solid border-y py-4 px-2 gap-x-4"
		>
			<div>
				<UserAvatar className="w-12 h-12" profile={post.author} />
			</div>
			<div className="flex flex-col flex-1 gap-1 max-w-full overflow-hidden">
				<div className="flex">
					<ProfileDisplayName profile={post.author} />
					<PostLink post={post}>
						<TimeElapsed timestamp={post.indexedAt}>
							{PostTimestamp}
						</TimeElapsed>
					</PostLink>
				</div>
				{record.reply && <ReplyMeta reply={record.reply} />}
				{record.text ? <RichText richText={postText} /> : null}
				{post.embed && <PostEmbed embed={post.embed} />}
				<div className="flex justify-between">
					<PostControls post={postData} />
				</div>
			</div>
		</div>
	);
}

function ReplyMeta({ reply }: { reply: AppBskyFeedPost.ReplyRef }) {
	const [, , repo] = reply.parent.uri.split("/");
	const { data: replyAuthor, isSuccess } = useProfileQuery({
		did: repo as Did,
	});
	if (isSuccess) {
		return (
			<div className="flex items-center gap-1 text-muted-foreground text-xs">
				<ReplyIcon className="w-3" /> respondendo para{" "}
				<ProfileDisplayName showUsername={false} profile={replyAuthor} />
			</div>
		);
	}
	return "...";
}
function PostTimestamp({ timeElapsed }: { timeElapsed: string }) {
	return <span className="text-zinc-500">&nbsp;&middot; {timeElapsed}</span>;
}

type PostLinkProps = PropsWithChildren<{
	post: PostProps["post"];
}>;
function PostLink({ post, children }: PostLinkProps) {
	const [, , did, , rkey] = post.uri.split("/");
	const postUrl = `https://bsky.app/profile/${did}/post/${rkey}`;
	return (
		<a target="_blank" rel="noreferrer noopener" href={postUrl}>
			{children}
		</a>
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
			<div className="flex flex-col gap-1">
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

	// External embeds

	return <ExternalEmbed embed={embed} />;
}

type EmbedImageProps = {
	images: AppBskyEmbedImages.ViewImage[];
};
function EmbedImages({ images }: EmbedImageProps) {
	const count = images.length;

	switch (count) {
		case 4: {
			const borders = [
				"rounded-tl-lg",
				"rounded-tr-lg",
				"rounded-bl-lg",
				"rounded-br-lg",
			];
			return (
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
			);
		}
		case 3: {
			const [largeImage, topSmall, bottomSmall] = images;
			return (
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
			);
		}
		case 2: {
			const [first, second] = images;
			return (
				<div className="flex gap-1 my-4">
					<div className="flex-1 aspect-square">
						<GalleryImage className="rounded-r-none" image={first} />{" "}
					</div>
					<div className="flex-1 aspect-square">
						<GalleryImage className="rounded-l-none" image={second} />{" "}
					</div>
				</div>
			);
		}
		default: {
			return <GalleryImage image={images[0]} />;
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
	}
	if (AppBskyEmbedRecord.isViewBlocked(embed.record)) {
		return "Blocked";
	}
	if (AppBskyEmbedRecord.isViewNotFound(embed.record)) {
		return "Deleted";
	}
	return null;
}

function QuoteEmbed({ quote }: QuoteEmbedProps) {
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
		<ContainerLink
			className="border flex p-2 rounded-lg flex-col"
			to={itemHref}
			title={itemTitle}
		>
			<div className="flex gap-1 items-center">
				<UserAvatar profile={quote.author} className="w-4 h-4" />
				<ProfileDisplayName className="max-w-[80%]" profile={quote.author} />
				<TimeElapsed timestamp={quote.indexedAt}>{PostTimestamp}</TimeElapsed>
			</div>
			{!isEmpty ? <RichText richText={postText} /> : null}
			{AppBskyEmbedImages.isView(imagesEmbed) && (
				<PostEmbed embed={imagesEmbed} />
			)}
			{AppBskyEmbedRecordWithMedia.isView(imagesEmbed) && (
				<PostEmbed embed={imagesEmbed.media} />
			)}
		</ContainerLink>
	);
}

type ExternalEmbedProps = {
	embed: PostEmbedProps["embed"];
};
function ExternalEmbed({ embed }: ExternalEmbedProps) {
	if (AppBskyEmbedExternal.isView(embed)) {
		if (domainMatch("open.spotify.com", new URL(embed.external.uri))) {
			return <SpotifyExternalEmbed embed={embed} />;
		}
		return <GenericExternalEmbed embed={embed} />;
	}
	return null;
}

function domainMatch(domain: string, uri: URL) {
	return uri.host.includes(domain);
}

type EmbedViewProps = { embed: AppBskyEmbedExternal.View };

function GenericExternalEmbed({ embed }: EmbedViewProps) {
	const { hostname: embedDomain } = new URL(embed.external.uri);
	return (
		<a href={embed.external.uri} target="_blank" rel="noopener noreferrer">
			<div className="flex gap-3 rounded-md overflow-hidden border">
				{embed.external.thumb && (
					<div className="max-w-full flex-1 aspect-square">
						<img
							className="object-cover w-full h-full"
							src={embed.external.thumb}
							alt={embed.external.title}
						/>
					</div>
				)}
				<div className="meta flex-[3] gap-2 flex flex-col p-2">
					<div className="text-xs text-muted-foreground">{embedDomain}</div>
					<div className="font-semibold">{embed.external.title}</div>
					<div className="font-light text-xs">{embed.external.description}</div>
				</div>
			</div>
		</a>
	);
}

function SpotifyExternalEmbed({ embed }: EmbedViewProps) {
	const { uri } = embed.external;
	const oEmbedUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(
		uri,
	)}`;

	const [oembed, setOembed] = useState(<StaticSpotifyEmbed embed={embed} />);
	useEffect(() => {
		async function fetchOembedData() {
			console.log(`fetching ${oEmbedUrl}`);
			const response = await fetch(oEmbedUrl);
			if (response.status === 200) {
				const data = await response.json();
				if (
					domainMatch("open.spotify.com", new URL(data.iframe_url)) &&
					data.html.includes(data.iframe_url)
				) {
					// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
					return <div dangerouslySetInnerHTML={{ __html: data.html }} />;
				}
				return <StaticSpotifyEmbed embed={embed} />;
			}
			return <StaticSpotifyEmbed embed={embed} />;
		}
		fetchOembedData().then((data) => {
			setOembed(data);
		});
	}, [oEmbedUrl, embed]);
	return oembed;
}

function StaticSpotifyEmbed({ embed }: EmbedViewProps) {
	return (
		<a href={embed.external.uri} target="_blank" rel="noopener noreferrer">
			<div className="flex gap-3 rounded-2xl overflow-hidden border bg-[#1db954] text-white">
				<div className="max-w-full flex-1">
					<img src={embed.external.thumb} alt={embed.external.title} />
				</div>
				<div className="meta flex-[3] gap-2 flex p-2">
					<div className="flex flex-col flex-grow justify-around">
						<div>
							<div className="font-semibold text-sm">
								{embed.external.title}
							</div>
							<div className="font-light text-xs">
								{embed.external.description}
							</div>
						</div>
						<div className="text-sm flex gap-2 items-center">
							<PlayCircleIcon />
							Play on Spotify
						</div>
					</div>
					<div>
						<SiSpotify size={24} />
					</div>
				</div>
			</div>
		</a>
	);
}
