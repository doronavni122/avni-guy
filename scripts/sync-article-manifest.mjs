#!/usr/bin/env node
/**
 * Compare KEYWORD_STUB_SLUGS + SITE_KEYWORDS_BATCH vs blog MDX glob.
 * SSOT output: article-slug-manifest.json (with --write).
 * Log: [content-pipeline-2026]
 */
import fs from 'node:fs';
import path from 'node:path';
import { KEYWORD_STUB_SLUGS } from './lib/keyword-stub-slugs.mjs';
import { SITE_KEYWORDS_BATCH } from './lib/site-keywords-batch.mjs';

const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog');
const MANIFEST_PATH = path.join(process.cwd(), 'article-slug-manifest.json');

function log(msg, extra) {
	if (extra !== undefined) console.error(`[content-pipeline-2026] ${msg}`, extra);
	else console.error(`[content-pipeline-2026] ${msg}`);
}

function logErr(msg, extra) {
	console.error(`[content-pipeline-2026] ERROR ${msg}`, extra ?? '');
}

function listMdxSlugs() {
	if (!fs.existsSync(BLOG_DIR)) return [];
	return fs
		.readdirSync(BLOG_DIR)
		.filter((f) => f.endsWith('.mdx'))
		.map((f) => f.replace(/\.mdx$/, ''))
		.sort();
}

function detectStubMarkers(slug) {
	const fp = path.join(BLOG_DIR, `${slug}.mdx`);
	let raw;
	try {
		raw = fs.readFileSync(fp, 'utf8');
	} catch {
		return { missing: true };
	}
	return {
		missing: false,
		hasUniqueStubToken: raw.includes('-unique-'),
		hasPlaceholderImage: raw.includes('Placeholder image for stub article'),
	};
}

function buildManifest() {
	const expectedSlugs = [...KEYWORD_STUB_SLUGS];
	const expectedSet = new Set(expectedSlugs);
	const mdxSlugs = listMdxSlugs();
	const mdxSet = new Set(mdxSlugs);

	const missingMdx = expectedSlugs.filter((s) => !mdxSet.has(s));
	const extraStubListedButMissing = missingMdx;
	const legacyMdxSlugs = mdxSlugs.filter((s) => !expectedSet.has(s));
	const unexpectedMdxForBatch = mdxSlugs.filter((s) => s.startsWith('guy-avni-') && !expectedSet.has(s));

	const stubMarkers = Object.fromEntries(
		expectedSlugs.map((slug) => [slug, detectStubMarkers(slug)]),
	);

	const likelyStubBodies = expectedSlugs.filter((slug) => {
		const m = stubMarkers[slug];
		return m?.hasUniqueStubToken || m?.hasPlaceholderImage;
	});

	const batchKeywordCountMismatch =
		SITE_KEYWORDS_BATCH.length !== expectedSlugs.length
			? {
					keywords: SITE_KEYWORDS_BATCH.length,
					slugs: expectedSlugs.length,
				}
			: null;

	return {
		generatedAt: new Date().toISOString(),
		expectedSlugs,
		expectedCount: expectedSlugs.length,
		mdxCount: mdxSlugs.length,
		legacyMdxCount: legacyMdxSlugs.length,
		batchKeywordCount: SITE_KEYWORDS_BATCH.length,
		batchKeywordCountMismatch,
		missingMdx,
		legacyMdxSlugs,
		unexpectedMdxForBatchCount: unexpectedMdxForBatch.length,
		likelyStubBodies,
		stubMarkers,
		ok: missingMdx.length === 0 && !batchKeywordCountMismatch,
	};
}

function main() {
	const write = process.argv.includes('--write');
	const jsonOnly = process.argv.includes('--json');

	log('step manifest: start sync');

	const manifest = buildManifest();

	if (write) {
		fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
		log('step manifest: wrote', { path: MANIFEST_PATH });
	}

	if (jsonOnly) {
		console.log(JSON.stringify(manifest, null, 2));
	} else {
		console.log(
			JSON.stringify(
				{
					ok: manifest.ok,
					expectedCount: manifest.expectedCount,
					mdxCount: manifest.mdxCount,
					missingMdx: manifest.missingMdx,
					likelyStubBodies: manifest.likelyStubBodies,
					batchKeywordCountMismatch: manifest.batchKeywordCountMismatch,
				},
				null,
				2,
			),
		);
	}

	if (manifest.missingMdx.length) {
		logErr('missing MDX for expected stub slugs', { count: manifest.missingMdx.length });
		for (const slug of manifest.missingMdx.slice(0, 20)) logErr('missing', slug);
	}

	if (manifest.batchKeywordCountMismatch) {
		logErr('SITE_KEYWORDS_BATCH count != KEYWORD_STUB_SLUGS count', manifest.batchKeywordCountMismatch);
	}

	if (manifest.likelyStubBodies.length) {
		log('step manifest: stub markers remain', { count: manifest.likelyStubBodies.length });
	}

	if (!manifest.ok) {
		logErr('manifest sync failed');
		process.exit(1);
	}

	log('step manifest: ok');
}

main();
