#!/usr/bin/env node
/**
 * Ensure .cursor/tmp/research/<slug>.md exists when REQUIRE_RESEARCH=1.
 * Log: [content-pipeline-2026]
 */
import fs from 'node:fs';
import path from 'node:path';
import { KEYWORD_STUB_SLUGS } from './lib/keyword-stub-slugs.mjs';

const RESEARCH_DIR = path.join(process.cwd(), '.cursor', 'tmp', 'research');

function log(msg, extra) {
	if (extra !== undefined) console.error(`[content-pipeline-2026] ${msg}`, extra);
	else console.error(`[content-pipeline-2026] ${msg}`);
}

function logErr(msg, extra) {
	console.error(`[content-pipeline-2026] ERROR ${msg}`, extra ?? '');
}

function resolveSlugs(argv) {
	if (argv.length) return argv;
	const env = process.env.PIPELINE_SLUGS?.trim();
	if (env) return env.split(',').map((s) => s.trim()).filter(Boolean);
	return [];
}

function main() {
	const requireResearch = process.env.REQUIRE_RESEARCH === '1';
	const slugs = resolveSlugs(process.argv.slice(2));

	log('step research-preflight: start', { requireResearch, count: slugs.length });

	if (!requireResearch) {
		log('step research-preflight: skipped (REQUIRE_RESEARCH not set)');
		return;
	}

	if (!slugs.length) {
		logErr('REQUIRE_RESEARCH=1 but no slugs (argv or PIPELINE_SLUGS)');
		process.exit(1);
	}

	const missing = [];
	for (const slug of slugs) {
		const fp = path.join(RESEARCH_DIR, `${slug}.md`);
		if (!fs.existsSync(fp)) missing.push(slug);
	}

	if (missing.length) {
		logErr('research files missing', { count: missing.length });
		for (const slug of missing) logErr('missing research', slug);
		log('hint', { template: 'article-research-loop.mdc', knownStubCount: KEYWORD_STUB_SLUGS.length });
		process.exit(1);
	}

	log('step research-preflight: ok', { count: slugs.length });
}

main();
