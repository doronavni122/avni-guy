import { SITE_CONTACT_EMAIL, SITE_TITLE, SITE_URL } from '../consts';
import {
	BRAND_ORG_LOGO_RASTER_PATH,
	imageObjectWithDimensions,
} from '@/lib/seo/brand-image-dimensions';
import { buildArticleSchema } from '@/lib/seo/schema-article';
import { hasVisibleOfficeNap, readOfficeNap } from '@/lib/seo/office-nap';
import { readPersonSameAsUrls, SITE_PERSON_ID } from '@/lib/seo/schema-person';

/** Stable JSON-LD @id for the law firm entity (LegalService). */
export const SITE_ORGANIZATION_ID = `${SITE_URL}#organization`;

/** Stable JSON-LD @id for the site (WebSite). */
export const SITE_WEBSITE_ID = `${SITE_URL}#website`;

/** Stable JSON-LD @id for the homepage WebPage entity. */
export const SITE_HOME_WEBPAGE_ID = `${SITE_URL}#webpage`;

function absoluteUrl(pathOrUrl: string): string {
	try {
		if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
			return pathOrUrl;
		}
		const p = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
		return new URL(p, SITE_URL).toString();
	} catch (err) {
		console.error('[structured-data] absoluteUrl failed', { pathOrUrl, err });
		return new URL(BRAND_ORG_LOGO_RASTER_PATH, SITE_URL).toString();
	}
}

export const buildOrganizationSchema = () => {
	const sameAs = readPersonSameAsUrls();
	const nap = readOfficeNap();
	const hasNap = hasVisibleOfficeNap(nap);
	const contactPoint: Record<string, unknown> = {
		'@type': 'ContactPoint',
		contactType: 'customer service',
		email: SITE_CONTACT_EMAIL,
		availableLanguage: ['Hebrew', 'he'],
	};
	if (nap.phone) {
		contactPoint.telephone = nap.phone;
	}
	const schema: Record<string, unknown> = {
		'@context': 'https://schema.org',
		// LocalBusiness only when claimed office NAP exists — never imply a storefront without address/phone.
		'@type': hasNap ? (['LegalService', 'LocalBusiness'] as const) : 'LegalService',
		'@id': SITE_ORGANIZATION_ID,
		name: 'גיא אבני משרד עורכי דין',
		url: SITE_URL,
		inLanguage: 'he-IL',
		// Raster logo for KG/crawlability; SVG brand mark stays UI-only (F03).
		logo: imageObjectWithDimensions(absoluteUrl(BRAND_ORG_LOGO_RASTER_PATH), {
			name: 'גיא אבני משרד עורכי דין',
			caption: 'לוגו משרד גיא אבני (רסטר לזיהוי ארגון)',
		}),
		contactPoint,
		founder: {
			'@type': 'Person',
			'@id': SITE_PERSON_ID,
			name: 'גיא אבני',
			url: absoluteUrl('/about/'),
		},
		employee: {
			'@type': 'Person',
			'@id': SITE_PERSON_ID,
			name: 'גיא אבני',
			url: absoluteUrl('/about/'),
		},
		areaServed: {
			'@type': 'Country',
			name: 'Israel',
		},
		knowsAbout: ['דיני נדל״ן', 'מיסוי מקרקעין', 'חוזים', 'ליטיגציה אזרחית', 'ייעוץ משפטי לעסקים'],
		...(sameAs.length ? { sameAs } : {}),
	};
	if (nap.phone) {
		schema.telephone = nap.phone;
	}
	if (nap.locality || nap.street) {
		schema.address = {
			'@type': 'PostalAddress',
			addressCountry: 'IL',
			...(nap.street ? { streetAddress: nap.street } : {}),
			...(nap.locality ? { addressLocality: nap.locality } : {}),
		};
	}
	return schema;
};

export const buildWebSiteJsonLd = () => ({
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	'@id': SITE_WEBSITE_ID,
	name: SITE_TITLE,
	url: SITE_URL,
	inLanguage: 'he-IL',
	publisher: { '@id': SITE_ORGANIZATION_ID },
	creator: {
		'@type': 'Person',
		'@id': SITE_PERSON_ID,
		name: 'גיא אבני',
		url: absoluteUrl('/about/'),
	},
	// No SearchAction: /search/ is noindex — sitelinks searchbox points at a non-indexable surface (F14).
});

export type BlogPostingSchemaInput = {
	headline: string;
	description: string;
	datePublished: string;
	dateModified: string;
	keywords: string[];
	articleSection: string;
	canonicalUrl: string;
	imageUrls: string[];
	authorName: string;
	authorUrl: string;
	/** Primary-law/gov citation URLs from article metadata only — never invent (F06). */
	citations?: string[];
};

export const buildBlogPostingSchema = (input: BlogPostingSchemaInput) => buildArticleSchema(input);

export type BreadcrumbItem = { name: string; path: string };

/** Normalize path for trailingSlash:true (root stays `/`). */
export function normalizeBreadcrumbPath(path: string): string {
	try {
		if (!path || path === '/') {
			return '/';
		}
		const withLeading = path.startsWith('/') ? path : `/${path}`;
		return withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
	} catch (err) {
		console.error('[structured-data] normalizeBreadcrumbPath failed', { path, err });
		return path || '/';
	}
}

