import { Centered } from "@/components/layouts/Centered";
import { BlueskyLogin } from "./login-bluesky";

export function LoginScreen() {
	return (
		<Centered>
			<h1 className="text-3xl font-bold text-center">Biska</h1>
			<BlueskyLogin />
		</Centered>
	);
}
