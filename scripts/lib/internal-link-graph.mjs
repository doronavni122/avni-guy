import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import {
	CATEGORY_PILLARS,
	isBrandMainKeyword,
	isGlobalPillarSlug,
	pillarsForCategory,
	primaryPillarForCategory,
} from './pillar-cluster-registry.mjs';

export const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog');

/** 2026 density SSOT: 3-7 paragraph internal links per 1000 Hebrew words. */
export const LINK_DENSITY_MIN_PER_1000 = 3;
export const LINK_DENSITY_MAX_PER_1000 = 7;
export const LINK_SPACING_MIN_WORDS = 200;
export const LINK_SPACING_MAX_WORDS = 350;
export const MAX_ANCHOR_WORDS = 7;
export const CONTEXTUAL_WORD_THRESHOLD = 800;

/**
 * Silo cap on contextual `/blog/*` links (excluding `/blog/` hub).
 * Stricter than density max on long articles (1000w allows 7; silo stays 4 until Scope 08 remediate).
 * `remediate-internal-links-batch.mjs` and `links:audit` enforce this cap; density bounds apply to totals.
 */
export const MAX_BLOG_LINKS = 4;

/** @deprecated Use computeBlogLinkDensityBounds(); kept for import compatibility. */
export const CONTEXTUAL_BLOG_MIN = LINK_DENSITY_MIN_PER_1000;
/** @deprecated Use computeBlogLinkDensityBounds(); aligned to 7/1000 max (was 8). */
export const CONTEXTUAL_BLOG_MAX = LINK_DENSITY_MAX_PER_1000;

/**
 * @param {number} wordCount
 * @returns {{ min: number, max: number }}
 */
export function computeLinkDensityBounds(wordCount) {
	const words = Math.max(0, Number(wordCount) || 0);
	if (words === 0) return { min: 0, max: 0 };
	const densityMin = Math.ceil((LINK_DENSITY_MIN_PER_1000 * words) / 1000);
	const densityMax = Math.floor((LINK_DENSITY_MAX_PER_1000 * words) / 1000);
	const spacingMinLinks = Math.ceil(words / LINK_SPACING_MAX_WORDS);
	const spacingMaxLinks = Math.floor(words / LINK_SPACING_MIN_WORDS);
	const max = Math.max(0, Math.min(densityMax, spacingMaxLinks));
	const min = Math.min(Math.max(densityMin, spacingMinLinks), max || densityMin);
	return { min: words === 0 ? 0 : min, max: Math.max(min, max) };
}

/**
 * Contextual `/blog/*` density with silo cap reconciliation.
 * @param {number} wordCount
 * @returns {{ min: number, max: number, densityMax: number, siloCap: number }}
 */
export function computeBlogLinkDensityBounds(wordCount) {
	const { min: densityMin, max: densityMax } = computeLinkDensityBounds(wordCount);
	const siloCap = MAX_BLOG_LINKS;
	const max = Math.min(densityMax, siloCap);
	if (!wordsAboveContextualThreshold(wordCount)) {
		return { min: 0, max, densityMax, siloCap };
	}
	const min = Math.min(densityMin, max);
	return { min, max, densityMax, siloCap };
}

/**
 * @param {number} wordCount
 */
export function wordsAboveContextualThreshold(wordCount) {
	return (Number(wordCount) || 0) > CONTEXTUAL_WORD_THRESHOLD;
}

/**
 * Target ~1 internal paragraph link per 200-350 words.
 * @param {number} wordCount
 * @param {number} linkCount
 * @returns {{ ok: boolean, wordsPerLink: number | null, minWords: number, maxWords: number }}
 */
export function auditLinkSpacing(wordCount, linkCount) {
	const words = Math.max(0, Number(wordCount) || 0);
	const count = Math.max(0, Number(linkCount) || 0);
	if (count === 0) {
		return { ok: words === 0, wordsPerLink: null, minWords: LINK_SPACING_MIN_WORDS, maxWords: LINK_SPACING_MAX_WORDS };
	}
	const wordsPerLink = words / count;
	const ok = wordsPerLink >= LINK_SPACING_MIN_WORDS && wordsPerLink <= LINK_SPACING_MAX_WORDS;
	return { ok, wordsPerLink, minWords: LINK_SPACING_MIN_WORDS, maxWords: LINK_SPACING_MAX_WORDS };
}

