import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { CLIENTS_DIR, PORTAL_WAIT_MS } from './constants.mjs';
import { parseClientBundle, readClientBundleFile } from './env-file.mjs';
import { waitUntil } from './wait.mjs';

/**
 * @param {NodeJS.ProcessEnv} env
 * @param {string} root
 * @param {string} network
 * @param {string} idKey
 * @param {string} secretKey
 */
export function resolveClient(env, root, network, idKey, secretKey) {
	try {
		const fromEnv = {
			client_id: String(env[idKey] || '').trim(),
			client_secret: String(env[secretKey] || '').trim(),
		};
		if (fromEnv.client_id) return { ...fromEnv, source: 'env' };
		const file = readClientBundleFile(root, network);
		if (file.client_id) return { ...file, source: 'file' };
		return { client_id: '', client_secret: '', source: 'missing' };
	} catch (err) {
		console.error('[social-oauth:resolveClient]', { network, err: String(err) });
		return { client_id: '', client_secret: '', source: 'error' };
	}
}

/**
 * @param {string} dir
 */
export function newestGoogleClientSecretJson(dir) {
	try {
		if (!fs.existsSync(dir)) return '';
		const files = fs
			.readdirSync(dir)
			.filter((n) => n.startsWith('client_secret') && n.endsWith('.json'))
			.map((n) => {
				const p = path.join(dir, n);
				return { p, m: fs.statSync(p).mtimeMs };
			})
			.sort((a, b) => b.m - a.m);
		return files[0]?.p || '';
	} catch (err) {
		console.error('[social-oauth:newestGoogleClientSecretJson]', { err: String(err) });
		return '';
	}
}

/**
 * Copy Google Cloud "Download JSON" into .playwright/oauth-clients/youtube.json
 * @param {string} root
 */
export function importGoogleClientFromDownloads(root) {
	try {
		const found = newestGoogleClientSecretJson(path.join(os.homedir(), 'Downloads'));
		if (!found) return { client_id: '', client_secret: '' };
		const bundle = parseClientBundle(fs.readFileSync(found, 'utf8'));
		if (!bundle.client_id) return bundle;
		const destDir = path.join(root, CLIENTS_DIR);
		fs.mkdirSync(destDir, { recursive: true });
		fs.copyFileSync(found, path.join(destDir, 'youtube.json'));
		return bundle;
	} catch (err) {
		console.error('[social-oauth:importGoogleClientFromDownloads]', { err: String(err) });
		return { client_id: '', client_secret: '' };
	}
}

/**
 * Poll env file bundle + Downloads JSON until client_id exists.
 * @param {{ root: string, network: string, logger: { logStep: Function }, timeoutMs?: number, extra?: () => { client_id: string, client_secret: string } }} opts
 */
export async function waitForClientBundle(opts) {
	const timeoutMs = opts.timeoutMs ?? PORTAL_WAIT_MS;
	opts.logger.logStep(
		'info',
		'portal',
		opts.network,
		`waiting for ${opts.network} client_id in .playwright/oauth-clients/${opts.network}.json (or Downloads client_secret*.json for youtube)`,
	);
	let found = { client_id: '', client_secret: '' };
	const ok = await waitUntil({
		timeoutMs,
		intervalMs: 2000,
		fn: () => {
			if (opts.network === 'youtube') {
				const fromDl = importGoogleClientFromDownloads(opts.root);
				if (fromDl.client_id) {
					found = fromDl;
					return true;
				}
			}
			const file = readClientBundleFile(opts.root, opts.network);
			if (file.client_id) {
				found = file;
				return true;
			}
			if (typeof opts.extra === 'function') {
				const extra = opts.extra();
				if (extra?.client_id) {
					found = extra;
					return true;
				}
			}
			return false;
		},
	});
	if (!ok) opts.logger.logStep('error', 'portal', opts.network, 'client bundle timeout');
	else opts.logger.logStep('info', 'portal', opts.network, 'client_id present');
	return found;
}
