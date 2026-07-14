import { SITE_URL } from '@/consts';

/** Stable JSON-LD @id for the person entity (canonical entity home). */
export const SITE_PERSON_ID = `${SITE_URL}/about/#person`;

const PERSON_IMAGE_PATH = '/images/shared/guy-avni-avni-guy-law-firm-lawyer-brand-portrait-photo-2.jpg';
const SITE_ORGANIZATION_ID = `${SITE_URL}#organization`;

export type PersonSchemaOptions = {
	sameAs?: string[];
};

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

export const buildPersonSchema = (options: PersonSchemaOptions = {}) => {
	const schema: Record<string, unknown> = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		'@id': SITE_PERSON_ID,
		name: 'גיא אבני',
		jobTitle: 'עורך דין',
		url: absoluteUrl('/about/'),
		image: {
			'@type': 'ImageObject',
			url: absoluteUrl(PERSON_IMAGE_PATH),
			contentUrl: absoluteUrl(PERSON_IMAGE_PATH),
			caption: 'גיא אבני עורך דין',
			name: 'גיא אבני עורך דין',
		},
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

	const barUrl = process.env.PERSON_ISRAEL_BAR_URL?.trim();
	if (barUrl?.startsWith('http')) {
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

	const wikidata = process.env.WIKIDATA_PERSON_URL?.trim();
	if (wikidata?.startsWith('http')) {
		urls.push(wikidata);
	}

	for (const key of [
		'PERSON_LINKEDIN_URL',
		'PERSON_ISRAEL_BAR_URL',
		'PERSON_FACEBOOK_URL',
		'PERSON_OFFICE_SITE_URL',
	] as const) {
		try {
			const v = process.env[key]?.trim();
			if (v?.startsWith('http') && !urls.includes(v)) {
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
		const office = officeExplicit?.startsWith('http') ? officeExplicit : 'https://guyavni.co.il/';
		if (!urls.includes(office)) {
			urls.push(office);
		}
	}

	return urls;
}
