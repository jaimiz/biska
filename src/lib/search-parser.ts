/*
 * this function will take a query like "term from:user.name" and
 * parse it as an object like { term: "term", from: "user.name" }
 */
type SearchGrammar = {
	terms: string;
	from?: string;
} & { [key: string]: string };

export function extractFilterFromSearchQuery(prefix: "from:") {
	return (searchQuery: string) => {
		return searchQuery.split(" ").filter((term) => term.startsWith(prefix));
	};
}

export function extractGenericTermsFromSearchQuery(searchQuery: string) {
	return searchQuery.split(" ").filter((term) => {
		const [, prefixedValue] = term.split(":");
		// if value is not undefined it measn that this is a prefixed expresssion,
		// like from:username. we don't want to include these
		return prefixedValue === undefined;
	});
}
export function extractFiltersFromSearchQuery(searchQuery: string) {
	return searchQuery
		.split(" ")
		.filter((term) => {
			const [prefix, value] = term.split(":");
			return prefix && value;
		})
		.reduce((filters: Record<string, string>, filter) => {
			const [prefix, value] = filter.split(":");
			filters[prefix] = value;
			return filters;
		}, {});
}

export function parseSearchQuery(searchQuery: string): SearchGrammar {
	const terms = extractGenericTermsFromSearchQuery(searchQuery);
	const filters = extractFiltersFromSearchQuery(searchQuery);
	return {
		...filters,
		terms: terms.join(" "),
	};
}

export function buildSearchQuery(searchGrammar: SearchGrammar): string {
	const { terms, ...filters } = searchGrammar;
	return `${terms} ${Object.entries(filters)
		.map(([filter, value]) => `${filter}:${value}`)
		.join(" ")}`;
}
