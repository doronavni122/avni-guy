#!/usr/bin/env node
import {
	anchorMatchesTarget,
	auditAnchorTypeDistribution,
	auditInternalNofollowLinks,
	auditLateralClusterLinks,
	auditSiteWideAnchorCollisions,
	buildLinkGraph,
	computeDonorDiversityMetrics,
	extractNonParagraphMarkdownLinks,
	isAnchorTooLong,
	isEnglishSlugAnchor,
	isGarbageAnchor,
	loadAllPosts,
	logGraph,
	MAX_BLOG_LINKS,
	normalizePath,
	pillarsForCategory,
	primaryPillarForCategory,
	slugFromBlogHref,
} from './lib/internal-link-graph.mjs';
import { isGlobalPillarSlug } from './lib/pillar-cluster-registry.mjs';

function auditPillarBidirectional(posts) {
	const missingSpokeToPillar = [];
	const missingPillarToSpoke = [];
	for (const p of posts) {
		if (isGlobalPillarSlug(p.slug)) continue;
		const pillars = pillarsForCategory(p.category);
		if (!pillars.length) continue;
		if (pillars.includes(p.slug)) continue;
		const primary = primaryPillarForCategory(p.category, p.slug);
		if (!primary || primary === p.slug) continue;
		const href = `/blog/${primary}/`;
		const hasPillar = p.paragraphLinks.some((l) => l.href === href);
		if (!hasPillar) {
			missingSpokeToPillar.push(p.slug);
		}
	}
	for (const p of posts) {
		if (!pillarsForCategory(p.category).includes(p.slug) && !isGlobalPillarSlug(p.slug)) continue;
		const spokes = posts.filter(
			(s) => s.category === p.category && s.slug !== p.slug && !isGlobalPillarSlug(s.slug),
		);
		const linkedSlugs = new Set(
			p.paragraphLinks
				.map((l) => slugFromBlogHref(l.href))
				.filter(Boolean),
		);
		const unlinked = spokes.filter((s) => !linkedSlugs.has(s.slug)).length;
		if (unlinked > Math.max(3, spokes.length * 0.5)) {
			missingPillarToSpoke.push(`${p.slug}: ${unlinked}/${spokes.length} category spokes not linked`);
		}
	}
	return { missingSpokeToPillar, missingPillarToSpoke };
}

function auditBlogAnchorKeywords(posts, postsBySlug) {
	const issues = [];
	for (const p of posts) {
		for (const link of p.paragraphLinks) {
			const targetSlug = slugFromBlogHref(link.href);
			if (!targetSlug) continue;
			const target = postsBySlug.get(targetSlug);
			if (!target) continue;
			if (!anchorMatchesTarget(link.anchor, target)) {
				issues.push({ slug: p.slug, anchor: link.anchor, href: link.href });
			}
		}
	}
	return issues;
}

