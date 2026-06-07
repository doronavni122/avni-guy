/**
 * Build link-plan spec from MDX + study (no hand ArticleSpec). Log: [pipeline-spec-from-slug]
 */
import matter from 'gray-matter';
import { YMYL_SLUGS } from './content-forbidden-patterns.mjs';
import { cleanupTitle } from './cleanup-mdx.mjs';
import { parseLsiTermsFromStudy } from './keywords-backfill.mjs';
import { pickRelatedBlogSlugs } from './pick-related-blog-slugs.mjs';

/**
 * @param {string} body
 * @param {string} heading
 */
export function extractStudySection(body, heading) {
	const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const re = new RegExp(`^## ${escaped}\\s*$`, 'm');
	const m = body.match(re);
	if (!m || m.index === undefined) return '';
	const start = m.index + m[0].length;
	const rest = body.slice(start);
	const next = rest.search(/^## /m);
	return (next === -1 ? rest : rest.slice(0, next)).trim();
}

/**
 * @param {string} outlineText
 */
function parseOutlineHeadings(outlineText) {
	const lines = outlineText.split('\n').map((l) => l.trim());
	const headings = [];
	for (const line of lines) {
		const m = line.match(/^\d+\.\s+(.+)$/);
		if (m) headings.push(m[1].trim());
	}
	return headings.length
		? headings
		: ['מסגרת רגולטורית', 'צעדים מעשיים', 'טעויות נפוצות', 'שיקולים לפני החלטה'];
}

/**
 * @param {string} slug
 * @param {Record<string, unknown>} data
 * @param {string} studyMarkdown
 */
export function buildPipelineSpec(slug, data, studyMarkdown) {
	const studyBody = matter(studyMarkdown).content ?? '';
	const title = cleanupTitle(String(data.title ?? slug));
	const mainKeyword = String(data.mainKeyword ?? '');
	const category = String(data.category ?? '');
	const tags = Array.isArray(data.tags) ? data.tags.map(String) : [];
	const lsi = parseLsiTermsFromStudy(studyMarkdown);
	const topicLexicon = lsi.length ? lsi : [mainKeyword, category, 'חקיקה עדכנית', 'תיעוד בכתב'];
	const outline = extractStudySection(studyBody, 'Section outline');
	const outlineHeadings = parseOutlineHeadings(outline);
	const firstH2 = outlineHeadings[0] ?? 'נקודות מפתח לפני החלטה';
	const sectionBlueprints = outlineHeadings.slice(1, 6).map((heading, i) => ({
		heading,
		focus: topicLexicon[i % topicLexicon.length] ?? heading,
	}));

	return {
		slug,
		title,
		mainKeyword,
		category,
		tags,
		relatedBlogSlugs: pickRelatedBlogSlugs(slug, category),
		firstH2: firstH2.replace(/^פתיחה ותשובה ישירה.*$/u, 'סיכום מעשי לפני החלטה'),
		topicLexicon,
		sectionBlueprints,
		ymyl: YMYL_SLUGS.has(slug),
		studyBody,
	};
}
