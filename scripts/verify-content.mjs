import { spawnSync } from 'node:child_process';

const STEPS = [
	{ name: 'content:audit', cmd: 'pnpm', args: ['run', 'content:audit'] },
	{ name: 'links:audit', cmd: 'pnpm', args: ['run', 'links:audit'] },
	{ name: 'taxonomy:audit', cmd: 'pnpm', args: ['run', 'taxonomy:audit'] },
	{ name: 'mdx:audit', cmd: 'pnpm', args: ['run', 'mdx:audit'] },
	{ name: 'images:audit', cmd: 'pnpm', args: ['run', 'images:audit'] },
];

function logStep(msg, extra) {
	if (extra !== undefined) console.log(`[verify-content] ${msg}`, extra);
	else console.log(`[verify-content] ${msg}`);
}

function logErr(msg, extra) {
	console.error(`[verify-content] ERROR ${msg}`, extra ?? '');
}

function resolveResearchSlugs() {
	const env =
		process.env.RESEARCH_AUDIT_SLUGS?.trim() || process.env.PIPELINE_SLUGS?.trim() || '';
	if (!env) return [];
	return env.split(',').map((s) => s.trim()).filter(Boolean);
}

function runResearchAudit(slugs) {
	if (!slugs.length) return true;
	logStep('optional: scoped research audit', { slugs: slugs.length });
	const result = spawnSync(
		process.execPath,
		['scripts/audit-research-study.mjs', ...slugs],
		{ stdio: 'inherit', env: process.env },
	);
	if (result.status !== 0) {
		logErr('research:audit failed', { exit: result.status });
		return false;
	}
	return true;
}

function main() {
	logStep('step 0: starting content verification pipeline');

	const researchSlugs = resolveResearchSlugs();
	if (researchSlugs.length && !runResearchAudit(researchSlugs)) {
		process.exit(1);
	}

	const steps = [...STEPS];
	if (process.env.LINK_CRAWL_ENFORCE === '1') {
		steps.push({ name: 'links:crawl', cmd: 'pnpm', args: ['run', 'links:crawl'] });
		logStep('optional: LINK_CRAWL_ENFORCE=1 — links:crawl appended');
	}
	for (let i = 0; i < steps.length; i++) {
		const step = steps[i];
		logStep(`step ${i + 1}: running ${step.name}`);
		const result = spawnSync(step.cmd, step.args, { stdio: 'inherit', env: process.env });
		if (result.status !== 0) {
			logErr(`${step.name} failed with exit code ${result.status ?? 'unknown'}`);
			process.exit(result.status ?? 1);
		}
	}
	logStep('done: all content verification steps passed');
}

main();
