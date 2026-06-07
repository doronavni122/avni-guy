/**
 * Article pipeline quality contract (code SSOT). Log: [article-pipeline-contract]
 */
import matter from 'gray-matter';
import fs from 'node:fs';
import path from 'node:path';
import { checkResearchStudyFile } from './check-research-study.mjs';
import {
    BANNED_ANCHOR_PATTERNS,
    FLUFF_BODY_PATTERNS,
    FORBIDDEN_30_60_90_HEADING,
    FORBIDDEN_CLOSING_SNIPPET,
    FORBIDDEN_OPENING_SNIPPET,
    FORBIDDEN_TITLE_SUFFIX,
} from './content-forbidden-patterns.mjs';
import { anchorMatchesTarget, anchorWordCount, isAnchorTooLong, MAX_ANCHOR_WORDS } from './internal-link-graph.mjs';
import { parseLsiTermsFromStudy } from './keywords-backfill.mjs';
import { RESEARCH_DIR, RESEARCH_MIN_WORDS } from './research-study-rules.mjs';

export const PIPELINE_CONTRACT_VERSION = 1;
export { RESEARCH_MIN_WORDS };

export const FORBIDDEN_BODY_PATTERNS = [
	FORBIDDEN_OPENING_SNIPPET,
	FORBIDDEN_CLOSING_SNIPPET,
	FORBIDDEN_30_60_90_HEADING,
	/^## פירוט נוסף/m,
	...FLUFF_BODY_PATTERNS,
];

const FILLER_HEADING_RE = /^## פירוט נוסף/m;
const INTERNAL_LINK_RE = /\[([^\]]+)\]\((\/[^)]+)\)/g;

function logErr(step, msg, extra) {
	console.error(`[article-pipeline-contract] ERROR step ${step}: ${msg}`, extra ?? '');
}

/**
 * @param {Record<string, unknown>} _data
 */
export function requiresExaStudy(_data) {
	return true;
}

/**
 * @param {string} sectionName
 * @param {string} studyMarkdown
 */
function extractStudySection(studyMarkdown, sectionName) {
	const re = new RegExp(`^## ${sectionName}\\s*\\n([\\s\\S]*?)(?=^## |$)`, 'm');
	const m = studyMarkdown.match(re);
	return m ? m[1].trim() : '';
}

/**
 * @param {string} line
 */
function parseTermLine(line) {
	const t = line
		.replace(/^[-*+]\s*/, '')
		.replace(/^\d+\.\s*/, '')
		.replace(/^\([^)]+\):\s*/, '')
		.trim();
	return t;
}

const CONTACT_ANCHOR_ALLOW = ['יצירת קשר', 'תיאום פגישה', 'פנייה ישירה', 'ייעוץ מקצועי'];

/**
 * @param {string} studyMarkdown
 */
export function extractStudyTerms(studyMarkdown) {
	/** @type {string[]} */
	const terms = [...parseLsiTermsFromStudy(studyMarkdown)];
	const body = matter(studyMarkdown).content ?? studyMarkdown;
	for (const name of ['Facts', 'Section outline']) {
		const block = extractStudySection(body, name);
		for (const line of block.split('\n')) {
			const t = parseTermLine(line);
			if (t.length < 3) continue;
			if (t.length > 80) {
				terms.push(t.slice(0, 80).trim());
				continue;
			}
			terms.push(t);
		}
	}
	const seen = new Set();
	const out = [];
	for (const t of terms) {
		const key = t.replace(/\s+/g, ' ').trim();
		if (!key || seen.has(key)) continue;
		seen.add(key);
		out.push(key);
	}
	for (const c of CONTACT_ANCHOR_ALLOW) {
		if (!seen.has(c)) out.push(c);
	}
	if (!out.includes('גיא אבני')) out.push('גיא אבני');
	return out;
}

/**
 * @param {string} block
 */
export function isProseParagraph(block) {
	const trimmed = block.trim();
	if (!trimmed) return false;
	if (trimmed.startsWith('#')) return false;
	if (trimmed.startsWith('|')) return false;
	const lines = trimmed.split('\n').map((l) => l.trim()).filter(Boolean);
	if (!lines.length) return false;
	if (lines.every((l) => /^[-*+]\s/.test(l) || /^\d+\.\s/.test(l))) return false;
	if (lines.some((l) => l.startsWith('|'))) return false;
	return true;
}

/**
 * @param {string} paragraph
 */
export function paragraphMustHaveInternalLink(paragraph) {
	return isProseParagraph(paragraph);
}

/**
 * @param {string} paragraph
 */
export function paragraphHasInternalLink(paragraph) {
	return /\]\(\//.test(paragraph);
}

