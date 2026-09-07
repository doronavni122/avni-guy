import fs from 'node:fs';
import path from 'node:path';
import { GRAPH_API_VERSION_DEFAULT } from '../constants.mjs';
import { httpRequest } from '../http.mjs';

/**
 * @param {object} ctx
 */
export async function publishInstagram(ctx) {
	const { env, copy, source, runDir, dry, logger, fetchImpl, sleep } = ctx;
	const userId = env.IG_USER_ID;
	const token = env.IG_ACCESS_TOKEN;
	if (dry) {
		fs.writeFileSync(path.join(runDir, 'instagram-payload.json'), JSON.stringify(copy.instagram, null, 2));
		logger.logStep('info', 'dry-run', 'instagram', 'instagram-payload.json');
		return { ok: true, network: 'instagram', method: 'native', result: 'dry-run', url: null, msg: 'dry-run' };
	}
	if (!userId || !token) return logger.failNet('token', 'instagram', 'missing IG_USER_ID IG_ACCESS_TOKEN');
	const host = env.IG_GRAPH_HOST || 'graph.facebook.com';
	const ver = env.GRAPH_API_VERSION || GRAPH_API_VERSION_DEFAULT;
	const imageUrl = source.imageUrl;
	if (!imageUrl) return logger.failNet('publish', 'instagram', 'missing public imageUrl');
	try {
		const params = new URLSearchParams({
			image_url: imageUrl,
			caption: copy.instagram.caption,
			alt_text: copy.instagram.alt || '',
			access_token: token,
		});
		const cont = await httpRequest({
			fetchImpl,
			sleep,
			logger,
			step: 'publish',
			network: 'instagram',
			method: 'POST',
			url: `https://${host}/${ver}/${userId}/media?${params}`,
		});
		fs.writeFileSync(path.join(runDir, 'ig-container.json'), cont.rawText || '{}');
		const cid = cont.json?.id;
		if (!cid) return logger.failNet('publish', 'instagram', cont.text);
		const pub = await httpRequest({
			fetchImpl,
			sleep,
			logger,
			step: 'publish',
			network: 'instagram',
			method: 'POST',
			url: `https://${host}/${ver}/${userId}/media_publish`,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			rawBody: new URLSearchParams({ creation_id: cid, access_token: token }),
		});
		fs.writeFileSync(path.join(runDir, 'ig-publish.json'), pub.rawText || '{}');
		if (pub.json?.id) {
			logger.logStep('info', 'publish', 'instagram', pub.json.id);
			return { ok: true, network: 'instagram', method: 'native', result: 'ok', url: pub.json.id, msg: 'ok' };
		}
		return logger.failNet('publish', 'instagram', pub.text);
	} catch (err) {
		return logger.failNet('publish', 'instagram', String(err));
	}
}
