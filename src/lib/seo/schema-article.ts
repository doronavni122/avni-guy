import { SITE_URL } from '@/consts';
import { SITE_PERSON_ID } from '@/lib/seo/schema-person';
import type { BlogPostingSchemaInput } from '@/utils/structured-data';

export const PERSON_REF = { '@id': SITE_PERSON_ID } as const;

const SITE_ORGANIZATION_ID = `${SITE_URL}#organization`;

export type ArticleSchemaInput = BlogPostingSchemaInput;

export function buildArticleSchema(input: ArticleSchemaInput): Record<string, unknown> {
	return {
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
		author: PERSON_REF,
		about: PERSON_REF,
		publisher: { '@id': SITE_ORGANIZATION_ID },
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': input.canonicalUrl,
			url: input.canonicalUrl,
		},
	};
}
