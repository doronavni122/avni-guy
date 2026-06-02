#!/usr/bin/env node
/**
 * Print GitHub Actions outputs for remediation program guard.
 * Usage: eval $(node scripts/emit-remediation-program-gha.mjs)
 * Or append to GITHUB_OUTPUT when GITHUB_OUTPUT is set.
 */
import fs from 'node:fs';
import {
    effectiveBatchSize,
    getProgramStatus,
    isProgramActive,
    loadProgram,
} from './lib/remediation-program.mjs';

function main() {
	const override = process.env.REMEDIATION_BATCH_OVERRIDE?.trim();
	const requested = override ? Number(override) : NaN;
	const program = loadProgram();
	const status = getProgramStatus(program);
	const batchSize = Number.isFinite(requested)
		? effectiveBatchSize(requested, program)
		: effectiveBatchSize(program.batchSize, program);

	const lines = [
		`active=${isProgramActive(program) ? 'true' : 'false'}`,
		`remaining=${status.remaining}`,
		`completed=${status.completedCount}`,
		`max=${status.maxArticles}`,
		`batch_size=${batchSize}`,
	];

	const outPath = process.env.GITHUB_OUTPUT;
	if (outPath) {
		fs.appendFileSync(outPath, `${lines.join('\n')}\n`);
	} else {
		for (const line of lines) console.log(line);
	}
}

main();
