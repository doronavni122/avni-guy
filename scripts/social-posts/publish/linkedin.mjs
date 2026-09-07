import fs from 'node:fs';
import path from 'node:path';
import { LINKEDIN_VERSION_DEFAULT } from '../constants.mjs';
import { httpRequest } from '../http.mjs';

/**
 * @param {object} ctx
 */
export async function publishLinkedIn(ctx) {
	const { env, copy, runDir, dry, logger, fetchImpl, sleep } = ctx;
	const token = env.LINKEDIN_ACCESS_TOKEN;
	const author = env.LINKEDIN_AUTHOR_URN;
	if (dry) {
		fs.writeFileSync(path.join(runDir, 'linkedin-payload.json'), JSON.stringify(copy.linkedin, null, 2));
		logger.logStep('info', 'dry-run', 'linkedin', 'linkedin-payload.json');
		return { ok: true, network: 'linkedin', method: 'native', result: 'dry-run', url: null, msg: 'dry-run' };
	}
	if (!token || !author) {
		return logger.failNet('token', 'linkedin', 'missing LINKEDIN_ACCESS_TOKEN LINKEDIN_AUTHOR_URN');
	}
	const ver = env.LINKEDIN_VERSION || LINKEDIN_VERSION_DEFAULT;
	try {
		const post = await httpRequest({
			fetchImpl,
			sleep,
			logger,
			step: 'publish',
			network: 'linkedin',
			method: 'POST',
			url: 'https://api.linkedin.com/rest/posts',
			headers: {
				Authorization: `Bearer ${token}`,
				'Linkedin-Version': ver,
				'X-Restli-Protocol-Version': '2.0.0',
				'Content-Type': 'application/json',
			},
			body: {
				author,
				commentary: copy.linkedin.text,
				visibility: 'PUBLIC',
				distribution: {
					feedDistribution: 'MAIN_FEED',
					targetEntities: [],
					thirdPartyDistributionChannels: [],
				},
				lifecycleState: 'PUBLISHED',
				isReshareDisabledByAuthor: false,
			},
		});
		fs.writeFileSync(path.join(runDir, 'li-post.json'), post.rawText || '{}');
		if (post.status === 201 || post.json?.id) {
			logger.logStep('info', 'publish', 'linkedin', post.json?.id || '201');
			return { ok: true, network: 'linkedin', method: 'native', result: 'ok', url: post.json?.id || null, msg: 'ok' };
		}
		return logger.failNet('publish', 'linkedin', post.text);
	} catch (err) {
		return logger.failNet('publish', 'linkedin', String(err));
	}
}
