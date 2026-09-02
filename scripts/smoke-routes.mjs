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
const LAYOUT_TITLE_SUFFIX = 'מאמרים משפטיים, שירותים וייעוץ | גיא אבני';
const QUARANTINED_SAMPLE = '/blog/time-management-for-legal-work/';
const THIN_CATEGORY_SAMPLE = '/categories/medical/';
const INDEXABLE_CATEGORY_SAMPLE = '/categories/tax/';
const MONEY_PAGE_SAMPLE = '/blog/purchase-tax-exemption-first-apartment/';
const PAGER_SAMPLE = '/blog/page/2/';

function extractTitle(html) {
	const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
	return match ? match[1].replace(/\s+/g, ' ').trim() : '';
}

function extractMetaContent(html, name) {
	const re = new RegExp(
		`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["']|<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${name}["']`,
		'i',
	);
	const match = html.match(re);
	return match ? (match[1] || match[2] || '').trim() : '';
}

function extractCanonical(html) {
	const match =
		html.match(/rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) ||
		html.match(/href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
	return match ? match[1].trim() : '';
}

function assertSeo(failures, route, body, checks) {
	try {
		const title = extractTitle(body);
		const robots = extractMetaContent(body, 'robots');
		const canonical = extractCanonical(body);
		if (checks.titleIncludes && !title.includes(checks.titleIncludes)) {
			failures.push(`${route}: title missing "${checks.titleIncludes}" (got "${title}")`);
		}
		if (checks.titleExcludes && title.includes(checks.titleExcludes)) {
			failures.push(`${route}: title still has layout suffix (got "${title}")`);
		}
		if (checks.robotsIncludes && !robots.toLowerCase().includes(checks.robotsIncludes)) {
			failures.push(`${route}: robots expected "${checks.robotsIncludes}", got "${robots || 'MISSING'}"`);
		}
		if (checks.canonicalIncludes && !canonical.includes(checks.canonicalIncludes)) {
			failures.push(`${route}: canonical expected "${checks.canonicalIncludes}", got "${canonical || 'MISSING'}"`);
		}
		if (checks.bodyIncludes && !body.includes(checks.bodyIncludes)) {
			failures.push(`${route}: body missing "${checks.bodyIncludes}"`);
		}
		if (checks.bodyExcludes && body.includes(checks.bodyExcludes)) {
			failures.push(`${route}: body still contains "${checks.bodyExcludes}"`);
		}
	} catch (err) {
		console.error('[smoke-routes] assertSeo failed', { route, err });
		failures.push(`${route}: assertSeo threw`);
	}
}

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
			if (sitemapBody.includes('/search/')) {
				failures.push('sitemap.xml: must not list /search/');
			}
			if (sitemapBody.includes('/blog/page/')) {
				failures.push('sitemap.xml: must not list blog pagers');
			}
			if (sitemapBody.includes('/blog/time-management-for-legal-work/')) {
				failures.push('sitemap.xml: must not list quarantined slugs');
			}
			if (sitemapBody.includes('/categories/medical/')) {
				failures.push('sitemap.xml: must not list thin category hubs');
			}
			if (sitemapBody.includes('/categories/real-estate-law/')) {
				failures.push('sitemap.xml: must not list overlap category real-estate-law');
			}
		}

		logStep('step 2b: checking SEO indexation + titles');
		const blogIndex = await fetchRoute('/blog/');
		if (blogIndex.status === 200) {
			assertSeo(failures, '/blog/', blogIndex.body, {
				titleIncludes: 'מאמרים משפטיים מעשיים',
				titleExcludes: LAYOUT_TITLE_SUFFIX,
				canonicalIncludes: '/blog/',
			});
		} else {
			failures.push(`/blog/: expected HTTP 200, got ${blogIndex.status}`);
		}

		const searchPage = await fetchRoute('/search/');
		if (searchPage.status === 200) {
			assertSeo(failures, '/search/', searchPage.body, {
				titleExcludes: LAYOUT_TITLE_SUFFIX,
				robotsIncludes: 'noindex',
			});
		} else {
			failures.push(`/search/: expected HTTP 200, got ${searchPage.status}`);
		}

		const pagerPage = await fetchRoute(PAGER_SAMPLE);
		if (pagerPage.status === 200) {
			assertSeo(failures, PAGER_SAMPLE, pagerPage.body, {
				robotsIncludes: 'noindex',
				canonicalIncludes: '/blog/',
			});
		} else {
			failures.push(`${PAGER_SAMPLE}: expected HTTP 200, got ${pagerPage.status}`);
		}

		const quarantined = await fetchRoute(QUARANTINED_SAMPLE);
		if (quarantined.status === 200) {
			assertSeo(failures, QUARANTINED_SAMPLE, quarantined.body, {
				robotsIncludes: 'noindex',
				titleExcludes: LAYOUT_TITLE_SUFFIX,
				bodyExcludes: 'מזהה נושא',
			});
		} else {
			failures.push(`${QUARANTINED_SAMPLE}: expected HTTP 200, got ${quarantined.status}`);
		}

		const thinCat = await fetchRoute(THIN_CATEGORY_SAMPLE);
		if (thinCat.status === 200) {
			assertSeo(failures, THIN_CATEGORY_SAMPLE, thinCat.body, {
				robotsIncludes: 'noindex',
				titleExcludes: LAYOUT_TITLE_SUFFIX,
			});
		} else {
			failures.push(`${THIN_CATEGORY_SAMPLE}: expected HTTP 200, got ${thinCat.status}`);
		}

		const taxCat = await fetchRoute(INDEXABLE_CATEGORY_SAMPLE);
		if (taxCat.status === 200) {
			assertSeo(failures, INDEXABLE_CATEGORY_SAMPLE, taxCat.body, {
				titleExcludes: LAYOUT_TITLE_SUFFIX,
			});
		} else {
			failures.push(`${INDEXABLE_CATEGORY_SAMPLE}: expected HTTP 200, got ${taxCat.status}`);
		}

		const moneyPage = await fetchRoute(MONEY_PAGE_SAMPLE);
		if (moneyPage.status === 200) {
			assertSeo(failures, MONEY_PAGE_SAMPLE, moneyPage.body, {
				titleExcludes: LAYOUT_TITLE_SUFFIX,
				bodyIncludes: 'יש פטור חלקי במדרגה הראשונה',
			});
		} else {
			failures.push(`${MONEY_PAGE_SAMPLE}: expected HTTP 200, got ${moneyPage.status}`);
		}

		const guyAvni = await fetchRoute('/guy-avni/');
		if (guyAvni.status === 200) {
			assertSeo(failures, '/guy-avni/', guyAvni.body, {
				titleExcludes: LAYOUT_TITLE_SUFFIX,
				bodyIncludes: '"@type":"Person"',
			});
		} else {
			failures.push(`/guy-avni/: expected HTTP 200, got ${guyAvni.status}`);
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
