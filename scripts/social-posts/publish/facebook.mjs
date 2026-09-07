import fs from 'node:fs';
import path from 'node:path';
import { GRAPH_API_VERSION_DEFAULT } from '../constants.mjs';
import { httpRequest } from '../http.mjs';
import { publishWithPlaywright } from './playwright-fallback.mjs';

/**
 * @param {object} ctx
 */
export async function publishFacebook(ctx) {
	const { env, copy, source, runDir, dry, logger, fetchImpl, sleep } = ctx;
	const pageId = env.FACEBOOK_PAGE_ID;
	const token = env.FACEBOOK_PAGE_ACCESS_TOKEN;
	if (dry) {
		fs.writeFileSync(path.join(runDir, 'facebook-payload.json'), JSON.stringify(copy.facebook, null, 2));
		logger.logStep('info', 'dry-run', 'facebook', 'facebook-payload.json');
		return { ok: true, network: 'facebook', method: 'native', result: 'dry-run', url: null, msg: 'dry-run' };
	}
	if (pageId && token) {
		try {
			const ver = env.GRAPH_API_VERSION || GRAPH_API_VERSION_DEFAULT;
			const form = new URLSearchParams({
				url: source.imageUrl || '',
				caption: copy.facebook.caption,
				published: 'true',
				access_token: token,
			});
			const photo = await httpRequest({
				fetchImpl,
				sleep,
				logger,
				step: 'publish',
				network: 'facebook',
				method: 'POST',
				url: `https://graph.facebook.com/${ver}/${pageId}/photos`,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				rawBody: form,
			});
			fs.writeFileSync(path.join(runDir, 'fb-photo.json'), photo.rawText || '{}');
			if (photo.json?.id || photo.json?.post_id) {
				const id = photo.json.post_id || photo.json.id;
				logger.logStep('info', 'publish', 'facebook', id);
				return { ok: true, network: 'facebook', method: 'native', result: 'ok', url: id, msg: 'ok' };
			}
			logger.logStep('error', 'publish', 'facebook', photo.text);
		} catch (err) {
			logger.logStep('error', 'publish', 'facebook', String(err));
		}
	} else {
		logger.logStep(
			'error',
			'token',
			'facebook',
			'Graph cannot post to personal profiles without FACEBOOK_PAGE_ID FACEBOOK_PAGE_ACCESS_TOKEN',
		);
	}
	if (env.PLAYWRIGHT_STATE_FACEBOOK) {
		return publishWithPlaywright({
			...ctx,
			network: 'facebook',
			statePath: env.PLAYWRIGHT_STATE_FACEBOOK,
			caption: copy.facebook.caption,
			startUrl: 'https://www.facebook.com/',
		});
	}
	return logger.failNet(
		'publish',
		'facebook',
		'profile skip: no Page token and no PLAYWRIGHT_STATE_FACEBOOK',
	);
}
