import { NETWORKS } from '../constants.mjs';
import { classifyNetwork } from '../source.mjs';
import { publishAyrshare } from './ayrshare.mjs';
import { publishFacebook } from './facebook.mjs';
import { publishInstagram } from './instagram.mjs';
import { publishLinkedIn } from './linkedin.mjs';
import { publishX } from './x.mjs';
import { publishYouTube } from './youtube.mjs';

const NATIVE = {
	x: publishX,
	instagram: publishInstagram,
	youtube: publishYouTube,
	linkedin: publishLinkedIn,
	facebook: publishFacebook,
};

/**
 * @param {string[]} profileUrls
 */
export function networksFromProfiles(profileUrls) {
	const set = new Set();
	for (const u of profileUrls || []) {
		const n = classifyNetwork(u);
		if (n) set.add(n);
	}
	return NETWORKS.filter((n) => set.has(n));
}

/**
 * @param {object} ctx
 */
export async function publishAll(ctx) {
	const { source, logger, missing, dry } = ctx;
	const live = networksFromProfiles(source.profiles);
	const targets = live.length ? live : [...NETWORKS];
	const done = new Map();

	if (ctx.env.AYRSHARE_API_KEY && !dry) {
		const ay = await publishAyrshare(ctx, targets);
		for (const r of ay.results) {
			if (r.ok) done.set(r.network, r);
		}
	}

	const jobs = targets.filter((n) => !done.has(n)).map(async (network) => {
		try {
			if (!dry && missing[network]?.length && network !== 'facebook') {
				return {
					ok: false,
					network,
					method: 'skipped',
					result: 'error',
					url: null,
					msg: `missing ${missing[network].join(' ')}`,
				};
			}
			const fn = NATIVE[network];
			if (!fn) {
				return logger.failNet('publish', network, 'no adapter');
			}
			return await fn(ctx);
		} catch (err) {
			return logger.failNet('publish', network, String(err));
		}
	});

	const rest = await Promise.all(jobs);
	for (const r of rest) done.set(r.network, r);
	return targets.map((n) => done.get(n));
}
