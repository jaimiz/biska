import { isInvalidHandle } from "@/lib/strings/handle";
import {
	AppBskyActorDefs,
	AppBskyActorSearchActorsTypeahead,
} from "@atproto/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { STALE } from "@/lib/queries";
import { useMyFollowsQuery } from "./follows-queries";
import { getAgent } from "@/lib/agent";

export const RQKEY = (prefix: string) => ["actor-autocomplete", prefix];

const autocompleteKeys = {
	all: ["autocomplete"] as const,
	prefixes: () => [...autocompleteKeys.all, "actor"] as const,
	prefix: (prefix: string) => [...autocompleteKeys.prefixes(), prefix] as const,
};

export function useActorAutocompleteQuery(prefix: string) {
	const { data: follows, isFetching } = useMyFollowsQuery();

	return useQuery<AppBskyActorDefs.ProfileViewBasic[]>({
		staleTime: STALE.MINUTES.ONE,
		queryKey: autocompleteKeys.prefix(prefix),
		async queryFn() {
			// TODO: Figure out how to pass the did to getAgent here
			const res = prefix
				? await getAgent().searchActorsTypeahead({
						term: prefix,
						limit: 8,
				  })
				: undefined;
			return res?.data.actors || [];
		},
		enabled: !isFetching,
		select: React.useCallback(
			(data: AppBskyActorDefs.ProfileViewBasic[]) => {
				return computeSuggestions(prefix, follows, data);
			},
			[prefix, follows],
		),
	});
}

export type ActorAutocompleteFn = ReturnType<typeof useActorAutocompleteFn>;
export function useActorAutocompleteFn() {
	const queryClient = useQueryClient();
	const { data: follows } = useMyFollowsQuery();

	return React.useCallback(
		async ({ query, limit = 8 }: { query: string; limit?: number }) => {
			let res: AppBskyActorSearchActorsTypeahead.Response | undefined =
				undefined;
			if (query) {
				try {
					res = await queryClient.fetchQuery({
						staleTime: STALE.MINUTES.ONE,
						queryKey: autocompleteKeys.prefix(query),
						queryFn: () =>
							getAgent().searchActorsTypeahead({
								term: query,
								limit,
							}),
					});
				} catch (e) {
					console.error("useActorSearch: searchActorsTypeahead failed", {
						error: e,
					});
				}
			}

			return computeSuggestions(query, follows, res?.data.actors);
		},
		[follows, queryClient],
	);
}

function computeSuggestions(
	prefix: string,
	follows: AppBskyActorDefs.ProfileViewBasic[] | undefined,
	searched: AppBskyActorDefs.ProfileViewBasic[] = [],
) {
	let items: AppBskyActorDefs.ProfileViewBasic[] = [];
	if (follows) {
		items = follows.filter((follow) => prefixMatch(prefix, follow)).slice(0, 8);
	}
	for (const item of searched) {
		if (!items.find((item2) => item2.handle === item.handle)) {
			items.push({
				did: item.did,
				handle: item.handle,
				displayName: item.displayName,
				avatar: item.avatar,
				labels: item.labels,
			});
		}
	}
	// TODO: remove muted users
	return items;
}

function prefixMatch(
	prefix: string,
	info: AppBskyActorDefs.ProfileViewBasic,
): boolean {
	if (!isInvalidHandle(info.handle) && info.handle.includes(prefix)) {
		return true;
	}
	if (info.displayName?.toLocaleLowerCase().includes(prefix)) {
		return true;
	}
	return false;
}
