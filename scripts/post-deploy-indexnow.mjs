#!/usr/bin/env node
/**
 * Post-deploy IndexNow ping — updates, redirect sources, and gone URLs.
 * Skips live ping when INDEXNOW_KEY unset (safe for local build:ci).
 * Live ping only when VERCEL=1 or INDEXNOW_PING=1; otherwise dry-run logs.
 */
import fs from 'node:fs';
import path from 'node:path';

const SITE_URL = process.env.SITE_URL?.trim() || 'https://avniguy.co.il';
const CONTENT_BLOG_DIR = path.join(process.cwd(), 'src/content/blog');
const STATE_PATH = path.join(process.cwd(), '.next', 'indexnow-url-state.json');
const LEGACY_SLUG_PREFIX = 'guy-avni-';
const BATCH_SIZE = 100;

/** Parity with sitemap static routes (plus blog index). */
const STATIC_PATHS = [
	'/',
	'/about/',
	'/search/',
	'/services/',
	'/contact/',
	'/blog/',
	'/categories/',
	'/tags/',
	'/editorial-policy/',
	'/sheelot/',
];

function logStep(step, detail) {
	console.error(`[post-deploy-indexnow:${step}]`, detail);
}

function readKey() {
	try {
		return process.env.INDEXNOW_KEY?.trim() || null;
	} catch (err) {
		logStep('readKey', { err: String(err) });
		return null;
	}
}

function toAbsolute(pathnameOrUrl) {
	try {
		if (/^https?:\/\//i.test(pathnameOrUrl)) {
			return new URL(pathnameOrUrl).toString();
		}
		const p = pathnameOrUrl.startsWith('/') ? pathnameOrUrl : `/${pathnameOrUrl}`;
		return new URL(p, SITE_URL).toString();
	} catch (err) {
		logStep('toAbsolute-fail', { pathnameOrUrl, err: String(err) });
		return null;
	}
}

function listBlogSlugs() {
	try {
		if (!fs.existsSync(CONTENT_BLOG_DIR)) {
			logStep('listBlogSlugs', 'content dir missing');
			return [];
		}
		const names = fs.readdirSync(CONTENT_BLOG_DIR);
		const slugs = names
			.filter((name) => /\.(md|mdx)$/i.test(name))
			.map((name) => name.replace(/\.(md|mdx)$/i, ''))
			.filter((slug) => slug.length > 0);
		return slugs.sort();
	} catch (err) {
		logStep('listBlogSlugs-fail', { err: String(err) });
		return [];
	}
}

function buildLiveUrls(slugs) {
	const paths = [
		...STATIC_PATHS,
		...slugs.map((slug) => `/blog/${slug}/`),
	];
	return paths.map(toAbsolute).filter(Boolean);
}

function buildRedirectSourceUrls(slugs) {
	return slugs
		.filter((slug) => !slug.startsWith(LEGACY_SLUG_PREFIX))
		.map((slug) => toAbsolute(`/blog/${LEGACY_SLUG_PREFIX}${slug}/`))
		.filter(Boolean);
}

function parseGoneEnv() {
	const raw = process.env.INDEXNOW_GONE_URLS?.trim();
	if (!raw) return [];
	try {
		return raw
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean)
			.map(toAbsolute)
			.filter(Boolean);
	} catch (err) {
		logStep('parseGoneEnv-fail', { err: String(err) });
		return [];
	}
}

function loadPreviousLiveUrls() {
	try {
		if (!fs.existsSync(STATE_PATH)) return [];
		const raw = fs.readFileSync(STATE_PATH, 'utf8');
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed?.liveUrls)) {
			logStep('state-shape', 'missing liveUrls array');
			return [];
		}
		return parsed.liveUrls.filter((u) => typeof u === 'string');
	} catch (err) {
		logStep('loadPrevious-fail', { err: String(err) });
		return [];
	}
}