/**
 * @param {string} anchor
 * @returns {number}
 */
export function anchorWordCount(anchor) {
	return String(anchor ?? '')
		.trim()
		.split(/\s+/)
		.filter(Boolean).length;
}

/**
 * @param {string} anchor
 * @param {number} [maxWords]
 */
export function isAnchorTooLong(anchor, maxWords = MAX_ANCHOR_WORDS) {
	return anchorWordCount(anchor) > maxWords;
}

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
	if (words.length <= MAX_ANCHOR_WORDS) return t;
	return words.slice(0, MAX_ANCHOR_WORDS).join(' ');
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

/** Static routes mirrored from `src/app/sitemap.ts` + main nav. */
export const STATIC_CRAWL_ROUTES = [
	'/',
	'/about/',
	'/services/',
	'/contact/',
	'/blog/',
	'/categories/',
	'/tags/',
];

export const NAV_ROUTES_FROM_HOME = STATIC_CRAWL_ROUTES.filter((p) => p !== '/');

/**
 * Inbound graph SSOT: blog paragraph `/blog/*` links only.
 * Set `expandedInbound: true` (env `LINK_INBOUND_EXPANDED=1`) to count any paragraph link to a blog slug.
 * @param {ReturnType<typeof loadAllPosts>} posts
 * @param {{ expandedInbound?: boolean }} [options]
 */
export function buildLinkGraph(posts, options = {}) {
	const { expandedInbound = false } = options;
	const inbound = new Map();
	for (const p of posts) inbound.set(p.slug, []);
	for (const p of posts) {
		const outbound = expandedInbound ? p.paragraphLinks : p.blogOut;
		for (const link of outbound) {
			const target = slugFromBlogHref(link.href);
			if (target && inbound.has(target)) {
				inbound.get(target).push({ from: p.slug, anchor: link.anchor, href: link.href });
			}
		}
	}
	return { inbound, postsBySlug: new Map(posts.map((p) => [p.slug, p])), mode: expandedInbound ? 'expanded' : 'blog-only' };
}

/**
 * @param {{ slug: string, category: string }} post
 */
export function isCategoryClusterPost(post) {
	if (isGlobalPillarSlug(post.slug)) return false;
	const pillars = pillarsForCategory(post.category);
	if (!pillars.length) return false;
	return !pillars.includes(post.slug);
}

/**
 * Cluster posts in the same category with zero outbound lateral cluster links.
 * @param {ReturnType<typeof loadAllPosts>} posts
 */
export function auditLateralClusterLinks(posts) {
	const byCategory = new Map();
	for (const p of posts) {
		if (!isCategoryClusterPost(p)) continue;
		if (!byCategory.has(p.category)) byCategory.set(p.category, []);
		byCategory.get(p.category).push(p);
	}
	const missingLateral = [];
	for (const [, clusterPosts] of byCategory) {
		const clusterSlugs = new Set(clusterPosts.map((p) => p.slug));
		for (const p of clusterPosts) {
			const lateralOut = p.paragraphLinks.filter((l) => {
				const target = slugFromBlogHref(l.href);
				return target && target !== p.slug && clusterSlugs.has(target);
			});
			if (!lateralOut.length) {
				missingLateral.push(p.slug);
			}
		}
	}
	return { missingLateral, clusterCount: [...byCategory.values()].reduce((n, arr) => n + arr.length, 0) };
}

/**
 * @param {Map<string, { from: string, anchor: string }[]>} inbound
 * @param {ReturnType<typeof loadAllPosts>} posts
 */
