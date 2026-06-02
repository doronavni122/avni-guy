import { spawn, spawnSync } from 'node:child_process';
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
	'/blog/guy-avni-contract-claim-mediation-four-thousand-six-weeks/',
	'/blog/guy-avni-court-case-keywords-find-case-90-seconds/',
];

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
			logStep('step 2: failures', { count: failures.length });
			for (const f of failures) logErr(f);
			process.exit(1);
		}
		logStep('done: all smoke routes passed', { count: ROUTES.length });
		if (process.env.LINK_CRAWL_ENFORCE === '1') {
			logStep('step 3: running links:crawl against smoke server');
			const crawl = spawnSync('pnpm', ['run', 'links:crawl'], {
				stdio: 'inherit',
				env: { ...process.env, LINK_CRAWL_BASE_URL: BASE },
			});
			if (crawl.status !== 0) {
				logErr('links:crawl failed after smoke', { exit: crawl.status });
				process.exit(crawl.status ?? 1);
			}
		}
	} catch (err) {
		logErr('smoke run failed', { err, stderr: stderr.slice(-500) });
		process.exit(1);
	} finally {
		cleanup();
	}
}

main();
