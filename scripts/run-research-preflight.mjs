#!/usr/bin/env node
/**
 * Research preflight: full audit when slugs scoped; REQUIRE_RESEARCH=1 strict gate.
 * Log: [content-pipeline-2026]
 */
import {
	checkResearchStudyFile,
	formatResearchErrors,
} from './lib/check-research-study.mjs';
import { researchStudyExists } from './lib/research-study-io.mjs';

function log(msg, extra) {
	if (extra !== undefined) console.error(`[content-pipeline-2026] ${msg}`, extra);
	else console.error(`[content-pipeline-2026] ${msg}`);
}

function logErr(msg, extra) {
	console.error(`[content-pipeline-2026] ERROR ${msg}`, extra ?? '');
}

function resolveSlugs(argv) {
	if (argv.length) return argv;
	const env = process.env.PIPELINE_SLUGS?.trim();
	if (env) return env.split(',').map((s) => s.trim()).filter(Boolean);
	return [];
}

function auditSlugs(slugs) {
	let failed = false;
	for (const slug of slugs) {
		if (!researchStudyExists(slug)) {
			logErr('research file missing', slug);
			log('hint', { scaffold: `pnpm run research:scaffold -- ${slug}` });
			failed = true;
			continue;
		}
		const result = checkResearchStudyFile(slug);
		if (!result.ok) {
			logErr('research audit failed', slug);
			for (const line of formatResearchErrors(result.errors).split('\n')) {
				logErr(line);
			}
			failed = true;
		} else {
			log('research audit ok', { slug, wordCount: result.wordCount });
		}
	}
	return !failed;
}

function main() {
	const argv = process.argv.slice(2);
	const skipResearch = argv.includes('--skip-research');
	const slugs = resolveSlugs(argv.filter((a) => !a.startsWith('--')));
	const requireResearch =
		process.env.REQUIRE_RESEARCH === '1' || slugs.length > 0;

	log('step research-preflight: start', {
		requireResearch,
		requireResearchEnv: process.env.REQUIRE_RESEARCH === '1',
		scopedSlugs: slugs.length,
		skipResearch,
	});

	if (skipResearch && requireResearch) {
		logErr('--skip-research blocked when REQUIRE_RESEARCH=1 or scoped slugs are set');
		process.exit(1);
	}

	if (skipResearch) {
		log('step research-preflight: skipped (--skip-research)');
		return;
	}

	if (!requireResearch) {
		log('step research-preflight: skipped (no REQUIRE_RESEARCH and no scoped slugs)');
		return;
	}

	if (!slugs.length) {
		logErr('REQUIRE_RESEARCH=1 but no slugs (argv or PIPELINE_SLUGS)');
		process.exit(1);
	}

	const ok = auditSlugs(slugs);
	if (!ok) {
		log('hint', { audit: 'pnpm run research:audit -- ' + slugs.join(' ') });
		process.exit(1);
	}

	log('step research-preflight: ok', { count: slugs.length });
}

main();
