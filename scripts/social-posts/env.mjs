import fs from 'node:fs';
import path from 'node:path';
import { NETWORK_ENV_KEYS, NETWORKS } from './constants.mjs';

/**
 * Parse KEY=VALUE lines. Does not override keys already set on `env`.
 * @param {string} filePath
 * @param {NodeJS.ProcessEnv} env
 */
export function loadEnvFile(filePath, env) {
	try {
		if (!fs.existsSync(filePath)) return;
		const text = fs.readFileSync(filePath, 'utf8');
		for (const line of text.split('\n')) {
			const t = line.trim();
			if (!t || t.startsWith('#')) continue;
			const eq = t.indexOf('=');
			if (eq < 1) continue;
			const key = t.slice(0, eq).trim();
			if (!key || env[key] !== undefined) continue;
			let val = t.slice(eq + 1).trim();
			if (
				(val.startsWith('"') && val.endsWith('"')) ||
				(val.startsWith("'") && val.endsWith("'"))
			) {
				val = val.slice(1, -1);
			}
			env[key] = val;
		}
	} catch (err) {
		console.error('[social-posts:loadEnvFile]', { filePath, err: String(err) });
	}
}

/**
 * @param {string} root
 * @param {NodeJS.ProcessEnv} env
 */
export function loadProjectEnv(root, env) {
	loadEnvFile(path.join(root, '.env.local'), env);
	loadEnvFile(path.join(root, '.env'), env);
}

/**
 * @param {string[]} argv
 * @param {NodeJS.ProcessEnv} env
 */
export function isDryRun(argv, env) {
	try {
		if (argv.includes('--dry-run')) return true;
		return String(env.SOCIAL_POSTS_DRY_RUN || '') === '1';
	} catch (err) {
		console.error('[social-posts:isDryRun]', { err: String(err) });
		return true;
	}
}

/**
 * @param {string} network
 * @param {NodeJS.ProcessEnv} env
 * @returns {string[]}
 */
export function missingEnvKeys(network, env) {
	const keys = NETWORK_ENV_KEYS[network];
	if (!keys) return [`unknown-network:${network}`];
	return keys.filter((k) => !String(env[k] || '').trim());
}

/**
 * @param {NodeJS.ProcessEnv} env
 */
export function credsStatus(env) {
	const out = {};
	for (const n of NETWORKS) {
		out[n] = missingEnvKeys(n, env);
	}
	return out;
}

/**
 * @param {string} flag
 * @param {string[]} argv
 * @param {string} [fallback]
 */
export function argvValue(flag, argv, fallback = '') {
	const i = argv.indexOf(flag);
	if (i === -1 || i + 1 >= argv.length) return fallback;
	return argv[i + 1];
}
