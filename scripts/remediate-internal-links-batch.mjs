#!/usr/bin/env node
/**
 * Batch internal links remediation: anchors, orphan mesh, hub rebalance, mainKeyword anchors.
 * Respects MAX_BLOG_LINKS silo cap (4); total density targets use computeLinkDensityBounds() in internal-link-graph.mjs.
 * Run: node scripts/remediate-internal-links-batch.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import matter from 'gray-matter';
import {
	BLOG_DIR,
	buildLinkGraph,
	computeBlogLinkDensityBounds,
	computeLinkDensityBounds,
	countBlogLinksInBody,
	extractParagraphMarkdownLinks,
	isAnchorTooLong,
	isEnglishSlugAnchor,
	isGarbageAnchor,
	loadAllPosts,
	logGraph,
	MAX_ANCHOR_WORDS,
	MAX_BLOG_LINKS,
	normalizePath,
	slugFromBlogHref,
	writeMdxWithSyncedLinks,
	titleAnchorFragment,
	anchorMatchesTarget,
	splitBodyByH2Sections,
	wordsAboveContextualThreshold,
	isCategoryClusterPost,
} from './lib/internal-link-graph.mjs';
import { countWordsHe } from './lib/seo-hero-rules.mjs';
import {
	CATEGORY_PILLARS,
	primaryPillarForCategory,
	pillarsForCategory,
} from './lib/pillar-cluster-registry.mjs';

function primaryPillarHref(donorSlug, postsBySlug) {
	const donor = postsBySlug.get(donorSlug);
	if (!donor) return null;
	const pillarSlug = primaryPillarForCategory(donor.category, donorSlug);
	if (!pillarSlug || pillarSlug === donorSlug) return null;
	return `/blog/${pillarSlug}/`;
}

const OVERLINKED_HUBS = new Set([
	'guy-avni-dispute-prevention-method',
	'guy-avni-contract-review-flow',
	'guy-avni-document-readiness-guide',
	'guy-avni-negotiation-clarity-principles',
	'guy-avni-legal-planning-basics',
	'guy-avni-meeting-preparation-checklist',
	'guy-avni-risk-management-routine',
	'guy-avni-evidence-prioritization-framework',
]);

const MAIN_KEYWORD_MISSING_ANCHORS = [
	'guy-avni-business-partnership-bad-endings',
	'guy-avni-business-partnership-types-israel-protection',
	'guy-avni-client-onboarding-framework',
	'guy-avni-client-trust-roadmap',
	'guy-avni-companies-registry-phone-call-four-questions',
	'guy-avni-criminal-case-closure-no-record',
	'guy-avni-criminal-record-sealing-seven-years',
	'guy-avni-driving-license-suspension-cancel-seven-days',
	'guy-avni-evidence-prioritization-framework',
	'guy-avni-hidden-legal-invoice-charges-israel',
	'guy-avni-lawyer-dual-representation-ethics-complaint',
	'guy-avni-legal-content-writing-approach',
	'guy-avni-legal-retainer-eight-deliverables',
	'guy-avni-long-term-legal-strategy',
	'guy-avni-meeting-preparation-checklist',
	'guy-avni-process-improvement-for-legal-teams',
	'guy-avni-questions-expose-bad-lawyer-first-meeting',
	'guy-avni-risk-management-routine',
	'guy-avni-time-management-for-legal-work',
	'guy-avni-wage-delay-penalty-clock-start',
	'guy-avni-workplace-harassment-complaint-filing',
	'guy-avni-wrongful-termination-notice-period-shortfall',
];

function hashPick(seed, arr) {
	let h = 0;
	for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
	return arr[h % arr.length];
}

/** Descriptive Hebrew anchor ≤7 words; no banned prefix pools that blow word limits. */
function anchorVariants(title, seed, target) {
	const frag = titleAnchorFragment(title);
	const kw = String(target?.mainKeyword ?? '').trim();
	if (kw.length >= 4 && anchorWordCount(kw) <= MAX_ANCHOR_WORDS) {
		const pools = [frag, kw];
		return clampAnchorWords(hashPick(seed, pools));
	}
	return clampAnchorWords(frag);
}

function clampAnchorWords(anchor) {
	const words = String(anchor ?? '')
		.trim()
		.split(/\s+/)
		.filter(Boolean);
	if (words.length <= MAX_ANCHOR_WORDS) return words.join(' ');
	return words.slice(0, MAX_ANCHOR_WORDS).join(' ');
}

function anchorWordCount(anchor) {
	return String(anchor ?? '')
		.trim()
		.split(/\s+/)
		.filter(Boolean).length;
}

function densityBoundsForBody(body) {
	const words = countWordsHe(body);
	return { words, total: computeLinkDensityBounds(words), blog: computeBlogLinkDensityBounds(words) };
}

function canAddParagraphLink(body) {
	const { total } = densityBoundsForBody(body);
	const count = extractParagraphMarkdownLinks(body).length;
	return count < total.max;
}

