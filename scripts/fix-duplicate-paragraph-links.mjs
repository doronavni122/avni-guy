#!/usr/bin/env node
/** Fix duplicate paragraph href/anchor per article after orphan mesh. */
import fs from 'node:fs';
import path from 'node:path';
import {
	BLOG_DIR,
	extractParagraphMarkdownLinks,
	loadAllPosts,
	logGraph,
	titleAnchorFragment,
	writeMdxWithSyncedLinks,
} from './lib/internal-link-graph.mjs';

let allPostsCache = null;

function siblingBlogFallback(slug, category, usedHrefs) {
	if (!allPostsCache) allPostsCache = loadAllPosts();
	for (const p of allPostsCache) {
		if (p.slug === slug) continue;
		if (p.category !== category) continue;
		const href = `/blog/${p.slug}/`;
		if (!usedHrefs.has(href)) {
			return { href, anchor: titleAnchorFragment(p.title) };
		}
	}
	return null;
}

function buildFallbackPool(tags, category) {
	const pool = [
		{ href: '/contact/', anchor: 'יצירת קשר עם המשרד' },
		{ href: '/about/', anchor: 'רקע המשרד והצוות' },
		{ href: '/services/', anchor: 'מפת שירותים משפטיים' },
		{ href: '/categories/', anchor: 'ניווט לפי קטגוריות' },
		{ href: '/tags/', anchor: 'אינדקס תגיות' },
		{ href: '/blog/', anchor: 'מאגר מאמרים מקצועיים' },
	];
	if (category) pool.push({ href: `/categories/${category}/`, anchor: `קטגוריית ${category}` });
	for (const tag of tags) {
		pool.push({ href: `/tags/${tag}/`, anchor: `תגית ${tag}` });
	}
	return pool;
}

function countBlogLinks(body) {
	return extractParagraphMarkdownLinks(body).filter((l) => l.href.startsWith('/blog/') && l.href !== '/blog/').length;
}

function fixDuplicates(body, slug, tags, category) {
	let b = body;
	const usedHrefs = new Set();
	const usedAnchors = new Set();
	const pool = buildFallbackPool(tags, category);
	let poolIdx = 0;
	const links = extractParagraphMarkdownLinks(b);
	let searchFrom = 0;
	let serial = 0;

	for (const link of links) {
		const dupH = usedHrefs.has(link.href);
		const dupA = usedAnchors.has(link.anchor);
		if (!usedHrefs.has(link.href)) usedHrefs.add(link.href);
		if (!usedAnchors.has(link.anchor)) usedAnchors.add(link.anchor);

		if (!dupH && !dupA) continue;

		let pick = null;
		for (const candidate of pool.slice(poolIdx)) {
			if (!usedHrefs.has(candidate.href) && !usedAnchors.has(candidate.anchor)) {
				pick = candidate;
				poolIdx = pool.indexOf(candidate) + 1;
				break;
			}
		}
		if (!pick) {
			const sib = siblingBlogFallback(slug, category, usedHrefs);
			if (sib && countBlogLinks(b) < 4) pick = sib;
		}
		if (!pick && !dupH && dupA) {
			serial += 1;
			pick = { href: link.href, anchor: `${link.anchor} ${serial}` };
		}
		if (!pick && dupH) {
			const idx = b.indexOf(link.full, searchFrom);
			if (idx >= 0) {
				b = b.slice(0, idx) + link.anchor + b.slice(idx + link.full.length);
				searchFrom = idx + link.anchor.length;
			}
			continue;
		}
		if (!pick) continue;

		const newFull = `[${pick.anchor}](${pick.href})`;
		usedHrefs.add(pick.href);
		usedAnchors.add(pick.anchor);

		const idx = b.indexOf(link.full, searchFrom);
		if (idx < 0) continue;
		b = b.slice(0, idx) + newFull + b.slice(idx + link.full.length);
		searchFrom = idx + newFull.length;
	}
	return b;
}

function resolveSlugFilter() {
	const raw = process.env.PIPELINE_SLUGS?.trim();
	if (!raw) return null;
	return new Set(raw.split(',').map((s) => s.trim()).filter(Boolean));
}

function main() {
	const slugFilter = resolveSlugFilter();
	logGraph('dedupe', 'fixing duplicate paragraph links', {
		scoped: Boolean(slugFilter),
	});
	let totalFixed = 0;
	for (let round = 0; round < 10; round++) {
		const posts = loadAllPosts();
		let fixed = 0;
		for (const p of posts) {
			if (slugFilter && !slugFilter.has(p.slug)) continue;
			const body = fixDuplicates(p.content, p.slug, p.tags, p.category);
			if (body !== p.content) {
				fs.writeFileSync(path.join(BLOG_DIR, `${p.slug}.mdx`), writeMdxWithSyncedLinks(p.raw, body), 'utf8');
				fixed += 1;
			}
		}
		totalFixed += fixed;
		logGraph('dedupe', `round ${round + 1}: fixed ${fixed}`);
		if (fixed === 0) break;
	}
	logGraph('dedupe', `total fixed ${totalFixed} article passes`);
}

main();
