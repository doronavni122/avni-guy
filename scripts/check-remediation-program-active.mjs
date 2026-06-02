#!/usr/bin/env node
/**
 * Exit 0 when program can accept new batches; exit 0 with skip message when inactive.
 * Used by GitHub Actions guard. Log: [remediation-program-check]
 */
import {
    getProgramStatus,
    isProgramActive,
} from './lib/remediation-program.mjs';

function log(msg, extra) {
	if (extra !== undefined) console.error(`[remediation-program-check] ${msg}`, extra);
	else console.error(`[remediation-program-check] ${msg}`);
}

function main() {
	const status = getProgramStatus();
	if (!isProgramActive()) {
		log('skip: remediation program complete or paused', status);
		process.exit(0);
	}
	log('active', {
		remaining: status.remaining,
		completed: `${status.completedCount}/${status.maxArticles}`,
	});
	process.exit(0);
}

main();
