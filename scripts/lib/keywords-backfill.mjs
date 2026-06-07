/**
 * Post-research frontmatter backfill from study LSI. Log: [keywords-backfill]
 */
import matter from 'gray-matter';
import { getArticleTier } from './content-tiers.mjs';

const SECONDARY_MIN = 4;
const SECONDARY_MAX = 6;

function log(step, msg, extra) {
	if (extra !== undefined) console.error(`[keywords-backfill] step ${step}: ${msg}`, extra);
	else console.error(`[keywords-backfill] step ${step}: ${msg}`);
}

/**
 * @param {string} studyMarkdown
 * @returns {string[]}
 */
export function parseLsiTermsFromStudy(studyMarkdown) {
	const parsed = matter(studyMarkdown);
	const body = parsed.content ?? '';
	const m = body.match(/^## LSI and related terms\s*$/m);
	if (!m || m.index === undefined) return [];
	const start = m.index + m[0].length;
	const rest = body.slice(start);
	const nextH2 = rest.search(/^## /m);
	const section = nextH2 === -1 ? rest : rest.slice(0, nextH2);
	return section
		.split('\n')
		.map((line) => line.replace(/^-\s*/, '').trim())
		.filter((t) => t.length >= 2);
}

/**
 * @param {string} slug
 * @param {Record<string, unknown>} data
 * @param {string} studyMarkdown
 */
export function backfillKeywordsFromStudy(slug, data, studyMarkdown) {
	const studyFm = matter(studyMarkdown).data ?? {};
	const next = { ...data };
	let changed = false;

	const studyKw = String(studyFm.main_keyword ?? studyFm.mainKeyword ?? '').trim();
	if (studyKw && studyKw !== next.mainKeyword) {
		next.mainKeyword = studyKw;
		changed = true;
		log(1, 'sync mainKeyword from study', { slug, mainKeyword: studyKw });
	}

	const tier = getArticleTier(slug);
	const expectedType = tier === 'pillar' ? 'pillar' : 'cluster';
	if (!next.contentType || next.contentType !== expectedType) {
		next.contentType = expectedType;
		changed = true;
		log(2, 'set contentType from tier', { slug, contentType: expectedType, tier });
	}

	const existing = Array.isArray(next.secondaryKeywords) ? [...next.secondaryKeywords] : [];
	if (existing.length < SECONDARY_MIN) {
		const lsi = parseLsiTermsFromStudy(studyMarkdown).filter(
			(t) => t !== next.mainKeyword && !existing.includes(t),
		);
		const merged = [...existing, ...lsi].slice(0, SECONDARY_MAX);
		while (merged.length < SECONDARY_MIN && lsi.length) {
			const extra = lsi.find((t) => !merged.includes(t));
			if (!extra) break;
			merged.push(extra);
		}
		if (merged.length >= SECONDARY_MIN) {
			next.secondaryKeywords = merged.slice(0, SECONDARY_MAX);
			changed = true;
			log(3, 'backfilled secondaryKeywords', { slug, count: next.secondaryKeywords.length });
		}
	}

	return { data: next, changed };
}
