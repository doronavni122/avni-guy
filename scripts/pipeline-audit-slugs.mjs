#!/usr/bin/env node
/**
 * Manifest gate + content:audit for all KEYWORD_STUB_SLUGS.
 * Log: [content-pipeline-2026]
 */
import { spawnSync } from 'node:child_process';
import { KEYWORD_STUB_SLUGS } from './lib/keyword-stub-slugs.mjs';

function log(msg, extra) {
	if (extra !== undefined) console.error(`[content-pipeline-2026] ${msg}`, extra);
	else console.error(`[content-pipeline-2026] ${msg}`);
}

function main() {
	log('step audit-slugs: manifest');
	let r = spawnSync(process.execPath, ['scripts/sync-article-manifest.mjs'], { stdio: 'inherit' });
	if (r.status !== 0) process.exit(r.status ?? 1);

	const slugs = KEYWORD_STUB_SLUGS.join(',');
	log('step audit-slugs: content:audit', { count: KEYWORD_STUB_SLUGS.length });
	r = spawnSync('pnpm', ['run', 'content:audit'], {
		stdio: 'inherit',
		env: { ...process.env, CONTENT_AUDIT_SLUGS: slugs },
	});
	process.exit(r.status ?? 1);
}

main();
