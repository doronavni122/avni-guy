import path from 'node:path';
import { GRAPH_API_VERSION_DEFAULT } from '../../social-posts/constants.mjs';
import { FB_STORAGE_STATE, META_SCOPES, PORTAL_URLS, PORTAL_WAIT_MS } from '../constants.mjs';
import { captureAuthorizationCode } from '../authorize.mjs';
import { resolveClient, waitForClientBundle } from '../clients.mjs';
import { upsertEnvFile } from '../env-file.mjs';
import { getJson } from '../http.mjs';

const GRAPH = `https://graph.facebook.com/${GRAPH_API_VERSION_DEFAULT}`;

/**
 * @param {{ clientId: string, redirectUri: string, state: string }} args
 */
export function metaAuthorizeUrl(args) {
	const u = new URL(`https://www.facebook.com/${GRAPH_API_VERSION_DEFAULT}/dialog/oauth`);
	u.searchParams.set('client_id', args.clientId);
	u.searchParams.set('redirect_uri', args.redirectUri);
	u.searchParams.set('state', args.state);
	u.searchParams.set('response_type', 'code');
	u.searchParams.set('scope', META_SCOPES);
	return u.toString();
}

/**
 * @param {object} ctx
 * @param {{ appId: string, appSecret: string, code: string, redirectUri: string }} args
 */
export async function exchangeMetaCode(ctx, args) {
	const u = new URL(`${GRAPH}/oauth/access_token`);
	u.searchParams.set('client_id', args.appId);
	u.searchParams.set('client_secret', args.appSecret);
	u.searchParams.set('redirect_uri', args.redirectUri);
	u.searchParams.set('code', args.code);
	return getJson({ url: u.toString(), fetchImpl: ctx.fetchImpl, logger: ctx.logger, network: 'facebook' });
}

/**
 * @param {object} ctx
 * @param {{ appId: string, appSecret: string, shortToken: string }} args
 */
export async function exchangeMetaLongLived(ctx, args) {
	const u = new URL(`${GRAPH}/oauth/access_token`);
	u.searchParams.set('grant_type', 'fb_exchange_token');
	u.searchParams.set('client_id', args.appId);
	u.searchParams.set('client_secret', args.appSecret);
	u.searchParams.set('fb_exchange_token', args.shortToken);
	return getJson({ url: u.toString(), fetchImpl: ctx.fetchImpl, logger: ctx.logger, network: 'facebook' });
}

/**
 * @param {object} ctx
 */
