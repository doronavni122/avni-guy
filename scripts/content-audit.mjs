import { runArticleContentChecks } from './lib/check-article-content.mjs';

function logStep(msg, extra) {
	if (extra !== undefined) console.log(`[content-audit] ${msg}`, extra);
	else console.log(`[content-audit] ${msg}`);
}

function main() {
	logStep('step 0: starting article content audit');
	const slugFilter = process.env.CONTENT_AUDIT_SLUGS
		? process.env.CONTENT_AUDIT_SLUGS.split(',').map((s) => s.trim()).filter(Boolean)
		: undefined;
	let result;
	try {
		result = runArticleContentChecks({ slugFilter });
	} catch (err) {
		console.error('[content-audit] ERROR runArticleContentChecks failed', err);
		process.exit(1);
	}
	if (!result.ok) {
		logStep('step 1: failures', { count: result.errors.length });
		for (const err of result.errors) {
			console.error(`[content-audit] FAIL: ${err}`);
		}
		process.exit(1);
	}
	logStep('done: all article content checks passed');
}

main();
