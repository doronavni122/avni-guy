#!/usr/bin/env node
/**
 * Writes public/{INDEXNOW_KEY}.txt when INDEXNOW_KEY is set (build/deploy).
 */
import fs from 'node:fs';
import path from 'node:path';

function logStep(step, detail) {
	console.error(`[write-indexnow-key:${step}]`, detail);
}

function warnProductionIndexNowUnset() {
	if (process.env.NODE_ENV === 'production' && !process.env.INDEXNOW_KEY?.trim()) {
		console.warn(
			'[env] INDEXNOW_KEY is empty in production — IndexNow key file and post-deploy pings are skipped. Owner: set INDEXNOW_KEY in Vercel project environment variables.',
		);
	}
}

function main() {
	try {
		warnProductionIndexNowUnset();
		const key = process.env.INDEXNOW_KEY?.trim();
		if (!key) {
			logStep('skip', 'INDEXNOW_KEY unset');
			process.exit(0);
		}
		const out = path.join(process.cwd(), 'public', `${key}.txt`);
		fs.writeFileSync(out, key, 'utf8');
		logStep('ok', { path: out });
	} catch (err) {
		logStep('fail', { err });
		process.exit(1);
	}
}

main();
