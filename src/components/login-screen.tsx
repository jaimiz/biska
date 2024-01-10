import { BlueskyLogin } from "./login-bluesky";

export function LoginScreen() {
	return (
		<div
			key="1"
			className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 space-y-5"
		>
			<h1 className="text-3xl font-bold text-center">Biska</h1>

			<BlueskyLogin />
		</div>
	);
}