export function computeDonorDiversityMetrics(inbound, posts) {
	const perTarget = posts.map((p) => {
		const edges = inbound.get(p.slug) ?? [];
		const uniqueDonors = new Set(edges.map((e) => e.from));
		return { slug: p.slug, donorCount: uniqueDonors.size };
	});
	const outboundBlog = new Map();
	for (const p of posts) {
		outboundBlog.set(
			p.slug,
			p.blogOut.filter((l) => slugFromBlogHref(l.href)).length,
		);
	}
	const singleDonor = perTarget.filter((t) => t.donorCount === 1);
	const zeroDonor = perTarget.filter((t) => t.donorCount === 0);
	const avgDonors =
		perTarget.length === 0 ? 0 : perTarget.reduce((s, t) => s + t.donorCount, 0) / perTarget.length;
	const topDonors = [...outboundBlog.entries()]
		.filter(([, n]) => n > 0)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 8)
		.map(([slug, count]) => ({ slug, outboundBlogLinks: count }));
	return {
		avgDonors: Number(avgDonors.toFixed(2)),
		singleDonorTargets: singleDonor.length,
		zeroDonorTargets: zeroDonor.length,
		topDonors,
	};
}

/** @type {RegExp[]} */
export const BRAND_ANCHOR_PATTERNS = [/גיא\s*אבני/u, /אבני\s*גיא/u, /עורך\s*דין\s*גיא/u];

/**
 * @param {string} anchor
 * @param {{ mainKeyword?: string, title?: string } | undefined} target
 * @returns {'exact' | 'partial' | 'branded' | 'natural'}
 */
export function classifyAnchorHebrew(anchor, target) {
	const a = String(anchor ?? '').trim();
	if (BRAND_ANCHOR_PATTERNS.some((re) => re.test(a)) || isBrandMainKeyword(a)) return 'branded';
	const kw = String(target?.mainKeyword ?? '').trim();
	if (kw.length >= 4 && a === kw) return 'exact';
	if (kw.length >= 4 && a.includes(kw) && anchorWordCount(a) <= 4) return 'exact';
	if (target && anchorMatchesTarget(a, target)) return 'partial';
	return 'natural';
}

/**
 * Same anchor text pointing to multiple internal URLs (site-wide).
 * @param {ReturnType<typeof loadAllPosts>} posts
 */
export function auditSiteWideAnchorCollisions(posts) {
	/** @type {Map<string, Set<string>>} */
	const byAnchor = new Map();
	for (const p of posts) {
		for (const link of p.paragraphLinks) {
			const key = String(link.anchor).trim().replace(/\s+/g, ' ');
			if (!key) continue;
			if (!byAnchor.has(key)) byAnchor.set(key, new Set());
			byAnchor.get(key).add(link.href);
		}
	}
	const collisions = [];
	for (const [anchor, hrefs] of byAnchor) {
		if (hrefs.size > 1) {
			collisions.push({ anchor, hrefs: [...hrefs].sort() });
		}
	}
	collisions.sort((a, b) => b.hrefs.length - a.hrefs.length);
	return collisions;
}

/**
 * @param {ReturnType<typeof loadAllPosts>} posts
 * @param {Map<string, ReturnType<typeof loadAllPosts>[number]>} postsBySlug
 */
export function auditAnchorTypeDistribution(posts, postsBySlug) {
	/** @type {Record<'exact' | 'partial' | 'branded' | 'natural', number>} */
	const counts = { exact: 0, partial: 0, branded: 0, natural: 0 };
	let blogLinks = 0;
	for (const p of posts) {
		for (const link of p.paragraphLinks) {
			const targetSlug = slugFromBlogHref(link.href);
			if (!targetSlug) continue;
			blogLinks += 1;
			const target = postsBySlug.get(targetSlug);
			const kind = classifyAnchorHebrew(link.anchor, target);
			counts[kind] += 1;
		}
	}
	const exactRatio = blogLinks === 0 ? 0 : counts.exact / blogLinks;
	return { counts, blogLinks, exactMatchRatio: Number(exactRatio.toFixed(3)) };
}

/**
 * Links in headings, lists, or images (not paragraph quota links).
 * @param {string} body
 */
