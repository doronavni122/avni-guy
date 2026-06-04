import matter from 'gray-matter';
import fs from 'node:fs';
import path from 'node:path';
import { BANNED_EM_DASH } from './check-banned-characters.mjs';
import {
    YMYL_EXTERNAL_ALLOWLIST_HOSTS,
    YMYL_SLUGS,
} from './content-forbidden-patterns.mjs';
import {
    RESEARCH_DIR,
    RESEARCH_LIMITATIONS_DISCLAIMER_PATTERNS,
    RESEARCH_MIN_AUTHORITY_URLS,
    RESEARCH_MIN_DATED_FACTS,
    RESEARCH_MIN_LSI_TERMS,
    RESEARCH_MIN_WORDS,
    RESEARCH_NON_YMYL_FRAMEWORK_ALIASES,
    RESEARCH_REQUIRED_SECTIONS,
    RESEARCH_STATUTE_REF_PATTERN,
    RESEARCH_YMYL_FRAMEWORK_SECTION,
    RESEARCH_YMYL_MATRIX_HOSTS,
    resolveResearchMinDurationSecForStudy,
} from './research-study-rules.mjs';
import { countWordsHe } from './seo-hero-rules.mjs';

const HTTPS_URL_RE = /https:\/\/[^\s)\]|>"']+/gi;

function err(ruleId, message) {
	return { ruleId, message };
}

function parseIso8601(value) {
	if (value instanceof Date) {
		return Number.isNaN(value.getTime()) ? null : value;
	}
	if (!value || typeof value !== 'string') return null;
	const d = new Date(value);
	return Number.isNaN(d.getTime()) ? null : d;
}

