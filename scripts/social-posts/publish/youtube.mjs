import fs from 'node:fs';
import path from 'node:path';
import { httpRequest } from '../http.mjs';

/**
 * @param {object} ctx
 */
export async function publishYouTube(ctx) {
	const { env, copy, runDir, dry, logger, fetchImpl, sleep } = ctx;
	const clientId = env.YOUTUBE_CLIENT_ID;
	const clientSecret = env.YOUTUBE_CLIENT_SECRET;
	const refresh = env.YOUTUBE_REFRESH_TOKEN;
	if (dry) {
		fs.writeFileSync(path.join(runDir, 'youtube-payload.json'), JSON.stringify(copy.youtube, null, 2));
		logger.logStep('info', 'dry-run', 'youtube', 'youtube-payload.json');
		return { ok: true, network: 'youtube', method: 'native', result: 'dry-run', url: null, msg: 'dry-run' };
	}
	if (!clientId || !clientSecret || !refresh) {
		return logger.failNet('token', 'youtube', 'missing YOUTUBE_CLIENT_ID YOUTUBE_CLIENT_SECRET YOUTUBE_REFRESH_TOKEN');
	}
	const videoPath = path.join(runDir, 'short.mp4');
	if (!fs.existsSync(videoPath)) {
		return logger.failNet('ffmpeg', 'youtube', 'short.mp4 missing');
	}
	try {
		const tok = await httpRequest({
			fetchImpl,
			sleep,
			logger,
			step: 'token',
			network: 'youtube',
			method: 'POST',
			url: 'https://oauth2.googleapis.com/token',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			rawBody: new URLSearchParams({
				client_id: clientId,
				client_secret: clientSecret,
				refresh_token: refresh,
				grant_type: 'refresh_token',
			}),
		});
		fs.writeFileSync(path.join(runDir, 'yt-token.json'), tok.rawText || '{}');
		const access = tok.json?.access_token;
		if (!access) return logger.failNet('token', 'youtube', 'refresh failed');
		const size = fs.statSync(videoPath).size;
		const locRes = await fetchImpl(
			'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${access}`,
					'Content-Type': 'application/json; charset=UTF-8',
					'X-Upload-Content-Length': String(size),
					'X-Upload-Content-Type': 'video/mp4',
				},
				body: JSON.stringify({
					snippet: {
						title: copy.youtube.title,
						description: copy.youtube.description,
						tags: ['גיא אבני', 'עורך דין'],
						categoryId: '27',
					},
					status: { privacyStatus: 'public', selfDeclaredMadeForKids: false },
				}),
			},
		);
		const loc = locRes.headers.get('location');
		if (!loc) return logger.failNet('publish', 'youtube', `no location header ${locRes.status}`);
		const buf = fs.readFileSync(videoPath);
		const up = await httpRequest({
			fetchImpl,
			sleep,
			logger,
			step: 'publish',
			network: 'youtube',
			method: 'PUT',
			url: loc,
			headers: {
				Authorization: `Bearer ${access}`,
				'Content-Type': 'video/mp4',
				'Content-Length': String(size),
			},
			rawBody: buf,
		});
		fs.writeFileSync(path.join(runDir, 'yt-upload.json'), up.rawText || '{}');
		if (up.json?.id) {
			const url = `https://www.youtube.com/watch?v=${up.json.id}`;
			logger.logStep('info', 'publish', 'youtube', url);
			return { ok: true, network: 'youtube', method: 'native', result: 'ok', url, msg: 'ok' };
		}
		return logger.failNet('publish', 'youtube', up.text);
	} catch (err) {
		return logger.failNet('publish', 'youtube', String(err));
	}
}
