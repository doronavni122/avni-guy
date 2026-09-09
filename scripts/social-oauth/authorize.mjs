import { createPkcePair, randomUrlSafe } from './pkce.mjs';
import { listenLoopback } from './loopback.mjs';
import { CONSENT_WAIT_MS } from './constants.mjs';

/**
 * Open authorize URL in the persistent page; capture loopback code; verify state.
 * @param {{
 *   page: import('@playwright/test').Page,
 *   logger: { logStep: Function },
 *   network: string,
 *   buildUrl: (args: { redirectUri: string, state: string, challenge: string, verifier: string }) => string,
 *   timeoutMs?: number,
 * }} opts
 */
export async function captureAuthorizationCode(opts) {
	const pkce = createPkcePair();
	const state = randomUrlSafe(16);
	const loop = await listenLoopback({ logger: opts.logger });
	try {
		const authorizeUrl = opts.buildUrl({
			redirectUri: loop.redirectUri,
			state,
			challenge: pkce.challenge,
			verifier: pkce.verifier,
		});
		opts.logger.logStep('info', 'authorize', opts.network, 'navigating; approve in the headed window if asked');
		try {
			await opts.page.goto(authorizeUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
		} catch (err) {
			console.error('[social-oauth:captureAuthorizationCode:goto]', { network: opts.network, err: String(err) });
			opts.logger.logStep('error', 'authorize', opts.network, String(err));
		}
		const timeoutMs = opts.timeoutMs ?? CONSENT_WAIT_MS;
		const result = await Promise.race([
			loop.waitForCode(),
			new Promise((_, reject) => {
				setTimeout(() => reject(new Error('consent timeout')), timeoutMs);
			}),
		]);
		if (result.error) {
			opts.logger.logStep('error', 'authorize', opts.network, result.error);
			return { ok: false, ...result, verifier: pkce.verifier, redirectUri: loop.redirectUri };
		}
		if (result.state && result.state !== state) {
			opts.logger.logStep('error', 'authorize', opts.network, 'state mismatch');
			return { ok: false, error: 'state_mismatch', code: '', verifier: pkce.verifier, redirectUri: loop.redirectUri };
		}
		if (!result.code) {
			opts.logger.logStep('error', 'authorize', opts.network, 'empty code');
			return { ok: false, error: 'empty_code', code: '', verifier: pkce.verifier, redirectUri: loop.redirectUri };
		}
		opts.logger.logStep('info', 'authorize', opts.network, 'code captured');
		return { ok: true, ...result, verifier: pkce.verifier, redirectUri: loop.redirectUri };
	} finally {
		try {
			await loop.close();
		} catch (err) {
			console.error('[social-oauth:captureAuthorizationCode:close]', { err: String(err) });
		}
	}
}
