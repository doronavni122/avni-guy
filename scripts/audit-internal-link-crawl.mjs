#!/usr/bin/env node
import {
	collectCrawlTargets,
	computeBlogClickDepths,
	hasCanonicalTrailingSlash,
	loadAllPosts,
	logGraph,
	normalizePath,
} from './lib/internal-link-graph.mjs';

const ENFORCE = process.env.LINK_CRAWL_ENFORCE === '1';
const BASE = (process.env.LINK_CRAWL_BASE_URL ?? 'http://127.0.0.1:3099').replace(/\/$/, '');
const MAX_REDIRECTS = 5;
const HTTP_TIMEOUT_MS = 12_000;

function logErr(step, message, extra) {
	console.error(`[links:crawl] ERROR step=${step} ${message}`, extra ?? '');
}

/**
 * @param {string} routePath
 */
async function probeRoute(routePath) {
	const url = `${BASE}${routePath}`;
	/** @type {{ status: number, url: string }[]} */
	const chain = [];
	let current = url;
	for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), HTTP_TIMEOUT_MS);
		let res;
		try {
			res = await fetch(current, { redirect: 'manual', signal: controller.signal });
		} catch (err) {
			clearTimeout(timer);
			return { routePath, ok: false, error: String(err?.message ?? err), chain };
		}
		clearTimeout(timer);
		chain.push({ status: res.status, url: current });
		if (res.status >= 300 && res.status < 400) {
			const loc = res.headers.get('location');
			if (!loc) {
				return { routePath, ok: false, error: 'redirect-missing-location', chain };
			}
			current = new URL(loc, current).toString();
			continue;
		}
		const ok = res.status >= 200 && res.status < 400;
		return { routePath, ok, status: res.status, chain, redirectHops: chain.length - 1 };
	}
	return { routePath, ok: false, error: 'redirect-chain-too-long', chain };
}

async function probeHttpRoutes(routes) {
	const sample = routes.slice(0, Math.min(routes.length, ENFORCE ? routes.length : 40));
	const results = [];
	for (const routePath of sample) {
		results.push(await probeRoute(routePath));
	}
	return { results, sampled: sample.length, total: routes.length };
}

async function isServerReachable() {
	try {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), 3000);
		const res = await fetch(`${BASE}/`, { redirect: 'manual', signal: controller.signal });
		clearTimeout(timer);
		return res.status >= 200 && res.status < 500;
	} catch {
		return false;
	}
}

async function main() {
	logGraph('crawl', 'starting internal link crawl audit');
	const posts = loadAllPosts();
	const routes = collectCrawlTargets(posts);
	let fail = false;

	console.log('\n=== LINK CRAWL SUMMARY ===');
	console.log(`Unique crawl targets: ${routes.length} (${posts.length} blog posts)`);

	const slashIssues = [];
	for (const p of posts) {
		for (const link of p.paragraphLinks) {
			if (!hasCanonicalTrailingSlash(link.href)) {
				slashIssues.push({ slug: p.slug, href: link.href, anchor: link.anchor });
			}
		}
	}
	console.log(`Trailing-slash violations (MDX hrefs): ${slashIssues.length}`);
	if (slashIssues.length) {
		for (const i of slashIssues.slice(0, 10)) {
			console.log(`  ${i.slug}: ${i.href} ("${i.anchor}")`);
		}
		if (ENFORCE) {
			fail = true;
			for (const i of slashIssues.slice(0, 15)) {
				logErr('trailing-slash', `${i.slug} ${i.href}`);
			}
		}
	}

	const depthReport = computeBlogClickDepths(posts, 3);
	console.log(`Click-depth graph routes reachable: ${depthReport.reachableRoutes}`);
	console.log(`Blog slugs over max depth 3: ${depthReport.overMax.length}`);
	if (depthReport.overMax.length) {
		for (const b of depthReport.overMax.slice(0, 10)) {
			console.log(`  depth>${depthReport.maxDepth}: ${b.slug} (depth=${b.depth ?? 'unreachable'})`);
		}
		if (ENFORCE) {
			fail = true;
			for (const b of depthReport.overMax.slice(0, 15)) {
				logErr('click-depth', `${b.slug} depth=${b.depth ?? 'unreachable'}`);
			}
		}
	}

	const serverUp = await isServerReachable();
	if (!serverUp) {
		console.log(`HTTP probe skipped: server not reachable at ${BASE} (set LINK_CRAWL_BASE_URL or start next start)`);
	} else {
		console.log(`HTTP probe base: ${BASE}`);
		const { results, sampled, total } = await probeHttpRoutes(routes);
		const notFound = results.filter((r) => r.status === 404 || r.error === 'redirect-chain-too-long');
		const longChains = results.filter((r) => (r.redirectHops ?? 0) > 1);
		const hardFails = results.filter((r) => !r.ok && r.status !== 404);
		console.log(`HTTP sampled: ${sampled}/${total}`);
		console.log(`HTTP 404: ${notFound.length}`);
		console.log(`Redirect chains >1 hop: ${longChains.length}`);
		console.log(`Other HTTP failures: ${hardFails.length}`);
		if (notFound.length) {
			for (const r of notFound.slice(0, 8)) {
				console.log(`  404: ${r.routePath}`);
			}
		}
		if (longChains.length) {
			for (const r of longChains.slice(0, 5)) {
				console.log(`  redirects(${r.redirectHops}): ${r.routePath} -> ${r.chain.at(-1)?.url ?? '?'}`);
			}
		}
		if (ENFORCE && (notFound.length || hardFails.length)) {
			fail = true;
			for (const r of [...notFound, ...hardFails].slice(0, 15)) {
				logErr('http', `${r.routePath} ${r.error ?? r.status}`);
			}
		}
	}

	if (fail && ENFORCE) {
		logGraph('crawl', 'FAILED');
		process.exit(1);
	}
	logGraph('crawl', fail ? 'completed with issues (non-enforced)' : 'PASSED');
	process.exit(0);
}

main().catch((err) => {
	logErr('main', 'unhandled', err);
	process.exit(1);
});