function main() {
	logGraph('audit', 'starting internal link graph audit');
	const posts = loadAllPosts();
	const expandedInbound = process.env.LINK_INBOUND_EXPANDED === '1';
	const { inbound, postsBySlug, mode } = buildLinkGraph(posts, { expandedInbound });
	let fail = false;

	console.log(`\n=== LINK GRAPH SUMMARY ===`);
	console.log(`Total articles: ${posts.length}`);
	console.log(`Inbound graph mode: ${mode} (LINK_INBOUND_EXPANDED=1 for all paragraph blog inbounds)`);

	const orphans = posts.filter((p) => (inbound.get(p.slug) ?? []).length === 0);
	const orphanPct = ((orphans.length / posts.length) * 100).toFixed(1);
	console.log(`Orphans (0 inbound blog): ${orphans.length} (${orphanPct}%)`);
	if (orphans.length) {
		console.log(`  sample: ${orphans.slice(0, 8).map((p) => p.slug).join(', ')}`);
		if (process.env.LINKS_AUDIT_ENFORCE === '1') {
			fail = true;
			for (const o of orphans) {
				console.error(`[links:audit] FAIL orphan: ${o.slug}`);
			}
		}
	}

	const diversity = computeDonorDiversityMetrics(inbound, posts);
	console.log(`Donor diversity: avg=${diversity.avgDonors} single-donor=${diversity.singleDonorTargets} zero-donor=${diversity.zeroDonorTargets}`);
	console.log('Top outbound blog donors:');
	for (const d of diversity.topDonors.slice(0, 5)) {
		console.log(`  ${d.slug}: ${d.outboundBlogLinks} blog outlinks`);
	}

	const overBlog = posts.filter((p) => p.blogOutCount > MAX_BLOG_LINKS);
	console.log(`Posts with >${MAX_BLOG_LINKS} blog links: ${overBlog.length}`);
	if (overBlog.length) {
		fail = true;
		for (const p of overBlog) {
			console.error(`[links:audit] FAIL blog>${MAX_BLOG_LINKS}: ${p.slug} (${p.blogOutCount})`);
		}
	}

	const englishSlugIssues = [];
	const garbageIssues = [];
	for (const p of posts) {
		for (const link of p.paragraphLinks) {
			if (link.href.startsWith('/blog/') && isEnglishSlugAnchor(link.anchor)) {
				englishSlugIssues.push({ slug: p.slug, anchor: link.anchor, href: link.href });
			}
			if (isGarbageAnchor(link.anchor)) {
				garbageIssues.push({ slug: p.slug, anchor: link.anchor, href: link.href });
			}
			if (isAnchorTooLong(link.anchor)) {
				garbageIssues.push({ slug: p.slug, anchor: link.anchor, href: link.href, reason: 'anchor-too-long' });
			}
		}
	}
	console.log(`English-slug anchors: ${englishSlugIssues.length}`);
	console.log(`Garbage anchors: ${garbageIssues.length}`);
	if (englishSlugIssues.length) {
		fail = true;
		for (const i of englishSlugIssues.slice(0, 20)) {
			console.error(`[links:audit] FAIL english-slug: ${i.slug} "${i.anchor}" -> ${i.href}`);
		}
		if (englishSlugIssues.length > 20) console.error(`... and ${englishSlugIssues.length - 20} more`);
	}
	if (garbageIssues.length) {
		fail = true;
		for (const i of garbageIssues.slice(0, 20)) {
			console.error(`[links:audit] FAIL garbage: ${i.slug} "${i.anchor}" -> ${i.href}`);
		}
	}

	const anchorKwIssues = auditBlogAnchorKeywords(posts, postsBySlug);
	console.log(`Blog anchors missing target keyword/title tokens: ${anchorKwIssues.length}`);
	if (process.env.CONTENT_LINKS_STRICT === '1' && anchorKwIssues.length) {
		fail = true;
		for (const i of anchorKwIssues.slice(0, 15)) {
			console.error(`[links:audit] FAIL anchor-keyword: ${i.slug} "${i.anchor}" -> ${i.href}`);
		}
	}

	const { missingSpokeToPillar, missingPillarToSpoke } = auditPillarBidirectional(posts);
	console.log(`Spokes missing category pillar link: ${missingSpokeToPillar.length}`);
	console.log(`Pillars with sparse spoke coverage: ${missingPillarToSpoke.length}`);
	if (process.env.LINKS_AUDIT_ENFORCE === '1' && missingSpokeToPillar.length) {
		fail = true;
		for (const s of missingSpokeToPillar.slice(0, 20)) {
			console.error(`[links:audit] FAIL spoke->pillar: ${s}`);
		}
		if (missingSpokeToPillar.length > 20) {
			console.error(`... and ${missingSpokeToPillar.length - 20} more spoke->pillar gaps`);
		}
	}
	if (missingPillarToSpoke.length) {
		for (const e of missingPillarToSpoke.slice(0, 5)) {
			console.log(`  pillar coverage: ${e}`);
		}
		if (process.env.LINKS_AUDIT_ENFORCE === '1') {
			fail = true;
			for (const e of missingPillarToSpoke.slice(0, 15)) {
				console.error(`[links:audit] FAIL pillar->spoke sparse: ${e}`);
			}
			if (missingPillarToSpoke.length > 15) {
				console.error(`... and ${missingPillarToSpoke.length - 15} more pillar->spoke gaps`);
			}
		}
	}

	const lateral = auditLateralClusterLinks(posts);
	console.log(`Cluster posts missing lateral same-category link: ${lateral.missingLateral.length}/${lateral.clusterCount}`);
	if (lateral.missingLateral.length) {
		console.log(`  sample: ${lateral.missingLateral.slice(0, 8).join(', ')}`);
		if (process.env.LINKS_AUDIT_ENFORCE === '1') {
			fail = true;
			for (const s of lateral.missingLateral.slice(0, 15)) {
				console.error(`[links:audit] FAIL lateral-cluster: ${s}`);
			}
		}
	}

	console.log('\n=== ANCHOR QUALITY (site-wide) ===');
	const collisions = auditSiteWideAnchorCollisions(posts);
	console.log(`Same anchor -> multiple URLs: ${collisions.length}`);
	for (const c of collisions.slice(0, 5)) {
		console.log(`  "${c.anchor}" -> ${c.hrefs.join(', ')}`);
	}
	if (process.env.LINKS_AUDIT_ENFORCE === '1' && collisions.length) {
		fail = true;
		for (const c of collisions.slice(0, 10)) {
			console.error(`[links:audit] FAIL anchor-collision: "${c.anchor}" -> ${c.hrefs.join(' | ')}`);
		}
	}

	const anchorTypes = auditAnchorTypeDistribution(posts, postsBySlug);
	console.log(
		`Anchor types (blog links): exact=${anchorTypes.counts.exact} partial=${anchorTypes.counts.partial} branded=${anchorTypes.counts.branded} natural=${anchorTypes.counts.natural}`,
	);
	console.log(`Exact-match ratio: ${anchorTypes.exactMatchRatio} (${anchorTypes.blogLinks} blog links)`);
	if (process.env.CONTENT_LINKS_STRICT === '1' && anchorTypes.exactMatchRatio > 0.35) {
		fail = true;
		console.error(`[links:audit] FAIL exact-match over-optimization: ratio=${anchorTypes.exactMatchRatio}`);
	}

	const nonParagraph = [];
	const nofollowIssues = [];
	for (const p of posts) {
		nonParagraph.push(...extractNonParagraphMarkdownLinks(p.content).map((l) => ({ slug: p.slug, ...l })));
		nofollowIssues.push(...auditInternalNofollowLinks(p.content, p.slug));
	}
	console.log(`Non-paragraph internal links (heading/list/image): ${nonParagraph.length}`);
	console.log(`Internal nofollow/rel issues: ${nofollowIssues.length}`);
	if (nonParagraph.length) {
		for (const l of nonParagraph.slice(0, 5)) {
			console.log(`  ${l.slug} [${l.context}]: ${l.href}`);
		}
	}
	if (nofollowIssues.length) {
		fail = true;
		for (const i of nofollowIssues.slice(0, 10)) {
			console.error(`[links:audit] FAIL internal-nofollow: ${i.slug}:${i.line} ${i.kind}`);
		}
	}

	const fmSyncFails = [];
	for (const p of posts) {
		const bodyHrefs = [...new Set(p.paragraphLinks.map((l) => l.href))];
		const fmSet = new Set(p.internalLinks.map(normalizePath));
		for (const h of bodyHrefs) {
			if (!fmSet.has(h)) {
				fmSyncFails.push(`${p.slug}: body href ${h} missing from internalLinks`);
				break;
			}
		}
		for (const h of p.internalLinks) {
			if (!bodyHrefs.includes(h)) {
				fmSyncFails.push(`${p.slug}: internalLinks ${h} missing from body`);
				break;
			}
		}
	}
	console.log(`FM/body sync failures: ${fmSyncFails.length}`);
	if (fmSyncFails.length) {
		fail = true;
		for (const e of fmSyncFails.slice(0, 10)) console.error(`[links:audit] FAIL sync: ${e}`);
	}

	const inboundCounts = posts
		.map((p) => ({ slug: p.slug, count: (inbound.get(p.slug) ?? []).length }))
		.sort((a, b) => b.count - a.count);
	console.log(`\nTop inbound blog targets:`);
	for (const t of inboundCounts.slice(0, 8)) {
		console.log(`  ${t.slug}: ${t.count}`);
	}

	if (process.env.LINKS_AUDIT_ENFORCE === '1' && fail) {
		logGraph('audit', 'FAILED');
		process.exit(1);
	}
	logGraph('audit', fail ? 'completed with issues (non-enforced)' : 'PASSED');
	process.exit(fail && process.env.LINKS_AUDIT_ENFORCE === '1' ? 1 : 0);
}

main();
