import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { Toaster } from "./components/ui/sonner";

import { Suspense, useEffect } from "react";
import { TimeTickProvider } from "./lib/clock";
import { queryClient } from "./lib/react-query";
import { MultiColumnView } from "./views/MultiColumnLayout";
import { BISKA_STORAGE_KEY, appStateAtom } from "./state/state";
import { useAtom } from "jotai";
import localforage from "localforage";
import { AppSchema } from "./state/schema";

export function App() {
	const [, setAppstate] = useAtom(appStateAtom);

	useEffect(() => {
		(async () => {
			const rawData = await localforage.getItem<unknown>(BISKA_STORAGE_KEY);
			if (AppSchema.safeParse(rawData).success) {
				setAppstate(rawData as AppSchema);
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
