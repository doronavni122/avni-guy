import { spawn } from 'node:child_process';
import http from 'node:http';

const PORT = Number(process.env.SMOKE_PORT ?? 3099);
const BASE = `http://127.0.0.1:${PORT}`;
const BRAND = 'גיא אבני';

const ROUTES = [
	'/',
	'/blog/',
	'/about/',
	'/categories/contracts/',
	'/tags/mediation/',
	'/blog/contract-claim-mediation-four-thousand-six-weeks/',
	'/blog/tenant-rights-israel/',
];

const SITEMAP_MIN_BLOG_URLS = 125;
const SITEMAP_FORBIDDEN = '/blog/guy-avni-';

function logStep(msg, extra) {
	if (extra !== undefined) console.log(`[smoke-routes] ${msg}`, extra);
	else console.log(`[smoke-routes] ${msg}`);
}

function logErr(msg, extra) {
	console.error(`[smoke-routes] ERROR ${msg}`, extra ?? '');
}

function waitForServer(maxMs = 30_000) {
	const start = Date.now();
	return new Promise((resolve, reject) => {
		const tick = () => {
			const req = http.get(`${BASE}/`, (res) => {
				res.resume();
				if (res.statusCode && res.statusCode >= 200 && res.statusCode < 500) {
					resolve(undefined);
					return;
				}
				retry();
			});
			req.on('error', retry);
			function retry() {
				if (Date.now() - start > maxMs) {
					reject(new Error(`Server not ready on ${BASE} after ${maxMs}ms`));
					return;
				}
				setTimeout(tick, 500);
			}
		};
		tick();
	});
}

async function fetchRoute(route) {
	const url = `${BASE}${route}`;
	const res = await fetch(url, { redirect: 'follow' });
	const body = await res.text();
	return { route, status: res.status, body };
}

async function main() {
	logStep('step 0: starting production server for smoke tests', { port: PORT });
	const child = spawn('pnpm', ['exec', 'next', 'start', '-p', String(PORT)], {
		stdio: ['ignore', 'pipe', 'pipe'],
		env: { ...process.env, PORT: String(PORT) },
	});

	let stderr = '';
	child.stderr?.on('data', (chunk) => {
		stderr += chunk.toString();
	});

	const cleanup = () => {
		try {
			child.kill('SIGTERM');
		} catch {
			/* ignore */
		}
	};
	process.on('exit', cleanup);
	process.on('SIGINT', () => {
		cleanup();
		process.exit(130);
	});

	try {
		await waitForServer();
		logStep('step 1: server ready', { base: BASE });
		const failures = [];
		for (const route of ROUTES) {
			const { status, body } = await fetchRoute(route);
			if (status !== 200) {
				failures.push(`${route}: expected HTTP 200, got ${status}`);
				continue;
			}
			if (!body.includes(BRAND)) {
				failures.push(`${route}: response missing brand text "${BRAND}"`);
			}
			if (/Application error|__next_error__/i.test(body)) {
				failures.push(`${route}: response contains application error marker`);
			}
		}
		if (failures.length) {
			logStep('step 2: route failures', { count: failures.length });
			for (const f of failures) logErr(f);
			process.exit(1);
		}

		logStep('step 2: checking sitemap.xml');
		const sitemapRes = await fetch(`${BASE}/sitemap.xml`, { redirect: 'follow' });
		const sitemapBody = await sitemapRes.text();
		if (sitemapRes.status !== 200) {
			failures.push(`sitemap.xml: expected HTTP 200, got ${sitemapRes.status}`);
		} else {
			const locCount = (sitemapBody.match(/<loc>/g) ?? []).length;
			const blogCount = (sitemapBody.match(/<loc>[^<]*\/blog\/[^<]+<\/loc>/g) ?? []).length;
			if (locCount < SITEMAP_MIN_BLOG_URLS + 7) {
				failures.push(`sitemap.xml: too few URLs (${locCount})`);
			}
			if (blogCount < SITEMAP_MIN_BLOG_URLS) {
				failures.push(`sitemap.xml: too few blog URLs (${blogCount})`);
			}
			if (sitemapBody.includes(SITEMAP_FORBIDDEN)) {
				failures.push(`sitemap.xml: contains deprecated ${SITEMAP_FORBIDDEN}`);
			}
		}

		logStep('step 3: checking article images on sample route');
		const sample = await fetchRoute('/blog/tenant-rights-israel/');
		if (sample.status === 200 && /images\/blog\//.test(sample.body)) {
			const imgMatch = sample.body.match(/images\/blog\/[^"'\s]+\.jpg/);
			if (imgMatch) {
				const imgPath = `/${imgMatch[0]}`;
				const imgRes = await fetch(`${BASE}${imgPath}`);
				if (imgRes.status !== 200) {
					failures.push(`article image ${imgPath}: expected HTTP 200, got ${imgRes.status}`);
				}
			}
		}

		if (failures.length) {
			logStep('step 4: failures', { count: failures.length });
			for (const f of failures) logErr(f);
			process.exit(1);
		}
		logStep('done: all smoke routes passed', { count: ROUTES.length });
	} catch (err) {
		logErr('smoke run failed', { err, stderr: stderr.slice(-500) });
		process.exit(1);
	} finally {
		cleanup();
	}
}

main();
