import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { Toaster } from "./components/ui/sonner";

import { useAtomValue, useSetAtom } from "jotai";
import { Suspense, useEffect } from "react";
import { TimeTickProvider } from "./lib/clock";
import { queryClient } from "./lib/react-query";
import { storageAppStateAtom } from "./state/state";
import { MultiColumnView } from "./views/MultiColumnLayout";

export function App() {
	const storageAppState = useAtomValue(storageAppStateAtom);
	const setMemoryAppState = useSetAtom(storageAppStateAtom);

	// biome-ignore lint/correctness/useExhaustiveDependencies: I just want to run this on mount
	useEffect(() => {
		setMemoryAppState(storageAppState);
	}, []);

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
