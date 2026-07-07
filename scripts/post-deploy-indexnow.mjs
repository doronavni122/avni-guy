#!/usr/bin/env node
/**
 * Post-deploy IndexNow ping — skips when INDEXNOW_KEY unset (safe for local build:ci).
 */
import fs from 'node:fs';
import path from 'node:path';

const SITE_URL = process.env.SITE_URL?.trim() || 'https://avniguy.co.il';
const STATIC_PATHS = ['/', '/about/', '/search/', '/services/', '/contact/', '/blog/'];

function logStep(step, detail) {
	console.error(`[post-deploy-indexnow:${step}]`, detail);
}

function readKey() {
	try {
		return process.env.INDEXNOW_KEY?.trim() || null;
	} catch (err) {
		logStep('readKey', { err });
		return null;
	}
}

async function main() {
	const key = readKey();
	if (!key) {
		logStep('skip', 'INDEXNOW_KEY unset — no ping');
		process.exit(0);
	}

	const urls = STATIC_PATHS.map((p) => new URL(p, SITE_URL).toString());
	logStep('ping', { count: urls.length });

	try {
		const res = await fetch(new URL('/api/indexnow/', SITE_URL), {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ urls }),
		});
		if (!res.ok) {
			const text = await res.text().catch(() => '');
			logStep('fail', { status: res.status, text });
			process.exit(0);
		}
		logStep('ok', { count: urls.length });
	} catch (err) {
		logStep('fetch-fail', { err });
		process.exit(0);
	}

	const marker = path.join(process.cwd(), '.next', 'indexnow-last-run.txt');
	try {
		fs.mkdirSync(path.dirname(marker), { recursive: true });
		fs.writeFileSync(marker, new Date().toISOString(), 'utf8');
	} catch (err) {
		logStep('marker-fail', { err });
	}
}

main();
