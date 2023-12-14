import { AppBskyFeedGetAuthorFeed } from "@atproto/api";

export function isBlockedByError(
	error: unknown,
): error is AppBskyFeedGetAuthorFeed.BlockedByActorError {
	return error instanceof AppBskyFeedGetAuthorFeed.BlockedByActorError;
}

export function isBlockingError(
	error: unknown,
): error is AppBskyFeedGetAuthorFeed.BlockedActorError {
	return error instanceof AppBskyFeedGetAuthorFeed.BlockedActorError;
}
