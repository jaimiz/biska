import { useProfileQuery } from "@/state/queries/profile"
import { currentAccountAtom } from "@/state/session"
import { useAtomValue } from "jotai"

export function Search() {
	const currentUser = useAtomValue(currentAccountAtom)
	const currentUserProfile = useProfileQuery({ did: currentUser?.did })
return <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
		<h2>YABC - Busca</h2>
		<p>{currentUserProfile.data?.displayName ?}
		</div>
}
