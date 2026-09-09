import { LINKEDIN_SCOPES, PORTAL_URLS, PORTAL_WAIT_MS } from '../constants.mjs';
import { captureAuthorizationCode } from '../authorize.mjs';
import { resolveClient, waitForClientBundle } from '../clients.mjs';
import { upsertEnvFile } from '../env-file.mjs';
import { getJson, postForm } from '../http.mjs';

/**
 * @param {string} sub
 */
export function linkedInAuthorUrn(sub) {
	const id = String(sub || '').trim();
	if (!id) return '';
	if (id.startsWith('urn:li:person:')) return id;
	return `urn:li:person:${id}`;
}

/**
 * @param {{ clientId: string, redirectUri: string, state: string }} args
 */
export function linkedinAuthorizeUrl(args) {
	const u = new URL('https://www.linkedin.com/oauth/v2/authorization');
	u.searchParams.set('response_type', 'code');
	u.searchParams.set('client_id', args.clientId);
	u.searchParams.set('redirect_uri', args.redirectUri);
	u.searchParams.set('state', args.state);
	u.searchParams.set('scope', LINKEDIN_SCOPES);
	return u.toString();
}

/**
 * @param {object} ctx
 */
export async function bootstrapLinkedIn(ctx) {
	const { env, root, page, logger, envPath } = ctx;
	try {
		let client = resolveClient(env, root, 'linkedin', 'LINKEDIN_CLIENT_ID', 'LINKEDIN_CLIENT_SECRET');
		if (!client.client_id) {
			logger.logStep(
				'info',
				'portal',
				'linkedin',
				'developers/apps: create app, add Sign In with LinkedIn (OIDC) + Share on LinkedIn, redirect http://127.0.0.1:8788/callback; save {client_id,client_secret} to .playwright/oauth-clients/linkedin.json',
			);
			try {
				await page.goto(PORTAL_URLS.linkedinApps, { waitUntil: 'domcontentloaded', timeout: 60000 });
			} catch (err) {
				console.error('[social-oauth:bootstrapLinkedIn:portal]', { err: String(err) });
				logger.logStep('error', 'portal', 'linkedin', String(err));
			}
			client = await waitForClientBundle({ root, network: 'linkedin', logger, timeoutMs: PORTAL_WAIT_MS });
		}
		if (!client.client_id || !client.client_secret) {
			return { ok: false, network: 'linkedin', keys: [], msg: 'missing linkedin client_id/secret' };
		}
		const auth = await captureAuthorizationCode({
			page,
			logger,
			network: 'linkedin',
			buildUrl: ({ redirectUri, state }) =>
				linkedinAuthorizeUrl({ clientId: client.client_id, redirectUri, state }),
		});
		if (!auth.ok) return { ok: false, network: 'linkedin', keys: [], msg: auth.error || 'authorize failed' };
		const tok = await postForm({
			url: 'https://www.linkedin.com/oauth/v2/accessToken',
			body: {
				grant_type: 'authorization_code',
				code: auth.code,
				redirect_uri: auth.redirectUri,
				client_id: client.client_id,
				client_secret: client.client_secret,
			},
			fetchImpl: ctx.fetchImpl,
			logger,
			network: 'linkedin',
		});
		const access = tok.json?.access_token;
		if (!access) return { ok: false, network: 'linkedin', keys: [], msg: 'no access_token' };
		const me = await getJson({
			url: 'https://api.linkedin.com/v2/userinfo',
			headers: { Authorization: `Bearer ${access}` },
			fetchImpl: ctx.fetchImpl,
			logger,
			network: 'linkedin',
		});
		const urn = linkedInAuthorUrn(me.json?.sub);
		if (!urn) return { ok: false, network: 'linkedin', keys: [], msg: 'no userinfo.sub' };
		const pairs = {
			LINKEDIN_CLIENT_ID: client.client_id,
			LINKEDIN_CLIENT_SECRET: client.client_secret,
			LINKEDIN_ACCESS_TOKEN: access,
			LINKEDIN_AUTHOR_URN: urn,
		};
		const keys = upsertEnvFile(envPath, pairs);
		Object.assign(env, pairs);
		logger.logStep('info', 'write-env', 'linkedin', keys.join(' '));
		return { ok: true, network: 'linkedin', keys, msg: 'ok' };
	} catch (err) {
		console.error('[social-oauth:bootstrapLinkedIn]', { err: String(err) });
		logger.logStep('error', 'bootstrap', 'linkedin', String(err));
		return { ok: false, network: 'linkedin', keys: [], msg: String(err) };
	}
}
