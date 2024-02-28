import { QueryClientProvider } from "@tanstack/react-query";
import { useAtom } from "jotai";
import localforage from "localforage";
import { Suspense, useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { bskyApi } from "./lib/agent";
import { TimeTickProvider } from "./lib/clock";
import { queryClient } from "./lib/react-query";
import { AppSchema } from "./state/schema";
import { BISKA_STORAGE_KEY, appStateAtom } from "./state/state";
import { MultiColumnView } from "./views/MultiColumnLayout";

export function App() {
	const [, setAppstate] = useAtom(appStateAtom);

	useEffect(() => {
		(async () => {
			const rawData = await localforage.getItem<unknown>(BISKA_STORAGE_KEY);
			const maybeAppstate = AppSchema.safeParse(rawData);
			if (maybeAppstate.success) {
				setAppstate(maybeAppstate.data);
				bskyApi.resumeSession(maybeAppstate.data.session.currentAccount);
			}
		})();
	}, [setAppstate]);
	const router = createBrowserRouter([
		{
			path: "/",
			element: <MultiColumnView />,
			errorElement: <MultiColumnView />,
		},
	]);
	return (
		<QueryClientProvider client={queryClient}>
			<TimeTickProvider>
				<RouterProvider router={router} />
			</TimeTickProvider>
			<Toaster />
		</QueryClientProvider>
	);
}

export default function AppWrapper() {
	return (
		<Suspense>
			<App />
		</Suspense>
	);
}
