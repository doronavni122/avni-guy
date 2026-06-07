/**
 * MDX forbidden-copy cleanup. Log: [cleanup-mdx]
 */
import {
	FORBIDDEN_30_60_90_HEADING,
	FORBIDDEN_CLOSING_SNIPPET,
	FORBIDDEN_OPENING_SNIPPET,
	FORBIDDEN_TITLE_SUFFIX,
} from './content-forbidden-patterns.mjs';
import {
	fitMetaDescription,
	fitMetaTitle,
	normalizeBodyHrefs,
	stripForbiddenTitle,
} from './article-body-kit.mjs';

const FILLER_HEADING_RE = /^## פירוט נוסף/m;

/**
 * @param {string} title
 */
export function cleanupTitle(title) {
	return stripForbiddenTitle(String(title ?? ''));
}

/**
 * @param {Record<string, unknown>} data
 */
export function cleanupMdxFrontmatter(data) {
	const next = { ...data };
	if (next.title) next.title = cleanupTitle(String(next.title));
	if (next.metaTitle) next.metaTitle = fitMetaTitle(String(next.metaTitle));
	else if (next.title) next.metaTitle = fitMetaTitle(String(next.title));
	if (next.metaDescription) next.metaDescription = fitMetaDescription(String(next.metaDescription));
	else if (next.description) next.metaDescription = fitMetaDescription(String(next.description));
	if (next.description) next.description = String(next.description).trim();
	return next;
}

/**
 * @param {string} body
 */
export function cleanupMdxBody(body) {
	let b = String(body ?? '');
	b = b.replaceAll(FORBIDDEN_OPENING_SNIPPET, '');
	b = b.replaceAll(FORBIDDEN_CLOSING_SNIPPET, '');
	b = b.replaceAll(FORBIDDEN_30_60_90_HEADING, '');
	b = b.replaceAll(FORBIDDEN_TITLE_SUFFIX, '');
	const idx = b.search(FILLER_HEADING_RE);
	if (idx !== -1) b = b.slice(0, idx);
	b = b
		.split('\n')
		.filter((line) => !line.includes('כדי לבנות הקשר רחב'))
		.join('\n');
	b = normalizeBodyHrefs(b);
	b = b.replace(/\n{3,}/g, '\n\n').trim();
	return b ? `${b}\n` : '';
}