/** Remove legacy trailing injections from orphan mesh (upper-half policy uses inline prose). */
function stripLegacyLeyonInjections(body) {
	let b = body;
	b = b.replace(/\s+לעיון(?:\s+נוסף)?:\s*\[[^\]]+\]\([^)]+\)\.?/gu, '');
	b = b.replace(/\s+לעיון:\s*[^.\n]+(?=\.|$)/gu, '');
	return b;
}

function isQualifyingParagraphLine(line) {
	const t = String(line ?? '').trim();
	if (!t || t.startsWith('#')) return false;
	if (/^[-*+]\s/.test(t)) return false;
	if (/^\d+\.\s/.test(t)) return false;
	if (t.includes('](http')) return false;
	return true;
}

function qualifyingParagraphIndices(lines, start = 0, end = lines.length) {
	const indices = [];
	for (let i = start; i < end; i++) {
		if (isQualifyingParagraphLine(lines[i])) indices.push(i);
	}
	return indices;
}

function firstQualifyingParagraphIndex(lines, start = 0, end = lines.length) {
	const indices = qualifyingParagraphIndices(lines, start, end);
	if (!indices.length) return -1;
	const upperEnd = start + Math.ceil((end - start) / 2);
	const inUpper = indices.filter((i) => i < upperEnd);
	return (inUpper.length ? inUpper : indices)[0];
}

function appendLinkToLine(line, anchor, href) {
	const trimmed = line.trimEnd();
	const link = `[${clampAnchorWords(anchor)}](${href})`;
	if (trimmed.includes(link)) return line;
	const sep = /[.!?]\s*$/.test(trimmed) ? ' ' : ': ';
	return `${trimmed}${sep}${link}.`;
}

function resolveAnchorForTarget(target, donorSlug, targetSlug, seed) {
	let anchor = anchorVariants(target.title, `${donorSlug}:${targetSlug}`, target);
	if (!anchorMatchesTarget(anchor, target) && target.mainKeyword?.length >= 4) {
		anchor = clampAnchorWords(target.mainKeyword);
	}
	if (!anchorMatchesTarget(anchor, target)) {
		anchor = anchorVariants(target.title, `${donorSlug}:retry:${targetSlug}`, target);
	}
	return clampAnchorWords(anchor);
}

function fixAllAnchorsInBody(body, postsBySlug, donorSlug) {
	let b = body;
	const links = extractParagraphMarkdownLinks(b);
	for (const link of links) {
		let newAnchor = link.anchor;
		const targetSlug = slugFromBlogHref(link.href);
		const target = targetSlug ? postsBySlug.get(targetSlug) : null;
		const isBlog = Boolean(targetSlug);
		const needsFix =
			isGarbageAnchor(link.anchor) ||
			isAnchorTooLong(link.anchor) ||
			/^מדריך:\s/u.test(link.anchor) ||
			/^המשך בנושא\s/u.test(link.anchor) ||
			/^קראו על\s/u.test(link.anchor) ||
			/\s-\sפירוט$/u.test(link.anchor) ||
			(isBlog && (isEnglishSlugAnchor(link.anchor) || /[a-z]{3,}/.test(link.anchor)));
		if (isBlog && target) {
			if (needsFix || !anchorMatchesTarget(link.anchor, target)) {
				newAnchor = resolveAnchorForTarget(target, donorSlug, targetSlug, link.anchor);
			}
		} else if (needsFix) {
			newAnchor = navAnchorFor(link.href, `${donorSlug}:${link.href}:${link.anchor}`);
		} else if (isAnchorTooLong(link.anchor)) {
			newAnchor = clampAnchorWords(titleAnchorFragment(link.anchor));
		}
		if (!newAnchor || newAnchor === link.anchor) continue;
		b = replaceLinkInBody(b, link.full, newAnchor, link.href);
	}
	return b;
}

/**
 * Trim paragraph links to computeLinkDensityBounds max; preserve pillar + one brand home when possible.
 */
