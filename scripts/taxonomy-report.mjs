import { findMissingLabels, loadTaxonomyCorpus } from './lib/taxonomy-corpus.mjs';

function logStep(msg, extra) {
	if (extra !== undefined) console.log(`[taxonomy-report] ${msg}`, extra);
	else console.log(`[taxonomy-report] ${msg}`);
}

function main() {
	logStep('step 0: scanning blog corpus and taxonomy labels');
	let result;
	try {
		result = findMissingLabels();
	} catch (err) {
		console.error('[taxonomy-report] ERROR findMissingLabels failed', err);
		process.exit(1);
	}
	const corpus = loadTaxonomyCorpus();
	logStep('step 1: corpus summary', {
		articlesCategories: corpus.categories.length,
		articlesTags: corpus.tags.length,
	});
	if (result.missingCategories.length) {
		logStep('missing CATEGORY_LABELS', result.missingCategories);
	}
	if (result.missingTags.length) {
		logStep('missing TAG_LABELS', result.missingTags);
	}
	if (result.ok) {
		logStep('done: all corpus slugs have Hebrew labels');
		return;
	}
	logStep('done: missing labels found', {
		missingCategories: result.missingCategories.length,
		missingTags: result.missingTags.length,
	});
	process.exitCode = 1;
}

main();
