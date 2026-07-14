import { SITE_URL } from '@/consts';
import { PERSON_SAMEAS_ENV_KEYS, warnProductionEnvGaps } from '@/env';

/** Stable JSON-LD @id for the person entity (canonical entity home). */
export const SITE_PERSON_ID = `${SITE_URL}/about/#person`;

/** Brand-query alt / ImageObject name for image-search rank tracking. */
export const PERSON_BRAND_IMAGE_ALT = 'גיא אבני עורך דין';

/** Unique Person portrait (do not reuse OG fallback for this placement). */
export const PERSON_PORTRAIT_IMAGE_PATH =
	'/images/shared/guy-avni-avni-guy-law-firm-lawyer-brand-portrait-photo-2.jpg';

/** Unique office/interior asset for brand image-rank panel (distinct URL). */
export const PERSON_OFFICE_IMAGE_PATH =
	'/images/shared/guy-avni-avni-guy-law-firm-lawyer-office-interior-photo-3.jpg';

/** @deprecated Prefer PERSON_PORTRAIT_IMAGE_PATH — kept as alias for call sites. */
const PERSON_IMAGE_PATH = PERSON_PORTRAIT_IMAGE_PATH;

const SITE_ORGANIZATION_ID = `${SITE_URL}#organization`;
const SITE_PERSON_IMAGE_ID = `${SITE_URL}/about/#person-image`;
const SITE_OFFICE_IMAGE_ID = `${SITE_URL}/about/#office-image`;
const DEFAULT_OFFICE_SAMEAS = 'https://guyavni.co.il/';

export type BrandImageRankPanelEntry = {
	id: 'portrait' | 'office';
	path: string;
	alt: string;
	role: 'person-portrait' | 'office-interior';
};

/**
 * Image-rank panel: stable pack of brand assets to track in GSC/Bing image reports
 * separately from text SERP (maps-005: image-search-rank-panel).
 */
export const BRAND_IMAGE_RANK_PANEL: readonly BrandImageRankPanelEntry[] = [
	{
		id: 'portrait',
		path: PERSON_PORTRAIT_IMAGE_PATH,
		alt: PERSON_BRAND_IMAGE_ALT,
		role: 'person-portrait',
	},
	{
		id: 'office',
		path: PERSON_OFFICE_IMAGE_PATH,
		alt: PERSON_BRAND_IMAGE_ALT,
		role: 'office-interior',
	},
] as const;

export type PersonSchemaOptions = {
	sameAs?: string[];
};

let productionSameAsWarnOnce = false;

function absoluteUrl(pathOrUrl: string): string {
	try {
		if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
			return pathOrUrl;
		}
		const p = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
		return new URL(p, SITE_URL).toString();
	} catch (err) {
		console.error('[schema-person] absoluteUrl failed', { pathOrUrl, err });
		return new URL(PERSON_IMAGE_PATH, SITE_URL).toString();
	}
}

function buildPersonPortraitImageObject(): Record<string, unknown> {
	const url = absoluteUrl(PERSON_PORTRAIT_IMAGE_PATH);
	return {
		'@type': 'ImageObject',
		'@id': SITE_PERSON_IMAGE_ID,
		url,
		contentUrl: url,
		name: PERSON_BRAND_IMAGE_ALT,
		caption: PERSON_BRAND_IMAGE_ALT,
		description: PERSON_BRAND_IMAGE_ALT,
		inLanguage: 'he',
		representativeOfPage: true,
	};
}

function buildOfficeImageObject(): Record<string, unknown> {
	const url = absoluteUrl(PERSON_OFFICE_IMAGE_PATH);
	return {
		'@type': 'ImageObject',
		'@id': SITE_OFFICE_IMAGE_ID,
		url,
		contentUrl: url,
		name: PERSON_BRAND_IMAGE_ALT,
		caption: PERSON_BRAND_IMAGE_ALT,
		description: PERSON_BRAND_IMAGE_ALT,
		inLanguage: 'he',
	};
}

function isPlaceholderSameAsUrl(url: string): boolean {
	return /example\.com|localhost|127\.0\.0\.1|placeholder|your-|\.local(?:\/|$)/i.test(url);
}

/** Generic Israel Bar portal home pages are not individual listings — never emit as sameAs. */
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
		console.error('[schema-person] isGenericIsraelBarPortalUrl parse failed', { url, err });
		return true;
	}
}

/**
 * Truthful sameAs edge gate.
 * PERSON_ISRAEL_BAR_URL must be a claimed individual listing — not a portal home.
 */
export function isTruthfulPersonSameAsUrl(url: string, envKey?: string): boolean {
	try {
		if (!url.startsWith('http://') && !url.startsWith('https://')) {
			return false;
		}
		if (isPlaceholderSameAsUrl(url)) {
			console.error('[schema-person] rejecting placeholder sameAs URL', { envKey, url });
			return false;
		}
		if (envKey === 'PERSON_ISRAEL_BAR_URL' && isGenericIsraelBarPortalUrl(url)) {
			console.error(
				'[schema-person] PERSON_ISRAEL_BAR_URL rejects generic Israel Bar portal — claim individual listing or leave empty',
				{ url },
			);
			return false;
		}
		return true;
	} catch (err) {
		console.error('[schema-person] isTruthfulPersonSameAsUrl failed', { envKey, url, err });
		return false;
	}
}

function readClaimedEnvHttpUrl(key: string): string | undefined {
	try {
		const v = process.env[key]?.trim();
		if (!v?.startsWith('http')) {
			return undefined;
		}
		return isTruthfulPersonSameAsUrl(v, key) ? v : undefined;
	} catch (err) {
		console.error('[schema-person] readClaimedEnvHttpUrl failed', { key, err });
		return undefined;
	}
}

