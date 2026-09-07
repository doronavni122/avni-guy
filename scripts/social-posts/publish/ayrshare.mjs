import fs from 'node:fs';
import path from 'node:path';
import { httpRequest } from '../http.mjs';

const PLATFORM_MAP = {
	x: 'twitter',
	instagram: 'instagram',
	youtube: 'youtube',
	linkedin: 'linkedin',
	facebook: 'facebook',
};

/**
 * @param {object} ctx
 * @param {string[]} networks
 */
export async function publishAyrshare(ctx, networks) {
	const { env, copy, source, runDir, dry, logger, fetchImpl, sleep } = ctx;
	const key = env.AYRSHARE_API_KEY;
	if (!key) return { attempted: false, results: [] };
	const platforms = networks.map((n) => PLATFORM_MAP[n]).filter(Boolean);
	if (!platforms.length) return { attempted: false, results: [] };
	const body = {
		post: copy.facebook?.caption || copy.linkedin?.text || copy.x?.text,
		platforms,
		mediaUrls: source.imageUrl ? [source.imageUrl] : [],
		twitterOptions: { thread: false },
		youTubeOptions: {
			title: copy.youtube?.title || '',
			visibility: 'public',
			shorts: true,
		},
	};
	fs.writeFileSync(path.join(runDir, 'ayrshare-body.json'), JSON.stringify(body, null, 2));
	if (dry) {
		logger.logStep('info', 'dry-run', null, 'ayrshare skipped http');
		return { attempted: false, results: [] };
	}
	try {
		const res = await httpRequest({
			fetchImpl,
			sleep,
			logger,
			step: 'publish',
			network: null,
			method: 'POST',
			url: 'https://api.ayrshare.com/api/post',
			headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
			body,
		});
		fs.writeFileSync(path.join(runDir, 'ayrshare-response.json'), res.rawText || '{}');
		const results = [];
		const posts = res.json?.posts || res.json?.postIds || [];
		const byPlatform = {};
		if (Array.isArray(posts)) {
			for (const p of posts) {
				const plat = p.platform || p.socialNetwork;
				byPlatform[plat] = p;
			}
		}
		for (const network of networks) {
			const plat = PLATFORM_MAP[network];
			const row = byPlatform[plat];
			const status = row?.status || res.json?.status;
			if (status === 'success' || row?.id || row?.postId) {
				logger.logStep('info', 'publish', network, 'ayrshare');
				results.push({
					ok: true,
					network,
					method: 'ayrshare',
					result: 'ok',
					url: row?.postUrl || row?.id || null,
					msg: 'ok',
				});
			} else {
				logger.logStep('error', 'publish', network, `ayrshare fail ${JSON.stringify(row || res.json || {})}`);
				results.push({
					ok: false,
					network,
					method: 'ayrshare',
					result: 'error',
					url: null,
					msg: 'ayrshare fail',
				});
			}
		}
		return { attempted: true, results };
	} catch (err) {
		logger.logStep('error', 'publish', null, String(err));
		return { attempted: true, results: [] };
	}
}
