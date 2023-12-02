import * as persisted from '@/state/persisted'
import { AtpPersistSessionHandler, BskyAgent } from '@atproto/api'
import { atom } from 'jotai'
import { PersistedAccount, Did } from '../persisted/schema'
import { PUBLIC_BSKY_AGENT } from '../queries'

let __currentAgent: BskyAgent = PUBLIC_BSKY_AGENT

export function getAgent() {
	return __currentAgent
}

export type Session = {
	isInitialLoad: boolean
	isSwitchingAccounts: boolean
	accounts: PersistedAccount[]
	currentAccount: PersistedAccount | undefined
}

export const sessionAtom = atom < Session > ({
	isInitialLoad: true,
	isSwitchingAccounts: false,
	accounts: [],
	currentAccount: undefined,
})

sessionAtom.onMount = (setAtom) => {
	setAtom({
		isInitialLoad: true,
		isSwitchingAccounts: false,
		accounts: persisted.get("session").accounts,
		currentAccount: undefined,
	})
}

export const persistentSessionAtom = atom(
	(get) => {
		return get(sessionAtom);
	},
	(_, set, update: Session) => {
		set(sessionAtom, update);
		persisted.write('session', {
			accounts: update.accounts,
			currentAccount: update.currentAccount,
		})
	}
)

export const currentAccountAtom = atom((get) => {
	return get(sessionAtom).currentAccount
})

export type ApiMethods = {
	login: (props: {
		service: string
		identifier: string
		password: string
	}) => Promise<void>
	logout: () => Promise<void>
	initSession: (account: PersistedAccount) => Promise<void>
	resumeSession: (account?: PersistedAccount) => Promise<void>
	removeAccount: (account: PersistedAccount) => void
	clearCurrentAccount: () => void
}

export function setSessionAndPersist(fn: (prev: Session) => Session) {
	const prev = persisted.stateStore.get(persistentSessionAtom);
	persisted.stateStore.set(persistentSessionAtom, fn(prev))
	return persisted.stateStore.get(persistentSessionAtom);
}

export function setSession(fn: (prev: Session) => Session) {
	const prev = persisted.stateStore.get(sessionAtom);
	persisted.stateStore.set(sessionAtom, fn(prev))
	return persisted.stateStore.get(sessionAtom);
}

function createPersistSessionHandler(
	account: PersistedAccount,
	persistSessionCallback: (props: {
		expired: boolean
		refreshedAccount: PersistedAccount
	}) => void,
): AtpPersistSessionHandler {
	return function persistSession(event, session) {
		const expired = !(event === 'create' || event === 'update')
		const refreshedAccount: PersistedAccount = {
			service: account.service,
			did: session?.did as Did || account.did,
			handle: session?.handle || account.handle,
			email: session?.email || account.email,
			emailConfirmed: session?.emailConfirmed || account.emailConfirmed,
			refreshJwt: session?.refreshJwt, // undefined when expired or creation fails
			accessJwt: session?.accessJwt, // undefined when expired or creation fails
		}

		persistSessionCallback({
			expired,
			refreshedAccount,
		})
	}
}

const upsertAccount = (account: PersistedAccount, expired = false) => {
	setSessionAndPersist((prev) => ({
		...prev,
		currentAccount: expired ? undefined : account,
		accounts: [account, ...prev.accounts.filter(a => a.did !== account.did)]
	}))
}

const login: ApiMethods['login'] = async ({ service, identifier, password }) => {

	const agent = new BskyAgent({ service })

	await agent.login({ identifier, password })

	if (!agent.session) {
		throw new Error(`session: login failed to establish a session`)
	}

	const account: PersistedAccount = {
		service: agent.service.toString(),
		did: agent.session.did as Did,
		handle: agent.session.handle,
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		email: agent.session.email!, // TODO this is always defined?
		emailConfirmed: agent.session.emailConfirmed || false,
		refreshJwt: agent.session.refreshJwt,
		accessJwt: agent.session.accessJwt,
	}

	agent.setPersistSessionHandler(
		createPersistSessionHandler(account, ({ expired, refreshedAccount }) => {
			upsertAccount(refreshedAccount, expired)
		}),
	)

	__currentAgent = agent
	upsertAccount(account)
}

const removeAccount: ApiMethods['removeAccount'] = (account) => {
	setSessionAndPersist(s => {
		return {
			...s,
			accounts: s.accounts.filter(a => a.did !== account.did),
		}
	})
}
const logout: ApiMethods['logout'] = async () => void setSessionAndPersist(s => {
	return {
		...s,
		agent: PUBLIC_BSKY_AGENT,
		currentAccount: undefined,
		accounts: s.accounts.map(a => ({
			...a,
			refreshJwt: undefined,
			accessJwt: undefined,
		})),
	}
})

const initSession = async (account: PersistedAccount) => {

	const agent = new BskyAgent({
		service: account.service,
		persistSession: createPersistSessionHandler(
			account,
			({ expired, refreshedAccount }) => {
				upsertAccount(refreshedAccount, expired)
			},
		),
	})

	await agent.resumeSession({
		accessJwt: account.accessJwt || '',
		refreshJwt: account.refreshJwt || '',
		did: account.did,
		handle: account.handle,
	})

	if (!agent.session) {
		throw new Error(`session: initSession failed to establish a session`)
	}

	// ensure changes in handle/email etc are captured on reload
	const freshAccount: PersistedAccount = {
		service: agent.service.toString(),
		did: agent.session.did as Did,
		handle: agent.session.handle,
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		email: agent.session.email!, // TODO this is always defined?
		emailConfirmed: agent.session.emailConfirmed || false,
		refreshJwt: agent.session.refreshJwt,
		accessJwt: agent.session.accessJwt,
	}

	__currentAgent = agent
	upsertAccount(freshAccount)
}

const resumeSession: ApiMethods['resumeSession'] = async (account) => {
	try {
		if (account) {
			await initSession(account)
		}
	} catch (e) {
		console.error(`session: resumeSession failed`, { error: e })
	} finally {
		setSession((session) => ({
			...session,
			isInitialLoad: false
		}))
	}
}

const clearCurrentAccount = () => {
	__currentAgent = PUBLIC_BSKY_AGENT
	setSessionAndPersist(s => ({
		...s,
		currentAccount: undefined,
	}))
}

export const api: ApiMethods = {
	login,
	logout,
	initSession,
	resumeSession,
	removeAccount,
	clearCurrentAccount,
}
