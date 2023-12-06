import { useProfileQuery } from "@/state/queries/profile";
import { currentAccountAtom } from "@/state/session";
import { useAtomValue } from "jotai";
import { ProfileCard } from "../user/profile-card";
import { PersistedAccount } from "@/state/persisted/schema";

export function CurrentUserCard() {
	const currentAccount = useAtomValue(currentAccountAtom) as PersistedAccount;
	const { isLoading, data: profile } = useProfileQuery({
		did: currentAccount.did,
	});
	return !isLoading && profile ? (
		<ProfileCard profile={profile} />
	) : (
		<ProfileCard
			profile={{
				displayName: "",
				handle: currentAccount.handle,
				did: currentAccount.did,
			}}
		/>
	);
}
