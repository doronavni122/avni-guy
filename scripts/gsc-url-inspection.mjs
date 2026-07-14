#!/usr/bin/env node
/**
 * GSC URL Inspection — `/`, `/about/`, + top-20 newest blog URLs.
 * Real client: service-account JWT → Search Console URL Inspection API (fetch, no googleapis).
 * Without credentials (or GSC_FORCE_MANUAL=1): write manual URL list + print console steps; exit 0.
 * Never claims live GSC success without API response.
 */
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import fg from 'fast-glob';
import matter from 'gray-matter';

const SITE_URL = process.env.SITE_URL?.trim() || 'https://avniguy.co.il';
const CONTENT_DIR = path.join(process.cwd(), 'src/content/blog');
const TOP_N = 20;
const OAUTH_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const INSPECT_URL = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect';
const WEBMASTERS_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const ARTIFACT_DIR = path.join(process.cwd(), '.next');
const MANUAL_PATH = path.join(ARTIFACT_DIR, 'gsc-manual-urls.json');
const LAST_PATH = path.join(ARTIFACT_DIR, 'gsc-url-inspection-last.json');

function logStep(step, detail) {
	console.error(`[gsc-url-inspection:${step}]`, detail);
}

function base64urlJson(value) {
	return Buffer.from(JSON.stringify(value)).toString('base64url');
}

function readServiceAccountPath() {
	try {
		return process.env.GSC_SERVICE_ACCOUNT_JSON?.trim() || null;
	} catch (err) {
		logStep('env', { err: String(err) });
		return null;
	}
}

function readSiteUrlProperty() {
	try {
		return process.env.GSC_SITE_URL?.trim() || null;
	} catch (err) {
		logStep('env-site', { err: String(err) });
		return null;
	}
}

function forceManual() {
	return process.env.GSC_FORCE_MANUAL === '1';
}

async function loadPriorityUrls() {
	const staticPaths = ['/', '/about/'];
	const files = await fg('**/*.{md,mdx}', { cwd: CONTENT_DIR, absolute: true });
	const posts = [];
	for (const file of files) {
		try {
			const raw = await fs.readFile(file, 'utf8');
			const { data } = matter(raw);
			const slug = path.basename(file).replace(/\.(md|mdx)$/, '');
			const pubDate = data.pubDate ? new Date(data.pubDate) : new Date(0);
			posts.push({
				slug,
				pubDate: Number.isNaN(pubDate.getTime()) ? new Date(0) : pubDate,
			});
		} catch (err) {
			logStep('load-post-fail', { file, err: String(err) });
		}
	}
	posts.sort((a, b) => b.pubDate - a.pubDate);
	const top = posts.slice(0, TOP_N);
	const urls = [
		...staticPaths.map((p) => new URL(p, SITE_URL).toString()),
		...top.map((p) => new URL(`/blog/${p.slug}/`, SITE_URL).toString()),
	];
	return { urls, topSlugs: top.map((p) => p.slug) };
}

async function loadServiceAccount(saPath) {
	try {
		const raw = await fs.readFile(saPath, 'utf8');
		const sa = JSON.parse(raw);
		if (!sa.client_email || !sa.private_key) {
			logStep('sa-shape', 'missing client_email or private_key');
			return null;
		}
		return sa;
	} catch (err) {
		logStep('sa-read-fail', { path: saPath, err: String(err) });
		return null;
	}
}

async function fetchAccessToken(sa) {
	const now = Math.floor(Date.now() / 1000);
	const header = { alg: 'RS256', typ: 'JWT' };
	const claim = {
		iss: sa.client_email,
		scope: WEBMASTERS_SCOPE,
		aud: OAUTH_TOKEN_URL,
		iat: now,
		exp: now + 3600,
	};
	const unsigned = `${base64urlJson(header)}.${base64urlJson(claim)}`;
	let signature;
	try {
		const signer = crypto.createSign('RSA-SHA256');
		signer.update(unsigned);
		signer.end();
		signature = signer.sign(sa.private_key, 'base64url');
	} catch (err) {
		logStep('jwt-sign-fail', { err: String(err) });
		return null;
	}
	const assertion = `${unsigned}.${signature}`;
	try {
		const res = await fetch(OAUTH_TOKEN_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({
				grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
				assertion,
			}),
		});
		const body = await res.json().catch(() => ({}));
		if (!res.ok || !body.access_token) {
			logStep('token-fail', { status: res.status, body });
			return null;
		}
		logStep('token-ok', { expires_in: body.expires_in ?? null });
		return body.access_token;
	} catch (err) {
		logStep('token-fetch-fail', { err: String(err) });
		return null;
	}
}

async function inspectUrl(url, token, siteUrl) {
	try {
		const res = await fetch(INSPECT_URL, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				inspectionUrl: url,
				siteUrl,
				languageCode: 'he',
			}),
		});
		const body = await res.json().catch(() => ({}));
		if (!res.ok) {
			logStep('inspect-http-fail', { url, status: res.status, body });
			return {
				url,
				ok: false,
				coverageState: 'API_ERROR',
				verdict: null,
				status: res.status,
				body,
			};
		}
		const indexStatus = body?.inspectionResult?.indexStatusResult ?? {};
		return {
			url,
			ok: true,
			coverageState: indexStatus.coverageState ?? 'UNKNOWN',
			verdict: indexStatus.verdict ?? null,
			lastCrawlTime: indexStatus.lastCrawlTime ?? null,
			robotsTxtState: indexStatus.robotsTxtState ?? null,
			pageFetchState: indexStatus.pageFetchState ?? null,
		};
	} catch (err) {
		logStep('inspect-fail', { url, err: String(err) });
		return {
			url,
			ok: false,
			coverageState: 'FETCH_ERROR',
			verdict: null,
			err: String(err),
		};
	}
}