export const buildBreadcrumbSchema = (items: BreadcrumbItem[]) => ({
	'@context': 'https://schema.org',
	'@type': 'BreadcrumbList',
	itemListElement: items.map((item, index) => {
		const path = normalizeBreadcrumbPath(item.path);
		return {
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: new URL(path, SITE_URL).toString(),
		};
	}),
});

export const buildFaqSchema = (items: Array<{ question: string; answer: string }>) => ({
	'@context': 'https://schema.org',
	'@type': 'FAQPage',
	mainEntity: items.map((item) => ({
		'@type': 'Question',
		name: item.question,
		acceptedAnswer: {
			'@type': 'Answer',
			text: item.answer,
		},
	})),
});

export type WebPageSchemaInput = {
	'@id': string;
	url: string;
	name: string;
	description: string;
	dateModified: string;
	'@type'?: 'WebPage' | 'CollectionPage' | 'AboutPage' | 'ProfilePage';
	mainEntity?: { '@id': string };
};

export const buildWebPageSchema = (input: WebPageSchemaInput) => ({
	'@context': 'https://schema.org',
	'@type': input['@type'] ?? 'WebPage',
	'@id': input['@id'],
	url: input.url,
	name: input.name,
	description: input.description,
	inLanguage: 'he-IL',
	isPartOf: { '@id': SITE_WEBSITE_ID },
	about: { '@id': SITE_ORGANIZATION_ID },
	publisher: { '@id': SITE_ORGANIZATION_ID },
	...(input.mainEntity ? { mainEntity: input.mainEntity } : {}),
	dateModified: input.dateModified,
});

export type HomeWebPageSchemaInput = {
	name: string;
	description: string;
	dateModified: string;
};

export const buildHomeWebPageSchema = (input: HomeWebPageSchemaInput) => ({
	'@context': 'https://schema.org',
	'@type': 'WebPage',
	'@id': SITE_HOME_WEBPAGE_ID,
	url: SITE_URL,
	name: input.name,
	description: input.description,
	inLanguage: 'he-IL',
	isPartOf: { '@id': SITE_WEBSITE_ID },
	about: { '@id': SITE_PERSON_ID },
	mainEntity: { '@id': SITE_PERSON_ID },
	dateModified: input.dateModified,
});

export type ItemListEntry = { name: string; url: string };

export const buildItemListSchema = (items: ItemListEntry[]) => ({
	'@context': 'https://schema.org',
	'@type': 'ItemList',
	itemListElement: items.map((item, index) => ({
		'@type': 'ListItem',
		position: index + 1,
		name: item.name,
		url: item.url,
	})),
});

export type ContactPageSchemaInput = {
	name: string;
	description: string;
	dateModified: string;
	email: string;
	telephone?: string;
	areaServedName?: string;
};

/** ContactPage + ContactPoint matching visible NAP (claimed fields only). */
export function buildContactPageSchema(input: ContactPageSchemaInput): Record<string, unknown> {
	try {
		const contactPoint: Record<string, unknown> = {
			'@type': 'ContactPoint',
			contactType: 'customer service',
			email: input.email,
			availableLanguage: ['Hebrew', 'he'],
			url: absoluteUrl('/contact/'),
		};
		if (input.telephone) {
			contactPoint.telephone = input.telephone;
		}
		if (input.areaServedName) {
			contactPoint.areaServed = {
				'@type': 'Country',
				name: input.areaServedName,
			};
		}
		return {
			'@context': 'https://schema.org',
			'@type': 'ContactPage',
			'@id': `${SITE_URL}/contact/#contactpage`,
			url: absoluteUrl('/contact/'),
			name: input.name,
			description: input.description,
			inLanguage: 'he-IL',
			isPartOf: { '@id': SITE_WEBSITE_ID },
			about: { '@id': SITE_PERSON_ID },
			mainEntity: { '@id': SITE_ORGANIZATION_ID },
			dateModified: input.dateModified,
			publisher: { '@id': SITE_ORGANIZATION_ID },
			contactPoint,
		};
	} catch (err) {
		console.error('[structured-data] buildContactPageSchema failed', { err });
		return {
			'@context': 'https://schema.org',
			'@type': 'ContactPage',
			'@id': `${SITE_URL}/contact/#contactpage`,
			url: absoluteUrl('/contact/'),
			name: input.name,
			description: input.description,
		};
	}
}

export type HowToStepInput = { name: string; text: string };

export const buildHowToSchema = (input: { name: string; description: string; steps: HowToStepInput[] }) => ({
	'@context': 'https://schema.org',
	'@type': 'HowTo',
	name: input.name,
	description: input.description,
	inLanguage: 'he-IL',
	step: input.steps.map((step, index) => ({
		'@type': 'HowToStep',
		position: index + 1,
		name: step.name,
		text: step.text,
	})),
});

/** Merge schema nodes into a single JSON-LD @graph document (TAG-013). */
export function buildJsonLdGraph(entries: Record<string, unknown>[]): Record<string, unknown> {
	const graph = entries.map((entry) => {
		const { '@context': _context, ...node } = entry;
		return node;
	});
	return {
		'@context': 'https://schema.org',
		'@graph': graph,
	};
}
