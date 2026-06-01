import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import {
	BANNED_ANCHOR_PATTERNS,
	FORBIDDEN_30_60_90_HEADING,
	FORBIDDEN_CLOSING_SNIPPET,
	FORBIDDEN_OPENING_SNIPPET,
	FORBIDDEN_TITLE_SUFFIX,
	STANDARD_NAV_LINK_PATHS,
	YMYL_EXTERNAL_ALLOWLIST_HOSTS,
	YMYL_SLUGS,
} from './content-forbidden-patterns.mjs';
import {
	ENGLISH_SLUG_ANCHOR_PATTERNS,
	GARBAGE_ANCHOR_PATTERNS,
	MAX_BLOG_LINKS,
} from './internal-link-graph.mjs';
import { getArticleTier, getMinWordsForTier, SLUG_CONTENT_CONTRACTS } from './content-tiers.mjs';
import { KEYWORD_STUB_SLUGS_SET } from './keyword-stub-slugs.mjs';
import { countWordsHe, SITE_KEYWORDS } from './seo-hero-rules.mjs';

const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog');
const MIN_PARAGRAPH_INTERNAL_LINKS = 10;
const META_TITLE_MIN = 50;
const META_TITLE_MAX = 60;
const META_DESC_MIN = 120;
const META_DESC_MAX = 165;
const NEAR_DUPLICATE_JACCARD_THRESHOLD = 0.42;
const BATCH_UPDATED_DATE = '2026-05-05';

function logErr(step, message, extra) {
	console.error(`[check-article-content] ERROR step=${step} ${message}`, extra ?? '');
}

function normalizePath(href) {
	if (!href || href.startsWith('http')) return href;
	const base = href.split('#')[0].split('?')[0];
	if (base === '/') return '/';
	return base.endsWith('/') ? base : `${base}/`;
}

function parseInternalLinksYaml(head) {
	const m = head.match(/^internalLinks:\s*\[([\s\S]*?)\]\s*$/m);
	if (!m) return [];
	return [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
}

function extractParagraphMarkdownLinks(body) {
	const links = [];
	const lines = body.split('\n');
	for (const line of lines) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('#')) continue;
		if (/^[-*+]\s/.test(trimmed)) continue;
		if (/^\d+\.\s/.test(trimmed)) continue;
		const re = /\[([^\]]+)\]\(([^)]+)\)/g;
		let match;
		while ((match = re.exec(line)) !== null) {
			const href = match[2].trim();
			if (href.startsWith('/') || href.startsWith('https://avniguy.co.il')) {
				links.push({ anchor: match[1].trim(), href: normalizePath(href.replace(/^https:\/\/avniguy\.co\.il/, '')) });
			}
		}
	}
	return links;
}

function bodyHasStandardNavBlock(body) {
	const count = STANDARD_NAV_LINK_PATHS.filter((p) => body.includes(`](${p})`) || body.includes(`](${p.replace(/\/$/, '')})`)).length;
	return count >= 6 && body.includes(FORBIDDEN_OPENING_SNIPPET);
}

