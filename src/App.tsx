import { QueryClientProvider } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Centered } from "./components/layouts/Centered";

import { Toaster } from "./components/ui/sonner";
import { Spinner } from "./components/ui/spinner";

import { TimeTickProvider } from "./lib/clock";
import { queryClient } from "./lib/react-query";
import { useReloadPrompt } from "./lib/useServiceWorker";
import { persisted } from "./state/state";
import { LoginScreen } from "./views/login-screen";
import { Search } from "./components/search/page";
import {
	currentAccountAtom,
	sessionStateAtom,
} from "./components/user/sessionAtoms";
import { bskyApi } from "./lib/api";
import { MultiColumnView } from "./views/MultiColumn";

function LoadingScreen() {
	return (
		<Centered>
			<h1 className="text-3xl font-bold text-center">
				<Spinner />
			</h1>
		</Centered>
	);
}

export function AppRouter() {
	const router = createBrowserRouter([
		{
			errorElement: <MultiColumnView />,
		},
		{
			path: "/search",
			element: <Search />,
		},
	]);
	return (
		<TimeTickProvider>
			<RouterProvider router={router} />
		</TimeTickProvider>
	);
}
function AppLogin() {
	const { isInitialLoad } = useAtomValue(sessionStateAtom);
	const currentAccount = useAtomValue(currentAccountAtom);
	useReloadPrompt();
	// init
	useEffect(() => {
		const account = persisted.get("session").currentAccount;
		bskyApi.resumeSession(account);
	}, []);

	// show nothing prior to init
	if (isInitialLoad) {
		return <LoadingScreen />;
	}
	/*
	 * Session and initial state should be loaded prior to rendering below.
	 */

	return currentAccount ? <AppRouter /> : <LoginScreen />;
}

function App() {
	const [isReady, setReady] = useState(false);

	useEffect(() => {
		persisted.init().then(() => {
			setReady(true);
		});
	}, []);

	if (!isReady) {
		return <LoadingScreen />;
	}
	return (
		<QueryClientProvider client={queryClient}>
			<AppLogin />
			<Toaster />
		</QueryClientProvider>
	);
}

export default App;