function extractHeadings(body) {
	const headings = [];
	for (const m of body.matchAll(/^##\s+(.+)$/gm)) {
		headings.push(m[1].trim());
	}
	return headings;
}

function sectionBody(body, heading) {
	const re = new RegExp(`^##\\s+${escapeRegExp(heading)}\\s*$[\\s\\S]*?(?=^##\\s+|\\Z)`, 'm');
	const m = body.match(re);
	return m ? m[0] : '';
}

function escapeRegExp(s) {
	return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractHttpsUrls(text) {
	const urls = [];
	for (const m of text.matchAll(HTTPS_URL_RE)) {
		urls.push(m[0].replace(/[.,;]+$/, ''));
	}
	return urls;
}

function hostnameFromUrl(url) {
	try {
		return new URL(url).hostname.replace(/^www\./, '');
	} catch {
		return null;
	}
}

function hostMatchesAllowlist(hostname) {
	if (!hostname) return false;
	return YMYL_EXTERNAL_ALLOWLIST_HOSTS.some(
		(h) => hostname === h || hostname.endsWith(`.${h}`) || hostname.includes(h),
	);
}

function countDatedFacts(body) {
	const factsBlock = `${sectionBody(body, 'Facts')}\n${sectionBody(body, 'Statistics 2025-2026')}`;
	const lines = factsBlock.split('\n').filter((l) => /\b202[56]\b/.test(l));
	return new Set(lines.map((l) => l.trim())).size;
}

function countLsiTerms(body, mainKeyword) {
	const block = sectionBody(body, 'LSI and related terms');
	const terms = [];
	for (const line of block.split('\n')) {
		const trimmed = line.replace(/^[-*]\s*/, '').trim();
		if (!trimmed || trimmed.startsWith('#')) continue;
		if (mainKeyword && trimmed.includes(mainKeyword)) continue;
		if (trimmed.length >= 2) terms.push(trimmed.toLowerCase());
	}
	return new Set(terms).size;
}

function countMatrixGovRows(body) {
	const block = sectionBody(body, 'Authority source matrix');
	let count = 0;
	for (const url of extractHttpsUrls(block)) {
		const host = hostnameFromUrl(url);
		if (host && RESEARCH_YMYL_MATRIX_HOSTS.some((h) => host.includes(h))) count += 1;
	}
	return count;
}

function hasFrameworkSection(headings, isYmyl) {
	if (isYmyl) {
		return headings.includes(RESEARCH_YMYL_FRAMEWORK_SECTION);
	}
	return RESEARCH_NON_YMYL_FRAMEWORK_ALIASES.some((h) => headings.includes(h));
}

function stripBodyForWordCount(rawBody) {
	let body = rawBody.replace(/^#\s+Research:[^\n]*\n+/m, '');
	return body.trim();
}

/**
 * Validate research study markdown content.
 * @param {{ slug: string, content: string, minDurationSec?: number }} input
 * @returns {{ ok: boolean, errors: Array<{ ruleId: string, message: string }>, wordCount?: number }}
 */
export function checkResearchStudy(input) {
	const { slug, content } = input;
	const errors = [];
	const isYmyl = YMYL_SLUGS.has(slug);

	let parsed;
	try {
		parsed = matter(content);
	} catch (e) {
		return {
			ok: false,
			errors: [err('RESEARCH_PARSE', `${slug}: invalid frontmatter (${e.message})`)],
		};
	}

	const fm = parsed.data;
	const minDurationSec = input.minDurationSec ?? resolveResearchMinDurationSecForStudy(fm);
	const body = parsed.content;

	const started = parseIso8601(fm.research_started_at);
	const completed = parseIso8601(fm.research_completed_at);

	if (!started) {
		errors.push(err('RESEARCH_FRONTMATTER', `${slug}: research_started_at missing or invalid ISO8601`));
	}
	if (!completed) {
		errors.push(err('RESEARCH_FRONTMATTER', `${slug}: research_completed_at missing or invalid ISO8601`));
	}
	if (started && completed) {
		const elapsedSec = (completed.getTime() - started.getTime()) / 1000;
		if (elapsedSec < minDurationSec) {
			errors.push(
				err(
					'RESEARCH_DURATION_MIN',
					`${slug}: duration ${Math.floor(elapsedSec)}s < ${minDurationSec}s required`,
				),
			);
		}
	}

	if (fm.slug && fm.slug !== slug) {
		errors.push(err('RESEARCH_FRONTMATTER', `${slug}: frontmatter slug mismatch (${fm.slug})`));
	}

	const wordCount = countWordsHe(stripBodyForWordCount(body));
	if (wordCount < RESEARCH_MIN_WORDS) {
		errors.push(
			err('RESEARCH_WORDS_MIN', `${slug}: ${wordCount} words < ${RESEARCH_MIN_WORDS} required`),
		);
	}

	if (body.includes(BANNED_EM_DASH)) {
		errors.push(err('RESEARCH_BANNED_CHAR', `${slug}: contains banned em dash U+2014`));
	}

	const headings = extractHeadings(body);
	for (const section of RESEARCH_REQUIRED_SECTIONS) {
		if (!headings.includes(section)) {
			errors.push(err('RESEARCH_SECTION_MISSING', `${slug}: missing section "## ${section}"`));
		}
	}

	if (!hasFrameworkSection(headings, isYmyl)) {
		const expected = isYmyl
			? `"## ${RESEARCH_YMYL_FRAMEWORK_SECTION}"`
			: `one of ${RESEARCH_NON_YMYL_FRAMEWORK_ALIASES.map((h) => `"## ${h}"`).join(', ')}`;
		errors.push(err('RESEARCH_SECTION_MISSING', `${slug}: missing framework section (${expected})`));
	}

	const urls = extractHttpsUrls(body);
	const uniqueUrls = [...new Set(urls)];
	if (uniqueUrls.length < RESEARCH_MIN_AUTHORITY_URLS) {
		errors.push(
			err(
				'RESEARCH_URL_COUNT',
				`${slug}: ${uniqueUrls.length} https URLs < ${RESEARCH_MIN_AUTHORITY_URLS} required`,
			),
		);
	}

	for (const url of uniqueUrls) {
		const host = hostnameFromUrl(url);
		if (!hostMatchesAllowlist(host)) {
			errors.push(err('RESEARCH_URL_ALLOWLIST', `${slug}: URL host not allowlisted: ${url}`));
		}
	}

	const datedFacts = countDatedFacts(body);
	if (datedFacts < RESEARCH_MIN_DATED_FACTS) {
		errors.push(
			err(
				'RESEARCH_DATED_FACTS',
				`${slug}: ${datedFacts} dated facts (2025/2026) < ${RESEARCH_MIN_DATED_FACTS} required`,
			),
		);
	}

	const mainKeyword = fm.main_keyword ?? fm.mainKeyword ?? '';
	const lsiCount = countLsiTerms(body, mainKeyword);
	if (lsiCount < RESEARCH_MIN_LSI_TERMS) {
		errors.push(
			err(
				'RESEARCH_LSI_TERMS',
				`${slug}: ${lsiCount} LSI terms < ${RESEARCH_MIN_LSI_TERMS} required (beyond main keyword)`,
			),
		);
	}

	if (isYmyl) {
		const govRows = countMatrixGovRows(body);
		if (govRows < 2) {
			errors.push(
				err(
					'RESEARCH_YMYL_MATRIX',
					`${slug}: ${govRows} authority matrix rows with gov.il/justice.gov.il/israelbar.org.il < 2 required`,
				),
			);
		}

		const frameworkBlock = sectionBody(body, RESEARCH_YMYL_FRAMEWORK_SECTION);
		if (frameworkBlock && !RESEARCH_STATUTE_REF_PATTERN.test(frameworkBlock)) {
			errors.push(
				err(
					'RESEARCH_YMYL_STATUTE',
					`${slug}: framework section missing statute section reference (סעיף/sec./section)`,
				),
			);
		}

		const limitationsBlock = sectionBody(body, 'Limitations');
		const hasDisclaimer = RESEARCH_LIMITATIONS_DISCLAIMER_PATTERNS.some((re) =>
			re.test(limitationsBlock),
		);
		if (!hasDisclaimer) {
			errors.push(
				err(
					'RESEARCH_YMYL_DISCLAIMER',
					`${slug}: Limitations section must include not-legal-advice phrasing`,
				),
			);
		}
	}

	return { ok: errors.length === 0, errors, wordCount };
}

/**
 * @param {string} slug
 * @param {{ minDurationSec?: number }} [options]
 */
export function checkResearchStudyFile(slug, options = {}) {
	const fp = path.join(process.cwd(), RESEARCH_DIR, `${slug}.md`);
	if (!fs.existsSync(fp)) {
		return {
			ok: false,
			errors: [err('RESEARCH_FILE_MISSING', `${slug}: research file not found at ${RESEARCH_DIR}/${slug}.md`)],
		};
	}
	const content = fs.readFileSync(fp, 'utf8');
	return checkResearchStudy({ slug, content, ...options });
}

export function formatResearchErrors(errors) {
	return errors.map((e) => `[${e.ruleId}] ${e.message}`).join('\n');
}