function trimExcessParagraphLinks(body, donorSlug, postsBySlug) {
	let b = stripLegacyLeyonInjections(body);
	const protectedHref = primaryPillarHref(donorSlug, postsBySlug);
	const lines = b.split('\n');
	const totalLines = lines.length;

	while (true) {
		const { total } = densityBoundsForBody(b);
		const links = extractParagraphMarkdownLinks(b);
		if (links.length <= total.max) break;

		const hrefFirst = new Map();
		const scored = links.map((link, order) => {
			const lineIdx = b.slice(0, b.indexOf(link.full)).split('\n').length - 1;
			const line = lines[lineIdx] ?? '';
			const lineLinkCount = (line.match(/\[[^\]]+\]\([^)]+\)/g) ?? []).length;
			const slug = slugFromBlogHref(link.href);
			let score = order;
			if (hrefFirst.has(link.href)) score += 200;
			else hrefFirst.set(link.href, true);
			if (link.href === protectedHref) score -= 500;
			if (link.href === '/') score -= 400;
			if (link.href === '/contact/') score -= 350;
			if (OVERLINKED_HUBS.has(slug ?? '')) score += 120;
			if (link.href.startsWith('/tags/') || link.href === '/tags/') score += 90;
			if (link.href.startsWith('/categories/')) score += 85;
			if (link.href.startsWith('/blog/') && link.href !== '/blog/') score -= 80;
			if (/\s-\sפירוט$/u.test(link.anchor)) score += 150;
			if (lineLinkCount > 2) score += 80 + lineLinkCount * 10;
			if (lineIdx > totalLines * 0.75) score += 40;
			if (link.href === '/about/' || link.href === '/services/' || link.href === '/blog/') score += 50;
			return { link, score };
		});
		scored.sort((a, b) => b.score - a.score);
		const victim = scored[0]?.link;
		if (!victim) break;
		const idx = b.indexOf(victim.full);
		if (idx < 0) break;
		b = b.slice(0, idx) + victim.anchor + b.slice(idx + victim.full.length);
		logGraph('remediate', `trim link ${donorSlug}`, { href: victim.href, count: links.length, max: total.max });
	}

	return b;
}

function replaceLinkInBody(body, oldFull, newAnchor, href) {
	const newFull = `[${newAnchor}](${href})`;
	return body.replace(oldFull, newFull);
}

const NAV_ANCHOR_MAP = {
	'/': 'דף הבית',
	'/about/': 'אודות המשרד',
	'/services/': 'שירותים משפטיים',
	'/blog/': 'מאגר מאמרים',
	'/categories/': 'קטגוריות תוכן',
	'/tags/': 'אינדקס תגיות',
	'/contact/': 'יצירת קשר',
};

function navAnchorFor(href, seed) {
	if (NAV_ANCHOR_MAP[href]) return NAV_ANCHOR_MAP[href];
	if (href.startsWith('/categories/')) {
		const cat = href.replace('/categories/', '').replace(/\/$/, '');
		return hashPick(`${seed}:cat:${cat}`, [`קטגוריית ${cat}`, `מאמרים ב${cat}`, `עמוד ${cat}`]);
	}
	if (href.startsWith('/tags/')) {
		const tag = href.replace('/tags/', '').replace(/\/$/, '');
		return hashPick(`${seed}:tag:${tag}`, [`תגית ${tag}`, `נושא ${tag}`, `מאמרים ${tag}`]);
	}
	return null;
}

function removeDuplicateParagraphHrefs(body) {
	let b = body;
	const seen = new Set();
	const links = extractParagraphMarkdownLinks(b);
	for (const link of links) {
		if (!seen.has(link.href)) {
			seen.add(link.href);
			continue;
		}
		const idx = b.indexOf(link.full);
		if (idx < 0) continue;
		b = b.slice(0, idx) + link.anchor + b.slice(idx + link.full.length);
	}
	return b;
}

function pickContextualBlogTarget(donorSlug, donor, postsBySlug, body) {
	const linked = new Set(
		extractParagraphMarkdownLinks(body)
			.map((l) => slugFromBlogHref(l.href))
			.filter(Boolean),
	);
	const sameCat = [...postsBySlug.values()].filter(
		(p) =>
			p.slug !== donorSlug &&
			!linked.has(p.slug) &&
			p.category === donor?.category &&
			!OVERLINKED_HUBS.has(p.slug),
	);
	if (sameCat.length) return hashPick(`${donorSlug}:ctx`, sameCat.map((p) => p.slug));
	const any = [...postsBySlug.values()].filter(
		(p) => p.slug !== donorSlug && !linked.has(p.slug) && !OVERLINKED_HUBS.has(p.slug),
	);
	return any.length ? hashPick(`${donorSlug}:ctx2`, any.map((p) => p.slug)) : null;
}

function ensureContextualBlogLinks(body, donorSlug, postsBySlug) {
	const donor = postsBySlug.get(donorSlug);
	if (!donor) return body;
	const { words, blog } = densityBoundsForBody(body);
	if (!wordsAboveContextualThreshold(words)) return body;
	let b = body;
	let contextual = countBlogLinksInBody(b);

	const tryAddBlog = () => {
		const targetSlug = pickContextualBlogTarget(donorSlug, donor, postsBySlug, b);
		if (!targetSlug) return false;
		const target = postsBySlug.get(targetSlug);
		if (!target) return false;
		const href = `/blog/${targetSlug}/`;
		const anchor = resolveAnchorForTarget(target, donorSlug, targetSlug, 'ctx');
		if (canAddParagraphLink(b)) {
			const next = injectLinkIntoSection(b, href, anchor);
			if (next !== b) {
				b = next;
				return true;
			}
		}
		const links = extractParagraphMarkdownLinks(b);
		const navVictim = links.find(
			(l) =>
				l.href.startsWith('/tags/') ||
				l.href === '/tags/' ||
				l.href === '/categories/' ||
				l.href === '/about/' ||
				l.href === '/services/' ||
				l.href === '/blog/',
		);
		if (!navVictim) return false;
		const newFull = `[${anchor}](${href})`;
		b = b.replace(navVictim.full, newFull);
		logGraph('remediate', `swap nav->blog ${donorSlug}`, { from: navVictim.href, to: href });
		return true;
	};

	while (contextual < blog.min && contextual < MAX_BLOG_LINKS) {
		if (!tryAddBlog()) break;
		contextual = countBlogLinksInBody(b);
	}
	return b;
}

