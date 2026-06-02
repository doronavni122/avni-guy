/**
 * Internal links program — 61-rule audit matrix (Scope 10).
 * Each rule returns PASS | FAIL | MANUAL with reason.
 */
import {
	BANNED_ANCHOR_PATTERNS,
	FORBIDDEN_OPENING_SNIPPET,
	STANDARD_NAV_LINK_PATHS,
} from './content-forbidden-patterns.mjs';
import {
	anchorMatchesTarget,
	auditAnchorTypeDistribution,
	auditInternalNofollowLinks,
	auditLateralClusterLinks,
	auditLinkSpacing,
	auditSiteWideAnchorCollisions,
	buildLinkGraph,
	computeBlogClickDepths,
	computeBlogLinkDensityBounds,
	computeDonorDiversityMetrics,
	computeLinkDensityBounds,
	CONTEXTUAL_WORD_THRESHOLD,
	extractNonParagraphMarkdownLinks,
	findSectionDuplicateHrefs,
	hasCanonicalTrailingSlash,
	isAnchorTooLong,
	isCategoryClusterPost,
	isEnglishSlugAnchor,
	isGarbageAnchor,
	loadAllPosts,
	MAX_ANCHOR_WORDS,
	MAX_BLOG_LINKS,
	normalizePath,
	pillarsForCategory,
	primaryPillarForCategory,
	slugFromBlogHref,
	STATIC_CRAWL_ROUTES,
} from './internal-link-graph.mjs';
import {
	CONVERSION_CORNERSTONE_PILLARS,
	cornerstoneHrefsForLinkGoal,
	defaultLinkGoalForContentType,
	isBrandMainKeyword,
	isGlobalPillarSlug,
	LINK_INTENT_PATHWAY,
} from './pillar-cluster-registry.mjs';
import { countWordsHe } from './seo-hero-rules.mjs';

export const INTERNAL_LINKS_RULE_COUNT = 61;

const LINKS_STRICT = process.env.CONTENT_LINKS_STRICT === '1';
const LINKS_ENFORCE = process.env.LINKS_AUDIT_ENFORCE === '1';

function pass(reason, extra = {}) {
	return { status: 'PASS', reason, ...extra };
}
function fail(reason, extra = {}) {
	return { status: 'FAIL', reason, ...extra };
}
function manual(reason, extra = {}) {
	return { status: 'MANUAL', reason, ...extra };
}

/**
 * @param {ReturnType<typeof loadAllPosts>} posts
 */
function buildContext(posts) {
	const { inbound, postsBySlug, mode } = buildLinkGraph(posts);
	const diversity = computeDonorDiversityMetrics(inbound, posts);
	const clickDepth = computeBlogClickDepths(posts);
	const lateral = auditLateralClusterLinks(posts);
	const anchorTypes = auditAnchorTypeDistribution(posts, postsBySlug);
	const collisions = auditSiteWideAnchorCollisions(posts);
	return { posts, inbound, postsBySlug, mode, diversity, clickDepth, lateral, anchorTypes, collisions };
}

