import { Button } from "@/components/ui/button";
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

import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "./ui/spinner";
import { BSKY_SOCIAL_SERVICE, bskyApi } from "@/services/api";

export function AlertDestructive() {
	return (
		<Alert variant="destructive">
			<AlertCircle className="h-4 w-4" />
			<AlertTitle>Erro</AlertTitle>
			<AlertDescription>Usuário ou senha incorretos.</AlertDescription>
		</Alert>
	);
}

export function BlueskyLogin() {
	const [open, setOpen] = useState(false);
	const [error, setError] = useState(false);
	const [isSubmitting, setSubmitting] = useState(false);

	return (
		<Dialog onOpenChange={setOpen} open={open} modal={true}>
			<DialogTrigger asChild>
				<Button
					className="bg-[#3a83f7] hover:bg-blue-700 text-white inline-flex items-center"
					variant="default"
				>
					<Cloud className="mr-1" />
					Entrar com Bluesky
				</Button>
			</DialogTrigger>
			<DialogContent
				className="sm:max-w-[425px]"
				onPointerDownOutside={(e) => e.preventDefault()}
			>
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						setError(false);
						setSubmitting(true);
						const formData = new FormData(e.currentTarget);
						const identifier = formData.get("identifier") as string;
						const password = formData.get("password") as string;
						if (identifier === "" || password === "") return;
						try {
							await bskyApi.login({
								service: BSKY_SOCIAL_SERVICE,
								identifier,
								password,
							});
							setOpen(false);
						} catch (e) {
							if (e.status === 401) {
								setError(true);
							}
						} finally {
							setSubmitting(false);
						}
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
							<Input
								name="password"
								id="password"
								required
								type="password"
								autoComplete="current-password"
							/>
						</div>
						{error && (
							<div>
								<AlertDestructive />
							</div>
						)}
					</div>
					<DialogFooter>
						<DialogClose asChild>
							<Button className="w-full" variant="outline">
								Cancel
							</Button>
						</DialogClose>
						<Button
							disabled={isSubmitting}
							className="bg-[#3a83f7] gap-x-2 hover:bg-blue-700 text-white inline-flex items-center w-full"
							type="submit"
						>
							{isSubmitting ? (
								<>
									<Spinner /> Entrando…
								</>
							) : (
								"Login"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
