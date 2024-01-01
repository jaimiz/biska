import { QueryClientProvider } from "@tanstack/react-query";
import { Provider as AtomProvider, getDefaultStore, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { LoginScreen } from "./components/login-screen";
import { queryClient } from "./lib/react-query";
import { IndexRoute } from "./routes/guarded";
import { RootRoute } from "./routes/guarded/root";
import * as persisted from "./state/persisted";
import { api, currentAccountAtom, sessionAtom } from "./state/session";
import { ProfileSheet } from "./components/user/ProfileSheet";
import { Search } from "./routes/guarded/search";

export function AppRouter() {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <RootRoute />,
			children: [
				{
					path: ":expand?",
					Component: IndexRoute,
					children: [
						{
							path: "profile/:handleOrDid",
							Component: ProfileSheet,
						},
					],
				},
			],
		},
	]);
	return <RouterProvider router={router} />;
}
function AppLogin() {
	const { isInitialLoad } = useAtomValue(sessionAtom);
	const currentAccount = useAtomValue(currentAccountAtom);
	// init
	useEffect(() => {
		const account = persisted.get("session").currentAccount;
		api.resumeSession(account);
	}, []);

	// show nothing prior to init
	if (isInitialLoad) {
		// TODO add a loading state
		return null;
	}
	/*
	 * Session and initial state should be loaded prior to rendering below.
	 */

	const SearchRouter = createBrowserRouter([
		{path : "/", element: <Search />}
	])

	return currentAccount ? <RouterProvider router={SearchRouter} /> : <LoginScreen />;
}

function App() {
	const [isReady, setReady] = useState(false);

	useEffect(() => {
		persisted.init().then(() => setReady(true));
	}, []);

	if (!isReady) {
		return null;
	}
	return (
		<QueryClientProvider client={queryClient}>
			<AtomProvider store={getDefaultStore()}>
				<AppLogin />
			</AtomProvider>
		</QueryClientProvider>
	);
}

export default App;
