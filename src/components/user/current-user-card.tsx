import { useAtomValue } from "jotai";
import { ProfileCard } from "../user/profile-card";
import { requireAccountAtom } from "./sessionAtoms";
import { useProfileQuery } from "./profile-queries";

export function CurrentUserCard() {
	const currentAccount = useAtomValue(requireAccountAtom);
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
