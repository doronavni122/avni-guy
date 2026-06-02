import { SITE_CONTACT_EMAIL, SITE_TITLE, SITE_URL } from '../consts';

/** Stable JSON-LD @id for the law firm entity (LegalService). */
export const SITE_ORGANIZATION_ID = `${SITE_URL}#organization`;

/** Stable JSON-LD @id for the site (WebSite). */
export const SITE_WEBSITE_ID = `${SITE_URL}#website`;

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

export const buildOrganizationSchema = () => ({
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
		name: 'גיא אבני',
		url: absoluteUrl('/about/'),
	},
});

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

export const buildBlogPostingSchema = (input: BlogPostingSchemaInput) => ({
	'@context': 'https://schema.org',
	'@type': 'BlogPosting',
	headline: input.headline,
	description: input.description,
	datePublished: input.datePublished,
	dateModified: input.dateModified,
	keywords: input.keywords,
	articleSection: input.articleSection,
	inLanguage: 'he',
	url: input.canonicalUrl,
	image: input.imageUrls,
	isAccessibleForFree: true,
	author: {
		'@type': 'Person',
		name: input.authorName,
		url: input.authorUrl,
	},
	publisher: { '@id': SITE_ORGANIZATION_ID },
	mainEntityOfPage: {
		'@type': 'WebPage',
		'@id': input.canonicalUrl,
		url: input.canonicalUrl,
	},
});

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
