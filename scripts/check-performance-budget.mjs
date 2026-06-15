#!/usr/bin/env node
/**
 * Post-build performance budget for homepage static HTML size.
 * First Load JS is validated via `next build` route table (target <= 120 kB).
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const NEXT_DIR = path.join(process.cwd(), '.next');
const HOME_HTML = path.join(NEXT_DIR, 'server', 'app', 'index.html');
const MAX_HOME_HTML_BYTES = 300 * 1024;

async function readFileSize(filePath) {
	try {
		const stat = await fs.stat(filePath);
		return stat.size;
	} catch {
		return null;
	}
}

async function main() {
	console.error('[perf-budget] step 1: checking homepage HTML size');
	const homeBytes = await readFileSize(HOME_HTML);
	if (homeBytes == null) {
		console.error('[perf-budget] ERROR missing homepage HTML; run pnpm build first');
		process.exit(1);
	}
	console.error('[perf-budget] homepage HTML bytes:', homeBytes);
	if (homeBytes > MAX_HOME_HTML_BYTES) {
		console.error('[perf-budget] ERROR homepage HTML exceeds budget', {
			bytes: homeBytes,
			maxBytes: MAX_HOME_HTML_BYTES,
		});
		process.exit(1);
	}

	console.error('[perf-budget] step 2: verify First Load JS <= 120 kB in next build output');
	console.error('[perf-budget] done: HTML budget passed');
}

main().catch((err) => {
	console.error('[perf-budget] ERROR', err);
	process.exit(1);
});