function tokenizeForSimilarity(text) {
	return new Set(
		text
			.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
			.replace(/#+\s/g, ' ')
			.replace(/[^\p{L}\p{N}\s]/gu, ' ')
			.toLowerCase()
			.split(/\s+/)
			.filter((w) => w.length > 3),
	);
}

function jaccard(a, b) {
	if (a.size === 0 && b.size === 0) return 1;
	let inter = 0;
	for (const t of a) {
		if (b.has(t)) inter += 1;
	}
	const union = a.size + b.size - inter;
	return union === 0 ? 0 : inter / union;
}

function firstH2Text(body) {
	const m = body.match(/^##\s+(.+)$/m);
	return m ? m[1].trim() : '';
}

function auditPost(slug, raw, allBodies) {
	const errors = [];
	const { data, content: body } = matter(raw);
	const title = data.title ?? '';
	const metaTitle = data.metaTitle ?? '';
	const metaDescription = data.metaDescription ?? '';
	const mainKeyword = data.mainKeyword ?? '';
	const internalLinks = Array.isArray(data.internalLinks) ? data.internalLinks : parseInternalLinksYaml(raw.split('---')[1] ?? '');
	const tier = getArticleTier(slug);
	const minWords = getMinWordsForTier(tier, slug);

	if (title.includes(FORBIDDEN_TITLE_SUFFIX)) {
		errors.push(`${slug}: title contains forbidden shared suffix`);
	}
	if (body.includes(FORBIDDEN_OPENING_SNIPPET)) {
		errors.push(`${slug}: body contains forbidden shared opening paragraph`);
	}
	if (body.includes(FORBIDDEN_CLOSING_SNIPPET)) {
		errors.push(`${slug}: body contains forbidden shared closing checklist block`);
	}
	if (body.includes(FORBIDDEN_30_60_90_HEADING)) {
		errors.push(`${slug}: body contains forbidden 30/60/90 template section`);
	}
	if (/^#\s+/m.test(body)) {
		errors.push(`${slug}: MDX body must not contain H1 (# heading)`);
	}
	const h2 = firstH2Text(body);
	if (h2 && title && h2.replace(/\s+/g, ' ') === title.replace(/\s+/g, ' ')) {
		errors.push(`${slug}: first H2 duplicates layout title`);
	}
	if (metaTitle.length < META_TITLE_MIN || metaTitle.length > META_TITLE_MAX) {
		errors.push(`${slug}: metaTitle length ${metaTitle.length} outside ${META_TITLE_MIN}-${META_TITLE_MAX}`);
	}
	if (metaDescription.length < META_DESC_MIN || metaDescription.length > META_DESC_MAX) {
		errors.push(`${slug}: metaDescription length ${metaDescription.length} outside ${META_DESC_MIN}-${META_DESC_MAX}`);
	}
	if (!SITE_KEYWORDS.includes(mainKeyword)) {
		errors.push(`${slug}: mainKeyword not in SITE_KEYWORDS`);
	} else if (!body.includes(mainKeyword)) {
		errors.push(`${slug}: body missing mainKeyword phrase`);
	}
	const words = countWordsHe(body);
	if (words < minWords) {
		errors.push(`${slug}: body word count ${words} below tier minimum ${minWords}`);
	}
	const contract = SLUG_CONTENT_CONTRACTS[slug];
	if (contract?.requiredHeadingFragments) {
		const missing = contract.requiredHeadingFragments.filter((f) => !body.includes(f));
		if (missing.length) {
			errors.push(`${slug}: missing required topic fragments: ${missing.join(', ')}`);
		}
	}
	if (bodyHasStandardNavBlock(body)) {
		errors.push(`${slug}: body uses forbidden standard 7-nav link boilerplate block`);
	}
	const paragraphLinks = extractParagraphMarkdownLinks(body);
	if (paragraphLinks.length < MIN_PARAGRAPH_INTERNAL_LINKS) {
		errors.push(`${slug}: paragraph internal links ${paragraphLinks.length} below minimum ${MIN_PARAGRAPH_INTERNAL_LINKS}`);
	}
	const hrefs = paragraphLinks.map((l) => l.href);
	const anchors = paragraphLinks.map((l) => l.anchor);
	const dupHref = hrefs.find((h, i) => hrefs.indexOf(h) !== i);
	if (dupHref) errors.push(`${slug}: duplicate paragraph link target ${dupHref}`);
	const dupAnchor = anchors.find((a, i) => anchors.indexOf(a) !== i);
	if (dupAnchor) errors.push(`${slug}: duplicate paragraph link anchor "${dupAnchor}"`);
	const blogLinks = paragraphLinks.filter((l) => l.href.startsWith('/blog/') && l.href !== '/blog/');
	if (blogLinks.length > MAX_BLOG_LINKS) {
		errors.push(`${slug}: blog paragraph links ${blogLinks.length} exceed max ${MAX_BLOG_LINKS}`);
	}
	for (const { anchor } of paragraphLinks) {
		if (BANNED_ANCHOR_PATTERNS.some((re) => re.test(anchor))) {
			errors.push(`${slug}: banned generic anchor "${anchor}"`);
			break;
		}
		if (ENGLISH_SLUG_ANCHOR_PATTERNS.some((re) => re.test(anchor))) {
			errors.push(`${slug}: english-slug anchor pattern "${anchor}"`);
			break;
		}
		if (GARBAGE_ANCHOR_PATTERNS.some((re) => re.test(anchor))) {
			errors.push(`${slug}: garbage anchor pattern "${anchor}"`);
			break;
		}
	}
	for (const href of hrefs) {
		if (href.startsWith('/') && href !== '/' && !href.endsWith('/')) {
			errors.push(`${slug}: internal href missing trailing slash: ${href}`);
			break;
		}
	}
	const fmNormalized = internalLinks.map((p) => normalizePath(p));
	for (const fmPath of fmNormalized) {
		if (fmPath.startsWith('/') && !fmPath.startsWith('http') && !hrefs.includes(fmPath)) {
			const alt = fmPath.endsWith('/') ? fmPath.slice(0, -1) : `${fmPath}/`;
			if (!hrefs.includes(alt)) {
				errors.push(`${slug}: internalLinks path not in body paragraphs: ${fmPath}`);
				break;
			}
		}
	}
	if (internalLinks.length < MIN_PARAGRAPH_INTERNAL_LINKS) {
		errors.push(`${slug}: internalLinks frontmatter count ${internalLinks.length} below ${MIN_PARAGRAPH_INTERNAL_LINKS}`);
	}
	const externalHttps = (body.match(/https:\/\/[^\s)]+/g) ?? []).filter((u) => !u.includes('avniguy.co.il'));
	const needsExternal = contract?.requireExternalHttps || YMYL_SLUGS.has(slug);
	if (needsExternal && externalHttps.length < 2) {
		errors.push(`${slug}: YMYL/topic contract requires at least 2 external https links in body`);
	}
	if (needsExternal) {
		const allowed = externalHttps.filter((u) =>
			YMYL_EXTERNAL_ALLOWLIST_HOSTS.some((host) => u.includes(host)),
		);
		if (allowed.length < 1) {
			errors.push(`${slug}: external links should include allowlisted authority host`);
		}
	}
	if (data.updatedDate) {
		const d = String(data.updatedDate).slice(0, 10);
		if (d === BATCH_UPDATED_DATE) {
			errors.push(`${slug}: updatedDate batch stamp ${BATCH_UPDATED_DATE} without materialChange flag`);
		}
	}
	const tokens = tokenizeForSimilarity(body);
	for (const other of allBodies) {
		if (other.slug === slug) continue;
		// Auto-generated keyword stubs may share structure; enforce uniqueness vs legacy corpus only.
		if (KEYWORD_STUB_SLUGS_SET.has(slug) && KEYWORD_STUB_SLUGS_SET.has(other.slug)) continue;
		const score = jaccard(tokens, other.tokens);
		if (score >= NEAR_DUPLICATE_JACCARD_THRESHOLD) {
			errors.push(`${slug}: near-duplicate body vs ${other.slug} (jaccard ${score.toFixed(2)})`);
			break;
		}
	}
	return errors;
}

/**
 * @param {{ slugFilter?: string[] }} [options]
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function runArticleContentChecks(options = {}) {
	const errors = [];
	try {
		const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'));
		const raws = files.map((f) => {
			const slug = f.replace(/\.mdx$/, '');
			return { slug, raw: fs.readFileSync(path.join(BLOG_DIR, f), 'utf8') };
		});
		const filter = options.slugFilter;
		const selected = filter ? raws.filter((r) => filter.includes(r.slug)) : raws;
		const allBodies = raws.map(({ slug, raw }) => ({
			slug,
			tokens: tokenizeForSimilarity(matter(raw).content),
		}));
		for (const { slug, raw } of selected) {
			try {
				errors.push(...auditPost(slug, raw, allBodies));
			} catch (err) {
				logErr('auditPost', slug, err);
				errors.push(`${slug}: audit threw ${err.message}`);
			}
		}
	} catch (err) {
		logErr('runArticleContentChecks', 'fatal', err);
		errors.push(`fatal: ${err.message}`);
	}
	return { ok: errors.length === 0, errors };
}
