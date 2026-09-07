#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCopy } from '../social-posts/copy.mjs';
import { prepareMedia } from '../social-posts/media.mjs';
import { publishAll } from '../social-posts/publish/index.mjs';
import { runSocialPosts } from '../social-posts/run.mjs';
import { loadSource } from '../social-posts/source.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');

try {
	const result = await runSocialPosts({
		root,
		argv: process.argv.slice(2),
		loadSource,
		buildCopy: ({ source }) => buildCopy(source),
		prepareMedia,
		publishAll,
	});
	process.exitCode = result.ok ? 0 : 1;
} catch (err) {
	console.error('[social-posts:cli]', { err: String(err) });
	process.exitCode = 1;
}