function injectLateralClusterLink(body, donorSlug, postsBySlug) {
	const donor = postsBySlug.get(donorSlug);
	if (!donor || !isCategoryClusterPost(donor)) return body;
	const clusterSlugs = [...postsBySlug.values()]
		.filter((p) => p.category === donor.category && isCategoryClusterPost(p) && p.slug !== donorSlug)
		.map((p) => p.slug);
	if (!clusterSlugs.length) return body;
	const hasLateral = extractParagraphMarkdownLinks(body).some((l) => {
		const t = slugFromBlogHref(l.href);
		return t && clusterSlugs.includes(t);
	});
	if (hasLateral) return body;
	const targetSlug = hashPick(`${donorSlug}:lat`, clusterSlugs);
	const target = postsBySlug.get(targetSlug);
	if (!target) return body;
	const href = `/blog/${targetSlug}/`;
	const anchor = resolveAnchorForTarget(target, donorSlug, targetSlug, 'lat');
	if (countBlogLinksInBody(body) >= MAX_BLOG_LINKS) {
		const links = extractParagraphMarkdownLinks(body).filter(
			(l) => l.href.startsWith('/blog/') && l.href !== '/blog/',
		);
		const navVictim = links.find((l) => OVERLINKED_HUBS.has(slugFromBlogHref(l.href) ?? '')) ?? links[links.length - 1];
		if (navVictim) return body.replace(navVictim.full, `[${anchor}](${href})`);
	}
	return injectLinkIntoSection(body, href, anchor);
}

function dedupeBrandHomeAnchors(body) {
	let b = body;
	const brandRe = /\[(גיא אבני(?: עורך דין)?)\]\(\/\)/gu;
	let seen = false;
	b = b.replace(brandRe, (full, anchor) => {
		if (!seen) {
			seen = true;
			return full;
		}
		return anchor;
	});
	return b;
}

function dedupeDuplicateAnchors(body) {
	let b = body;
	const seen = new Set();
	for (const link of extractParagraphMarkdownLinks(b)) {
		const key = link.anchor.trim();
		if (!seen.has(key)) {
			seen.add(key);
			continue;
		}
		const idx = b.indexOf(link.full);
		if (idx < 0) continue;
		b = b.slice(0, idx) + link.anchor + b.slice(idx + link.full.length);
	}
	return b;
}

function fixAnchorsInBody(body, postsBySlug, donorSlug) {
	return fixAllAnchorsInBody(body, postsBySlug, donorSlug);
}

function pickSiblingReplacement(donorSlug, hubSlug, postsBySlug, inbound) {
	const donor = postsBySlug.get(donorSlug);
	if (!donor) return null;
	const pillars = CATEGORY_PILLARS[donor.category] ?? [];
	const candidates = pillars.filter(
		(s) => s !== donorSlug && s !== hubSlug && !OVERLINKED_HUBS.has(s),
	);
	for (const c of candidates) {
		const alreadyLinked = extractParagraphMarkdownLinks(postsBySlug.get(donorSlug)?.content ?? '').some(
			(l) => slugFromBlogHref(l.href) === c,
		);
		if (!alreadyLinked) return c;
	}
	const sameCat = [...postsBySlug.values()].filter(
		(p) =>
			p.category === donor.category &&
			p.slug !== donorSlug &&
			p.slug !== hubSlug &&
			!OVERLINKED_HUBS.has(p.slug),
	);
	return sameCat.length ? hashPick(`${donorSlug}:sib`, sameCat.map((p) => p.slug)) : null;
}

function rebalanceHubLinks(body, donorSlug, postsBySlug) {
	let b = body;
	const links = extractParagraphMarkdownLinks(b);
	for (const link of links) {
		const target = slugFromBlogHref(link.href);
		if (!target || !OVERLINKED_HUBS.has(target)) continue;
		const replacement = pickSiblingReplacement(donorSlug, target, postsBySlug);
		if (!replacement) continue;
		const repPost = postsBySlug.get(replacement);
		const newHref = `/blog/${replacement}/`;
		const newAnchor = anchorVariants(repPost.title, `${donorSlug}:rep:${target}`, repPost);
		b = replaceLinkInBody(b, link.full, newAnchor, newHref);
	}
	return b;
}

