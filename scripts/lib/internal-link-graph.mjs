import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog');
export const MAX_BLOG_LINKS = 4;
export const CONTEXTUAL_BLOG_MIN = 3;
export const CONTEXTUAL_BLOG_MAX = 8;
export const CONTEXTUAL_WORD_THRESHOLD = 800;

/** @type {RegExp[]} */
export const ENGLISH_SLUG_ANCHOR_PATTERNS = [
	/קראו על [a-z]/u,
	/מדריך [a-z][a-z\s-]{2,}/u,
	/המשך בנושא [a-z][a-z\s-]{2,}/u,
	/[a-z][a-z\s-]{4,}(?=\]\(\/blog\/)/u,
];

/** @type {RegExp[]} */
export const GARBAGE_ANCHOR_PATTERNS = [
	/-\d+$/,
	/guyavni[a-z0-9]+/iu,
	/000\s*ש"ח-\d/u,
	/חסרים בתיק שלך-\d+/u,
];

export function logGraph(step, message, extra) {
	if (extra !== undefined) console.error(`[internal-links-implementation] ${step}: ${message}`, extra);
	else console.error(`[internal-links-implementation] ${step}: ${message}`);
}

export function normalizePath(href) {
	if (!href || href.startsWith('http')) return href;
	const base = href.split('#')[0].split('?')[0];
	if (base === '/') return '/';
	return base.endsWith('/') ? base : `${base}/`;
}

export function slugFromBlogHref(href) {
	const m = href.match(/^\/blog\/([^/]+)\/$/);
	return m ? m[1] : null;
}

export function extractParagraphMarkdownLinks(body) {
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
				links.push({
					anchor: match[1].trim(),
					href: normalizePath(href.replace(/^https:\/\/avniguy\.co\.il/, '')),
					full: match[0],
				});
			}
		}
	}
	return links;
}

export function isEnglishSlugAnchor(anchor) {
	return ENGLISH_SLUG_ANCHOR_PATTERNS.some((re) => re.test(anchor));
}

export function isGarbageAnchor(anchor) {
	return GARBAGE_ANCHOR_PATTERNS.some((re) => re.test(anchor));
}

export function titleAnchorFragment(title) {
	let t = String(title)
		.replace(/^גיא אבני[^|]*\|\s*/u, '')
		.replace(/^גיא אבני\s*/u, '')
		.trim();
	const cut = t.split(/[|?:]/)[0].trim();
	t = cut || t;
	const words = t.split(/\s+/).filter(Boolean);
	if (words.length <= 8) return t;
	return words.slice(0, 8).join(' ');
}

export function loadAllPosts() {
	const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'));
	return files.map((f) => {
		const slug = f.replace(/\.mdx$/, '');
		const raw = fs.readFileSync(path.join(BLOG_DIR, f), 'utf8');
		const { data, content } = matter(raw);
		const paragraphLinks = extractParagraphMarkdownLinks(content);
		const internalLinks = Array.isArray(data.internalLinks) ? data.internalLinks.map(normalizePath) : [];
		const blogOut = paragraphLinks.filter((l) => l.href.startsWith('/blog/') && l.href !== '/blog/');
		return {
			slug,
			raw,
			data,
			content,
			title: data.title ?? '',
			mainKeyword: data.mainKeyword ?? '',
			category: data.category ?? '',
			tags: data.tags ?? [],
			paragraphLinks,
			internalLinks,
			blogOut,
			blogOutCount: blogOut.length,
		};
	});
}

export function buildLinkGraph(posts) {
	const inbound = new Map();
	for (const p of posts) inbound.set(p.slug, []);
	for (const p of posts) {
		for (const link of p.blogOut) {
			const target = slugFromBlogHref(link.href);
			if (target && inbound.has(target)) {
				inbound.get(target).push({ from: p.slug, anchor: link.anchor });
			}
		}
	}
	return { inbound, postsBySlug: new Map(posts.map((p) => [p.slug, p])) };
}

