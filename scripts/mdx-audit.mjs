import { runMdxCompileChecks } from './lib/check-mdx-compile.mjs';

function logStep(msg, extra) {
	if (extra !== undefined) console.log(`[mdx-audit] ${msg}`, extra);
	else console.log(`[mdx-audit] ${msg}`);
}

async function main() {
	logStep('step 0: starting MDX compile audit');
	let result;
	try {
		result = await runMdxCompileChecks();
	} catch (err) {
		console.error('[mdx-audit] ERROR runMdxCompileChecks failed', err);
		process.exit(1);
	}
	if (!result.ok) {
		logStep('step 1: failures', { count: result.errors.length });
		for (const err of result.errors.slice(0, 20)) {
			console.error(`[mdx-audit] FAIL: ${err}`);
		}
		if (result.errors.length > 20) {
			console.error(`[mdx-audit] FAIL: ... and ${result.errors.length - 20} more`);
		}
		process.exit(1);
	}
	logStep('done: all MDX bodies compile');
}

main();
