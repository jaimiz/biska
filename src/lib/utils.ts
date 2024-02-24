import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// stolen from https://github.com/mary-ext/langit/blob/70cf8ed820d27337370039f517f4968c6553cd11/app/api/utils/tid.ts
let lastTimestamp = 0;

export const getCurrentTid = () => {
	// we need these two aspects, which Date.now() doesn't provide:
	// - monotonically increasing time
	// - microsecond precision

	// while `performance.timeOrigin + performance.now()` could be used here, they
	// seem to have cross-browser differences, not sure on that yet.

	let now = Math.max(Date.now() * 1_000, lastTimestamp);

	if (now === lastTimestamp) {
		now += 1;
	}

	lastTimestamp = now;

	const id = Math.floor(Math.random() * 32);

	return s32encode(now) + s32encode(id).padStart(2, "2");
};

const S32_CHAR = "234567abcdefghijklmnopqrstuvwxyz";

export const s32encode = (i: number): string => {
	let s = "";
	while (i) {
		const c = i % 32;
		// biome-ignore lint/style/noParameterAssign:
		i = Math.floor(i / 32);
		s = S32_CHAR.charAt(c) + s;
	}
	return s;
};
