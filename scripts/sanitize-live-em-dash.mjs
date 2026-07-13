#!/usr/bin/env node
/**
 * One-shot / maintenance: replace U+2014 em dash with hyphen in live user-facing sources.
 */
import fs from 'node:fs';
import path from 'node:path';
import fg from 'fast-glob';
import { replaceEmDashInText } from '../.content-kit/adapters/shared/replace-em-dash.mjs';

const ROOT = process.cwd();

const GLOBS = [
	'src/content/blog/**/*.{md,mdx}',
	'src/lib/seo/main-page-heroes.mjs',
	'src/app/**/*.{tsx,ts}',
	'src/lib/content/inject-entity-links.ts',
	'src/lib/nav/site-nav.ts',
	'src/lib/home/**/*.ts',
	'src/components/**/*.{tsx,ts}',
];

function sanitizeFile(filePath) {
	const abs = path.join(ROOT, filePath);
	const raw = fs.readFileSync(abs, 'utf8');
	if (!raw.includes('\u2014')) return false;
	const next = replaceEmDashInText(raw);
	if (next === raw) return false;
	fs.writeFileSync(abs, next, 'utf8');
	console.log(`[sanitize-live-em-dash] updated ${filePath}`);
	return true;
}

function main() {
	let count = 0;
	for (const pattern of GLOBS) {
		const files = fg.sync(pattern, { cwd: ROOT, onlyFiles: true });
		for (const file of files) {
			if (sanitizeFile(file)) count += 1;
		}
	}
	console.log(`[sanitize-live-em-dash] done — ${count} file(s) updated`);
}

try {
	main();
} catch (err) {
	console.error('[sanitize-live-em-dash] failed', err);
	process.exit(1);
}