export async function bootstrapMeta(ctx) {
	const { env, root, page, context, logger, envPath } = ctx;
	try {
		let client = resolveClient(env, root, 'meta', 'FACEBOOK_APP_ID', 'FACEBOOK_APP_SECRET');
		if (!client.client_id) {
			logger.logStep(
				'info',
				'portal',
				'meta',
				'developers.facebook.com: create Business app, add Facebook Login for Business + Instagram Graph; Valid OAuth Redirect http://127.0.0.1:8788/callback; save {client_id,client_secret} to .playwright/oauth-clients/meta.json. Create a Facebook Page (Graph cannot post to a personal profile). Convert IG to Professional and link the Page.',
			);
			try {
				await page.goto(PORTAL_URLS.metaApps, { waitUntil: 'domcontentloaded', timeout: 60000 });
			} catch (err) {
				console.error('[social-oauth:bootstrapMeta:portal]', { err: String(err) });
				logger.logStep('error', 'portal', 'meta', String(err));
			}
			client = await waitForClientBundle({ root, network: 'meta', logger, timeoutMs: PORTAL_WAIT_MS });
		}
		if (!client.client_id || !client.client_secret) {
			return { ok: false, network: 'meta', keys: [], msg: 'missing facebook app id/secret' };
		}

		if (!env.FACEBOOK_PAGE_ID) {
			logger.logStep('info', 'portal', 'facebook', 'open Page create if you still have a personal profile only');
			try {
				await page.goto(PORTAL_URLS.facebookPagesCreate, { waitUntil: 'domcontentloaded', timeout: 60000 });
			} catch (err) {
				console.error('[social-oauth:bootstrapMeta:page-create]', { err: String(err) });
			}
		}

		const auth = await captureAuthorizationCode({
			page,
			logger,
			network: 'meta',
			buildUrl: ({ redirectUri, state }) =>
				metaAuthorizeUrl({ clientId: client.client_id, redirectUri, state }),
		});
		if (!auth.ok) return { ok: false, network: 'meta', keys: [], msg: auth.error || 'authorize failed' };

		const short = await exchangeMetaCode(ctx, {
			appId: client.client_id,
			appSecret: client.client_secret,
			code: auth.code,
			redirectUri: auth.redirectUri,
		});
		const shortTok = short.json?.access_token;
		if (!shortTok) return { ok: false, network: 'meta', keys: [], msg: 'no short-lived token' };

		const long = await exchangeMetaLongLived(ctx, {
			appId: client.client_id,
			appSecret: client.client_secret,
			shortToken: shortTok,
		});
		const userTok = long.json?.access_token || shortTok;

		const accounts = await getJson({
			url: `${GRAPH}/me/accounts`,
			headers: { Authorization: `Bearer ${userTok}` },
			fetchImpl: ctx.fetchImpl,
			logger,
			network: 'facebook',
		});
		const pageRow = accounts.json?.data?.[0];
		if (!pageRow?.id || !pageRow?.access_token) {
			logger.logStep('error', 'bootstrap', 'facebook', 'no Page in /me/accounts — create a Page then re-run --network meta');
			return { ok: false, network: 'meta', keys: [], msg: 'no facebook page' };
		}

		const ig = await getJson({
			url: `${GRAPH}/${pageRow.id}?fields=instagram_business_account`,
			headers: { Authorization: `Bearer ${pageRow.access_token}` },
			fetchImpl: ctx.fetchImpl,
			logger,
			network: 'instagram',
		});
		const igUserId = ig.json?.instagram_business_account?.id || '';
		if (!igUserId) {
			logger.logStep('error', 'bootstrap', 'instagram', 'no instagram_business_account — convert IG to Professional and link the Page, then re-run');
			try {
				await page.goto(PORTAL_URLS.instagramConvert, { waitUntil: 'domcontentloaded', timeout: 60000 });
			} catch (err) {
				console.error('[social-oauth:bootstrapMeta:ig-convert]', { err: String(err) });
			}
		}

		const statePath = path.join(root, FB_STORAGE_STATE);
		try {
			await context.storageState({ path: statePath });
		} catch (err) {
			console.error('[social-oauth:bootstrapMeta:storageState]', { err: String(err) });
			logger.logStep('error', 'storageState', 'facebook', String(err));
		}

		const pairs = {
			FACEBOOK_APP_ID: client.client_id,
			FACEBOOK_APP_SECRET: client.client_secret,
			FACEBOOK_PAGE_ID: String(pageRow.id),
			FACEBOOK_PAGE_ACCESS_TOKEN: String(pageRow.access_token),
			PLAYWRIGHT_STATE_FACEBOOK: statePath,
		};
		if (igUserId) {
			pairs.IG_USER_ID = igUserId;
			pairs.IG_ACCESS_TOKEN = String(pageRow.access_token);
		}
		const keys = upsertEnvFile(envPath, pairs);
		Object.assign(env, pairs);
		logger.logStep('info', 'write-env', 'meta', keys.join(' '));
		return { ok: Boolean(igUserId), network: 'meta', keys, msg: igUserId ? 'ok' : 'page ok; instagram not linked' };
	} catch (err) {
		console.error('[social-oauth:bootstrapMeta]', { err: String(err) });
		logger.logStep('error', 'bootstrap', 'meta', String(err));
		return { ok: false, network: 'meta', keys: [], msg: String(err) };
	}
}
