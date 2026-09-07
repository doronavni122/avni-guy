import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { NETWORKS } from './constants.mjs';
import { argvValue, credsStatus, isDryRun, loadProjectEnv } from './env.mjs';
import { createLogger } from './log.mjs';

/**
 * @typedef {{ ok: boolean, network: string, method: string|null, result: string, url: string|null, msg: string }} NetResult
 */

/**
 * @param {{
 *   root: string,
 *   argv?: string[],
 *   env?: NodeJS.ProcessEnv,
 *   now?: () => Date,
 *   fetchImpl?: typeof fetch,
 *   sleep?: (ms: number) => Promise<void>,
 *   loadSource?: Function,
 *   buildCopy?: Function,
 *   prepareMedia?: Function,
 *   publishAll?: Function,
 * }} opts
 */
export async function runSocialPosts(opts) {
	const root = opts.root;
	const argv = opts.argv || process.argv.slice(2);
	const env = opts.env || { ...process.env };
	const now = opts.now || (() => new Date());

	try {
		loadProjectEnv(root, env);
	} catch (err) {
		console.error('[social-posts:loadProjectEnv]', { err: String(err) });
	}

	const runId = now().toISOString().replace(/[:.]/g, '').replace('Z', 'Z');
	const runDir = path.join(os.tmpdir(), 'avni-social-posts', runId);
	fs.mkdirSync(runDir, { recursive: true });
	const logger = createLogger(path.join(runDir, 'run.jsonl'));
	logger.logStep('info', 'run-start', null, `runDir=${runDir}`);

	const dry = isDryRun(argv, env);
	if (dry) logger.logStep('info', 'dry-run', null, 'SOCIAL_POSTS_DRY_RUN or --dry-run');

	const missing = credsStatus(env);
	/** @type {NetResult[]} */
	const results = [];

	for (const network of NETWORKS) {
		if (missing[network].length) {
			logger.logStep('error', 'token', network, `missing ${missing[network].join(' ')}`);
			results.push({
				ok: false,
				network,
				method: 'skipped',
				result: 'error',
				url: null,
				msg: `missing ${missing[network].join(' ')}`,
			});
		}
	}

	if (typeof opts.loadSource === 'function') {
		try {
			const source = await opts.loadSource({ root, argv, env, runDir, logger });
			if (!source) {
				logger.logStep('error', 'load-content', null, 'no blog mdx');
				return { runDir, dry, results, ok: false };
			}
			fs.writeFileSync(path.join(runDir, 'source.json'), JSON.stringify(source, null, 2));
			logger.logStep('info', 'load-content', null, source.slug || 'source');

			if (typeof opts.buildCopy === 'function') {
				const copy = await opts.buildCopy({ source, env, logger });
				fs.writeFileSync(path.join(runDir, 'copy.json'), JSON.stringify(copy, null, 2));
				logger.logStep('info', 'write-copy', null, path.join(runDir, 'copy.json'));

				if (typeof opts.prepareMedia === 'function') {
					await opts.prepareMedia({ source, copy, runDir, env, logger, fetchImpl: opts.fetchImpl });
				}
				if (typeof opts.publishAll === 'function') {
					const published = await opts.publishAll({
						source,
						copy,
						runDir,
						env,
						argv,
						dry,
						logger,
						fetchImpl: opts.fetchImpl,
						sleep: opts.sleep,
						missing,
					});
					results.length = 0;
					results.push(...published);
				} else if (dry) {
					for (const network of NETWORKS) {
						const already = results.find((r) => r.network === network);
						if (already) continue;
						fs.writeFileSync(
							path.join(runDir, `${network}-payload.json`),
							JSON.stringify(copy[network] || {}, null, 2),
						);
						logger.logStep('info', 'dry-run', network, `${network}-payload.json`);
						results.push({
							ok: true,
							network,
							method: 'dry-run',
							result: 'dry-run',
							url: null,
							msg: 'dry-run',
						});
					}
				}
			}
		} catch (err) {
			logger.logStep('error', 'load-content', null, String(err));
			return { runDir, dry, results, ok: false };
		}
	}

	const slug = argvValue('--slug', argv, '');
	if (slug) logger.logStep('info', 'load-content', null, `slug=${slug}`);

	printSummary(results, runDir);
	return { runDir, dry, results, ok: true };
}

/**
 * @param {NetResult[]} results
 * @param {string} runDir
 */
export function printSummary(results, runDir) {
	const table = results.map((r) => ({
		network: r.network,
		method: r.method,
		result: r.result,
		url_or_msg: r.url || r.msg,
	}));
	console.log(JSON.stringify({ runDir, table }, null, 2));
}
