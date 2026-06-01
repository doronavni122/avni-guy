#!/usr/bin/env node
/**
 * Batch internal links remediation: anchors, orphan mesh, hub rebalance, mainKeyword anchors.
 * Run: node scripts/remediate-internal-links-batch.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import {
	BLOG_DIR,
	buildLinkGraph,
	countBlogLinksInBody,
	extractParagraphMarkdownLinks,
	isEnglishSlugAnchor,
	isGarbageAnchor,
	loadAllPosts,
	logGraph,
	MAX_BLOG_LINKS,
	normalizePath,
	slugFromBlogHref,
	writeMdxWithSyncedLinks,
	titleAnchorFragment,
	anchorMatchesTarget,
	splitBodyByH2Sections,
} from './lib/internal-link-graph.mjs';
import {
	CATEGORY_PILLARS,
	primaryPillarForCategory,
	pillarsForCategory,
} from './lib/pillar-cluster-registry.mjs';

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

function anchorVariants(title, seed) {
	const frag = titleAnchorFragment(title);
	const pools = [
		frag,
		`מדריך: ${frag}`,
		`המשך בנושא ${frag}`,
		`קראו על ${frag}`,
	];
	return hashPick(seed, pools);
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

function fixAnchorsInBody(body, postsBySlug, donorSlug) {
	let b = body;
	const links = extractParagraphMarkdownLinks(b);
	for (const link of links) {
		const targetSlug = slugFromBlogHref(link.href);
		const target = targetSlug ? postsBySlug.get(targetSlug) : null;
		const isBlog = Boolean(targetSlug);
		const needsFix =
			isGarbageAnchor(link.anchor) ||
			(isBlog && (isEnglishSlugAnchor(link.anchor) || /[a-z]{3,}/.test(link.anchor)));
		if (!needsFix) continue;
		let newAnchor;
		if (isBlog && target) {
			newAnchor = anchorVariants(target.title, `${donorSlug}:${targetSlug}:${link.anchor}`);
		} else {
			newAnchor = navAnchorFor(link.href, `${donorSlug}:${link.href}:${link.anchor}`);
		}
		if (!newAnchor || newAnchor === link.anchor) continue;
		b = replaceLinkInBody(b, link.full, newAnchor, link.href);
	}
	return b;
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
		const newAnchor = anchorVariants(repPost.title, `${donorSlug}:rep:${target}`);
		b = replaceLinkInBody(b, link.full, newAnchor, newHref);
	}
	return b;
}

function reduceBlogLinksOverMax(body, donorSlug, postsBySlug) {
	let b = body;
	while (countBlogLinksInBody(b) > MAX_BLOG_LINKS) {
		const links = extractParagraphMarkdownLinks(b).filter(
			(l) => l.href.startsWith('/blog/') && l.href !== '/blog/',
		);
		const hubLink = links.find((l) => OVERLINKED_HUBS.has(slugFromBlogHref(l.href) ?? ''));
		const toRemove = hubLink ?? links[links.length - 1];
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
	const sections = splitBodyByH2Sections(body);
	for (let i = sections.length - 1; i >= 0; i--) {
		const sec = sections[i];
		if (extractParagraphMarkdownLinks(sec.content).some((l) => l.href === href)) continue;
		const lines = sec.content.split('\n');
		for (let j = lines.length - 1; j >= 0; j--) {
			const t = lines[j].trim();
			if (!t || t.startsWith('#') || /^[-*+]\s/.test(t) || /^\d+\.\s/.test(t)) continue;
			lines[j] = `${lines[j]} לעיון: [${anchor}](${href}).`;
			sec.content = lines.join('\n');
			return rebuildBodyFromSections(sections);
		}
	}
	const lines = body.split('\n');
	for (let i = lines.length - 1; i >= 0; i--) {
		const t = lines[i].trim();
		if (!t || t.startsWith('#') || /^[-*+]\s/.test(t) || /^\d+\.\s/.test(t)) continue;
		lines[i] = `${lines[i]} לעיון: [${anchor}](${href}).`;
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
	const anchor = pillar.mainKeyword && pillar.mainKeyword.length >= 4
		? pillar.mainKeyword
		: anchorVariants(pillar.title, `${donorSlug}:pillar:${pillarSlug}`);
	if (!anchorMatchesTarget(anchor, pillar)) {
		return injectLinkIntoSection(body, href, anchorVariants(pillar.title, `${donorSlug}:pillar`));
	}
	return injectLinkIntoSection(body, href, anchor);
}

function injectOrphanLink(body, donorSlug, orphanSlug, postsBySlug) {
	const orphan = postsBySlug.get(orphanSlug);
	if (!orphan) return body;
	const href = `/blog/${orphanSlug}/`;
	const already = extractParagraphMarkdownLinks(body).some((l) => l.href === href);
	if (already) return body;
	const anchor = anchorVariants(orphan.title, `${donorSlug}:orphan:${orphanSlug}`);

	if (countBlogLinksInBody(body) >= MAX_BLOG_LINKS) {
		const links = extractParagraphMarkdownLinks(body).filter(
			(l) => l.href.startsWith('/blog/') && l.href !== '/blog/',
		);
		const hubLink = links.find((l) => OVERLINKED_HUBS.has(slugFromBlogHref(l.href) ?? ''));
		const toSwap = hubLink ?? links[links.length - 1];
		if (toSwap) {
			return body.replace(toSwap.full, `[${anchor}](${href})`);
		}
		return body;
	}

	const lines = body.split('\n');
	for (let i = lines.length - 1; i >= 0; i--) {
		const t = lines[i].trim();
		if (!t || t.startsWith('#') || /^[-*+]\s/.test(t) || /^\d+\.\s/.test(t)) continue;
		if (t.includes('](http')) continue;
		lines[i] = `${lines[i]} לעיון נוסף: [${anchor}](${href}).`;
		return lines.join('\n');
	}
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
		const newFull =
			hCount > 1
				? `[${pick.anchor}](${pick.href})`
				: `[${link.anchor} - פירוט](${link.href})`;
		const idx = b.indexOf(link.full, offset);
		if (idx < 0) continue;
		b = b.slice(0, idx) + newFull + b.slice(idx + link.full.length);
		offset = idx + newFull.length;
	}
	return b;
}

function writePost(slug, raw, content) {
	const out = writeMdxWithSyncedLinks(raw, content);
	fs.writeFileSync(path.join(BLOG_DIR, `${slug}.mdx`), out, 'utf8');
}

function main() {
	logGraph('remediate', 'starting batch internal links remediation');
	let posts = loadAllPosts();
	const postsBySlug = new Map(posts.map((p) => [p.slug, p]));
	let { inbound } = buildLinkGraph(posts);

	let stats = { anchorFixes: 0, hubRebalance: 0, orphanLinks: 0, keywordAnchors: 0, blogReduced: 0, pillarLinks: 0 };

	for (const p of posts) {
		let body = p.content;
		const before = body;
		body = fixAnchorsInBody(body, postsBySlug, p.slug);
		const afterAnchors = body;
		body = injectPillarLink(body, p.slug, postsBySlug);
		if (body !== afterAnchors) stats.pillarLinks += 1;
		body = rebalanceHubLinks(body, p.slug, postsBySlug);
		body = reduceBlogLinksOverMax(body, p.slug, postsBySlug);
		body = dedupeParagraphLinks(body, p.slug);
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

	const orphans = posts.filter((p) => (inbound.get(p.slug) ?? []).length === 0);
	logGraph('remediate', `orphans to mesh: ${orphans.length}`);

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
			if ((inbound.get(orphan.slug) ?? []).length >= 2) break;
			const fresh = postsBySlug.get(donor.slug);
			if (!fresh) continue;
			const newBody = injectOrphanLink(fresh.content, donor.slug, orphan.slug, postsBySlug);
			if (newBody !== fresh.content) {
				let finalBody = dedupeParagraphLinks(newBody, donor.slug);
				writePost(donor.slug, fresh.raw, finalBody);
				stats.orphanLinks += 1;
				fresh.content = finalBody;
				fresh.raw = fs.readFileSync(path.join(BLOG_DIR, `${donor.slug}.mdx`), 'utf8');
				if (!inbound.has(orphan.slug)) inbound.set(orphan.slug, []);
				inbound.get(orphan.slug).push({ from: donor.slug });
			}
		}
	}

	posts = loadAllPosts();
	for (const p of posts) {
		if (countBlogLinksInBody(p.content) > MAX_BLOG_LINKS) {
			const body = reduceBlogLinksOverMax(p.content, p.slug, postsBySlug);
			writePost(p.slug, p.raw, body);
			stats.blogReduced += 1;
		}
	}

	posts = loadAllPosts();
	for (const p of posts) {
		const body = dedupeParagraphLinks(p.content, p.slug);
		if (body !== p.content) writePost(p.slug, p.raw, body);
	}

	logGraph('remediate', 'done', stats);
	console.log(JSON.stringify(stats, null, 2));
}

main();
