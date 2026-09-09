import { PORTAL_URLS, PORTAL_WAIT_MS, YOUTUBE_SCOPE } from '../constants.mjs';
import { captureAuthorizationCode } from '../authorize.mjs';
import { resolveClient, waitForClientBundle } from '../clients.mjs';
import { upsertEnvFile } from '../env-file.mjs';
import { postForm } from '../http.mjs';

/**
 * @param {{ clientId: string, redirectUri: string, state: string, challenge: string }} args
 */
export function youtubeAuthorizeUrl(args) {
	const u = new URL('https://accounts.google.com/o/oauth2/v2/auth');
	u.searchParams.set('client_id', args.clientId);
	u.searchParams.set('redirect_uri', args.redirectUri);
	u.searchParams.set('response_type', 'code');
	u.searchParams.set('scope', YOUTUBE_SCOPE);
	u.searchParams.set('access_type', 'offline');
	u.searchParams.set('prompt', 'consent');
	u.searchParams.set('include_granted_scopes', 'true');
	u.searchParams.set('state', args.state);
	u.searchParams.set('code_challenge', args.challenge);
	u.searchParams.set('code_challenge_method', 'S256');
	return u.toString();
}

/**
 * @param {object} ctx
 */
export async function bootstrapYoutube(ctx) {
	const { env, root, page, logger, envPath } = ctx;
	try {
		let client = resolveClient(env, root, 'youtube', 'YOUTUBE_CLIENT_ID', 'YOUTUBE_CLIENT_SECRET');
		if (!client.client_id) {
			logger.logStep(
				'info',
				'portal',
				'youtube',
				`create Desktop OAuth client; enable YouTube Data API v3; add test user; redirect http://127.0.0.1:8788/callback; download JSON to Downloads`,
			);
			try {
				await page.goto(PORTAL_URLS.youtubeApi, { waitUntil: 'domcontentloaded', timeout: 60000 });
			} catch (err) {
				console.error('[social-oauth:bootstrapYoutube:portal]', { err: String(err) });
				logger.logStep('error', 'portal', 'youtube', String(err));
			}
			client = await waitForClientBundle({ root, network: 'youtube', logger, timeoutMs: PORTAL_WAIT_MS });
		}
		if (!client.client_id) {
			return { ok: false, network: 'youtube', keys: [], msg: 'missing youtube client_id' };
		}
		const auth = await captureAuthorizationCode({
			page,
			logger,
			network: 'youtube',
			buildUrl: ({ redirectUri, state, challenge }) =>
				youtubeAuthorizeUrl({ clientId: client.client_id, redirectUri, state, challenge }),
		});
		if (!auth.ok) return { ok: false, network: 'youtube', keys: [], msg: auth.error || 'authorize failed' };
		const body = {
			code: auth.code,
			client_id: client.client_id,
			redirect_uri: auth.redirectUri,
			grant_type: 'authorization_code',
			code_verifier: auth.verifier,
		};
		if (client.client_secret) body.client_secret = client.client_secret;
		const tok = await postForm({
			url: 'https://oauth2.googleapis.com/token',
			body,
			fetchImpl: ctx.fetchImpl,
			logger,
			network: 'youtube',
		});
		const refresh = tok.json?.refresh_token;
		if (!refresh) return { ok: false, network: 'youtube', keys: [], msg: 'no refresh_token (need prompt=consent Desktop client)' };
		const keys = upsertEnvFile(envPath, {
			YOUTUBE_CLIENT_ID: client.client_id,
			YOUTUBE_CLIENT_SECRET: client.client_secret || env.YOUTUBE_CLIENT_SECRET || '',
			YOUTUBE_REFRESH_TOKEN: refresh,
		});
		env.YOUTUBE_CLIENT_ID = client.client_id;
		env.YOUTUBE_CLIENT_SECRET = client.client_secret || env.YOUTUBE_CLIENT_SECRET;
		env.YOUTUBE_REFRESH_TOKEN = refresh;
		logger.logStep('info', 'write-env', 'youtube', keys.join(' '));
		return { ok: true, network: 'youtube', keys, msg: 'ok' };
	} catch (err) {
		console.error('[social-oauth:bootstrapYoutube]', { err: String(err) });
		logger.logStep('error', 'bootstrap', 'youtube', String(err));
		return { ok: false, network: 'youtube', keys: [], msg: String(err) };
	}
}