function reduceBlogLinksOverMax(body, donorSlug, postsBySlug) {
	let b = body;
	const protectedHref = primaryPillarHref(donorSlug, postsBySlug);
	while (countBlogLinksInBody(b) > MAX_BLOG_LINKS) {
		const links = extractParagraphMarkdownLinks(b).filter(
			(l) => l.href.startsWith('/blog/') && l.href !== '/blog/',
		);
		const hubLink = links.find((l) => OVERLINKED_HUBS.has(slugFromBlogHref(l.href) ?? ''));
		const removable = links.filter((l) => l.href !== protectedHref);
		const toRemove = hubLink ?? removable[removable.length - 1];
		if (!toRemove) break;
		const tagFallback = hashPick(`${donorSlug}:tag`, ['/tags/', '/categories/']);
		const tagAnchor = tagFallback === '/tags/' ? 'תגיות במאגר' : 'קטגוריות תוכן';
		b = b.replace(toRemove.full, `[${tagAnchor}](${tagFallback})`);
	}
	return b;
}

function rebuildBodyFromSections(sections) {
	const parts = [];
	for (const s of sections) {
		if (s.heading) parts.push(`## ${s.heading}`);
		if (s.content.trim()) parts.push(s.content.trimEnd());
	}
	return `${parts.join('\n\n')}\n`;
}

function injectLinkIntoSection(body, href, anchor) {
	if (!canAddParagraphLink(body)) {
		logGraph('remediate', 'inject skip density max', { href });
		return body;
	}
	const sections = splitBodyByH2Sections(body);
	const upperSectionCount = Math.max(1, Math.ceil(sections.length / 2));
	for (let i = 0; i < upperSectionCount; i++) {
		const sec = sections[i];
		if (extractParagraphMarkdownLinks(sec.content).some((l) => l.href === href)) continue;
		const lines = sec.content.split('\n');
		const j = firstQualifyingParagraphIndex(lines, 0, lines.length);
		if (j < 0) continue;
		lines[j] = appendLinkToLine(lines[j], anchor, href);
		sec.content = lines.join('\n');
		return rebuildBodyFromSections(sections);
	}
	const lines = body.split('\n');
	const j = firstQualifyingParagraphIndex(lines, 0, Math.ceil(lines.length / 2));
	if (j >= 0) {
		lines[j] = appendLinkToLine(lines[j], anchor, href);
		return lines.join('\n');
	}
	return body;
}

function injectPillarLink(body, donorSlug, postsBySlug) {
	const donor = postsBySlug.get(donorSlug);
	if (!donor) return body;
	const pillarSlug = primaryPillarForCategory(donor.category, donorSlug);
	if (!pillarSlug || pillarSlug === donorSlug) return body;
	const pillar = postsBySlug.get(pillarSlug);
	if (!pillar) return body;
	const href = `/blog/${pillarSlug}/`;
	if (extractParagraphMarkdownLinks(body).some((l) => l.href === href)) return body;
	let anchor = pillar.mainKeyword && pillar.mainKeyword.length >= 4
		? pillar.mainKeyword
		: anchorVariants(pillar.title, `${donorSlug}:pillar:${pillarSlug}`);
	if (!anchorMatchesTarget(anchor, pillar)) {
		anchor = anchorVariants(pillar.title, `${donorSlug}:pillar`, pillar);
	}
	if (countBlogLinksInBody(body) >= MAX_BLOG_LINKS) {
		const categoryPillars = new Set(pillarsForCategory(donor.category));
		const links = extractParagraphMarkdownLinks(body).filter(
			(l) => l.href.startsWith('/blog/') && l.href !== '/blog/' && l.href !== href,
		);
		const toSwap =
			links.find((l) => {
				const s = slugFromBlogHref(l.href);
				return s && !categoryPillars.has(s) && !OVERLINKED_HUBS.has(s);
			}) ??
			links.find((l) => OVERLINKED_HUBS.has(slugFromBlogHref(l.href) ?? '')) ??
			links[links.length - 1];
		if (toSwap) {
			return body.replace(toSwap.full, `[${anchor}](${href})`);
		}
	}
	return injectLinkIntoSection(body, href, anchor);
}