function isAlertCoverage(coverageState) {
	if (!coverageState) return true;
	const okish = new Set([
		'Submitted and indexed',
		'Indexed, not submitted in sitemap',
		'SUBMITTED_AND_INDEXED',
	]);
	return !okish.has(coverageState);
}

async function writeManualArtifact(urls, topSlugs, reason) {
	const artifact = {
		at: new Date().toISOString(),
		mode: 'manual',
		reason,
		siteUrl: SITE_URL,
		count: urls.length,
		topSlugs,
		urls,
		console_steps: [
			'1. Open https://search.google.com/search-console',
			'2. Select property matching avniguy.co.il (domain or URL-prefix)',
			'3. URL Inspection → paste each URL from urls[]',
			'4. Request indexing only when coverage is not indexed / not found',
			'5. Ticket only non-indexed URLs; one run per deploy',
			'6. Do not claim success in ops logs without console confirmation',
		],
	};
	try {
		await fs.mkdir(ARTIFACT_DIR, { recursive: true });
		await fs.writeFile(MANUAL_PATH, JSON.stringify(artifact, null, 2), 'utf8');
		logStep('manual-artifact', { path: MANUAL_PATH, count: urls.length });
	} catch (err) {
		logStep('manual-artifact-fail', { err: String(err) });
	}
	logStep('MANUAL', {
		reason,
		count: urls.length,
		steps: artifact.console_steps,
		artifact: MANUAL_PATH,
	});
	return artifact;
}

async function writeLastResults(payload) {
	try {
		await fs.mkdir(ARTIFACT_DIR, { recursive: true });
		await fs.writeFile(LAST_PATH, JSON.stringify(payload, null, 2), 'utf8');
		logStep('results-saved', { path: LAST_PATH });
	} catch (err) {
		logStep('results-save-fail', { err: String(err) });
	}
}

async function runApiPath(urls, topSlugs, saPath, siteUrlProperty) {
	const sa = await loadServiceAccount(saPath);
	if (!sa) {
		await writeManualArtifact(urls, topSlugs, 'service_account_unreadable_or_invalid');
		return;
	}
	logStep('credentials', { path: saPath, client_email: sa.client_email });
	const token = await fetchAccessToken(sa);
	if (!token) {
		await writeManualArtifact(urls, topSlugs, 'oauth_token_failed');
		return;
	}

	const results = [];
	for (const url of urls) {
		const result = await inspectUrl(url, token, siteUrlProperty);
		results.push(result);
		if (result.ok && isAlertCoverage(result.coverageState)) {
			console.error(
				`[gsc-url-inspection] ALERT coverageState=${result.coverageState} verdict=${result.verdict} url=${url}`,
			);
		} else if (!result.ok) {
			console.error(
				`[gsc-url-inspection] ALERT api_fail coverageState=${result.coverageState} url=${url}`,
			);
		} else {
			logStep('inspect-ok', {
				url,
				coverageState: result.coverageState,
				verdict: result.verdict,
			});
		}
	}

	const payload = {
		at: new Date().toISOString(),
		mode: 'api',
		siteUrlProperty,
		count: urls.length,
		topSlugs,
		results,
		successCount: results.filter((r) => r.ok).length,
		alertCount: results.filter((r) => !r.ok || isAlertCoverage(r.coverageState)).length,
	};
	await writeLastResults(payload);
	logStep('api-complete', {
		count: payload.count,
		successCount: payload.successCount,
		alertCount: payload.alertCount,
		note: 'successCount = API responded; not a claim that indexing succeeded',
	});
}

async function main() {
	let loaded;
	try {
		loaded = await loadPriorityUrls();
	} catch (err) {
		logStep('load-urls-fail', { err: String(err) });
		process.exit(0);
	}
	const { urls, topSlugs } = loaded;
	logStep('targets', { count: urls.length, topN: TOP_N, sample: urls.slice(0, 3) });

	if (forceManual()) {
		await writeManualArtifact(urls, topSlugs, 'GSC_FORCE_MANUAL=1');
		process.exit(0);
	}

	const saPath = readServiceAccountPath();
	const siteUrlProperty = readSiteUrlProperty();

	if (!saPath) {
		await writeManualArtifact(urls, topSlugs, 'GSC_SERVICE_ACCOUNT_JSON unset');
		process.exit(0);
	}

	try {
		await fs.access(saPath);
	} catch (err) {
		logStep('skip', { reason: 'credentials file missing', path: saPath, err: String(err) });
		await writeManualArtifact(urls, topSlugs, 'credentials_file_missing');
		process.exit(0);
	}

	if (!siteUrlProperty) {
		await writeManualArtifact(
			urls,
			topSlugs,
			'GSC_SITE_URL unset (e.g. sc-domain:avniguy.co.il or https://avniguy.co.il/)',
		);
		process.exit(0);
	}

	await runApiPath(urls, topSlugs, saPath, siteUrlProperty);
	process.exit(0);
}

main().catch((err) => {
	logStep('unhandled', { err: String(err) });
	process.exit(0);
});
