import fs from 'node:fs';
import path from 'node:path';

/**
 * @param {string} raw
 * @returns {Record<string, string>}
 */
export function parseEnvText(raw) {
	/** @type {Record<string, string>} */
	const out = {};
	try {
		for (const line of String(raw || '').split('\n')) {
			const t = line.trim();
			if (!t || t.startsWith('#')) continue;
			const eq = t.indexOf('=');
			if (eq < 1) continue;
			const key = t.slice(0, eq).trim();
			let val = t.slice(eq + 1).trim();
			if (
				(val.startsWith('"') && val.endsWith('"')) ||
				(val.startsWith("'") && val.endsWith("'"))
			) {
				val = val.slice(1, -1);
			}
			if (key) out[key] = val;
		}
	} catch (err) {
		console.error('[social-oauth:parseEnvText]', { err: String(err) });
	}
	return out;
}

/**
 * @param {string} value
 */
function escapeEnvValue(value) {
	const s = String(value ?? '');
	if (/[\s#"']/.test(s)) return `"${s.replace(/"/g, '\\"')}"`;
	return s;
}

/**
 * Upsert keys in an env file. Never logs values.
 * @param {string} filePath
 * @param {Record<string, string>} pairs
 * @param {{ force?: boolean }} [opts]
 * @returns {string[]} keys written
 */
export function upsertEnvFile(filePath, pairs, opts = {}) {
	const force = opts.force !== false;
	const written = [];
	try {
		fs.mkdirSync(path.dirname(filePath), { recursive: true });
		let text = '';
		try {
			if (fs.existsSync(filePath)) text = fs.readFileSync(filePath, 'utf8');
		} catch (err) {
			console.error('[social-oauth:upsertEnvFile:read]', { err: String(err) });
			throw err;
		}
		const existing = parseEnvText(text);
		let next = text.endsWith('\n') || text === '' ? text : `${text}\n`;
		for (const [key, value] of Object.entries(pairs)) {
			if (!key) continue;
			const val = String(value ?? '');
			if (!val) continue;
			if (!force && String(existing[key] || '').trim()) continue;
			const line = `${key}=${escapeEnvValue(val)}`;
			const re = new RegExp(`^${key}=.*$`, 'm');
			if (re.test(next)) next = next.replace(re, line);
			else next += `${line}\n`;
			written.push(key);
		}
		fs.writeFileSync(filePath, next, { encoding: 'utf8', mode: 0o600 });
	} catch (err) {
		console.error('[social-oauth:upsertEnvFile]', { filePath, keys: Object.keys(pairs), err: String(err) });
		throw err;
	}
	return written;
}

/**
 * @param {unknown} raw
 * @returns {{ client_id: string, client_secret: string }}
 */
export function parseClientBundle(raw) {
	try {
		const obj = typeof raw === 'string' ? JSON.parse(raw) : raw;
		if (!obj || typeof obj !== 'object') return { client_id: '', client_secret: '' };
		const installed = obj.installed || obj.web || obj;
		const client_id = String(installed.client_id || installed.clientId || obj.client_id || '');
		const client_secret = String(
			installed.client_secret || installed.clientSecret || obj.client_secret || '',
		);
		return { client_id, client_secret };
	} catch (err) {
		console.error('[social-oauth:parseClientBundle]', { err: String(err) });
		return { client_id: '', client_secret: '' };
	}
}

/**
 * @param {string} root
 * @param {string} network
 */
export function readClientBundleFile(root, network) {
	const filePath = path.join(root, '.playwright', 'oauth-clients', `${network}.json`);
	try {
		if (!fs.existsSync(filePath)) return { client_id: '', client_secret: '' };
		return parseClientBundle(fs.readFileSync(filePath, 'utf8'));
	} catch (err) {
		console.error('[social-oauth:readClientBundleFile]', { network, err: String(err) });
		return { client_id: '', client_secret: '' };
	}
}