/**
 * @param {string} anchor
 * @param {string[]} studyTerms
 */
export function anchorMustBeStudyTerm(anchor, studyTerms, href = '') {
	const a = String(anchor ?? '').trim().replace(/\s+/g, ' ');
	if (!a) return false;
	if (href === '/contact/' && CONTACT_ANCHOR_ALLOW.some((c) => a.includes(c) || c.includes(a))) {
		return true;
	}
	for (const term of studyTerms) {
		const t = term.replace(/\s+/g, ' ').trim();
		if (t.length < 3) continue;
		if (a === t || a.includes(t) || t.includes(a)) return true;
		const aWords = a.split(/\s+/).filter((w) => w.length >= 3);
		const tWords = t.split(/\s+/).filter((w) => w.length >= 3);
		let hits = 0;
		for (const w of tWords) {
			if (aWords.some((aw) => aw.includes(w) || w.includes(aw))) hits += 1;
		}
		if (tWords.length >= 2 && hits >= 2) return true;
		if (tWords.length === 1 && hits >= 1) return true;
	}
	return false;
}

/**
 * @param {string} text
 * @param {string} mainKeyword
 */
export function titleMustIncludeMainKeyword(text, mainKeyword) {
	const t = String(text ?? '').trim();
	const kw = String(mainKeyword ?? '').trim();
	if (!kw) return true;
	if (t.includes(kw)) return true;
	return anchorMatchesTarget(t, { mainKeyword: kw, title: kw });
}

/**
 * @param {string} body
 * @param {string} mainKeyword
 */
