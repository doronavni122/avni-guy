import { findMissingLabels } from './taxonomy-corpus.mjs';

function logErr(message, extra) {
	console.error(`[check-taxonomy-labels] ERROR ${message}`, extra ?? '');
}

/**
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function runTaxonomyLabelChecks() {
	try {
		const result = findMissingLabels();
		const errors = [];
		for (const slug of result.missingCategories) {
			errors.push(`Missing CATEGORY_LABELS entry for corpus category "${slug}"`);
		}
		for (const slug of result.missingTags) {
			errors.push(`Missing TAG_LABELS entry for corpus tag "${slug}"`);
		}
		return { ok: errors.length === 0, errors };
	} catch (err) {
		logErr('runTaxonomyLabelChecks failed', err);
		throw err;
	}
}
