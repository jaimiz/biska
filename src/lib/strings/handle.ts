export function makeValidHandle(str: string): string {
	let handle = str;
	if (handle.length > 20) {
		handle = handle.slice(0, 20);
	}
	handle = str.toLowerCase();
	return handle.replace(/^[^a-z0-9]+/g, "").replace(/[^a-z0-9-]/g, "");
}

export function createFullHandle(name: string, domain: string): string {
	const username = (name || "").replace(/[.]+$/, "");
	const userdomain = (domain || "").replace(/^[.]+/, "");
	return `${username}.${userdomain}`;
}

export function isInvalidHandle(handle: string): boolean {
	return handle === "handle.invalid";
}

export function sanitizeHandle(handle: string, prefix = ""): string {
	return isInvalidHandle(handle) ? "⚠Invalid Handle" : `${prefix}${handle}`;
}
