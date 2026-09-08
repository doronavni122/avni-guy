#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runSocialOauth } from '../social-oauth/run.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');

try {
	const result = await runSocialOauth({
		root,
		argv: process.argv.slice(2),
	});
	process.exitCode = result.ok ? 0 : 1;
} catch (err) {
	console.error('[social-oauth:cli]', { err: String(err) });
	process.exitCode = 1;
}
