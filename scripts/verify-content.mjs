import { spawnSync } from 'node:child_process';

const STEPS = [
	{ name: 'content:audit', cmd: 'pnpm', args: ['run', 'content:audit'] },
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

function main() {
	logStep('step 0: starting content verification pipeline');
	for (let i = 0; i < STEPS.length; i++) {
		const step = STEPS[i];
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
