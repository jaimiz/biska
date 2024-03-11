import { isBlockedByError, isBlockingError } from "@/lib/errors";
import { cn } from "@/lib/utils";

import { Did } from "@/state/schema";
import { RichText as RichTextAPI } from "@atproto/api";
import { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { useAtomValue } from "jotai";
import {
	Ban,
	Circle,
	MessageSquareX,
	UserRound,
	UserRoundCheck,
	UserRoundMinus,
	UserRoundPlus,
	UserRoundX,
	UsersRound,
} from "lucide-react";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Post } from "../feed/post";
import { RichText } from "../text";
import { Alert, AlertDescription } from "../ui/alert";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { UserAvatar } from "./avatar";
import {
	AuthorFeedFilters,
	useProfilePosts,
	useProfileQuery,
} from "./profile-queries";
import { requireAccountAtom } from "./sessionAtoms";

export function ProfileSheetView() {
	const { handleOrDid } = useParams();
	console.log({ handleOrDid });
	let isLoading = true;
	let profile = null;
	try {
		const { isLoading: isQueryLoading, data } = useProfileQuery({
			did: handleOrDid as Did,
		});
		isLoading = isQueryLoading;
		profile = data;
	} catch (e) {
		isLoading = false;
		console.error(e);
	}

	if (isLoading) {
		return "Carregando…";
	}
	if (!isLoading && !profile) {
		return "Erro ao carregar o perfil";
	}

	return !isLoading && profile && <ProfileSheet profile={profile} />;
}

function ProfileFollowBadge({ profile }: { profile: ProfileViewDetailed }) {
	let message = null;
	let action = null;
	let actionIcon = null;
	let icon = null;
	const { blockedBy, blocking, followedBy, following } = profile.viewer ?? {};
	try {
		const viewer = useAtomValue(requireAccountAtom);
		if (profile.did === viewer.did) {
			message = "Você!";
			icon = <UserRound />;
		} else if (blocking && blockedBy) {
			message = "Mutualmente Bloqueados";
			icon = <Ban />;
			action = "Desbloquear";
			actionIcon = <Circle />;
		} else if (blocking) {
			message = "Você bloqueou";
			icon = <UserRoundMinus />;
			action = "Desbloquear";
			actionIcon = <Circle />;
		} else if (blockedBy) {
			message = "Você está bloqueado";
			icon = <UserRoundX />;
			action = "Bloquear";
			actionIcon = <Ban />;
		} else if (following && followedBy) {
			message = "Mutuals";
			icon = <UsersRound />;
			action = "Deixar de seguir";
			actionIcon = <UserRoundMinus />;
		} else if (following) {
			message = "Você segue";
			icon = <UserRoundCheck />;
			action = "Deixar de seguir";
			actionIcon = <UserRoundMinus />;
		} else if (followedBy) {
			message = "Segue você";
			icon = <UserRoundPlus />;
			action = "Seguir";
			actionIcon = <UserRoundCheck />;
		}
		if (message && icon) {
			const hasAction = action && actionIcon;

			return (
				<Badge className="group/follow w-36 inline-flex items-center justify-center">
					<span className="basis-6">
						<span className={cn({ "group-hover/follow:hidden": hasAction })}>
							{icon}
						</span>
						<span
							className={cn("hidden", {
								"group-hover/follow:inline": hasAction,
							})}
						>
							{actionIcon}
						</span>
					</span>
					<span className="grow text-center">
						<span className={cn({ "group-hover/follow:hidden": hasAction })}>
							{message}
						</span>
						<span
							className={cn("hidden", {
								"group-hover/follow:inline": hasAction,
							})}
						>
							{action}
						</span>
					</span>
				</Badge>
			);
		}
	} catch {
		return null;
	}
}

function modIsBlocked(viewer: ProfileViewDetailed["viewer"]) {
	return viewer?.blockedBy || viewer?.blocking;
}

function modIsMuted(viewer: ProfileViewDetailed["viewer"]) {
	return viewer?.muted || viewer?.mutedByList;
}

export function ProfileSheet({ profile }: { profile: ProfileViewDetailed }) {
	const descriptionRT = useMemo(() => {
		return new RichTextAPI({
			text: profile?.description ?? "",
		});
	}, [profile]);
	const shouldBlurProfile = modIsBlocked(profile.viewer);
	const isMuted = modIsMuted(profile.viewer);
	return (
		<section className="relative transition-all">
			<div className="w-full h-min transition-all overflow-hidden group shadow-lg">
				<img
					alt={profile.displayName ?? profile.handle}
					className={cn("object-cover w-full", {
						blur: shouldBlurProfile,
					})}
					src={profile.banner}
				/>
			</div>
			<div className="absolute transform -translate-y-1/2 w-full flex justify-end transition-all px-10">
				<UserAvatar
					className={cn(
						"w-24 h-24 border-4 border-white shadow-lg text-4xl expanded:w-32 expanded:h-32 transition-all",
						{
							blur: shouldBlurProfile,
						},
					)}
					profile={profile}
				/>
			</div>
			<div className="mt-24 text-right px-10">
				{profile.displayName && (
					<h1 className="text-2xl font-bold">{profile.displayName}</h1>
				)}
				<p className="text-zinc-500 mt-2">@{profile.handle}</p>
				<ProfileFollowBadge profile={profile} />
			</div>
			{!shouldBlurProfile && (
				<>
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
					{isMuted && (
						<div className="p-4">
							<Alert className="flex items-center">
								<MessageSquareX />
								<AlertDescription>Você mutou esse usuário</AlertDescription>
							</Alert>
						</div>
					)}
					<Tabs defaultValue="posts_no_replies">
						<TabsList>
							<TabsTrigger value="posts_no_replies">Posts</TabsTrigger>
							<TabsTrigger value="posts_with_replies">
								Posts & Replies
							</TabsTrigger>
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
				</>
			)}
		</section>
	);
}

function PostsTab({
	did,
	filter = "posts_no_replies",
}: {
	did: string;
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
