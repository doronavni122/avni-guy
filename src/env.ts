import { z } from 'zod';

/** Server-side env schema (optional keys used by SEO/deploy scripts). */
const serverEnvSchema = z.object({
	INDEXNOW_KEY: z.string().optional(),
	WIKIDATA_PERSON_URL: z.string().url().optional().or(z.literal('')),
	PERSON_LINKEDIN_URL: z.string().url().optional().or(z.literal('')),
	/** Claimed individual Israel Bar listing only — never invent; empty = omit sameAs edge. */
	PERSON_ISRAEL_BAR_URL: z.string().url().optional().or(z.literal('')),
	PERSON_FACEBOOK_URL: z.string().url().optional().or(z.literal('')),
	/** empty string = opt-out office sameAs; unset = default guyavni; http URL = that office. */
	PERSON_OFFICE_SITE_URL: z.string().url().optional().or(z.literal('')),
	NEXT_PUBLIC_OFFICE_LOCALITY: z.string().optional(),
	NEXT_PUBLIC_OFFICE_STREET: z.string().optional(),
	NEXT_PUBLIC_OFFICE_PHONE: z.string().optional(),
	NEXT_PUBLIC_BAR_LICENSE_ID: z.string().optional(),
	SITE_URL: z.string().url().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

/** Env keys that feed Person/Organization sameAs (claimed = non-empty http URL). */
export const PERSON_SAMEAS_ENV_KEYS = [
	'WIKIDATA_PERSON_URL',
	'PERSON_LINKEDIN_URL',
	'PERSON_ISRAEL_BAR_URL',
	'PERSON_FACEBOOK_URL',
	'PERSON_OFFICE_SITE_URL',
] as const;

export type PersonSameAsEnvKey = (typeof PERSON_SAMEAS_ENV_KEYS)[number];

export function parseServerEnv(): ServerEnv {
	try {
		return serverEnvSchema.parse(process.env);
	} catch (err) {
		console.error('[env] parseServerEnv failed', { err });
		return {};
	}
}

function isGenericIsraelBarPortalUrl(url: string): boolean {
	try {
		const u = new URL(url);
		const host = u.hostname.toLowerCase().replace(/^www\./, '');
		if (host !== 'israelbar.org.il' && host !== 'israelbar.biz') {
			return false;
		}
		const path = u.pathname.replace(/\/+$/, '') || '/';
		return path === '/' || path === '/home';
	} catch (err) {
		console.error('[env] isGenericIsraelBarPortalUrl parse failed', { url, err });
		return true;
	}
}

/** Warn when production build runs without required owner-set keys. */
export function warnProductionEnvGaps(): void {
	if (process.env.NODE_ENV !== 'production') {
		return;
	}
	try {
		const key = process.env.INDEXNOW_KEY?.trim();
		if (!key) {
			console.warn(
				'[env] INDEXNOW_KEY is empty in production — IndexNow key file and post-deploy pings are skipped. Owner: set INDEXNOW_KEY in Vercel project environment variables.',
			);
		}

		const wikidata = process.env.WIKIDATA_PERSON_URL?.trim();
		if (!wikidata) {
			console.warn(
				'[env] WIKIDATA_PERSON_URL is empty in production — Person.sameAs omits Wikidata until a verified Q-item URL is claimed in Vercel.',
			);
		} else if (!wikidata.startsWith('http')) {
			console.warn('[env] WIKIDATA_PERSON_URL is set but not an http(s) URL — sameAs edge skipped.', {
				valuePreview: wikidata.slice(0, 48),
			});
		}

		const bar = process.env.PERSON_ISRAEL_BAR_URL?.trim();
		if (!bar) {
			console.warn(
				'[env] PERSON_ISRAEL_BAR_URL is empty in production — Bar sameAs/memberOf omitted until an individual listing URL is claimed (ops runbook prod-sameas-bar-assert). Do not invent a URL.',
			);
		} else if (!bar.startsWith('http')) {
			console.warn('[env] PERSON_ISRAEL_BAR_URL is set but not an http(s) URL — sameAs edge skipped.', {
				valuePreview: bar.slice(0, 48),
			});
		} else if (isGenericIsraelBarPortalUrl(bar)) {
			console.error(
				'[env] PERSON_ISRAEL_BAR_URL points at a generic Israel Bar portal home — reject for sameAs. Set individual member listing URL only, or leave empty.',
				{ bar },
			);
		}

		for (const officeKey of [
			'NEXT_PUBLIC_OFFICE_LOCALITY',
			'NEXT_PUBLIC_OFFICE_STREET',
			'NEXT_PUBLIC_OFFICE_PHONE',
		] as const) {
			const officeVal = process.env[officeKey]?.trim();
			if (!officeVal) {
				console.warn(
					`[env] ${officeKey} is empty in production — contact NAP and Person address omit this field until a claimed value is set. Do not invent an address or phone.`,
				);
			}
		}
	} catch (err) {
		console.error('[env] warnProductionEnvGaps failed', { err });
	}
}
