import { QueryClientProvider } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Centered } from "./components/layouts/Centered";
import { LoginScreen } from "./components/login-screen";
import { Toaster } from "./components/ui/sonner";
import { Spinner } from "./components/ui/spinner";
import {
	currentAccountAtom,
	sessionStateAtom,
} from "./features/user/sessionAtoms";
import { TimeTickProvider } from "./lib/clock";
import { queryClient } from "./lib/react-query";
import { useReloadPrompt } from "./lib/useServiceWorker";
import { bskyApi } from "./services/api";
import { persisted } from "./state/state";
import { DashboardView } from "./views/Dashboard";
import { Search } from "./features/search/page";

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
			errorElement: <DashboardView />,
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
