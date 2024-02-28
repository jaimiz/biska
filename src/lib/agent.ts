import {
	requireAccountAtom,
	upsertAccountAtom,
} from "@/components/user/sessionAtoms";
import type { Did, PersistedAccount, Session } from "@/state/schema";
import { appStateAtom, atomStore } from "@/state/state";
import { dashboardSidebarExpanded } from "@/views/MultiColumnLayout";
import { AtpPersistSessionHandler, BskyAgent } from "@atproto/api";
import { atom, useAtomValue } from "jotai";
import { atomFamily } from "jotai/utils";

const agentsAtom = atom<Record<Did, BskyAgent>>({});
const agentsFamily = atomFamily((did: Did) =>
	atom(
		(get) => get(agentsAtom)[did as Did],
		(get, set, agent: BskyAgent) => {
			const prev = get(agentsAtom);
			set(agentsAtom, {
				...prev,
				[did]: agent,
			});
		},
	),
);

export const BSKY_SOCIAL_SERVICE = "https://bsky.social";

export const PUBLIC_BSKY_AGENT = new BskyAgent({
	service: "https://api.bsky.app",
});

export function getAgent(did: Did) {
	const agentAtom = agentsFamily(did);
	const agent = atomStore.get(agentAtom);
	console.log(agent);
	return agent;
}

export function useCurrentAgent() {
	const currentAccount = useAtomValue(requireAccountAtom);
	return getAgent(currentAccount.did);
}

export type ApiMethods = {
	login: (props: {
		service: string;
		identifier: string;
		password: string;
	}) => Promise<void>;
	logout: () => Promise<void>;
	initSession: (account: PersistedAccount) => Promise<void>;
	resumeSession: (account?: PersistedAccount) => Promise<void>;
	removeAccount: (account: PersistedAccount) => void;
	clearCurrentAccount: () => void;
};

export function setSessionAndPersist(fn: (prev: Session) => Session) {
	const prev = atomStore.get(appStateAtom).session;
	const { currentAccount, accounts } = fn(prev);
	atomStore.set(appStateAtom, {
		session: {
			currentAccount,
			accounts,
		},
	});
	return {
		currentAccount,
		accounts,
	};
}

export function setSession(fn: (prev: Session) => Session) {
	const prev = atomStore.get(appStateAtom).session;
	const session = fn(prev);
	atomStore.set(appStateAtom, {
		session,
	});
	return session;
}

function createPersistSessionHandler(
	account: PersistedAccount,
	persistSessionCallback: (props: {
		expired: boolean;
		refreshedAccount: PersistedAccount;
	}) => void,
): AtpPersistSessionHandler {
	return function persistSession(event, session) {
		const expired = !(event === "create" || event === "update");
		const refreshedAccount: PersistedAccount = {
			service: account.service,
			did: (session?.did as Did) || account.did,
			handle: session?.handle || account.handle,
			email: session?.email || account.email,
			emailConfirmed: session?.emailConfirmed || account.emailConfirmed,
			refreshJwt: session?.refreshJwt, // undefined when expired or creation fails
			accessJwt: session?.accessJwt, // undefined when expired or creation fails
		};

		persistSessionCallback({
			expired,
			refreshedAccount,
		});
	};
}

const login: ApiMethods["login"] = async ({
	service,
	identifier,
	password,
}) => {
	const agent = new BskyAgent({ service });

	await agent.login({ identifier, password });

	if (!agent.session) {
		throw new Error(`session: login failed to establish a session`);
	}

	const agentAtom = agentsFamily(agent.session.did as Did);

	atomStore.set(agentAtom, agent);

	const account: PersistedAccount = {
		service: agent.service.toString(),
		did: agent.session.did as Did,
		handle: agent.session.handle,
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		email: agent.session.email!, // TODO this is always defined?
		emailConfirmed: agent.session.emailConfirmed || false,
		refreshJwt: agent.session.refreshJwt,
		accessJwt: agent.session.accessJwt,
	};

	atomStore.set(agentsFamily(account.did), agent);
	atomStore.set(upsertAccountAtom, account);
};

const removeAccount: ApiMethods["removeAccount"] = (account) => {
	setSessionAndPersist((s) => {
		return {
			...s,
			accounts: s.accounts.filter((a) => a.did !== account.did),
		};
	});
};
const logout: ApiMethods["logout"] = async () => {
	atomStore.set(dashboardSidebarExpanded, false);
	setSessionAndPersist((s) => {
		return {
			...s,
			agent: PUBLIC_BSKY_AGENT,
			currentAccount: undefined,
			accounts: s.accounts.map((a) => ({
				...a,
				refreshJwt: undefined,
				accessJwt: undefined,
			})),
		};
	});
};

const initSession = async (account: PersistedAccount) => {
	const agent = new BskyAgent({
		service: account.service,
		persistSession: createPersistSessionHandler(
			account,
			({ expired, refreshedAccount }) => {
				atomStore.set(upsertAccountAtom, refreshedAccount, expired);
			},
		),
	});

	await agent.resumeSession({
		accessJwt: account.accessJwt || "",
		refreshJwt: account.refreshJwt || "",
		did: account.did,
		handle: account.handle,
	});

	if (!agent.session) {
		throw new Error(`session: initSession failed to establish a session`);
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
	};

	atomStore.set(agentsFamily(account.did), agent);
	atomStore.set(upsertAccountAtom, freshAccount);
};

const resumeSession: ApiMethods["resumeSession"] = async (account) => {
	try {
		if (account) {
			await initSession(account);
		}
	} catch (e) {
		console.error(`session: resumeSession failed`, { error: e });
	} finally {
		setSession((session) => ({
			...session,
		}));
	}
};

const clearCurrentAccount = () => {
	setSessionAndPersist((s) => ({
		...s,
		currentAccount: undefined,
	}));
};

export const bskyApi: ApiMethods = {
	login,
	logout,
	initSession,
	resumeSession,
	removeAccount,
	clearCurrentAccount,
};