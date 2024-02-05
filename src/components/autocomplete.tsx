import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useActorAutocompleteFn } from "@/state/queries/autocomplete";
import { useEffect, useState } from "react";

type AutocompleteProps = {
	onSelect?: (value: string) => void;
	value?: string;
};
export function AutocompleteUsers(props: AutocompleteProps) {
	const queryAutocomplete = useActorAutocompleteFn();
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState(props.value ?? "");
	const [query, setQuery] = useState("");
	const [options, setOptions] = useState<
		Array<{ value: string; label: string }>
	>([]);

	useEffect(() => {
		async function runQuery() {
			const results = await queryAutocomplete({
				query,
			});
			setOptions(
				results.map((result) => {
					return {
						label: `${
							result.displayName
								? `${result.displayName} (${result.handle})`
								: result.handle
						}`,
						value: result.handle,
					};
				}),
			);
		}
		runQuery();
	}, [query]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[200px] justify-between"
				>
					{value ? value : "Procurar usuário…"}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput
						placeholder="Buscar usuário…"
						onValueChange={(e) => {
							setQuery(e);
						}}
					/>
					<CommandEmpty>Nenhum usuário encontrado…</CommandEmpty>
					<CommandGroup>
						{options.map((option) => (
							<CommandItem
								key={option.value}
								value={option.value}
								onSelect={(currentValue) => {
									setValue(currentValue === value ? "" : currentValue);
									if (props.onSelect) {
										props.onSelect(currentValue === value ? "" : currentValue);
									}
									setOpen(false);
								}}
							>
								<Check
									className={cn(
										"mr-2 h-4 w-4",
										value === option.value ? "opacity-100" : "opacity-0",
									)}
								/>
								{option.label}
							</CommandItem>
						))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
