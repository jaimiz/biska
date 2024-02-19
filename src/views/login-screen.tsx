import { Centered } from "@/components/layouts/Centered";
import { BlueskyLogin } from "./login-bluesky";
import { BskyAppLink } from "@/components/ui/link";

export function LoginScreen() {
	return (
		<Centered>
			<h1 className="text-3xl font-bold w-120">biska</h1>
			<p className="w-120">
				Bem vindo ao biska, um client experimental para o Bluesky.
				<br />
				Você precisa fazer login para continuar.
				<br /> Se você não tem uma conta, você pode criar uma em{" "}
				<BskyAppLink to="/">bsky.app</BskyAppLink>
			</p>
			<BlueskyLogin />
		</Centered>
	);
}
