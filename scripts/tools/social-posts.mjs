#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runSocialPosts } from '../social-posts/run.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');

try {
	const result = await runSocialPosts({ root, argv: process.argv.slice(2) });
	process.exitCode = result.ok ? 0 : 1;
} catch (err) {
	console.error('[social-posts:cli]', { err: String(err) });
	process.exitCode = 1;
}