function injectOrphanLink(body, donorSlug, orphanSlug, postsBySlug, inbound = new Map()) {
	const orphan = postsBySlug.get(orphanSlug);
	if (!orphan) return body;
	const href = `/blog/${orphanSlug}/`;
	const already = extractParagraphMarkdownLinks(body).some((l) => l.href === href);
	if (already) return body;
	if (!canAddParagraphLink(body)) {
		logGraph('remediate', 'orphan inject skip density', { donorSlug, orphanSlug });
		return body;
	}
	let anchor = resolveAnchorForTarget(orphan, donorSlug, orphanSlug, 'orphan');

	if (countBlogLinksInBody(body) >= MAX_BLOG_LINKS) {
		const protectedHref = primaryPillarHref(donorSlug, postsBySlug);
		const links = extractParagraphMarkdownLinks(body).filter(
			(l) => l.href.startsWith('/blog/') && l.href !== '/blog/' && l.href !== href && l.href !== protectedHref,
		);
		const toSwap = pickSwapBlogLink(links, inbound, protectedHref);
		if (toSwap) {
			return body.replace(toSwap.full, `[${anchor}](${href})`);
		}
		return body;
	}

	const sections = splitBodyByH2Sections(body);
	const upperSectionCount = Math.max(1, Math.ceil(sections.length / 2));
	for (let i = 0; i < upperSectionCount; i++) {
		const sec = sections[i];
		if (extractParagraphMarkdownLinks(sec.content).some((l) => l.href === href)) continue;
		const lines = sec.content.split('\n');
		const j = firstQualifyingParagraphIndex(lines, 0, lines.length);
		if (j < 0) continue;
		lines[j] = appendLinkToLine(lines[j], anchor, href);
		sec.content = lines.join('\n');
		return rebuildBodyFromSections(sections);
	}
	const lines = body.split('\n');
	const j = firstQualifyingParagraphIndex(lines, 0, Math.ceil(lines.length / 2));
	if (j >= 0) {
		lines[j] = appendLinkToLine(lines[j], anchor, href);
		return lines.join('\n');
	}
	logGraph('remediate', 'ERROR orphan inject no paragraph', { donorSlug, orphanSlug });
	return body;
}

function addMainKeywordAnchor(body, slug, mainKeyword) {
	if (!mainKeyword) return body;
	const links = extractParagraphMarkdownLinks(body);
	if (links.some((l) => l.anchor.includes(mainKeyword))) return body;
	const lines = body.split('\n');
	for (let i = 0; i < lines.length; i++) {
		const t = lines[i].trim();
		if (!t || t.startsWith('#') || /^[-*+]\s/.test(t)) continue;
		if (lines[i].includes(mainKeyword) && !lines[i].includes('[')) {
			const wrapped = lines[i].replace(mainKeyword, `[${mainKeyword}](/)`);
			lines[i] = wrapped;
			return lines.join('\n');
		}
	}
	for (let i = 0; i < lines.length; i++) {
		const t = lines[i].trim();
		if (!t || t.startsWith('#') || /^[-*+]\s/.test(t)) continue;
		lines[i] = `${lines[i]} ${mainKeyword} מלווה את הנושא במאמר זה.`;
		return lines.join('\n');
	}
	return body;
}

function dedupeParagraphLinks(body, donorSlug) {
	let b = body;
	const hrefCount = new Map();
	const anchorCount = new Map();
	const links = extractParagraphMarkdownLinks(b);
	const replacements = [
		{ href: '/contact/', anchor: 'יצירת קשר עם המשרד' },
		{ href: '/about/', anchor: 'רקע המשרד והצוות' },
		{ href: '/services/', anchor: 'מפת שירותים משפטיים' },
		{ href: '/categories/', anchor: 'ניווט לפי קטגוריות' },
		{ href: '/tags/', anchor: 'אינדקס תגיות' },
	];
	let offset = 0;
	for (const link of links) {
		const hCount = (hrefCount.get(link.href) ?? 0) + 1;
		const aCount = (anchorCount.get(link.anchor) ?? 0) + 1;
		hrefCount.set(link.href, hCount);
		anchorCount.set(link.anchor, aCount);
		if (hCount === 1 && aCount === 1) continue;
		const pick = replacements[(hCount + aCount) % replacements.length];
		const dupAnchor = clampAnchorWords(pick.anchor);
		const newFull = `[${dupAnchor}](${pick.href})`;
		const idx = b.indexOf(link.full, offset);
		if (idx < 0) continue;
		b = b.slice(0, idx) + newFull + b.slice(idx + link.full.length);
		offset = idx + newFull.length;
	}
	return b;
}

function pickSwapBlogLink(links, inbound, protectedHref) {
	const candidates = links.filter((l) => l.href !== protectedHref);
	if (!candidates.length) return null;
	const scored = candidates.map((l) => {
		const slug = slugFromBlogHref(l.href);
		const inCount = slug ? (inbound.get(slug)?.length ?? 0) : 99;
		const hubBoost = slug && OVERLINKED_HUBS.has(slug) ? 1000 : 0;
		return { link: l, score: hubBoost + inCount };
	});
	scored.sort((a, b) => b.score - a.score);
	return scored[0]?.link ?? null;
}

