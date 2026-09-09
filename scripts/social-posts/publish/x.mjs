import fs from 'node:fs';
import path from 'node:path';
import { httpRequest } from '../http.mjs';
import { upsertEnvFile } from '../../social-oauth/env-file.mjs';

/**
 * X user tokens expire in ~2h. Rotate using refresh_token (refresh tokens also rotate).
 * @param {object} ctx
 * @returns {Promise<string>}
 */
export async function refreshXUserToken(ctx) {
	const { env, logger, fetchImpl, sleep } = ctx;
	const refresh = String(env.X_REFRESH_TOKEN || '').trim();
	const clientId = String(env.X_CLIENT_ID || '').trim();
	const current = String(env.X_USER_ACCESS_TOKEN || '').trim();
	if (!refresh || !clientId) return current;
	try {
		/** @type {Record<string, string>} */
		const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
		const secret = String(env.X_CLIENT_SECRET || '').trim();
		if (secret) {
			headers.Authorization = `Basic ${Buffer.from(`${clientId}:${secret}`, 'utf8').toString('base64')}`;
		}
		const tok = await httpRequest({
			fetchImpl,
			sleep,
			logger,
			step: 'token',
			network: 'x',
			method: 'POST',
			url: 'https://api.x.com/2/oauth2/token',
			headers,
			rawBody: new URLSearchParams({
				grant_type: 'refresh_token',
				refresh_token: refresh,
				client_id: clientId,
			}),
		});
		const access = tok.json?.access_token;
		if (!access) {
			logger.logStep('error', 'token', 'x', 'refresh failed; using existing access token');
			return current;
		}
		env.X_USER_ACCESS_TOKEN = access;
		if (tok.json?.refresh_token) env.X_REFRESH_TOKEN = tok.json.refresh_token;
		try {
			const envPath = ctx.envPath || (ctx.root ? path.join(ctx.root, '.env.local') : '');
			if (envPath) {
				upsertEnvFile(envPath, {
					X_USER_ACCESS_TOKEN: env.X_USER_ACCESS_TOKEN,
					X_REFRESH_TOKEN: env.X_REFRESH_TOKEN,
				});
			}
		} catch (err) {
			console.error('[social-posts:refreshXUserToken:upsert]', { err: String(err) });
		}
		logger.logStep('info', 'token', 'x', 'refreshed user access token');
		return access;
	} catch (err) {
		console.error('[social-posts:refreshXUserToken]', { err: String(err) });
		logger.logStep('error', 'token', 'x', String(err));
		return current;
	}
}

/**
 * @param {object} ctx
 */
export async function publishX(ctx) {
	const { env, copy, runDir, dry, logger, fetchImpl, sleep } = ctx;
	if (dry) {
		fs.writeFileSync(path.join(runDir, 'x-payload.json'), JSON.stringify(copy.x, null, 2));
		logger.logStep('info', 'dry-run', 'x', 'x-payload.json');
		return { ok: true, network: 'x', method: 'native', result: 'dry-run', url: null, msg: 'dry-run' };
	}
	const token = (await refreshXUserToken(ctx)) || env.X_USER_ACCESS_TOKEN;
	if (!token) return logger.failNet('token', 'x', 'missing X_USER_ACCESS_TOKEN');
	const imagePath = path.join(runDir, 'source.jpg');
	const headers = { Authorization: `Bearer ${token}` };
	let mediaId = '';
	try {
		if (fs.existsSync(imagePath)) {
			const bytes = fs.statSync(imagePath).size;
			const init = await httpRequest({
				fetchImpl,
				sleep,
				logger,
				step: 'publish',
				network: 'x',
				method: 'POST',
				url: 'https://api.x.com/2/media/upload/initialize',
				headers: { ...headers, 'Content-Type': 'application/json' },
				body: { media_type: 'image/jpeg', total_bytes: bytes, media_category: 'tweet_image' },
			});
			fs.writeFileSync(path.join(runDir, 'x-init.json'), init.rawText || '{}');
			mediaId = init.json?.data?.id || '';
			if (!mediaId) return logger.failNet('publish', 'x', init.text);
			const buf = fs.readFileSync(imagePath);
			const form = new FormData();
			form.set('segment_index', '0');
			form.set('media', new Blob([buf]), 'source.jpg');
			const append = await httpRequest({
				fetchImpl,
				sleep,
				logger,
				step: 'publish',
				network: 'x',
				method: 'POST',
				url: `https://api.x.com/2/media/upload/${mediaId}/append`,
				headers,
				rawBody: form,
			});
			fs.writeFileSync(path.join(runDir, 'x-append.json'), append.rawText || '{}');
			const fin = await httpRequest({
				fetchImpl,
				sleep,
				logger,
				step: 'publish',
				network: 'x',
				method: 'POST',
				url: `https://api.x.com/2/media/upload/${mediaId}/finalize`,
				headers,
			});
			fs.writeFileSync(path.join(runDir, 'x-finalize.json'), fin.rawText || '{}');
			await httpRequest({
				fetchImpl,
				sleep,
				logger,
				step: 'publish',
				network: 'x',
				method: 'POST',
				url: 'https://api.x.com/2/media/metadata',
				headers: { ...headers, 'Content-Type': 'application/json' },
				body: { id: mediaId, metadata: { alt_text: { text: copy.x.alt || '' } } },
			});
		}
		const tweetBody = { text: copy.x.text };
		if (mediaId) tweetBody.media = { media_ids: [mediaId] };
		const tweet = await httpRequest({
			fetchImpl,
			sleep,
			logger,
			step: 'publish',
			network: 'x',
			method: 'POST',
			url: 'https://api.x.com/2/tweets',
			headers: { ...headers, 'Content-Type': 'application/json' },
			body: tweetBody,
		});
		fs.writeFileSync(path.join(runDir, 'x-tweet.json'), tweet.rawText || '{}');
		const id = tweet.json?.data?.id;
		if (tweet.status === 201 && id) {
			const url = `https://x.com/AvniGuy11492/status/${id}`;
			logger.logStep('info', 'publish', 'x', url);
			return { ok: true, network: 'x', method: 'native', result: 'ok', url, msg: 'ok' };
		}
		return logger.failNet('publish', 'x', tweet.text);
	} catch (err) {
		return logger.failNet('publish', 'x', String(err));
	}
}
