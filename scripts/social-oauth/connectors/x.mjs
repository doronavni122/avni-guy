import { PORTAL_URLS, PORTAL_WAIT_MS, X_SCOPES } from '../constants.mjs';
import { captureAuthorizationCode } from '../authorize.mjs';
import { resolveClient, waitForClientBundle } from '../clients.mjs';
import { upsertEnvFile } from '../env-file.mjs';
import { basicAuthHeader, postForm } from '../http.mjs';

/**
 * @param {{ clientId: string, redirectUri: string, state: string, challenge: string, scopes?: string }} args
 */
export function xAuthorizeUrl(args) {
	const u = new URL('https://x.com/i/oauth2/authorize');
	u.searchParams.set('response_type', 'code');
	u.searchParams.set('client_id', args.clientId);
	u.searchParams.set('redirect_uri', args.redirectUri);
	u.searchParams.set('scope', args.scopes || X_SCOPES);
	u.searchParams.set('state', args.state);
	u.searchParams.set('code_challenge', args.challenge);
	u.searchParams.set('code_challenge_method', 'S256');
	return u.toString();
}

/**
 * @param {object} ctx
 * @param {{ client_id: string, client_secret: string, code: string, redirectUri: string, verifier: string }} args
 */
export async function exchangeXCode(ctx, args) {
	const body = {
		code: args.code,
		grant_type: 'authorization_code',
		redirect_uri: args.redirectUri,
		code_verifier: args.verifier,
		client_id: args.client_id,
	};
	/** @type {Record<string, string>} */
	const headers = {};
	if (args.client_secret) {
		headers.Authorization = basicAuthHeader(args.client_id, args.client_secret);
	}
	return postForm({
		url: 'https://api.x.com/2/oauth2/token',
		body,
		headers,
		fetchImpl: ctx.fetchImpl,
		logger: ctx.logger,
		network: 'x',
	});
}

/**
 * @param {object} ctx
 */
export async function bootstrapX(ctx) {
	const { env, root, page, logger, envPath } = ctx;
	try {
		let client = resolveClient(env, root, 'x', 'X_CLIENT_ID', 'X_CLIENT_SECRET');
		if (!client.client_id) {
			logger.logStep(
				'info',
				'portal',
				'x',
				`developer.x.com: create app, OAuth 2.0 User auth Read+Write, callback http://127.0.0.1:8788/callback, website ${'https://avniguy.co.il'}; save {client_id,client_secret} to .playwright/oauth-clients/x.json`,
			);
			try {
				await page.goto(PORTAL_URLS.xPortal, { waitUntil: 'domcontentloaded', timeout: 60000 });
			} catch (err) {
				console.error('[social-oauth:bootstrapX:portal]', { err: String(err) });
				logger.logStep('error', 'portal', 'x', String(err));
			}
			client = await waitForClientBundle({ root, network: 'x', logger, timeoutMs: PORTAL_WAIT_MS });
		}
		if (!client.client_id) return { ok: false, network: 'x', keys: [], msg: 'missing x client_id' };

		let scopes = X_SCOPES;
		let auth = await captureAuthorizationCode({
			page,
			logger,
			network: 'x',
			buildUrl: ({ redirectUri, state, challenge }) =>
				xAuthorizeUrl({ clientId: client.client_id, redirectUri, state, challenge, scopes }),
		});
		if (!auth.ok && /invalid_scope|media.write/i.test(auth.error || '')) {
			scopes = 'tweet.read tweet.write users.read offline.access';
			auth = await captureAuthorizationCode({
				page,
				logger,
				network: 'x',
				buildUrl: ({ redirectUri, state, challenge }) =>
					xAuthorizeUrl({ clientId: client.client_id, redirectUri, state, challenge, scopes }),
			});
		}
		if (!auth.ok) return { ok: false, network: 'x', keys: [], msg: auth.error || 'authorize failed' };

		const tok = await exchangeXCode(ctx, {
			client_id: client.client_id,
			client_secret: client.client_secret,
			code: auth.code,
			redirectUri: auth.redirectUri,
			verifier: auth.verifier,
		});
		const access = tok.json?.access_token;
		const refresh = tok.json?.refresh_token;
		if (!access) return { ok: false, network: 'x', keys: [], msg: 'no access_token' };
		const pairs = {
			X_CLIENT_ID: client.client_id,
			X_USER_ACCESS_TOKEN: access,
		};
		if (client.client_secret) pairs.X_CLIENT_SECRET = client.client_secret;
		if (refresh) pairs.X_REFRESH_TOKEN = refresh;
		const keys = upsertEnvFile(envPath, pairs);
		Object.assign(env, pairs);
		logger.logStep('info', 'write-env', 'x', keys.join(' '));
		return { ok: true, network: 'x', keys, msg: 'ok' };
	} catch (err) {
		console.error('[social-oauth:bootstrapX]', { err: String(err) });
		logger.logStep('error', 'bootstrap', 'x', String(err));
		return { ok: false, network: 'x', keys: [], msg: String(err) };
	}
}
