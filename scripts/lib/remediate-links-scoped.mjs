/**
 * Scoped internal links remediation for pipeline batches. Log: [remediate-links-scoped]
 */
import { runRemediateInternalLinks } from '../remediate-internal-links-batch.mjs';

function log(step, msg, extra) {
	if (extra !== undefined) console.error(`[remediate-links-scoped] step ${step}: ${msg}`, extra);
	else console.error(`[remediate-links-scoped] step ${step}: ${msg}`);
}

/**
 * @param {string[]} slugs
 * @param {{ dryRun?: boolean }} [options]
 */
export function remediateLinksScoped(slugs, options = {}) {
	if (!slugs.length) {
		log(0, 'no slugs; skip');
		return;
	}
	if (options.dryRun) {
		log(0, 'dry-run skip', { slugs: slugs.length });
		return;
	}
	const prev = process.env.PIPELINE_SLUGS;
	process.env.PIPELINE_SLUGS = slugs.join(',');
	try {
		log(1, 'run scoped remediate', { count: slugs.length });
		runRemediateInternalLinks();
	} finally {
		if (prev === undefined) delete process.env.PIPELINE_SLUGS;
		else process.env.PIPELINE_SLUGS = prev;
	}
}
