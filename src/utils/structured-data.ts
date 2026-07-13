import { SITE_CONTACT_EMAIL, SITE_TITLE, SITE_URL } from '../consts';
import { buildArticleSchema } from '@/lib/seo/schema-article';
import { readPersonSameAsUrls, SITE_PERSON_ID } from '@/lib/seo/schema-person';

/** Stable JSON-LD @id for the law firm entity (LegalService). */
export const SITE_ORGANIZATION_ID = `${SITE_URL}#organization`;

/** Stable JSON-LD @id for the site (WebSite). */
export const SITE_WEBSITE_ID = `${SITE_URL}#website`;

/** Stable JSON-LD @id for the homepage WebPage entity. */
export const SITE_HOME_WEBPAGE_ID = `${SITE_URL}#webpage`;

const BRAND_LOGO_PATH = '/images/branding/guy-avni-avni-guy-law-firm-lawyer-brand-logo.svg';

function absoluteUrl(pathOrUrl: string): string {
	try {
		if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
			return pathOrUrl;
		}
		const p = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
		return new URL(p, SITE_URL).toString();
	} catch (err) {
		console.error('[structured-data] absoluteUrl failed', { pathOrUrl, err });
		return new URL(BRAND_LOGO_PATH, SITE_URL).toString();
	}
}

export const buildOrganizationSchema = () => {
	const sameAs = readPersonSameAsUrls();
	return {
		'@context': 'https://schema.org',
		'@type': 'LegalService',
		'@id': SITE_ORGANIZATION_ID,
		name: 'גיא אבני משרד עורכי דין',
		url: SITE_URL,
		inLanguage: 'he',
		logo: {
			'@type': 'ImageObject',
			url: absoluteUrl(BRAND_LOGO_PATH),
		},
		contactPoint: {
			'@type': 'ContactPoint',
			contactType: 'customer service',
			email: SITE_CONTACT_EMAIL,
			availableLanguage: ['Hebrew'],
		},
		founder: {
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
};

export const buildWebSiteJsonLd = () => ({
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	'@id': SITE_WEBSITE_ID,
	name: SITE_TITLE,
	url: SITE_URL,
	inLanguage: 'he',
	publisher: { '@id': SITE_ORGANIZATION_ID },
	creator: {
		'@type': 'Person',
		name: 'גיא אבני',
		url: absoluteUrl('/about/'),
	},
	potentialAction: {
		'@type': 'SearchAction',
		target: {
			'@type': 'EntryPoint',
			urlTemplate: `${SITE_URL}/search/?q={search_term_string}`,
		},
		'query-input': 'required name=search_term_string',
	},
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
};

export const buildBlogPostingSchema = (input: BlogPostingSchemaInput) => buildArticleSchema(input);

export type BreadcrumbItem = { name: string; path: string };

export const buildBreadcrumbSchema = (items: BreadcrumbItem[]) => ({
	'@context': 'https://schema.org',
	'@type': 'BreadcrumbList',
	itemListElement: items.map((item, index) => ({
		'@type': 'ListItem',
		position: index + 1,
		name: item.name,
		item: new URL(item.path, SITE_URL).toString(),
	})),
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
	'@type'?: 'WebPage' | 'CollectionPage' | 'AboutPage';
	mainEntity?: { '@id': string };
};

export const buildWebPageSchema = (input: WebPageSchemaInput) => ({
	'@context': 'https://schema.org',
	'@type': input['@type'] ?? 'WebPage',
	'@id': input['@id'],
	url: input.url,
	name: input.name,
	description: input.description,
	inLanguage: 'he',
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
	inLanguage: 'he',
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

export type HowToStepInput = { name: string; text: string };

export const buildHowToSchema = (input: { name: string; description: string; steps: HowToStepInput[] }) => ({
	'@context': 'https://schema.org',
	'@type': 'HowTo',
	name: input.name,
	description: input.description,
	inLanguage: 'he',
	step: input.steps.map((step, index) => ({
		'@type': 'HowToStep',
		position: index + 1,
		name: step.name,
		text: step.text,
	})),
});
