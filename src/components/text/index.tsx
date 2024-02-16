import { cn } from "@/lib/utils";
import { AppBskyRichtextFacet, RichText as RichTextAPI } from "@atproto/api";
import { VariantProps, cva } from "class-variance-authority";
import { ClassValue } from "clsx";
import { PropsWithChildren } from "react";
import { SmartLink } from "../link";

const richTextVariants = cva("", {
	variants: {
		format: {
			formatted: "whitespace-pre-wrap break-words",
			none: "",
		},
	},
	defaultVariants: {
		format: "formatted",
	},
});

export interface RichTextProps extends VariantProps<typeof richTextVariants> {
	className?: ClassValue;
	richText: RichTextAPI;
}

function Text({
	className,
	children,
}: PropsWithChildren<{ className: ClassValue }>) {
	return <div className={cn(className)}>{children}</div>;
}

export function RichText({ richText, className, format }: RichTextProps) {
	const { text, facets } = richText;
	if (!facets?.length) {
		if (/^\p{Extended_Pictographic}+$/u.test(text) && text.length <= 5) {
			return (
				<Text
					className={cn(richTextVariants({ format }), "text-3xl", className)}
				>
					{text}
				</Text>
			);
		}
		return (
			<Text className={cn(richTextVariants({ format }), className)}>
				{text}
			</Text>
		);
	}

	const els = [];
	let key = 0;
	for (const segment of richText.segments()) {
		const link = segment.link;
		const mention = segment.mention;
		if (mention && AppBskyRichtextFacet.validateMention(mention).success) {
			console.log("valid", { mention });
			els.push(
				<SmartLink key={key} to={`/profile/${mention.did}`}>
					{segment.text}
				</SmartLink>,
			);
		} else if (mention?.did) {
			// TODO: This is an optmistc mention, so we'll just us the handle and not the
			// resolved did. I want to implement a cache for this in the future, but
			// for now this is fine.
			els.push(
				<SmartLink key={key} to={`/profile/${mention.did}`}>
					{segment.text}
				</SmartLink>,
			);
		} else if (link && AppBskyRichtextFacet.validateLink(link).success) {
			els.push(
				<SmartLink key={key} to={`${link.uri}`}>
					{segment.text}
				</SmartLink>,
			);
		} else {
			els.push(segment.text);
		}
		key++;
	}
	return (
		<Text className={cn(richTextVariants({ format }), className)}>{els}</Text>
	);
}
