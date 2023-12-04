import type { LucideIcon } from "lucide-react";
import { Copy, HelpCircle, Info } from "lucide-react";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger,
} from "./ui/sheet";
import { TextButton } from "./ui/text-button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
type AppPasswordMiniGuideProps = {
	Icon?: LucideIcon;
};
export function AppPasswordMiniGuide(props: AppPasswordMiniGuideProps) {
	const { Icon = HelpCircle } = props;
	return (
		<Sheet>
			<div className="flex items-center text-xs">
				<SheetTrigger className="flex gap-x-1" asChild>
					<TextButton>
						Você deveria usar uma 'App Password'
						<Icon className="inline-block" size={14} />
					</TextButton>
				</SheetTrigger>
			</div>
			<SheetContent
				side={"right"}
				className="w-full max-w-none overflow-y-auto sm:max-w-none lg:w-1/3"
			>
				<SheetTitle>Porque usar um App Password?</SheetTitle>
				<SheetDescription>
					O BlueSky oferece uma opção nas suas configurações de gerar uma 'App
					Password', ou seja, uma senha de aplicativo.
				</SheetDescription>
				<SheetDescription>
					Essa senha é separada da sua senha principal e não oferece acesso
					completo à sua conta (é impossível, por exemplo, deletar sua conta
					usando uma App Password).
				</SheetDescription>
				<SheetDescription>
					Por questões de segurança, é recomendável que você use sempre uma App
					Password em qualquer serviço que não seja o BlueSky.
				</SheetDescription>
				<SheetTitle>Como criar uma App Password?</SheetTitle>
				<SheetDescription asChild>
					<Alert variant="info">
						<Info className="h-4 w-4" />
						<AlertTitle>
							Você pode acessar as configurações de App Password diretamente
							nesse link
						</AlertTitle>
						<AlertDescription>
							<a
								target="_blank"
								href="https://bsky.app/settings/app-passwords"
								rel="noreferrer"
							>
								https://bsky.app/settings/app-passwords
							</a>
						</AlertDescription>
					</Alert>
				</SheetDescription>
				<SheetDescription>
					Você também pode ir nas suas configurações (Settings) e clicar em App
					Passwords. Na nova página, você vai ver uma lista contendo suas App
					Passwords. Se você ainda não criou nenhuma, a lista estará vazia, como
					na imagem. Clique em 'Add App Password'. Na janela que se abre, você
					pode digitar um nome ou utilizar o nome aleatório que eles sugerem. É
					recomendável que você coloque um nome que te ajude a identificar onde
					aquela senha está sendo usada, caso você precise revogá-la. Digite o
					nome da sua preferência e clique em 'Create App Password'
					<strong>Parabéns 🎉</strong>, você criou sua App Password! Mas
					atenção: ela só será mostrada uma vez! Clique no ícone{" "}
					<Copy className="inline-block" aria-label="Copiar" size={14} /> para
					copiar a sua App Password. É recomendável que você cole a senha em um
					local seguro, como um gerenciador de senhas. Pronto! Agora você pode
					usar essa 'App Password' para fazer login na Balloon Foundation.
					<SheetClose asChild className="my-3 w-full">
						<Button>Fechar</Button>
					</SheetClose>
				</SheetDescription>
			</SheetContent>
		</Sheet>
	);
}