export function ensureMainKeywordInHeadings(body, mainKeyword) {
	if (!mainKeyword) return body;
	return body
		.split('\n')
		.map((line) => {
			const m = line.match(/^(##+)\s+(.+)$/);
			if (!m) return line;
			const h2 = m[2].trim();
			if (titleMustIncludeMainKeyword(h2, mainKeyword)) return line;
			return `${m[1]} ${h2} - ${mainKeyword}`;
		})
		.join('\n');
}

/**
 * @param {Record<string, unknown>} data
 * @param {string} mainKeyword
 */
export function ensureMainKeywordInFrontmatter(data, mainKeyword, options = {}) {
	const next = { ...data };
	const kw = String(mainKeyword ?? '').trim();
	if (!kw) return next;
	const metaMax = options.metaMax ?? (process.env.CONTENT_STRICT === '1' ? 155 : 165);
	if (next.title && !titleMustIncludeMainKeyword(String(next.title), kw)) {
		next.title = `${kw}: ${String(next.title).replace(new RegExp(`^${kw}:\\s*`), '')}`;
	}
	if (next.metaTitle && !titleMustIncludeMainKeyword(String(next.metaTitle), kw)) {
		next.metaTitle = `${kw} | ${String(next.metaTitle)}`.slice(0, 60);
	}
	if (next.metaDescription && !String(next.metaDescription).includes(kw)) {
		let md = `${kw}: ${String(next.metaDescription)}`;
		if (md.length > metaMax) md = md.slice(0, metaMax);
		next.metaDescription = md;
	} else if (next.metaDescription) {
		let md = String(next.metaDescription).trim();
		if (md.length > metaMax) md = md.slice(0, metaMax);
		next.metaDescription = md;
	}
	return next;
}

/**
 * @param {string} body
 */
export function splitBodyParagraphs(body) {
	return body.split(/\n\n+/);
}

/**
 * @param {string} body
 */
function extractParagraphInternalLinks(body) {
	/** @type {{ anchor: string, href: string, paragraph: string }[]} */
	const links = [];
	for (const block of splitBodyParagraphs(body)) {
		if (!isProseParagraph(block)) continue;
		let m;
		const re = new RegExp(INTERNAL_LINK_RE.source, 'g');
		while ((m = re.exec(block)) !== null) {
			links.push({ anchor: m[1].trim(), href: m[2].trim(), paragraph: block });
		}
	}
	return links;
}

/**
 * @param {string} body
 */
function listH2Headings(body) {
	/** @type {string[]} */
	const headings = [];
	for (const line of body.split('\n')) {
		const m = line.match(/^##\s+(.+)$/);
		if (m) headings.push(m[1].trim());
	}
	return headings;
}

/**
 * @param {{ slug?: string, studyMarkdown?: string, mdxRaw?: string, data?: Record<string, unknown>, body?: string }} opts
 */
export function runPipelineContractChecks(opts) {
	/** @type {string[]} */
	const errors = [];
	const slug = opts.slug ?? '';
	let studyMarkdown = opts.studyMarkdown ?? '';
	let data = opts.data ?? {};
	let body = opts.body ?? '';

	if (opts.mdxRaw) {
		const parsed = matter(opts.mdxRaw);
		data = parsed.data;
		body = parsed.content;
	}

	if (slug && !studyMarkdown) {
		const fp = path.join(process.cwd(), RESEARCH_DIR, `${slug}.md`);
		if (!fs.existsSync(fp)) {
			errors.push(`${slug}: missing study file content-research/${slug}.md`);
		} else {
			studyMarkdown = fs.readFileSync(fp, 'utf8');
		}
	}
	const mainKeyword = String(data.mainKeyword ?? '').trim();
	const title = String(data.title ?? '').trim();
	const metaTitle = String(data.metaTitle ?? '').trim();
	const metaDescription = String(data.metaDescription ?? '').trim();

	if (title.includes(FORBIDDEN_TITLE_SUFFIX)) {
		errors.push(`${slug}: title contains forbidden suffix`);
	}
	for (const pat of FORBIDDEN_BODY_PATTERNS) {
		if (typeof pat === 'string' && body.includes(pat)) {
			errors.push(`${slug}: forbidden body pattern`);
			break;
		}
		if (pat instanceof RegExp && pat.test(body)) {
			errors.push(`${slug}: forbidden body pattern ${pat.source}`);
			break;
		}
	}
	if (FILLER_HEADING_RE.test(body)) {
		errors.push(`${slug}: body contains filler heading ## פירוט נוסף`);
	}

	if (mainKeyword) {
		if (!titleMustIncludeMainKeyword(title, mainKeyword)) {
			errors.push(`${slug}: title missing mainKeyword variant`);
		}
		if (metaTitle && !titleMustIncludeMainKeyword(metaTitle, mainKeyword)) {
			errors.push(`${slug}: metaTitle missing mainKeyword variant`);
		}
		if (metaDescription && !metaDescription.includes(mainKeyword) && !titleMustIncludeMainKeyword(metaDescription, mainKeyword)) {
			errors.push(`${slug}: metaDescription missing mainKeyword`);
		}
		for (const h2 of listH2Headings(body)) {
			if (h2 === 'שאלות נפוצות' || h2 === 'מקורות רשמיים') continue;
			if (!titleMustIncludeMainKeyword(h2, mainKeyword)) {
				errors.push(`${slug}: H2 "${h2}" missing mainKeyword variant`);
				break;
			}
		}
	}

	const studyTerms = studyMarkdown ? extractStudyTerms(studyMarkdown) : [];
	if (studyMarkdown && studyTerms.length < 4) {
		errors.push(`${slug}: study has fewer than 4 extractable anchor terms`);
	}

	let proseIdx = 0;
	for (const block of splitBodyParagraphs(body)) {
		if (!paragraphMustHaveInternalLink(block)) continue;
		proseIdx += 1;
		if (!paragraphHasInternalLink(block)) {
			errors.push(`${slug}: prose paragraph #${proseIdx} missing internal link`);
			if (errors.length > 12) break;
		}
	}

	if (studyTerms.length) {
		const links = extractParagraphInternalLinks(body);
		for (const link of links) {
			if (isAnchorTooLong(link.anchor)) {
				errors.push(
					`${slug}: anchor exceeds ${MAX_ANCHOR_WORDS} words (${anchorWordCount(link.anchor)}): "${link.anchor}"`,
				);
				break;
			}
			if (BANNED_ANCHOR_PATTERNS.some((re) => re.test(link.anchor))) {
				errors.push(`${slug}: banned anchor "${link.anchor}"`);
				break;
			}
			if (/לעיון נוסף/.test(link.anchor) || /לעיון נוסף/.test(link.paragraph)) {
				errors.push(`${slug}: generic לעיון נוסף link boilerplate`);
				break;
			}
			if (!anchorMustBeStudyTerm(link.anchor, studyTerms, link.href)) {
				errors.push(`${slug}: anchor "${link.anchor}" not from study terms`);
				break;
			}
			if (link.href.startsWith('/') && link.href !== '/' && !link.href.endsWith('/')) {
				errors.push(`${slug}: href missing trailing slash: ${link.href}`);
				break;
			}
		}
	}

	if (slug && studyMarkdown && process.env.PIPELINE_CONTRACT_STRICT_RESEARCH !== '0') {
		const fp = path.join(process.cwd(), RESEARCH_DIR, `${slug}.md`);
		if (fs.existsSync(fp)) {
			const studyCheck = checkResearchStudyFile(slug);
			if (!studyCheck.ok) {
				errors.push(`${slug}: study audit failed: ${studyCheck.errors.slice(0, 3).join('; ')}`);
			}
		}
	}

	if (errors.length) {
		logErr('audit', 'contract failed', { slug, count: errors.length });
	}
	return { ok: errors.length === 0, errors };
}