function meshOrphans(posts, postsBySlug, inbound, stats, minInbound = 1) {
	const orphans = posts.filter((p) => (inbound.get(p.slug) ?? []).length < minInbound);
	for (const orphan of orphans) {
		const donors = posts
			.filter((p) => p.slug !== orphan.slug)
			.sort((a, b) => {
				const aScore = a.category === orphan.category ? 2 : 0;
				const bScore = b.category === orphan.category ? 2 : 0;
				const aTag = orphan.tags.some((t) => a.tags.includes(t)) ? 1 : 0;
				const bTag = orphan.tags.some((t) => b.tags.includes(t)) ? 1 : 0;
				return bScore + bTag - (aScore + aTag);
			});
		for (const donor of donors) {
			if ((inbound.get(orphan.slug) ?? []).length >= minInbound) break;
			const fresh = postsBySlug.get(donor.slug);
			if (!fresh) continue;
			let newBody = injectOrphanLink(fresh.content, donor.slug, orphan.slug, postsBySlug, inbound);
			newBody = reduceBlogLinksOverMax(newBody, donor.slug, postsBySlug);
			newBody = trimExcessParagraphLinks(newBody, donor.slug, postsBySlug);
			newBody = fixAnchorsInBody(newBody, postsBySlug, donor.slug);
			if (newBody === fresh.content) continue;
			writePost(donor.slug, fresh.raw, newBody);
			stats.orphanLinks += 1;
			fresh.content = newBody;
			fresh.raw = fs.readFileSync(path.join(BLOG_DIR, `${donor.slug}.mdx`), 'utf8');
			const swapped = extractParagraphMarkdownLinks(fresh.content)
				.filter((l) => l.href.startsWith('/blog/') && l.href !== '/blog/')
				.map((l) => slugFromBlogHref(l.href))
				.filter(Boolean);
			for (const slug of swapped) {
				if (!inbound.has(slug)) inbound.set(slug, []);
				if (!inbound.get(slug).some((e) => e.from === donor.slug)) {
					inbound.get(slug).push({ from: donor.slug });
				}
			}
			// Rebuild inbound from graph after each write for accuracy
			const rebuilt = buildLinkGraph(loadAllPosts()).inbound;
			for (const [k, v] of rebuilt) inbound.set(k, v);
		}
	}
	return orphans.length;
}

const INTERNAL_LINKS_FM_MIN = 10;

function loadGitHeadRaw(slug) {
	try {
		return execSync(`git show HEAD:src/content/blog/${slug}.mdx`, {
			encoding: 'utf8',
			stdio: ['ignore', 'pipe', 'ignore'],
		});
	} catch (err) {
		logGraph('remediate', 'ERROR loadGitHeadRaw', { slug, err: String(err) });
		return null;
	}
}

/** Restore internalLinks FM when density trim left fewer than schema min (merge HEAD + paragraph hrefs). */
function repairFrontmatterInternalLinks(slug, raw, content) {
	const parsed = matter(raw);
	const paragraphHrefs = [...new Set(extractParagraphMarkdownLinks(content).map((l) => l.href))];
	let merged = [
		...new Set([
			...paragraphHrefs,
			...(Array.isArray(parsed.data.internalLinks) ? parsed.data.internalLinks.map(normalizePath) : []),
		]),
	];
	if (merged.length >= INTERNAL_LINKS_FM_MIN) {
		parsed.data.internalLinks = merged;
		return matter.stringify({ ...parsed, content });
	}
	const headRaw = loadGitHeadRaw(slug);
	if (headRaw) {
		const head = matter(headRaw);
		const headLinks = Array.isArray(head.data.internalLinks) ? head.data.internalLinks.map(normalizePath) : [];
		merged = [...new Set([...merged, ...headLinks])];
	}
	parsed.data.internalLinks = merged;
	logGraph('remediate', 'repair internalLinks FM', { slug, count: merged.length });
	return matter.stringify({ ...parsed, content });
}

function writePost(slug, raw, content) {
	const out = repairFrontmatterInternalLinks(slug, raw, content);
	fs.writeFileSync(path.join(BLOG_DIR, `${slug}.mdx`), out, 'utf8');
}

