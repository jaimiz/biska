import { useEffect } from "react";
import { toast } from "sonner";
import { useRegisterSW } from "virtual:pwa-register/react";

export function useReloadPrompt() {
	const {
		needRefresh: [needRefresh, setNeedRefresh],
		updateServiceWorker,
	} = useRegisterSW({
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		onRegistered(r: any) {
			// eslint-disable-next-line prefer-template
			console.log(`SW Registered: ${r}`);
		},
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		onRegisterError(error: any) {
			console.log("SW registration error", error);
		},
	});

	const close = () => {
		setNeedRefresh(false);
	};

	return useEffect(() => {
		if (needRefresh) {
			toast("New content available, refresh the page to update", {
				action: {
					label: "Update",
					onClick: () => updateServiceWorker(true),
				},
				onDismiss: () => close(),
				onAutoClose: () => close(),
			});
		}
	}, [needRefresh, updateServiceWorker, close]);
}
