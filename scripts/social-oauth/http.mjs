import { redact } from '../social-posts/log.mjs';

/**
 * POST application/x-www-form-urlencoded. Never logs body values.
 * @param {{
 *   url: string,
 *   body: Record<string, string>,
 *   headers?: Record<string, string>,
 *   fetchImpl?: typeof fetch,
 *   logger?: { logStep: Function },
 *   network?: string,
 * }} opts
 */
export async function postForm(opts) {
	const fetchImpl = opts.fetchImpl || fetch;
	const { url, body } = opts;
	try {
		const headers = { 'Content-Type': 'application/x-www-form-urlencoded', ...(opts.headers || {}) };
		const rawBody = new URLSearchParams(body);
		const res = await fetchImpl(url, { method: 'POST', headers, body: rawBody });
		const text = await res.text();
		let json = null;
		try {
			json = JSON.parse(text);
		} catch {
			json = null;
		}
		opts.logger?.logStep(
			res.ok ? 'info' : 'error',
			'token-exchange',
			opts.network || null,
			`status=${res.status} ${redact(text).slice(0, 200)}`,
		);
		return { ok: res.ok, status: res.status, json, text };
	} catch (err) {
		console.error('[social-oauth:postForm]', { url, err: String(err) });
		opts.logger?.logStep('error', 'token-exchange', opts.network || null, String(err));
		return { ok: false, status: 0, json: null, text: String(err) };
	}
}

/**
 * GET JSON. Never logs tokens.
 * @param {{ url: string, headers?: Record<string, string>, fetchImpl?: typeof fetch, logger?: { logStep: Function }, network?: string }} opts
 */
export async function getJson(opts) {
	const fetchImpl = opts.fetchImpl || fetch;
	try {
		const res = await fetchImpl(opts.url, { headers: opts.headers || {} });
		const text = await res.text();
		let json = null;
		try {
			json = JSON.parse(text);
		} catch {
			json = null;
		}
		opts.logger?.logStep(
			res.ok ? 'info' : 'error',
			'api-get',
			opts.network || null,
			`status=${res.status} ${redact(text).slice(0, 200)}`,
		);
		return { ok: res.ok, status: res.status, json, text };
	} catch (err) {
		console.error('[social-oauth:getJson]', { url: opts.url, err: String(err) });
		opts.logger?.logStep('error', 'api-get', opts.network || null, String(err));
		return { ok: false, status: 0, json: null, text: String(err) };
	}
}

/**
 * @param {string} clientId
 * @param {string} clientSecret
 */
export function basicAuthHeader(clientId, clientSecret) {
	try {
		const token = Buffer.from(`${clientId}:${clientSecret}`, 'utf8').toString('base64');
		return `Basic ${token}`;
	} catch (err) {
		console.error('[social-oauth:basicAuthHeader]', { err: String(err) });
		return '';
	}
}
