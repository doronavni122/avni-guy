import http from 'node:http';
import { LOOPBACK_HOST, LOOPBACK_PATH, LOOPBACK_PORT_DEFAULT } from './constants.mjs';

/**
 * @param {string} rawUrl
 * @param {string} [base]
 */
export function parseCallbackSearch(rawUrl, base = 'http://127.0.0.1') {
	try {
		const u = new URL(rawUrl, base);
		return {
			pathname: u.pathname,
			code: u.searchParams.get('code') || '',
			state: u.searchParams.get('state') || '',
			error: u.searchParams.get('error') || '',
			errorDescription: u.searchParams.get('error_description') || '',
		};
	} catch (err) {
		console.error('[social-oauth:parseCallbackSearch]', { err: String(err) });
		return { pathname: '', code: '', state: '', error: 'parse_failed', errorDescription: String(err) };
	}
}

/**
 * RFC 8252 loopback listener. Fixed port so developer portals can pre-register the URI.
 * @param {{ port?: number, path?: string, logger?: { logStep: Function } }} [opts]
 */
export function listenLoopback(opts = {}) {
	const port = Number(opts.port || process.env.SOCIAL_OAUTH_LOOPBACK_PORT || LOOPBACK_PORT_DEFAULT);
	const pathName = opts.path || LOOPBACK_PATH;
	const logger = opts.logger;

	return new Promise((resolve, reject) => {
		/** @type {(v: { code: string, state: string, error: string, errorDescription: string }) => void} */
		let settle;
		const codePromise = new Promise((res) => {
			settle = res;
		});

		const server = http.createServer((req, res) => {
			try {
				const parsed = parseCallbackSearch(req.url || '/', `http://${LOOPBACK_HOST}:${port}`);
				if (parsed.pathname !== pathName) {
					res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
					res.end('not found');
					return;
				}
				res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
				res.end(
					'<!doctype html><html><body><p>OAuth callback received. You can return to the terminal.</p></body></html>',
				);
				settle({
					code: parsed.code,
					state: parsed.state,
					error: parsed.error,
					errorDescription: parsed.errorDescription,
				});
			} catch (err) {
				console.error('[social-oauth:loopback-request]', { err: String(err) });
				res.writeHead(500);
				res.end('error');
			}
		});

		server.on('error', (err) => {
			console.error('[social-oauth:listenLoopback]', { port, err: String(err) });
			reject(err);
		});

		server.listen(port, LOOPBACK_HOST, () => {
			const redirectUri = `http://${LOOPBACK_HOST}:${port}${pathName}`;
			logger?.logStep('info', 'loopback', null, `listening ${redirectUri}`);
			resolve({
				redirectUri,
				port,
				waitForCode: () => codePromise,
				close: () =>
					new Promise((res) => {
						server.close(() => res());
					}),
			});
		});
	});
}
