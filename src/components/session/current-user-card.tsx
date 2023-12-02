import { Account } from "@/state/persisted/schema";
import { useProfileQuery } from "@/state/queries/profile";
import { currentAccountAtom } from "@/state/session";
import { useAtomValue } from "jotai";
import { ProfileCard } from "../user/profile-card";

export function CurrentUserCard() {
	const currentAccount = useAtomValue(currentAccountAtom) as Account;
	const { isLoading, data: profile } = useProfileQuery({ did: currentAccount.did })
	return !isLoading && profile ? (<ProfileCard profile={profile} />) : <ProfileCard profile={{
		displayName: "",
		handle: currentAccount.handle,
		did: currentAccount.did
	}} />
}
