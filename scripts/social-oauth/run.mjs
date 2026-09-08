import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { OAUTH_NETWORKS } from './constants.mjs';
import { argvValue, credsStatus, loadProjectEnv } from '../social-posts/env.mjs';
import { createLogger } from '../social-posts/log.mjs';
import { waitForGmailLogin } from './gmail.mjs';
import { openOauthBrowser } from './session.mjs';
import { bootstrapYoutube } from './connectors/youtube.mjs';
import { bootstrapX } from './connectors/x.mjs';
import { bootstrapLinkedIn } from './connectors/linkedin.mjs';
import { bootstrapMeta } from './connectors/meta.mjs';

const BOOTSTRAP = {
	youtube: bootstrapYoutube,
	x: bootstrapX,
	linkedin: bootstrapLinkedIn,
	meta: bootstrapMeta,
};

/**
 * @param {string[]} argv
 */
export function parseNetworks(argv) {
	try {
		const raw = argvValue('--network', argv, '') || argvValue('--networks', argv, '');
		if (!raw || raw === 'all') return [...OAUTH_NETWORKS];
		const wanted = raw
			.split(',')
			.map((s) => s.trim().toLowerCase())
			.filter(Boolean)
			.map((n) => (n === 'facebook' || n === 'instagram' ? 'meta' : n));
		const set = new Set();
		for (const n of wanted) {
			if (OAUTH_NETWORKS.includes(n)) set.add(n);
		}
		return [...set];
	} catch (err) {
		console.error('[social-oauth:parseNetworks]', { err: String(err) });
		return [...OAUTH_NETWORKS];
	}
}

/**
 * @param {{
 *   root: string,
 *   argv?: string[],
 *   env?: NodeJS.ProcessEnv,
 *   fetchImpl?: typeof fetch,
 *   openBrowser?: typeof openOauthBrowser,
 * }} opts
 */
export async function runSocialOauth(opts) {
	const root = opts.root;
	const argv = opts.argv || process.argv.slice(2);
	const env = opts.env || { ...process.env };
	try {
		loadProjectEnv(root, env);
	} catch (err) {
		console.error('[social-oauth:loadProjectEnv]', { err: String(err) });
	}

	const runId = new Date().toISOString().replace(/[:.]/g, '');
	const runDir = path.join(os.tmpdir(), 'avni-social-oauth', runId);
	fs.mkdirSync(runDir, { recursive: true });
	const logger = createLogger(path.join(runDir, 'run.jsonl'));
	logger.logStep('info', 'run-start', null, `runDir=${runDir}`);

	const loginOnly = argv.includes('--login') || argv.includes('--login-only');
	const networks = parseNetworks(argv);
	const envPath = path.join(root, '.env.local');
	const dry = argv.includes('--dry-run');
	if (dry) logger.logStep('info', 'dry-run', null, 'will not write .env.local');

	const openBrowser = opts.openBrowser || openOauthBrowser;
	let browser;
	/** @type {{ ok: boolean, network: string, keys: string[], msg: string }[]} */
	const results = [];

	try {
		browser = await openBrowser({ root, logger });
		await waitForGmailLogin({ page: browser.page, logger });
		if (loginOnly) {
			logger.logStep('info', 'gmail-login', null, 'login-only; close the window when done browsing');
			printOauthSummary(results, runDir, credsStatus(env));
			return { ok: true, runDir, results, dry };
		}

		const ctx = {
			root,
			env,
			page: browser.page,
			context: browser.context,
			logger,
			envPath: dry ? path.join(runDir, 'dry.env') : envPath,
			fetchImpl: opts.fetchImpl,
		};

		for (const network of networks) {
			const fn = BOOTSTRAP[network];
			if (!fn) {
				logger.logStep('error', 'bootstrap', network, 'no connector');
				results.push({ ok: false, network, keys: [], msg: 'no connector' });
				continue;
			}
			try {
				const r = await fn(ctx);
				results.push(r);
			} catch (err) {
				console.error('[social-oauth:runSocialOauth:network]', { network, err: String(err) });
				logger.logStep('error', 'bootstrap', network, String(err));
				results.push({ ok: false, network, keys: [], msg: String(err) });
			}
		}
	} catch (err) {
		console.error('[social-oauth:runSocialOauth]', { err: String(err) });
		logger.logStep('error', 'run', null, String(err));
		printOauthSummary(results, runDir, credsStatus(env));
		return { ok: false, runDir, results, dry };
	} finally {
		try {
			if (browser?.context && !argv.includes('--keep-open')) await browser.context.close();
		} catch (err) {
			console.error('[social-oauth:runSocialOauth:close]', { err: String(err) });
		}
	}

	printOauthSummary(results, runDir, credsStatus(env));
	return { ok: results.every((r) => r.ok), runDir, results, dry };
}

/**
 * @param {{ ok: boolean, network: string, keys: string[], msg: string }[]} results
 * @param {string} runDir
 * @param {Record<string, string[]>} missing
 */
export function printOauthSummary(results, runDir, missing) {
	const table = results.map((r) => ({
		network: r.network,
		ok: r.ok,
		keys: (r.keys || []).join(' '),
		msg: r.msg,
	}));
	const creds = Object.fromEntries(Object.entries(missing || {}).map(([k, v]) => [k, v.length ? 'missing' : 'present']));
	console.log(JSON.stringify({ runDir, table, creds }, null, 2));
}
