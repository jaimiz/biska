import { Button } from "@/components/ui/button";
import { BSKY_SOCIAL_SERVICE } from "@/state/queries";
import { api } from "@/state/session";
import { Cloud } from "lucide-react";
import { useState } from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function BlueskyLogin() {
	const [open, setOpen] = useState(false);

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>
				<Button
					className="bg-[#3a83f7] hover:bg-blue-700 text-white inline-flex items-center"
					variant="default"
				>
					<Cloud className="mr-1" />
					Entrar com Bluesky
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						const formData = new FormData(e.currentTarget);
						const identifier = formData.get("identifier") as string;
						const password = formData.get("password") as string;
						if (identifier === "" || password === "") return;
						await api.login({
							service: BSKY_SOCIAL_SERVICE,
							identifier,
							password,
						});
						setOpen(false);
					}}
				>
					<DialogHeader>
						<DialogTitle>Login</DialogTitle>
						<DialogDescription>
							Enter your username and password to login.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="username">Username</Label>
							<div
								className="flex relative items-stretch w-full

h-10 rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50

                "
							>
								<span className="flex p-2 items-center border-input border-r bg-muted text-muted-foreground">
									@
								</span>
								<input
									name="identifier"
									className="w-full bg-transparent p-2"
									id="username"
									required
									type="text"
								/>
							</div>
							<p className="text-sm text-muted-foreground">
								You need to use your full username (e.g. alice.bsky.social)
							</p>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input name="password" id="password" required type="password" />
						</div>
					</div>
					<DialogFooter>
						<DialogClose asChild>
							<Button className="w-full" variant="outline">
								Cancel
							</Button>
						</DialogClose>
						<Button
							className="bg-[#3a83f7] hover:bg-blue-700 text-white inline-flex items-center w-full"
							type="submit"
						>
							Login
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
