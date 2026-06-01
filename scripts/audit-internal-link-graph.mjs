#!/usr/bin/env node
import {
	buildLinkGraph,
	ENGLISH_SLUG_ANCHOR_PATTERNS,
	GARBAGE_ANCHOR_PATTERNS,
	isEnglishSlugAnchor,
	isGarbageAnchor,
	loadAllPosts,
	logGraph,
	MAX_BLOG_LINKS,
	normalizePath,
	slugFromBlogHref,
} from './lib/internal-link-graph.mjs';

function main() {
	logGraph('audit', 'starting internal link graph audit');
	const posts = loadAllPosts();
	const { inbound } = buildLinkGraph(posts);
	let fail = false;

	const orphans = posts.filter((p) => (inbound.get(p.slug) ?? []).length === 0);
	const orphanPct = ((orphans.length / posts.length) * 100).toFixed(1);
	console.log(`\n=== LINK GRAPH SUMMARY ===`);
	console.log(`Total articles: ${posts.length}`);
	console.log(`Orphans (0 inbound blog): ${orphans.length} (${orphanPct}%)`);

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
		if (garbageIssues.length > 20) console.error(`... and ${garbageIssues.length - 20} more`);
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