/**
 * Assert every claimed Person sameAs env URL appears in the emitted list.
 * Returns missing claimed URLs (empty = pass).
 */
export function assertClaimedPersonSameAsEdges(sameAs: string[]): string[] {
	const missing: string[] = [];
	try {
		for (const key of PERSON_SAMEAS_ENV_KEYS) {
			if (key === 'PERSON_OFFICE_SITE_URL') {
				const raw = process.env.PERSON_OFFICE_SITE_URL;
				// Explicit empty opt-out: do not require office in sameAs.
				if (raw?.trim() === '') {
					continue;
				}
			}
			const claimed = readClaimedEnvHttpUrl(key);
			if (!claimed) {
				continue;
			}
			if (!sameAs.includes(claimed)) {
				missing.push(claimed);
				console.error('[schema-person] claimed sameAs env URL missing from emitted list', {
					key,
					claimed,
					sameAs,
				});
			}
		}
		// Default office when PERSON_OFFICE_SITE_URL unset (not opt-out).
		const officeRaw = process.env.PERSON_OFFICE_SITE_URL;
		if (officeRaw === undefined && !sameAs.includes(DEFAULT_OFFICE_SAMEAS)) {
			missing.push(DEFAULT_OFFICE_SAMEAS);
			console.error('[schema-person] default office sameAs missing from emitted list', {
				expected: DEFAULT_OFFICE_SAMEAS,
				sameAs,
			});
		}
	} catch (err) {
		console.error('[schema-person] assertClaimedPersonSameAsEdges failed', { err });
	}
	return missing;
}

export const buildPersonSchema = (options: PersonSchemaOptions = {}) => {
	const schema: Record<string, unknown> = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		'@id': SITE_PERSON_ID,
		name: 'גיא אבני',
		jobTitle: 'עורך דין',
		url: absoluteUrl('/about/'),
		image: [buildPersonPortraitImageObject(), buildOfficeImageObject()],
		worksFor: { '@id': SITE_ORGANIZATION_ID },
		knowsAbout: ['דיני נדל״ן', 'מיסוי מקרקעין', 'חוזים', 'ליטיגציה אזרחית', 'ייעוץ משפטי לעסקים'],
		hasCredential: {
			'@type': 'EducationalOccupationalCredential',
			credentialCategory: 'רישיון עורך דין',
			recognizedBy: {
				'@type': 'Organization',
				name: 'לשכת עורכי הדין בישראל',
			},
		},
		mainEntityOfPage: absoluteUrl('/about/'),
		subjectOf: {
			'@type': 'CreativeWork',
			url: absoluteUrl('/.well-known/person.json'),
			name: 'Machine-readable person CV',
		},
	};

	const barUrl = readClaimedEnvHttpUrl('PERSON_ISRAEL_BAR_URL');
	if (barUrl) {
		schema.memberOf = {
			'@type': 'Organization',
			name: 'לשכת עורכי הדין בישראל',
			url: barUrl,
		};
	}

	const officeLocality = process.env.NEXT_PUBLIC_OFFICE_LOCALITY?.trim();
	const officeStreet = process.env.NEXT_PUBLIC_OFFICE_STREET?.trim();
	const officePhone = process.env.NEXT_PUBLIC_OFFICE_PHONE?.trim();
	if (officeLocality || officeStreet || officePhone) {
		schema.address = {
			'@type': 'PostalAddress',
			...(officeStreet ? { streetAddress: officeStreet } : {}),
			addressCountry: 'IL',
			...(officeLocality ? { addressLocality: officeLocality } : {}),
		};
		if (officePhone) {
			schema.telephone = officePhone;
		}
	}

	if (options.sameAs?.length) {
		schema.sameAs = options.sameAs;
	}

	return schema;
};

/** Read verified profile URLs from env (optional; no secrets in repo). */
export function readPersonSameAsUrls(): string[] {
	const urls: string[] = [];

	try {
		if (!productionSameAsWarnOnce && process.env.NODE_ENV === 'production') {
			productionSameAsWarnOnce = true;
			warnProductionEnvGaps();
		}
	} catch (err) {
		console.error('[schema-person] production env warn hook failed', { err });
	}

	const wikidata = readClaimedEnvHttpUrl('WIKIDATA_PERSON_URL');
	if (wikidata) {
		urls.push(wikidata);
	}

	for (const key of [
		'PERSON_LINKEDIN_URL',
		'PERSON_ISRAEL_BAR_URL',
		'PERSON_FACEBOOK_URL',
		'PERSON_OFFICE_SITE_URL',
	] as const) {
		try {
			const v = readClaimedEnvHttpUrl(key);
			if (v && !urls.includes(v)) {
				urls.push(v);
			}
		} catch (err) {
			console.error('[schema-person] readPersonSameAsUrls env read failed', { key, err });
		}
	}

	const officeExplicit = process.env.PERSON_OFFICE_SITE_URL?.trim();
	if (officeExplicit === '') {
		// Owner opted out of office sameAs.
	} else {
		const office = officeExplicit?.startsWith('http')
			? readClaimedEnvHttpUrl('PERSON_OFFICE_SITE_URL')
			: DEFAULT_OFFICE_SAMEAS;
		if (office && isTruthfulPersonSameAsUrl(office, 'PERSON_OFFICE_SITE_URL') && !urls.includes(office)) {
			urls.push(office);
		}
	}

	const missing = assertClaimedPersonSameAsEdges(urls);
	if (missing.length) {
		console.error('[schema-person] sameAs claim assert failed', { missing, urls });
	}

	return urls;
}