export function writeMdxWithSyncedLinks(raw, content) {
	const hrefs = [...new Set(extractParagraphMarkdownLinks(content).map((l) => l.href))];
	const parsed = matter(raw);
	parsed.data.internalLinks = hrefs;
	const fmLines = ['---'];
	const scalarKeys = ['title', 'description', 'metaTitle', 'metaDescription', 'mainKeyword', 'pubDate', 'category'];
	for (const key of scalarKeys) {
		if (parsed.data[key] !== undefined) {
			fmLines.push(`${key}: "${String(parsed.data[key]).replace(/"/g, '\\"')}"`);
		}
	}
	if (parsed.data.updatedDate) fmLines.push(`updatedDate: "${parsed.data.updatedDate}"`);
	if (parsed.data.materialChange) fmLines.push('materialChange: true');
	fmLines.push(`tags: [${(parsed.data.tags ?? []).map((t) => `"${t}"`).join(', ')}]`);
	fmLines.push(`internalLinks: [${hrefs.map((p) => `"${p}"`).join(', ')}]`);
	const imagesMatch = raw.match(/^images:\n[\s\S]*?(?=\n---)/m);
	if (imagesMatch) fmLines.push(imagesMatch[0].trimEnd());
	fmLines.push('---');
	return `${fmLines.join('\n')}\n\n${content}`;
}

export function countBlogLinksInBody(body) {
	return extractParagraphMarkdownLinks(body).filter((l) => l.href.startsWith('/blog/') && l.href !== '/blog/').length;
}

export function countContextualBlogLinks(paragraphLinks) {
	return paragraphLinks.filter((l) => l.href.startsWith('/blog/') && l.href !== '/blog/').length;
}

/**
 * Anchor should reflect target mainKeyword or title tokens (Hebrew descriptive).
 * @param {string} anchor
 * @param {{ mainKeyword?: string, title?: string }} target
 */
export function anchorMatchesTarget(anchor, target) {
	const a = String(anchor ?? '').trim();
	const kw = String(target?.mainKeyword ?? '').trim();
	if (kw.length >= 4 && a.includes(kw)) return true;
	const frag = titleAnchorFragment(target?.title ?? '');
	const words = frag.split(/\s+/).filter((w) => w.length >= 3);
	if (!words.length) return false;
	let hits = 0;
	for (const w of words) {
		if (a.includes(w)) hits += 1;
	}
	if (words.length === 1) return hits >= 1;
	return hits >= 2;
}

/**
 * Split MDX body into H2 sections (content between ## headings).
 * @param {string} body
 * @returns {{ heading: string, content: string }[]}
 */
export function splitBodyByH2Sections(body) {
	const sections = [];
	const lines = body.split('\n');
	let currentHeading = '';
	let buf = [];
	for (const line of lines) {
		if (/^##\s+/.test(line)) {
			if (buf.length || currentHeading) {
				sections.push({ heading: currentHeading, content: buf.join('\n') });
			}
			currentHeading = line.replace(/^##\s+/, '').trim();
			buf = [];
			continue;
		}
		buf.push(line);
	}
	sections.push({ heading: currentHeading, content: buf.join('\n') });
	return sections;
}

/**
 * @param {string} body
 * @returns {string[]} duplicate hrefs appearing twice in same H2 section
 */
export function findSectionDuplicateHrefs(body) {
	const dups = [];
	for (const { content } of splitBodyByH2Sections(body)) {
		const links = extractParagraphMarkdownLinks(content);
		const seen = new Set();
		for (const { href } of links) {
			if (seen.has(href)) {
				dups.push(href);
				break;
			}
			seen.add(href);
		}
	}
	return dups;
}

export { CATEGORY_PILLARS, pillarsForCategory, primaryPillarForCategory, isBrandMainKeyword } from './pillar-cluster-registry.mjs';
