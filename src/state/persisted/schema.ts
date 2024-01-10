import { z } from "zod";

/* Custom zod types */
const did = z.custom<`did:plc:${string}`>((val) => {
	return typeof val === "string" ? val.startsWith("did:plc:") : false;
}, "Must be a valid did:plc: string");

export type Did = z.infer<typeof did>;

/* Schema */

/* Sections */
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

const preferencesSchema = z.object({
	interface: z.object({
		profilePictureStyle: z.enum(["round", "square"]).default("square"),
	}),
});

export type Preferences = z.infer<typeof preferencesSchema>;

const appMetaSchema = z.object({
	version: z.string().optional(),
});

export type AppMeta = z.infer<typeof appMetaSchema>;

const columnSettingsSchema = z.object({
	name: z.string(),
});

const columnSchema = z.discriminatedUnion("type", [
	// Skyline column
	z.object({
		type: z.enum(["skyline"]),
		account: did,
		settings: columnSettingsSchema,
	}),
]);

export type Column = z.infer<typeof columnSchema>;

/* General Schema */

export const AppSchema = z.object({
	session: z.object({
		accounts: z.array(accountSchema),
		currentAccount: accountSchema.optional(),
	}),
	preferences: preferencesSchema,
	columns: z.array(columnSchema),
	meta: appMetaSchema,
});

export type AppSchema = z.infer<typeof AppSchema>;

export type AppSchemaKey = keyof AppSchema;

export const defaultAppSchema: AppSchema = {
	session: {
		accounts: [],
	},
	preferences: {
		interface: {
			profilePictureStyle: "square",
		},
	},
	columns: [],
	meta: {
		version: BISKA_VERSION,
	},
};