export function extractNonParagraphMarkdownLinks(body) {
	const links = [];
	const lines = body.split('\n');
	for (const line of lines) {
		const trimmed = line.trim();
		if (!trimmed) continue;
		const isParagraph =
			!trimmed.startsWith('#') && !/^[-*+]\s/.test(trimmed) && !/^\d+\.\s/.test(trimmed) && !trimmed.startsWith('!');
		if (isParagraph) continue;
		const patterns = [
			/\[([^\]]+)\]\(([^)]+)\)/g,
			/!\[([^\]]*)\]\(([^)]+)\)/g,
		];
		for (const re of patterns) {
			let match;
			while ((match = re.exec(line)) !== null) {
				const href = match[2].trim();
				if (href.startsWith('/') || href.startsWith('https://avniguy.co.il')) {
					links.push({
						anchor: (match[1] ?? '').trim(),
						href: normalizePath(href.replace(/^https:\/\/avniguy\.co\.il/, '')),
						context: trimmed.startsWith('#') ? 'heading' : trimmed.startsWith('!') ? 'image' : 'list',
					});
				}
			}
		}
	}
	return links;
}

/**
 * Internal links with nofollow / rel attributes in MDX (should be crawlable).
 * @param {string} body
 * @param {string} slug
 */
export function auditInternalNofollowLinks(body, slug) {
	const issues = [];
	const lines = body.split('\n');
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		if (!/nofollow|rel\s*=/iu.test(line)) continue;
		if (/<a\s[^>]*href\s*=\s*["'](\/[^"']+)["'][^>]*rel\s*=\s*["'][^"']*nofollow/iu.test(line)) {
			issues.push({ slug, line: i + 1, kind: 'html-nofollow', snippet: line.trim().slice(0, 120) });
		}
		if (/\]\(\/[^)]+\)\{[^}]*nofollow/iu.test(line)) {
			issues.push({ slug, line: i + 1, kind: 'md-nofollow', snippet: line.trim().slice(0, 120) });
		}
	}
	return issues;
}

/**
 * @param {ReturnType<typeof loadAllPosts>} posts
 */
export function collectCrawlTargets(posts) {
	const hrefs = new Set(STATIC_CRAWL_ROUTES);
	for (const p of posts) {
		for (const link of p.paragraphLinks) {
			if (link.href.startsWith('/')) hrefs.add(link.href);
		}
		hrefs.add(`/blog/${p.slug}/`);
	}
	for (const cat of new Set(posts.map((p) => p.category).filter(Boolean))) {
		hrefs.add(`/categories/${cat}/`);
	}
	for (const p of posts) {
		for (const tag of p.tags ?? []) {
			hrefs.add(`/tags/${tag}/`);
		}
	}
	return [...hrefs].sort();
}

/**
 * @param {string} href
 */
export function hasCanonicalTrailingSlash(href) {
	if (!href || href.startsWith('http') || href.startsWith('#')) return true;
	const base = href.split('#')[0].split('?')[0];
	if (base === '/') return true;
	return base.endsWith('/');
}

/**
 * Load category hub pillar hrefs from `category-hub-intros.ts` for click-depth edges.
 */
export function loadCategoryHubEdges() {
	const introPath = path.join(process.cwd(), 'src', 'lib', 'seo', 'category-hub-intros.ts');
	if (!fs.existsSync(introPath)) {
		logGraph('crawl', 'category-hub-intros.ts missing', introPath);
		return [];
	}
	const raw = fs.readFileSync(introPath, 'utf8');
	const hrefs = [];
	for (const m of raw.matchAll(/href:\s*'([^']+)'/g)) {
		hrefs.push(normalizePath(m[1]));
	}
	return hrefs;
}

/**
 * BFS click depth from `/`. Template edges: nav, blog index -> all posts, category hubs -> pillars.
 * @param {ReturnType<typeof loadAllPosts>} posts
 * @param {number} [maxDepth]
 */
