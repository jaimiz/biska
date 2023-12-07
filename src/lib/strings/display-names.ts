/* eslint-disable no-control-regex */
import { ModerationUI } from "@atproto/api";
import { describeModerationCause } from "../moderation";

// \u2705 = ✅
// \u2713 = ✓
// \u2714 = ✔
// \u2611 = ☑
const CHECK_MARKS_RE = /[\u2705\u2713\u2714\u2611]/gu;
// biome-ignore format lint: we remove control chars from display names. format is disabled to avoid moving the regex to a new line
const CONTROL_CHARS_RE = /[\u0000-\u001F\u007F-\u009F\u061C\u200E\u200F\u202A-\u202E\u2066-\u2069]/g;

export function sanitizeDisplayName(
	str: string,
	moderation?: ModerationUI,
): string {
	if (moderation?.blur) {
		return `⚠${describeModerationCause(moderation.cause, "account").name}`;
	}
	if (typeof str === "string") {
		return str.replace(CHECK_MARKS_RE, "").replace(CONTROL_CHARS_RE, "").trim();
	}
	return "";
}

export function combinedDisplayName({
	handle,
	displayName,
}: {
	handle?: string;
	displayName?: string;
}): string {
	if (!handle) {
		return "";
	}
	return displayName
		? `${sanitizeDisplayName(displayName)} (@${handle})`
		: `@${handle}`;
}
