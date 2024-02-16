import { z } from "zod";

/* Custom zod types */
const did = z.custom<`did:plc:${string}`>((val) => {
	return typeof val === "string" ? val.startsWith("did:plc:") : false;
}, "Must be a valid did:plc: string");

export type Did = z.infer<typeof did>;

/* Schema */

const accountSchema = z.object({
	service: z.string(),
	did,
	handle: z.string(),
	email: z.string(),
	emailConfirmed: z.boolean(),
	refreshJwt: z.string().optional(), // optional because it can expire
	accessJwt: z.string().optional(), // optional because it can expire
});

export type PersistedAccount = z.infer<typeof accountSchema>;

const sessionSchema = z.object({
	accounts: z.array(accountSchema),
	currentAccount: accountSchema.optional(),
});

export type Session = z.infer<typeof sessionSchema>;

const preferencesSchema = z.object({
	interface: z.object({
		profilePictureStyle: z.enum(["round", "square"]).default("square"),
	}),
	behavior: z.object({
		openProfileIn: z.enum(["app", "bsky"]).default("app"),
	}),
});

export type Preferences = z.infer<typeof preferencesSchema>;

const appMetaSchema = z.object({
	version: z.string().optional(),
});

export type AppMeta = z.infer<typeof appMetaSchema>;

/* General Schema */

export const StorageSchema = z.object({
	session: sessionSchema,
	preferences: preferencesSchema,
	meta: appMetaSchema,
});

export const AppSchema = z
	.object({
		sessionState: z.object({
			isInitialLoad: z.boolean(),
		}),
	})
	.and(StorageSchema);

export type StorageSchema = z.infer<typeof StorageSchema>;
export type AppSchema = z.infer<typeof AppSchema>;

export type StorageSchemaKey = keyof StorageSchema;
export type AppSchemaKey = keyof AppSchema;

export const defaultAppSchema: AppSchema = {
	sessionState: {
		isInitialLoad: true,
	},
	session: {
		accounts: [],
	},
	preferences: {
		interface: {
			profilePictureStyle: "square",
		},
		behavior: {
			openProfileIn: "bsky",
		},
	},
	meta: {
		version: BISKA_VERSION,
	},
};
