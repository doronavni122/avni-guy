/**
 * Load repo-root `.env.local` into process.env (does not override existing env).
 * Log: [load-env-local]
 */
import fs from 'node:fs';
import path from 'node:path';

let loaded = false;

export function loadEnvLocal() {
	if (loaded) return;
	loaded = true;
	const fp = path.join(process.cwd(), '.env.local');
	if (!fs.existsSync(fp)) return;
	const text = fs.readFileSync(fp, 'utf8');
	for (const line of text.split('\n')) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('#')) continue;
		const eq = trimmed.indexOf('=');
		if (eq <= 0) continue;
		const key = trimmed.slice(0, eq).trim();
		if (!key || process.env[key] !== undefined) continue;
		let val = trimmed.slice(eq + 1).trim();
		if (
			(val.startsWith('"') && val.endsWith('"')) ||
			(val.startsWith("'") && val.endsWith("'"))
		) {
			val = val.slice(1, -1);
		}
		process.env[key] = val;
	}
}
