import { SITE_URL } from '@/consts';
import { imageObjectWithDimensions } from '@/lib/seo/brand-image-dimensions';
import { SITE_PERSON_ID } from '@/lib/seo/schema-person';
import type { BlogPostingSchemaInput } from '@/utils/structured-data';

export const PERSON_REF = { '@id': SITE_PERSON_ID } as const;

const SITE_ORGANIZATION_ID = `${SITE_URL}#organization`;

export type ArticleSchemaInput = BlogPostingSchemaInput;

/**
 * BlogPosting.image as ImageObject[].
 * Multi-aspect (1x1 / 4x3 / 16x9) requires distinct cropped assets; without them we emit
 * a documented single-aspect ImageObject fallback with width/height when known (F05).
 */
function buildArticleImageObjects(imageUrls: string[]): Record<string, unknown>[] {
	try {
		return imageUrls.map((url) => imageObjectWithDimensions(url));
	} catch (err) {
		console.error('[schema-article] buildArticleImageObjects failed', { err });
		return imageUrls.map((url) => ({ '@type': 'ImageObject', url }));
	}
}

export function buildArticleSchema(input: ArticleSchemaInput): Record<string, unknown> {
	const schema: Record<string, unknown> = {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		'@id': input.canonicalUrl,
		headline: input.headline,
		description: input.description,
		datePublished: input.datePublished,
		dateModified: input.dateModified,
		keywords: input.keywords,
		articleSection: input.articleSection,
		inLanguage: 'he-IL',
		url: input.canonicalUrl,
		image: buildArticleImageObjects(input.imageUrls),
		isAccessibleForFree: true,
		// Inline name+url required by Google Article author markup; @id retained (F04).
		author: {
			'@type': 'Person',
			'@id': SITE_PERSON_ID,
			name: input.authorName,
			url: input.authorUrl,
		},
		publisher: { '@id': SITE_ORGANIZATION_ID },
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': `${input.canonicalUrl}#webpage`,
			url: input.canonicalUrl,
		},
	};

	if (input.citations?.length) {
		schema.citation = input.citations.map((url) => ({
			'@type': 'CreativeWork',
			url,
		}));
	}

	return schema;
}
