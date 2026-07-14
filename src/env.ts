import { z } from 'zod';

/** Server-side env schema (optional keys used by SEO/deploy scripts). */
const serverEnvSchema = z.object({
	INDEXNOW_KEY: z.string().optional(),
	WIKIDATA_PERSON_URL: z.string().url().optional().or(z.literal('')),
	PERSON_LINKEDIN_URL: z.string().url().optional().or(z.literal('')),
	PERSON_ISRAEL_BAR_URL: z.string().url().optional().or(z.literal('')),
	PERSON_FACEBOOK_URL: z.string().url().optional().or(z.literal('')),
	PERSON_OFFICE_SITE_URL: z.string().url().optional().or(z.literal('')),
	NEXT_PUBLIC_OFFICE_LOCALITY: z.string().optional(),
	NEXT_PUBLIC_OFFICE_STREET: z.string().optional(),
	NEXT_PUBLIC_OFFICE_PHONE: z.string().optional(),
	NEXT_PUBLIC_BAR_LICENSE_ID: z.string().optional(),
	SITE_URL: z.string().url().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function parseServerEnv(): ServerEnv {
	try {
		return serverEnvSchema.parse(process.env);
	} catch (err) {
		console.error('[env] parseServerEnv failed', { err });
		return {};
	}
}

/** Warn when production build runs without required owner-set keys. */
export function warnProductionEnvGaps(): void {
	if (process.env.NODE_ENV !== 'production') {
		return;
	}
	const key = process.env.INDEXNOW_KEY?.trim();
	if (!key) {
		console.warn(
			'[env] INDEXNOW_KEY is empty in production — IndexNow key file and post-deploy pings are skipped. Owner: set INDEXNOW_KEY in Vercel project environment variables.',
		);
	}
}
