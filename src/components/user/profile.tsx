import { isBlockedByError, isBlockingError } from "@/lib/errors";
import {
	AuthorFeedFilters,
	useProfilePosts,
	useProfileQuery,
} from "@/state/queries/profile";
import { Did } from "@/state/schema";
import { RichText as RichTextAPI } from "@atproto/api";
import { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Post } from "../feed/post";
import { RichText } from "../text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { UserAvatar } from "./avatar";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

export function Profile() {
	const { handleOrDid } = useParams();
	const { isLoading, data: profile } = useProfileQuery({
		did: handleOrDid as Did,
	});

	if (isLoading) {
		return "Carregando…";
	}
	if (!isLoading && !profile) {
		return "Erro ao carregar o perfil";
	}

	return !isLoading && profile && <ProfileSheet profile={profile} />;
}

export function ProfileSheet({ profile }: { profile: ProfileViewDetailed }) {
	const descriptionRT = useMemo(() => {
		return new RichTextAPI({
			text: profile?.description ?? "",
		});
	}, [profile]);
	return (
		<section className="relative transition-all">
			<div className="w-full h-min transition-all overflow-hidden group shadow-lg">
				<img
					alt={profile.displayName ?? profile.handle}
					className="object-cover w-full"
					src={profile.banner}
				/>
			</div>
			<div className="absolute transform -translate-y-1/2 w-full flex justify-end transition-all px-10">
				<UserAvatar
					className="w-24 h-24 border-4 border-white shadow-lg text-4xl expanded:w-32 expanded:h-32 transition-all"
					profile={profile}
				/>
			</div>
			<div className="mt-24 text-right px-10">
				{profile.displayName && (
					<h1 className="text-2xl font-bold">{profile.displayName}</h1>
				)}
				<p className="text-zinc-500 mt-2">@{profile.handle}</p>
			</div>
			<div className="mt-6 flex space-x-4 justify-end px-10">
				<div className="flex space-x-6">
					<div>
						<p className="text-2xl font-bold">{profile.postsCount}</p>
						<p className="text-zinc-500">Posts</p>
					</div>
					<div>
						<p className="text-2xl font-bold">{profile.followersCount}</p>
						<p className="text-zinc-500">Followers</p>
					</div>
					<div>
						<p className="text-2xl font-bold">{profile.followsCount}</p>
						<p className="text-zinc-500">Following</p>
					</div>
				</div>
			</div>
			<div className="mt-6 px-10">
				<RichText
					className="text-zinc-500 text-right"
					richText={descriptionRT}
				/>
			</div>
			<Tabs defaultValue="posts_no_replies">
				<TabsList>
					<TabsTrigger value="posts_no_replies">Posts</TabsTrigger>
					<TabsTrigger value="posts_with_replies">Posts & Replies</TabsTrigger>
					<TabsTrigger value="posts_with_media">Media</TabsTrigger>
				</TabsList>
				<TabsContent value="posts_no_replies">
					<PostsTab did={profile.did} />
				</TabsContent>
				<TabsContent value="posts_with_replies">
					<PostsTab did={profile.did} filter="posts_with_replies" />
				</TabsContent>
				<TabsContent value="posts_with_media">
					<PostsTab filter="posts_with_media" did={profile.did} />
				</TabsContent>
			</Tabs>
		</section>
	);
}

function PostsTab({
	did,
	filter = "posts_no_replies",
}: {
	did?: string;
	filter?: AuthorFeedFilters;
}) {
	// Load user posts
	const { profilePostsQuery: timelineQuery, profilePostsData: timelineData } =
		useProfilePosts(did, filter);
	// End Load user posts

	if (timelineQuery.status === "pending") {
		return "Carregando posts…";
	}
	if (timelineQuery.status === "error") {
		if (isBlockingError(timelineQuery.error))
			return "Você bloqueou esse usuário";
		if (isBlockedByError(timelineQuery.error)) return "Você está bloqueado";
		return "Erro ao carregar posts";
	}
	const { fetchNextPage, isFetching, hasNextPage } = timelineQuery;
	const posts = timelineData.map((timelineEntry) => {
		return (
			<Post
				post={timelineEntry.post}
				record={timelineEntry.record}
				reason={timelineEntry.reason}
				key={`${timelineEntry.post.cid}`}
			/>
		);
	});
	return (
		<div className="flex flex-col items-center max-w-full">
			<div className="max-w-full">{posts}</div>
			{hasNextPage && (
				<div className="py-5">
					<Button
						disabled={isFetching}
						className="gap-2"
						onClick={() => {
							if (!isFetching) {
								fetchNextPage();
							}
						}}
					>
						{isFetching ? (
							<>
								<Spinner /> Carregando…
							</>
						) : (
							"Carregar mais posts"
						)}
					</Button>
				</div>
			)}
			{!hasNextPage && (
				<div className="w-full relative flex py-5 px-32 items-center text-purple-300">
					<div className="flex-grow border-t border-current" />
					<span className="flex-shrink mx-2 text-current">fim</span>
					<div className="flex-grow border-t border-current" />
				</div>
			)}
		</div>
	);
}
