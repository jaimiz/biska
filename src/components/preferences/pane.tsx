import {
	SheetContent,
	SheetDescription,
	SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAtom, useSetAtom } from "jotai";
import { interfacePreferencesAtom, preferencesAtom } from "./atoms";
import { Preferences } from "@/state/schema";

export function PreferencesDrawer() {
	const [preferences, setPreferences] = useAtom(preferencesAtom);
	const setInterfacePreferences = useSetAtom(interfacePreferencesAtom);
	return (
		<SheetContent
			side={"right"}
			className="w-full max-w-none overflow-y-auto sm:max-w-none lg:w-1/3"
		>
			<SheetTitle>Preferências</SheetTitle>
			<SheetDescription className="flex flex-col gap-3">
				<div className="flex flex-col gap-2 w-full">
					<h3 className="text-md text-foreground font-semibold">
						Visualizar perfis
					</h3>
					<Tabs
						value={preferences.behavior.openProfileIn}
						className="flex items-center w-full"
						onValueChange={(value) => {
							setPreferences({
								behavior: {
									openProfileIn: value as "app" | "bsky",
								},
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
					<p className="text-xs text-muted-foreground">
						{preferences.behavior.openProfileIn === "app"
							? "Quando você clicar num perfil, ele vai aparecer na parte direita da tela, da mesma forma que o painel de preferências está aparecendo agora."
							: "Quando você clicar num perfil, ele vai abrir o perfil do usuário no bsky.app. O perfil será aberto numa nova aba, pra que você não perca o resultado da busca."}
					</p>{" "}
				</div>
				<div className="flex flex-col gap-2 w-full">
					<h3 className="text-md text-foreground font-semibold">
						Tamanho das colunas
					</h3>
					<Tabs
						value={preferences.interface.columnSize}
						className="flex items-center w-full"
						onValueChange={(value) => {
							setInterfacePreferences({
								columnSize: value as Preferences["interface"]["columnSize"],
							});
						}}
					>
						<TabsList className="h-auto items-stretch gap-x-2 w-full">
							<TabsTrigger
								className="data-[state=active]:bg-purple-300 flex-1"
								value="sm"
							>
								Pequena
							</TabsTrigger>
							<TabsTrigger
								className="data-[state=active]:bg-purple-300 flex-1"
								value="md"
							>
								Média
							</TabsTrigger>
							<TabsTrigger
								className="data-[state=active]:bg-purple-300 flex-1"
								value="lg"
							>
								Grande
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>
			</SheetDescription>
		</SheetContent>
	);
}