export function computeBlogClickDepths(posts, maxDepth = 3) {
	/** @type {Map<string, Set<string>>} */
	const adj = new Map();
	const addEdge = (from, to) => {
		if (!from || !to || !to.startsWith('/')) return;
		const f = normalizePath(from);
		const t = normalizePath(to);
		if (!adj.has(f)) adj.set(f, new Set());
		adj.get(f).add(t);
	};

	for (const route of NAV_ROUTES_FROM_HOME) addEdge('/', route);
	for (const p of posts) addEdge('/blog/', `/blog/${p.slug}/`);
	for (const p of posts) {
		const from = `/blog/${p.slug}/`;
		for (const link of p.paragraphLinks) {
			if (link.href.startsWith('/')) addEdge(from, link.href);
		}
	}
	for (const cat of new Set(posts.map((p) => p.category).filter(Boolean))) {
		const catPath = `/categories/${cat}/`;
		addEdge('/categories/', catPath);
	}
	const postsBySlug = new Map(posts.map((p) => [p.slug, p]));
	for (const href of loadCategoryHubEdges()) {
		if (!href.startsWith('/blog/') || href === '/blog/') continue;
		const targetSlug = slugFromBlogHref(href);
		const targetPost = targetSlug ? postsBySlug.get(targetSlug) : null;
		if (targetPost?.category) {
			addEdge(`/categories/${targetPost.category}/`, href);
		}
	}

	/** @type {Map<string, number>} */
	const depth = new Map([['/', 0]]);
	const queue = ['/'];
	while (queue.length) {
		const cur = queue.shift();
		const d = depth.get(cur) ?? 0;
		for (const next of adj.get(cur) ?? []) {
			if (depth.has(next)) continue;
			depth.set(next, d + 1);
			queue.push(next);
		}
	}

	const blogDepths = posts.map((p) => {
		const pathKey = `/blog/${p.slug}/`;
		const d = depth.get(pathKey);
		return { slug: p.slug, depth: d ?? null, overMax: d == null || d > maxDepth };
	});
	const overMax = blogDepths.filter((b) => b.overMax);
	return { blogDepths, overMax, maxDepth, reachableRoutes: depth.size };
}

export function writeMdxWithSyncedLinks(raw, content) {
	const parsed = matter(raw);
	const paragraphHrefs = [...new Set(extractParagraphMarkdownLinks(content).map((l) => l.href))];
	const existing = Array.isArray(parsed.data.internalLinks)
		? parsed.data.internalLinks.map(normalizePath)
		: [];
	const merged = [...new Set([...paragraphHrefs, ...existing])];
	parsed.data.internalLinks = merged;
	if (paragraphHrefs.length > 0) parsed.data.materialChange = true;
	return matter.stringify({ ...parsed, content });
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

export { CATEGORY_PILLARS, pillarsForCategory, primaryPillarForCategory, isBrandMainKeyword, isGlobalPillarSlug };

/** @returns {boolean} quick self-check when run as `node scripts/lib/internal-link-graph.mjs` */
export function verifyLinkDensityLogic() {
	const cases = [
		{ words: 1000, total: { min: 3, max: 5 }, blog: { min: 3, max: 4 }, spacingOk: 4 },
		{ words: 800, total: { min: 3, max: 4 }, blog: { min: 0, max: 4 }, spacingOk: 3 },
		{ words: 2000, total: { min: 6, max: 10 }, blog: { min: 4, max: 4 }, spacingOk: 8 },
	];
	let ok = true;
	for (const c of cases) {
		const total = computeLinkDensityBounds(c.words);
		const blog = computeBlogLinkDensityBounds(c.words);
		if (total.min !== c.total.min || total.max !== c.total.max) {
			console.error(`[verifyLinkDensityLogic] FAIL total ${c.words}w`, total, c.total);
			ok = false;
		}
		if (blog.min !== c.blog.min || blog.max !== c.blog.max) {
			console.error(`[verifyLinkDensityLogic] FAIL blog ${c.words}w`, blog, c.blog);
			ok = false;
		}
	const spacing = auditLinkSpacing(c.words, c.spacingOk);
		if (!spacing.ok && c.total.min <= c.spacingOk && c.spacingOk <= c.total.max) {
			console.error(`[verifyLinkDensityLogic] FAIL spacing ${c.words}w/${c.spacingOk}links`, spacing);
			ok = false;
		}
	}
	if (titleAnchorFragment('one two three four five six seven eight').split(/\s+/).length !== 7) {
		console.error('[verifyLinkDensityLogic] FAIL titleAnchorFragment max words');
		ok = false;
	}
	return ok;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const passed = verifyLinkDensityLogic();
	console.log(passed ? '[internal-link-graph] verifyLinkDensityLogic PASSED' : '[internal-link-graph] verifyLinkDensityLogic FAILED');
	process.exit(passed ? 0 : 1);
}