function main() {
	logGraph('remediate', 'starting batch internal links remediation');
	let posts = loadAllPosts();
	const postsBySlug = new Map(posts.map((p) => [p.slug, p]));
	let { inbound } = buildLinkGraph(posts);

	let stats = {
		anchorFixes: 0,
		hubRebalance: 0,
		orphanLinks: 0,
		keywordAnchors: 0,
		blogReduced: 0,
		pillarLinks: 0,
		densityTrimmed: 0,
		leyonStripped: 0,
		contextualBoosted: 0,
		lateralLinks: 0,
	};

	for (const p of posts) {
		let body = p.content;
		const before = body;
		const stripped = stripLegacyLeyonInjections(body);
		if (stripped !== body) {
			body = stripped;
			stats.leyonStripped += 1;
		}
		body = fixAnchorsInBody(body, postsBySlug, p.slug);
		const afterAnchors = body;
		const trimmed = trimExcessParagraphLinks(body, p.slug, postsBySlug);
		if (trimmed !== body) {
			body = trimmed;
			stats.densityTrimmed += 1;
		}
		body = injectPillarLink(body, p.slug, postsBySlug);
		if (body !== afterAnchors) stats.pillarLinks += 1;
		body = rebalanceHubLinks(body, p.slug, postsBySlug);
		body = reduceBlogLinksOverMax(body, p.slug, postsBySlug);
		body = trimExcessParagraphLinks(body, p.slug, postsBySlug);
		body = removeDuplicateParagraphHrefs(body);
		const boosted = ensureContextualBlogLinks(body, p.slug, postsBySlug);
		if (boosted !== body) {
			body = boosted;
			stats.contextualBoosted += 1;
		}
		body = trimExcessParagraphLinks(body, p.slug, postsBySlug);
		body = dedupeParagraphLinks(body, p.slug);
		body = removeDuplicateParagraphHrefs(body);
		body = dedupeBrandHomeAnchors(body);
		body = dedupeDuplicateAnchors(body);
		const lateral = injectLateralClusterLink(body, p.slug, postsBySlug);
		if (lateral !== body) {
			body = lateral;
			stats.lateralLinks += 1;
		}
		if (MAIN_KEYWORD_MISSING_ANCHORS.includes(p.slug)) {
			body = addMainKeywordAnchor(body, p.slug, p.mainKeyword);
		}
		if (body !== before) {
			writePost(p.slug, p.raw, body);
			stats.anchorFixes += 1;
		}
	}

	posts = loadAllPosts();
	({ inbound } = buildLinkGraph(posts));
	for (const p of posts) postsBySlug.set(p.slug, p);

	let orphanCount = meshOrphans(posts, postsBySlug, inbound, stats, 2);
	logGraph('remediate', `orphans to mesh: ${orphanCount}`);

	posts = loadAllPosts();
	for (const p of posts) postsBySlug.set(p.slug, p);
	for (const p of posts) {
		let body = trimExcessParagraphLinks(p.content, p.slug, postsBySlug);
		body = fixAnchorsInBody(body, postsBySlug, p.slug);
		if (countBlogLinksInBody(body) > MAX_BLOG_LINKS) {
			body = reduceBlogLinksOverMax(body, p.slug, postsBySlug);
			stats.blogReduced += 1;
		}
		if (body !== p.content) {
			writePost(p.slug, p.raw, body);
			stats.densityTrimmed += 1;
		}
	}

	posts = loadAllPosts();
	for (const p of posts) {
		let body = dedupeParagraphLinks(p.content, p.slug);
		body = removeDuplicateParagraphHrefs(body);
		body = ensureContextualBlogLinks(body, p.slug, postsBySlug);
		body = trimExcessParagraphLinks(body, p.slug, postsBySlug);
		body = fixAnchorsInBody(body, postsBySlug, p.slug);
		body = removeDuplicateParagraphHrefs(body);
		if (body !== p.content) writePost(p.slug, p.raw, body);
	}

	// Final pillar pass then iterative orphan mesh until stable
	posts = loadAllPosts();
	for (const p of posts) postsBySlug.set(p.slug, p);
	for (const p of posts) {
		let body = injectPillarLink(p.content, p.slug, postsBySlug);
		body = reduceBlogLinksOverMax(body, p.slug, postsBySlug);
		body = trimExcessParagraphLinks(body, p.slug, postsBySlug);
		body = fixAnchorsInBody(body, postsBySlug, p.slug);
		if (body !== p.content) {
			writePost(p.slug, p.raw, body);
			stats.pillarLinks += 1;
		}
	}

	for (let round = 0; round < 15; round++) {
		posts = loadAllPosts();
		({ inbound } = buildLinkGraph(posts));
		for (const p of posts) postsBySlug.set(p.slug, p);
		const remaining = posts.filter((p) => (inbound.get(p.slug) ?? []).length === 0).length;
		if (remaining === 0) break;
		logGraph('remediate', `orphan mesh round ${round + 1}: ${remaining} orphans`);
		meshOrphans(posts, postsBySlug, inbound, stats, 1);
	}

	posts = loadAllPosts();
	for (const p of posts) postsBySlug.set(p.slug, p);
	for (const p of posts) {
		let body = stripLegacyLeyonInjections(p.content);
		body = fixAnchorsInBody(body, postsBySlug, p.slug);
		body = ensureContextualBlogLinks(body, p.slug, postsBySlug);
		body = trimExcessParagraphLinks(body, p.slug, postsBySlug);
		body = reduceBlogLinksOverMax(body, p.slug, postsBySlug);
		body = removeDuplicateParagraphHrefs(body);
		body = dedupeBrandHomeAnchors(body);
		body = dedupeDuplicateAnchors(body);
		if (body !== p.content) writePost(p.slug, p.raw, body);
	}

	posts = loadAllPosts();
	let fmRepaired = 0;
	for (const p of posts) {
		const out = repairFrontmatterInternalLinks(p.slug, p.raw, p.content);
		if (out !== fs.readFileSync(path.join(BLOG_DIR, `${p.slug}.mdx`), 'utf8')) {
			fs.writeFileSync(path.join(BLOG_DIR, `${p.slug}.mdx`), out, 'utf8');
			fmRepaired += 1;
		}
	}
	stats.fmRepaired = fmRepaired;

	logGraph('remediate', 'done', stats);
	console.log(JSON.stringify(stats, null, 2));
}

main();
