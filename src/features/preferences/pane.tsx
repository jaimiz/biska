import {
	SheetContent,
	SheetDescription,
	SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAtom } from "jotai";
import { behaviorPreferencesAtom } from "./atoms";

export function PreferencesDrawer() {
	const [behavior, setBehavior] = useAtom(behaviorPreferencesAtom);
	return (
		<SheetContent
			side={"right"}
			className="w-full max-w-none overflow-y-auto sm:max-w-none lg:w-1/3"
		>
			<SheetTitle>Preferências</SheetTitle>
			<SheetDescription>
				<div className="flex justify-between w-full">
					<Tabs
						value={behavior.openProfileIn}
						className="flex items-center w-full"
						onValueChange={(value) => {
							setBehavior({
								openProfileIn: value as "app" | "bsky",
							});
						}}
					>
						<TabsList className="h-auto items-stretch gap-x-2 w-full">
							<TabsTrigger
								className="data-[state=active]:bg-purple-300 flex-1"
								value="app"
							>
								Abrir o perfil no Biska
							</TabsTrigger>
							<TabsTrigger
								className="data-[state=active]:bg-purple-300 flex-1"
								value="bsky"
							>
								Abrir o perfil no Bluesky
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>
				<p className="text-sm text-muted-foreground">
					{behavior.openProfileIn === "app"
						? "Quando você clicar num perfil, ele vai aparecer na parte direita da tela, da mesma forma que o painel de preferências está aparecendo agora."
						: "Quando você clicar num perfil, ele vai abrir o perfil do usuário no bsky.app. O perfil será aberto numa nova aba, pra que você não perca o resultado da busca."}
				</p>
			</SheetDescription>
		</SheetContent>
	);
}