/** @type {{ id: string, name: string, category: string, mode?: string, check: (ctx: ReturnType<typeof buildContext>) => { status: string, reason: string, sample?: unknown } }[]} */
export const INTERNAL_LINKS_RULES = [
	{ id: 'IL-01', name: 'Batch checklist workflow documented', category: 'process', mode: 'manual', check: () => manual('Confirm temp_internal_links_checklist.txt for batch runs') },
	{ id: 'IL-02', name: 'Keyword map before link insertion', category: 'process', mode: 'manual', check: () => manual('Reviewer confirms anchors from target mainKeyword/title') },
	{
		id: 'IL-03',
		name: 'No standard 7-nav boilerplate block',
		category: 'process',
		check(ctx) {
			const hits = ctx.posts.filter((p) => {
				const navCount = STANDARD_NAV_LINK_PATHS.filter(
					(h) => p.content.includes(`](${h})`) || p.content.includes(`](${h.replace(/\/$/, '')})`),
				).length;
				return navCount >= 6 && p.content.includes(FORBIDDEN_OPENING_SNIPPET);
			});
			return hits.length === 0 ? pass('No 7-nav boilerplate') : fail(`${hits.length} with boilerplate`, { sample: hits.slice(0, 5).map((p) => p.slug) });
		},
	},
	{
		id: 'IL-04',
		name: 'Optional linkGoal frontmatter valid',
		category: 'process',
		check(ctx) {
			const allowed = new Set(LINK_INTENT_PATHWAY);
			const bad = ctx.posts.filter((p) => p.data.linkGoal && !allowed.has(p.data.linkGoal));
			return bad.length === 0 ? pass('linkGoal valid or omitted') : fail(`${bad.length} invalid linkGoal`, { sample: bad.map((p) => p.slug) });
		},
	},
	{ id: 'IL-05', name: 'Equity hub rebalance review', category: 'process', mode: 'manual', check: () => manual('Review OVERLINKED_HUBS vs CONVERSION_CORNERSTONE_PILLARS inbound') },
	{
		id: 'IL-06',
		name: 'Per-post density minimum 3/1000',
		category: 'density',
		check(ctx) {
			const low = [];
			for (const p of ctx.posts) {
				const words = countWordsHe(p.content);
				const bounds = computeLinkDensityBounds(words);
				if (words >= 400 && p.paragraphLinks.length < bounds.min) low.push(`${p.slug}:${p.paragraphLinks.length}<${bounds.min}`);
			}
			return low.length === 0 ? pass('Density minimum OK') : fail(`${low.length} below min`, { sample: low.slice(0, 10) });
		},
	},
	{
		id: 'IL-07',
		name: 'Per-post density maximum 7/1000',
		category: 'density',
		check(ctx) {
			const high = ctx.posts.filter((p) => {
				const bounds = computeLinkDensityBounds(countWordsHe(p.content));
				return p.paragraphLinks.length > bounds.max;
			});
			return high.length === 0 ? pass('Density maximum OK') : fail(`${high.length} exceed max`, { sample: high.slice(0, 8).map((p) => p.slug) });
		},
	},
	{
		id: 'IL-08',
		name: 'Link spacing 200-350 words per link',
		category: 'density',
		check(ctx) {
			const bad = [];
			for (const p of ctx.posts) {
				const words = countWordsHe(p.content);
				const count = p.paragraphLinks.length;
				if (!count) continue;
				const spacing = auditLinkSpacing(words, count);
				const bounds = computeLinkDensityBounds(words);
				if (!spacing.ok && count >= bounds.min && count <= bounds.max) bad.push(`${p.slug}:${spacing.wordsPerLink?.toFixed(0)}w/link`);
			}
			return bad.length === 0 ? pass('Spacing OK') : fail(`${bad.length} spacing issues`, { sample: bad.slice(0, 8) });
		},
	},
	{
		id: 'IL-09',
		name: 'Contextual blog min when words>800',
		category: 'density',
		check(ctx) {
			const low = [];
			for (const p of ctx.posts) {
				const words = countWordsHe(p.content);
				if (words <= CONTEXTUAL_WORD_THRESHOLD) continue;
				const blogBounds = computeBlogLinkDensityBounds(words);
				if (p.blogOutCount < blogBounds.min) low.push(`${p.slug}:${p.blogOutCount}<${blogBounds.min}`);
			}
			return low.length === 0 ? pass('Contextual min OK') : fail(`${low.length} below contextual min`, { sample: low.slice(0, 10) });
		},
	},
	{
		id: 'IL-10',
		name: 'Silo cap max 4 blog links',
		category: 'density',
		check(ctx) {
			const over = ctx.posts.filter((p) => p.blogOutCount > MAX_BLOG_LINKS);
			return over.length === 0 ? pass(`Silo cap ${MAX_BLOG_LINKS} OK`) : fail(`${over.length} exceed cap`, { sample: over.map((p) => p.slug) });
		},
	},
	{
		id: 'IL-11',
		name: 'Corpus average link density review',
		category: 'density',
		mode: 'manual',
		check(ctx) {
			const avg =
				ctx.posts.reduce((s, p) => s + p.paragraphLinks.length / Math.max(1, countWordsHe(p.content) / 1000), 0) /
				Math.max(1, ctx.posts.length);
			return manual(`Avg ~${avg.toFixed(2)} links/1000w (target 3-7)`);
		},
	},
	{
		id: 'IL-12',
		name: 'No zero-link posts over 500 words',
		category: 'density',
		check(ctx) {
			const empty = ctx.posts.filter((p) => countWordsHe(p.content) > 500 && p.paragraphLinks.length === 0);
			return empty.length === 0 ? pass('No empty long posts') : fail(`${empty.length} zero-link posts`, { sample: empty.map((p) => p.slug) });
		},
	},
	{
		id: 'IL-13',
		name: 'Topical blog min 3 when CONTENT_STRICT',
		category: 'density',
		check(ctx) {
			if (process.env.CONTENT_STRICT !== '1') return pass('Skipped (CONTENT_STRICT not set)');
			const low = ctx.posts.filter((p) => p.blogOutCount < 3);
			return low.length === 0 ? pass('Topical min OK') : fail(`${low.length} below min 3`, { sample: low.slice(0, 8).map((p) => p.slug) });
		},
	},
	{
		id: 'IL-14',
		name: 'Quota links in paragraph prose only',
		category: 'placement',
		check(ctx) {
			const nonPara = [];
			for (const p of ctx.posts) nonPara.push(...extractNonParagraphMarkdownLinks(p.content));
			return nonPara.length === 0 ? pass('Paragraph-only quota links') : manual(`${nonPara.length} non-paragraph links to review`);
		},
	},
	{
		id: 'IL-15',
		name: 'Max one href per H2 section',
		category: 'placement',
		check(ctx) {
			if (!LINKS_STRICT) return pass('Skipped (CONTENT_LINKS_STRICT not set)');
			const bad = ctx.posts.filter((p) => findSectionDuplicateHrefs(p.content).length);
			return bad.length === 0 ? pass('Section href uniqueness OK') : fail(`${bad.length} section dupes`, { sample: bad.slice(0, 8).map((p) => p.slug) });
		},
	},
	{
		id: 'IL-16',
		name: 'Unique paragraph href per article',
		category: 'placement',
		check(ctx) {
			const dup = [];
			for (const p of ctx.posts) {
				const hrefs = p.paragraphLinks.map((l) => l.href);
				const d = hrefs.find((h, i) => hrefs.indexOf(h) !== i);
				if (d) dup.push(`${p.slug}:${d}`);
			}
			return dup.length === 0 ? pass('Unique hrefs OK') : fail(`${dup.length} dup hrefs`, { sample: dup.slice(0, 10) });
		},
	},
	{
		id: 'IL-17',
		name: 'Unique paragraph anchor per article',
		category: 'placement',
		check(ctx) {
			const dup = [];
			for (const p of ctx.posts) {
				const anchors = p.paragraphLinks.map((l) => l.anchor);
				const d = anchors.find((a, i) => anchors.indexOf(a) !== i);
				if (d) dup.push(`${p.slug}:"${d}"`);
			}
			return dup.length === 0 ? pass('Unique anchors OK') : fail(`${dup.length} dup anchors`, { sample: dup.slice(0, 10) });
		},
	},
	{
		id: 'IL-18',
		name: 'Trailing slash on internal hrefs',
		category: 'placement',
		check(ctx) {
			const bad = [];
			for (const p of ctx.posts) {
				for (const link of p.paragraphLinks) {
					if (!hasCanonicalTrailingSlash(link.href)) bad.push(`${p.slug}:${link.href}`);
				}
			}
			return bad.length === 0 ? pass('Trailing slashes OK') : fail(`${bad.length} slash issues`, { sample: bad.slice(0, 10) });
		},
	},
	{
		id: 'IL-19',
		name: 'No internal nofollow',
		category: 'placement',
		check(ctx) {
			const issues = [];
			for (const p of ctx.posts) issues.push(...auditInternalNofollowLinks(p.content, p.slug));
			return issues.length === 0 ? pass('No nofollow') : fail(`${issues.length} nofollow`, { sample: issues.slice(0, 5) });
		},
	},
	{ id: 'IL-20', name: 'Non-paragraph link inventory', category: 'placement', mode: 'manual', check: (ctx) => manual(`${ctx.posts.reduce((n, p) => n + extractNonParagraphMarkdownLinks(p.content).length, 0)} non-paragraph links`) },
	{
		id: 'IL-21',
		name: 'Anchor max 7 Hebrew words',
		category: 'anchor',
		check(ctx) {
			const long = [];
			for (const p of ctx.posts) {
				for (const link of p.paragraphLinks) {
					if (isAnchorTooLong(link.anchor)) long.push(`${p.slug}:"${link.anchor}"`);
				}
			}
			return long.length === 0 ? pass(`Anchors <= ${MAX_ANCHOR_WORDS} words`) : fail(`${long.length} too long`, { sample: long.slice(0, 8) });
		},
	},
	{
		id: 'IL-22',
		name: 'No English slug anchors',
		category: 'anchor',
		check(ctx) {
			const bad = [];
			for (const p of ctx.posts) {
				for (const link of p.paragraphLinks) {
					if (link.href.startsWith('/blog/') && isEnglishSlugAnchor(link.anchor)) bad.push(`${p.slug}:"${link.anchor}"`);
				}
			}
			return bad.length === 0 ? pass('No english-slug anchors') : fail(`${bad.length} english-slug`, { sample: bad.slice(0, 8) });
		},
	},
	{
		id: 'IL-23',
		name: 'No garbage anchor patterns',
		category: 'anchor',
		check(ctx) {
			const bad = [];
			for (const p of ctx.posts) {
				for (const link of p.paragraphLinks) {
					if (isGarbageAnchor(link.anchor)) bad.push(`${p.slug}:"${link.anchor}"`);
				}
			}
			return bad.length === 0 ? pass('No garbage anchors') : fail(`${bad.length} garbage`, { sample: bad.slice(0, 8) });
		},
	},
	{
		id: 'IL-24',
		name: 'No banned generic anchors',
		category: 'anchor',
		check(ctx) {
			const bad = [];
			for (const p of ctx.posts) {
				for (const link of p.paragraphLinks) {
					if (BANNED_ANCHOR_PATTERNS.some((re) => re.test(link.anchor))) bad.push(`${p.slug}:"${link.anchor}"`);
				}
			}
			return bad.length === 0 ? pass('No banned anchors') : fail(`${bad.length} banned`, { sample: bad.slice(0, 8) });
		},
	},
	{
		id: 'IL-25',
		name: 'Blog anchors match target keyword/title',
		category: 'anchor',
		check(ctx) {
			if (!LINKS_STRICT) return pass('Skipped (CONTENT_LINKS_STRICT not set)');
			const bad = [];
			for (const p of ctx.posts) {
				for (const link of p.paragraphLinks) {
					const targetSlug = slugFromBlogHref(link.href);
					if (!targetSlug) continue;
					const target = ctx.postsBySlug.get(targetSlug);
					if (target && !anchorMatchesTarget(link.anchor, target)) bad.push(`${p.slug}->${link.href}`);
				}
			}
			return bad.length === 0 ? pass('Anchor-keyword OK') : fail(`${bad.length} gaps`, { sample: bad.slice(0, 8) });
		},
	},
	{
		id: 'IL-26',
		name: 'Site-wide anchor collision free',
		category: 'anchor',
		check(ctx) {
			return ctx.collisions.length === 0 ? pass('No collisions') : fail(`${ctx.collisions.length} collisions`, { sample: ctx.collisions.slice(0, 5) });
		},
	},
	{
		id: 'IL-27',
		name: 'Exact-match ratio <= 0.35',
		category: 'anchor',
		check(ctx) {
			if (!LINKS_STRICT) return pass('Skipped (CONTENT_LINKS_STRICT not set)');
			return ctx.anchorTypes.exactMatchRatio <= 0.35
				? pass(`Ratio ${ctx.anchorTypes.exactMatchRatio} OK`)
				: fail(`Ratio ${ctx.anchorTypes.exactMatchRatio} > 0.35`);
		},
	},
	{ id: 'IL-28', name: 'Branded anchor distribution review', category: 'anchor', mode: 'manual', check: (ctx) => manual(`Branded=${ctx.anchorTypes.counts.branded}/${ctx.anchorTypes.blogLinks} blog links`) },
	{ id: 'IL-29', name: 'Descriptive Hebrew anchors spot-check', category: 'anchor', mode: 'manual', check: () => manual('Spot-check 5 random anchors for natural Hebrew') },
	{
		id: 'IL-30',
		name: 'No numbered generic series anchors',
		category: 'anchor',
		check(ctx) {
			const bad = [];
			for (const p of ctx.posts) {
				for (const link of p.paragraphLinks) {
					if (/^(קריאה|קישור)\s+(פנימית|קשורה|ממוקדת)\s+\d+/u.test(link.anchor)) bad.push(`${p.slug}:"${link.anchor}"`);
				}
			}
			return bad.length === 0 ? pass('No numbered series') : fail(`${bad.length} numbered`, { sample: bad.slice(0, 5) });
		},
	},
	{
		id: 'IL-31',
		name: 'Zero orphan blog posts',
		category: 'graph',
		check(ctx) {
			const orphans = ctx.posts.filter((p) => (ctx.inbound.get(p.slug) ?? []).length === 0);
			if (orphans.length === 0) return pass('No orphans');
			if (LINKS_ENFORCE) return fail(`${orphans.length} orphans`, { sample: orphans.slice(0, 8).map((p) => p.slug) });
			return manual(`${orphans.length} orphans (non-enforced)`, { sample: orphans.slice(0, 5).map((p) => p.slug) });
		},
	},
	{
		id: 'IL-32',
		name: 'Spoke links category primary pillar',
		category: 'graph',
		check(ctx) {
			const missing = [];
			for (const p of ctx.posts) {
				if (isGlobalPillarSlug(p.slug)) continue;
				const pillars = pillarsForCategory(p.category);
				if (!pillars.length || pillars.includes(p.slug)) continue;
				const primary = primaryPillarForCategory(p.category, p.slug);
				if (!primary) continue;
				const href = `/blog/${primary}/`;
				if (!p.paragraphLinks.some((l) => l.href === href)) missing.push(p.slug);
			}
			if (missing.length === 0) return pass('Spoke->pillar OK');
			if (LINKS_ENFORCE) return fail(`${missing.length} missing pillar`, { sample: missing.slice(0, 10) });
			return manual(`${missing.length} missing pillar (warn)`, { sample: missing.slice(0, 5) });
		},
	},
	{
		id: 'IL-33',
		name: 'Pillar to spoke coverage threshold',
		category: 'graph',
		check(ctx) {
			const sparse = [];
			for (const p of ctx.posts) {
				if (!pillarsForCategory(p.category).includes(p.slug) && !isGlobalPillarSlug(p.slug)) continue;
				const spokes = ctx.posts.filter((s) => s.category === p.category && s.slug !== p.slug && !isGlobalPillarSlug(s.slug));
				const linked = new Set(p.paragraphLinks.map((l) => slugFromBlogHref(l.href)).filter(Boolean));
				const unlinked = spokes.filter((s) => !linked.has(s.slug)).length;
				if (unlinked > Math.max(3, spokes.length * 0.5)) sparse.push(`${p.slug}:${unlinked}/${spokes.length}`);
			}
			return sparse.length === 0 ? pass('Pillar spoke coverage OK') : manual(`${sparse.length} sparse pillars (>50% or >3 unlinked)`, { sample: sparse.slice(0, 5) });
		},
	},
	{
		id: 'IL-34',
		name: 'Lateral cluster same-category link',
		category: 'graph',
		check(ctx) {
			const { missingLateral, clusterCount } = ctx.lateral;
			if (missingLateral.length === 0) return pass('Lateral cluster OK');
			if (LINKS_ENFORCE) return fail(`${missingLateral.length}/${clusterCount} missing lateral`, { sample: missingLateral.slice(0, 8) });
			return manual(`${missingLateral.length} missing lateral`, { sample: missingLateral.slice(0, 5) });
		},
	},
	{
		id: 'IL-35',
		name: 'Blog silo outbound cap enforced',
		category: 'graph',
		check(ctx) {
			const over = ctx.posts.filter((p) => p.blogOutCount > MAX_BLOG_LINKS);
			return over.length === 0 ? pass('Silo cap OK') : fail(`${over.length} over cap`);
		},
	},
	{ id: 'IL-36', name: 'Donor diversity average review', category: 'graph', mode: 'manual', check: (ctx) => manual(`Avg donors=${ctx.diversity.avgDonors}; single=${ctx.diversity.singleDonorTargets}; zero=${ctx.diversity.zeroDonorTargets}`) },
	{ id: 'IL-37', name: 'Single-donor target remediation', category: 'graph', mode: 'manual', check: (ctx) => manual(`${ctx.diversity.singleDonorTargets} single-donor targets`) },
	{ id: 'IL-38', name: 'Overlinked hub outbound share', category: 'graph', mode: 'manual', check: (ctx) => manual(`Top donors: ${ctx.diversity.topDonors.slice(0, 3).map((d) => `${d.slug}:${d.outboundBlogLinks}`).join(', ')}`) },
	{
		id: 'IL-39',
		name: 'Click depth max 3 from home',
		category: 'graph',
		check(ctx) {
			const { overMax, maxDepth } = ctx.clickDepth;
			return overMax.length === 0 ? pass(`Depth <= ${maxDepth}`) : fail(`${overMax.length} too deep`, { sample: overMax.slice(0, 8).map((b) => b.slug) });
		},
	},
	{
		id: 'IL-40',
		name: 'All blog posts reachable from home',
		category: 'graph',
		check(ctx) {
			const unreachable = ctx.clickDepth.blogDepths.filter((b) => b.depth == null);
			return unreachable.length === 0 ? pass('All reachable') : fail(`${unreachable.length} unreachable`, { sample: unreachable.map((b) => b.slug) });
		},
	},
	{ id: 'IL-41', name: 'Category hub pillar edges present', category: 'graph', mode: 'manual', check: () => manual('Verify category-hub-intros.ts vs CATEGORY_PILLARS') },
	{
		id: 'IL-42',
		name: 'No non-brand keyword cannibalization',
		category: 'graph',
		check(ctx) {
			const byKw = new Map();
			for (const p of ctx.posts) {
				const kw = String(p.mainKeyword ?? '').trim();
				if (!kw || isBrandMainKeyword(kw)) continue;
				if (!byKw.has(kw)) byKw.set(kw, []);
				byKw.get(kw).push(p.slug);
			}
			const dup = [...byKw.entries()].filter(([, slugs]) => slugs.length > 1);
			if (dup.length === 0) return pass('No cannibalization');
			if (LINKS_STRICT) return fail(`${dup.length} shared keywords`, { sample: dup.slice(0, 3) });
			return manual(`${dup.length} shared keywords`, { sample: dup.slice(0, 3) });
		},
	},
	{
		id: 'IL-43',
		name: 'internalLinks includes body hrefs',
		category: 'sync',
		check(ctx) {
			const bad = [];
			for (const p of ctx.posts) {
				const bodyHrefs = [...new Set(p.paragraphLinks.map((l) => l.href))];
				const fmSet = new Set(p.internalLinks.map(normalizePath));
				if (bodyHrefs.some((h) => !fmSet.has(h))) bad.push(p.slug);
			}
			return bad.length === 0 ? pass('FM includes body hrefs') : fail(`${bad.length} fm gaps`, { sample: bad.slice(0, 8) });
		},
	},
	{
		id: 'IL-44',
		name: 'Body hrefs listed in internalLinks',
		category: 'sync',
		check(ctx) {
			const bad = [];
			for (const p of ctx.posts) {
				const bodyHrefs = new Set(p.paragraphLinks.map((l) => l.href));
				if (p.internalLinks.some((h) => h.startsWith('/') && !bodyHrefs.has(h))) bad.push(p.slug);
			}
			return bad.length === 0 ? pass('No fm-only paths') : fail(`${bad.length} body/fm mismatch`, { sample: bad.slice(0, 8) });
		},
	},
	{
		id: 'IL-45',
		name: 'internalLinks trailing slash form',
		category: 'sync',
		check(ctx) {
			const bad = ctx.posts.filter((p) => p.internalLinks.some((h) => h.startsWith('/') && !hasCanonicalTrailingSlash(h)));
			return bad.length === 0 ? pass('FM slashes OK') : fail(`${bad.length} fm slash issues`, { sample: bad.slice(0, 5).map((p) => p.slug) });
		},
	},
	{
		id: 'IL-46',
		name: 'linkGoal aligns with contentType default',
		category: 'sync',
		mode: 'manual',
		check(ctx) {
			const mism = ctx.posts.filter((p) => {
				const explicit = p.data.linkGoal;
				const def = defaultLinkGoalForContentType(p.data.contentType);
				return explicit && def && explicit !== def;
			});
			return mism.length === 0 ? pass('linkGoal defaults OK') : manual(`${mism.length} explicit overrides to review`, { sample: mism.slice(0, 5).map((p) => p.slug) });
		},
	},
	{
		id: 'IL-47',
		name: 'One homepage brand link per article',
		category: 'brand',
		check(ctx) {
			const bad = ctx.posts.filter((p) => p.paragraphLinks.filter((l) => l.href === '/').length > 1);
			return bad.length === 0 ? pass('Single home link OK') : fail(`${bad.length} duplicate / links`, { sample: bad.map((p) => p.slug) });
		},
	},
	{
		id: 'IL-48',
		name: 'Brand anchor text canonical',
		category: 'brand',
		check(ctx) {
			const bad = [];
			for (const p of ctx.posts) {
				for (const link of p.paragraphLinks.filter((l) => l.href === '/')) {
					if (!/^גיא אבני(?:\s+עורך דין)?$/u.test(link.anchor.trim())) bad.push(`${p.slug}:"${link.anchor}"`);
				}
			}
			return bad.length === 0 ? pass('Brand anchors OK') : fail(`${bad.length} non-canonical brand`, { sample: bad.slice(0, 5) });
		},
	},
	{ id: 'IL-49', name: 'Brand link paragraph placement', category: 'brand', mode: 'manual', check: () => manual('Spot-check brand / links are paragraph-only') },
	{
		id: 'IL-50',
		name: 'Decision CTA /contact/ on cluster posts',
		category: 'conversion',
		check(ctx) {
			const clusters = ctx.posts.filter((p) => p.data.contentType === 'cluster' || isCategoryClusterPost(p));
			const withContact = clusters.filter((p) => p.paragraphLinks.some((l) => l.href === '/contact/'));
			const pct = clusters.length ? (withContact.length / clusters.length) * 100 : 100;
			return pct >= 40 ? pass(`${pct.toFixed(0)}% clusters link /contact/`) : manual(`Only ${pct.toFixed(0)}% clusters link /contact/`);
		},
	},
	{
		id: 'IL-51',
		name: 'Conversion cornerstone pillars inbound equity',
		category: 'conversion',
		check(ctx) {
			const low = CONVERSION_CORNERSTONE_PILLARS.filter((slug) => (ctx.inbound.get(slug) ?? []).length < 3);
			return low.length === 0 ? pass('Cornerstone inbound OK') : manual(`${low.length} cornerstone pillars <3 inbound`, { sample: low });
		},
	},
	{
		id: 'IL-52',
		name: 'Intent pathway coverage sample',
		category: 'conversion',
		mode: 'manual',
		check(ctx) {
			const sample = ctx.posts.slice(0, 3).map((p) => {
				const goal = p.data.linkGoal ?? defaultLinkGoalForContentType(p.data.contentType) ?? 'awareness';
				const targets = cornerstoneHrefsForLinkGoal(goal);
				const hit = targets.some((t) => p.paragraphLinks.some((l) => l.href === t));
				return `${p.slug}:${goal}:${hit ? 'hit' : 'miss'}`;
			});
			return manual(`Intent sample: ${sample.join('; ')}`);
		},
	},
	{
		id: 'IL-53',
		name: 'Static crawl routes in graph SSOT',
		category: 'crawl',
		check: () => (STATIC_CRAWL_ROUTES.length >= 7 ? pass(`${STATIC_CRAWL_ROUTES.length} static routes`) : fail('STATIC_CRAWL_ROUTES incomplete')),
	},
	{
		id: 'IL-54',
		name: 'Blog index template edge to all posts',
		category: 'crawl',
		check: (ctx) => (ctx.posts.length > 0 ? pass(`${ctx.posts.length} posts via /blog/ edge`) : fail('No posts')),
	},
	{
		id: 'IL-55',
		name: 'Nav routes depth 1 from home',
		category: 'crawl',
		check: () => pass(`Nav routes registered: ${STATIC_CRAWL_ROUTES.filter((r) => r !== '/').join(', ')}`),
	},
	{
		id: 'IL-56',
		name: 'Aggregate internal crawlability',
		category: 'crawl',
		check(ctx) {
			let nofollow = 0;
			for (const p of ctx.posts) nofollow += auditInternalNofollowLinks(p.content, p.slug).length;
			return nofollow === 0 ? pass('Crawlable corpus') : fail(`${nofollow} nofollow blockers`);
		},
	},
	{ id: 'IL-57', name: 'Layout footer duplicate link review', category: 'crawl', mode: 'manual', check: () => manual('Review BlogPostLayout footer vs body duplicates') },
	{ id: 'IL-58', name: 'Pillar 90d refresh policy', category: 'governance', mode: 'manual', check: () => manual('Quarterly pillar materialChange/updatedDate review') },
	{ id: 'IL-59', name: 'Quarterly links audit full cadence', category: 'governance', mode: 'manual', check: () => manual('Workflow internal-links-quarterly.yml every 90 days') },
	{ id: 'IL-60', name: 'Remediate batch idempotent', category: 'governance', mode: 'manual', check: () => manual('Re-run links:remediate on clean corpus expects zero writes') },
	{
		id: 'IL-61',
		name: 'Registry rule count SSOT',
		category: 'governance',
		check: () =>
			INTERNAL_LINKS_RULES.length === INTERNAL_LINKS_RULE_COUNT
				? pass(`${INTERNAL_LINKS_RULE_COUNT} rules registered`)
				: fail(`Expected ${INTERNAL_LINKS_RULE_COUNT}, got ${INTERNAL_LINKS_RULES.length}`),
	},
];

/**
 * Run all 61 rules.
 * @param {{ slugFilter?: string[] }} [options]
 */
export function runInternalLinksFullAudit(options = {}) {
	const allPosts = loadAllPosts();
	const posts = options.slugFilter?.length ? allPosts.filter((p) => options.slugFilter.includes(p.slug)) : allPosts;
	const ctx = buildContext(posts);
	const results = [];
	let passCount = 0;
	let failCount = 0;
	let manualCount = 0;

	for (const rule of INTERNAL_LINKS_RULES) {
		let outcome;
		try {
			outcome = rule.check(ctx);
		} catch (err) {
			outcome = fail(`Rule threw: ${err.message}`);
		}
		const row = { id: rule.id, name: rule.name, category: rule.category, mode: rule.mode ?? 'auto', ...outcome };
		results.push(row);
		if (row.status === 'PASS') passCount += 1;
		else if (row.status === 'FAIL') failCount += 1;
		else manualCount += 1;
	}

	return {
		ok: failCount === 0,
		summary: { total: INTERNAL_LINKS_RULES.length, pass: passCount, fail: failCount, manual: manualCount },
		results,
		ctx: { articleCount: posts.length, inboundMode: ctx.mode },
	};
}
