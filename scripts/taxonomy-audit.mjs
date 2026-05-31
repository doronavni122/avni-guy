import { runTaxonomyLabelChecks } from './lib/check-taxonomy-labels.mjs';

function logStep(msg, extra) {
	if (extra !== undefined) console.log(`[taxonomy-audit] ${msg}`, extra);
	else console.log(`[taxonomy-audit] ${msg}`);
}

function main() {
	logStep('step 0: starting taxonomy label audit');
	let result;
	try {
		result = runTaxonomyLabelChecks();
	} catch (err) {
		console.error('[taxonomy-audit] ERROR runTaxonomyLabelChecks failed', err);
		process.exit(1);
	}
	if (!result.ok) {
		logStep('step 1: failures', { count: result.errors.length });
		for (const err of result.errors) {
			console.error(`[taxonomy-audit] FAIL: ${err}`);
		}
		process.exit(1);
	}
	logStep('done: all corpus categories and tags have Hebrew labels');
}

main();
