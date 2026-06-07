/**
 * Per-paragraph study-term internal links. Log: [study-anchor-linker]
 */
import {
    extractStudyTerms,
    isProseParagraph,
} from './article-pipeline-contract.mjs';
import {
    buildSiteLinkTargetIndex,
    resolveHrefForStudyTerm,
    trimAnchorWords,
} from './site-link-target-index.mjs';

function log(step, msg, extra) {
	if (extra !== undefined) console.error(`[study-anchor-linker] step ${step}: ${msg}`, extra);
	else console.error(`[study-anchor-linker] step ${step}: ${msg}`);
}

function logErr(msg, extra) {
	console.error(`[study-anchor-linker] ERROR ${msg}`, extra ?? '');
}

/**
 * @param {string} paragraph
 * @param {string} term
 * @param {string} href
 */
function injectTermLink(paragraph, term, href) {
	const anchor = trimAnchorWords(term);
	const link = `[${anchor}](${href})`;
	if (paragraph.includes(link)) return paragraph;
	if (/\]\(\//.test(paragraph)) return paragraph;
	const trimmed = paragraph.trimEnd();
	const sep = trimmed.endsWith('.') || trimmed.endsWith('?') ? ' ' : '. ';
	return `${trimmed}${sep}ראו ${link}.`;
}

/**
 * @param {string} paragraph
 * @param {string[]} studyTerms
 */
function scoreTermsForParagraph(paragraph, studyTerms) {
	const plain = paragraph.replace(/\[([^\]]+)\]\([^)]+\)/g, ' ');
	return studyTerms
		.map((term) => {
			let score = 0;
			if (plain.includes(term)) score += 10;
			const words = term.split(/\s+/).filter((w) => w.length >= 3);
			for (const w of words) {
				if (plain.includes(w)) score += 2;
			}
			return { term, score };
		})
		.filter((x) => x.score > 0)
		.sort((a, b) => b.score - a.score);
}

/**
 * @param {string} body
 * @param {string} studyMarkdown
 * @param {{ slug?: string, category?: string, tags?: string[], mainKeyword?: string }} articleContext
 */
export function injectStudyAnchorsPerParagraph(body, studyMarkdown, articleContext = {}) {
	const studyTerms = extractStudyTerms(studyMarkdown);
	if (!studyTerms.length) {
		logErr('no study terms', { slug: articleContext.slug });
		return body;
	}

	const index = buildSiteLinkTargetIndex(articleContext.slug ?? '');
	const blocks = body.split(/\n\n+/);
	const usedHrefs = new Set();
	let termCursor = 0;

	const takeTerm = (paragraph, prefer) => {
		if (prefer.length) return prefer[0].term;
		const term = studyTerms[termCursor % studyTerms.length];
		termCursor += 1;
		return term;
	};

	const out = blocks.map((block) => {
		if (!isProseParagraph(block)) return block;
		if (/\]\(\//.test(block)) return block;

		const ranked = scoreTermsForParagraph(block, studyTerms);
		let term = takeTerm(block, ranked);
		let resolved = resolveHrefForStudyTerm(term, articleContext, index);

		let attempts = 0;
		while (usedHrefs.has(resolved.href) && attempts < studyTerms.length) {
			term = studyTerms[(termCursor + attempts) % studyTerms.length];
			resolved = resolveHrefForStudyTerm(term, articleContext, index);
			attempts += 1;
		}
		usedHrefs.add(resolved.href);
		termCursor += 1;
		return injectTermLink(block, resolved.anchor, resolved.href);
	});

	let result = out.join('\n\n');

	if (!result.includes('](/') && !result.includes(']( /')) {
		const brand = resolveHrefForStudyTerm('גיא אבני', articleContext, index);
		const parts = result.split(/\n\n+/);
		for (let i = 0; i < parts.length; i++) {
			if (isProseParagraph(parts[i])) {
				parts[i] = injectTermLink(parts[i], 'גיא אבני', brand.href === '/blog/' ? '/' : brand.href);
				break;
			}
		}
		result = parts.join('\n\n');
	}

	const proseCount = blocks.filter(isProseParagraph).length;
	const linked = result.split(/\n\n+/).filter((b) => isProseParagraph(b) && /\]\(\//.test(b)).length;
	log(1, 'injected study anchors', { prose: proseCount, linked, slug: articleContext.slug });
	return result;
}

/**
 * @param {string} body
 */
export function collectInternalHrefsFromBody(body) {
	/** @type {string[]} */
	const hrefs = [];
	const re = /\[[^\]]+\]\((\/[^)]+)\)/g;
	let m;
	while ((m = re.exec(body)) !== null) {
		let href = m[1].trim();
		if (href !== '/' && !href.endsWith('/')) href = `${href}/`;
		hrefs.push(href);
	}
	return [...new Set(hrefs)];
}