function saveState(liveUrls) {
	try {
		fs.mkdirSync(path.dirname(STATE_PATH), { recursive: true });
		fs.writeFileSync(
			STATE_PATH,
			JSON.stringify(
				{
					updatedAt: new Date().toISOString(),
					liveUrls,
				},
				null,
				2,
			),
			'utf8',
		);
		logStep('state-saved', { path: STATE_PATH, count: liveUrls.length });
	} catch (err) {
		logStep('state-save-fail', { err: String(err) });
	}
}

function chunk(arr, size) {
	const out = [];
	for (let i = 0; i < arr.length; i += size) {
		out.push(arr.slice(i, i + size));
	}
	return out;
}

function shouldLivePing(key) {
	if (!key) return false;
	const vercel = process.env.VERCEL === '1';
	const force = process.env.INDEXNOW_PING === '1';
	return vercel || force;
}

async function postBatch(urls, action) {
	const endpoint = new URL('/api/indexnow/', SITE_URL);
	try {
		const res = await fetch(endpoint, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ urls, action }),
		});
		if (!res.ok) {
			const text = await res.text().catch(() => '');
			logStep('batch-fail', { action, status: res.status, text, count: urls.length });
			return false;
		}
		logStep('batch-ok', { action, count: urls.length });
		return true;
	} catch (err) {
		logStep('batch-fetch-fail', { action, err: String(err), count: urls.length });
		return false;
	}
}

async function pingSets(sets, live) {
	for (const { action, urls } of sets) {
		if (urls.length === 0) {
			logStep('empty-set', { action });
			continue;
		}
		if (!live) {
			logStep('dry-run', { action, count: urls.length });
			continue;
		}
		const batches = chunk(urls, BATCH_SIZE);
		for (let i = 0; i < batches.length; i += 1) {
			logStep('batch-start', { action, batch: i + 1, of: batches.length, count: batches[i].length });
			await postBatch(batches[i], action);
		}
	}
}

async function main() {
	const key = readKey();
	const slugs = listBlogSlugs();
	const liveUrls = buildLiveUrls(slugs);
	const redirectUrls = buildRedirectSourceUrls(slugs);
	const previousLive = loadPreviousLiveUrls();
	const liveSet = new Set(liveUrls);
	const detectedGone = previousLive.filter((u) => !liveSet.has(u));
	const envGone = parseGoneEnv();
	const goneUrls = [...new Set([...detectedGone, ...envGone])];

	logStep('coverage', {
		static: STATIC_PATHS.length,
		posts: slugs.length,
		live: liveUrls.length,
		redirect: redirectUrls.length,
		goneDetected: detectedGone.length,
		goneEnv: envGone.length,
		goneTotal: goneUrls.length,
		previousLive: previousLive.length,
	});

	// Persist current live set for next-run gone detection (even when not pinging).
	saveState(liveUrls);

	if (!key) {
		logStep('skip', 'INDEXNOW_KEY unset — no live ping');
		process.exit(0);
	}

	const live = shouldLivePing(key);
	if (!live) {
		logStep('dry-run-mode', 'set VERCEL=1 or INDEXNOW_PING=1 for live IndexNow POST');
	}

	await pingSets(
		[
			{ action: 'update', urls: liveUrls },
			{ action: 'redirect', urls: redirectUrls },
			{ action: 'gone', urls: goneUrls },
		],
		live,
	);

	if (live) {
		logStep('ok', {
			update: liveUrls.length,
			redirect: redirectUrls.length,
			gone: goneUrls.length,
		});
	}

	const marker = path.join(process.cwd(), '.next', 'indexnow-last-run.txt');
	try {
		fs.mkdirSync(path.dirname(marker), { recursive: true });
		fs.writeFileSync(
			marker,
			JSON.stringify({
				at: new Date().toISOString(),
				livePing: live,
				update: liveUrls.length,
				redirect: redirectUrls.length,
				gone: goneUrls.length,
			}),
			'utf8',
		);
	} catch (err) {
		logStep('marker-fail', { err: String(err) });
	}
}

main().catch((err) => {
	logStep('unhandled', { err: String(err) });
	process.exit(0);
});
