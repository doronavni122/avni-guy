#!/usr/bin/env node
/**
 * Fail if any published blog MDX filename still uses the deprecated guy-avni- prefix.
 */
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const PREFIX = 'guy-avni-';
const contentRoot = join(process.cwd(), 'src/content/blog');

let files;
try {
	files = readdirSync(contentRoot).filter((name) => name.endsWith('.mdx') || name.endsWith('.md'));
} catch (err) {
	console.error('[check-blog-slug-prefix] failed to read content root', err);
	process.exit(1);
}

const bad = files.filter((name) => name.startsWith(PREFIX));
if (bad.length > 0) {
	console.error(`[check-blog-slug-prefix] FAIL: ${bad.length} file(s) use deprecated prefix "${PREFIX}"`);
	for (const name of bad.sort()) {
		console.error(`  - ${name}`);
	}
	process.exit(1);
}

console.log(`[check-blog-slug-prefix] OK: ${files.length} blog file(s), none with "${PREFIX}"`);
