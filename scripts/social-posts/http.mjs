import { redact } from './log.mjs';

const BODY_CAP = 500;

/**
 * @param {string} text
 */
export function truncateBody(text) {
	const r = redact(text || '');
	return r.length > BODY_CAP ? `${r.slice(0, BODY_CAP)}…` : r;
}

/**
 * @param {{
 *   fetchImpl: typeof fetch,
 *   method: string,
 *   url: string,
 *   headers?: Record<string, string>,
 *   body?: unknown,
 *   rawBody?: BodyInit,
 *   logger: { logStep: Function },
 *   step: string,
 *   network: string,
 *   sleep?: (ms: number) => Promise<void>,
 *   retry429?: boolean,
 * }} opts
 */
export async function httpRequest(opts) {
	const fetchImpl = opts.fetchImpl || fetch;
	const sleep = opts.sleep || ((ms) => new Promise((r) => setTimeout(r, ms)));
	const retry429 = opts.retry429 !== false;
	const headers = { ...(opts.headers || {}) };
	try {
		const init = { method: opts.method, headers };
		if (opts.rawBody !== undefined) init.body = opts.rawBody;
		else if (opts.body !== undefined) {
			headers['Content-Type'] = headers['Content-Type'] || 'application/json';
			init.body = JSON.stringify(opts.body);
		}
		const res = await fetchImpl(opts.url, init);
		const text = await res.text();
		if (res.status === 429 && retry429) {
			opts.logger.logStep('error', opts.step, opts.network, `429 ${truncateBody(text)}`);
			await sleep(30_000);
			return httpRequest({ ...opts, retry429: false });
		}
		let json = null;
		try {
			json = text ? JSON.parse(text) : null;
		} catch {
			json = null;
		}
		return { ok: res.ok, status: res.status, text: truncateBody(text), json, rawText: text };
	} catch (err) {
		opts.logger.logStep('error', opts.step, opts.network, String(err));
		return { ok: false, status: 0, text: String(err), json: null, rawText: '' };
	}
}
