/**
 * Given a string, tries to generate a two letter combination to be used as
 * fallback when user profile picture is not available.
 */
export function getInitials(text: string) {
	const words = normalizeString(text).split(/(\s|\.)+/g);
	const [first, , second] = words;
	if (!second) {
		return `${first.slice(0, 1).toUpperCase()}${first.slice(1, 2)}`;
	}
	return `${first.slice(0, 1).toUpperCase()}${second
		.slice(0, 1)
		.toUpperCase()}`;
}

/* Removes non alphanumeric characters from a string */
export const normalizeString = (str: string) =>
	str.replace(/[^A-zÀ-ú\p{N}\p{P}\p{Z}^$\n]/gu, "").trim();
