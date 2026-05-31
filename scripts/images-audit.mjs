import { runImageUrlChecks } from './lib/check-image-urls.mjs';

function logStep(msg, extra) {
	if (extra !== undefined) console.log(`[images-audit] ${msg}`, extra);
	else console.log(`[images-audit] ${msg}`);
}

async function main() {
	logStep('step 0: starting frontmatter image URL audit');
	let result;
	try {
		result = await runImageUrlChecks();
	} catch (err) {
		console.error('[images-audit] ERROR runImageUrlChecks failed', err);
		process.exit(1);
	}
	if (!result.ok) {
		logStep('step 1: failures', { count: result.errors.length });
		for (const err of result.errors.slice(0, 20)) {
			console.error(`[images-audit] FAIL: ${err}`);
		}
		if (result.errors.length > 20) {
			console.error(`[images-audit] FAIL: ... and ${result.errors.length - 20} more`);
		}
		process.exit(1);
	}
	logStep('done: all frontmatter image URLs reachable');
}

main();
