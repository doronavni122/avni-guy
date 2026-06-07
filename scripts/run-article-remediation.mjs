#!/usr/bin/env node
/**
 * Pass 1/2 orchestration for article remediation (LLM steps are manual/agent).
 * Log: [article-remediation]
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {
    listPass1RemediationSlugs,
    pickPass1Batch,
    researchDirPath,
} from './lib/list-remediation-queue.mjs';
import {
    getProgramStatus,
    isProgramActive,
    loadProgram,
    markSlugCompleted,
    remainingSlots,
} from './lib/remediation-program.mjs';
import { researchStudyExists } from './lib/research-study-io.mjs';
import { RESEARCH_DIR } from './lib/research-study-rules.mjs';

const QUEUE_PATH = path.join(process.cwd(), 'config', 'remediation-batch.json');

function log(step, msg, extra) {
	if (extra !== undefined) console.error(`[article-remediation] step ${step}: ${msg}`, extra);
	else console.error(`[article-remediation] step ${step}: ${msg}`);
}

function logErr(step, msg, extra) {
	console.error(`[article-remediation] ERROR step ${step}: ${msg}`, extra ?? '');
}

function parseArgs(argv) {
	const flags = new Set(argv.filter((a) => a.startsWith('--')));
	const positional = argv.filter((a) => !a.startsWith('--'));
	const pickFailuresEq = argv.find((a) => a.startsWith('--pick-failures='));
	const pickFailuresFlag = flags.has('--pick-failures') || Boolean(pickFailuresEq);
	const markCompleteEq = argv.find((a) => a.startsWith('--mark-complete='));
	const pass = argv.find((a) => a.startsWith('--pass='));
	const batchFromArg = pickFailuresEq ? Number(pickFailuresEq.split('=')[1]) : NaN;
	const program = loadProgram();
	const defaultBatch = program.batchSize;
	const batchSize = Number.isFinite(batchFromArg)
		? batchFromArg
		: Number(process.env.REMEDIATION_BATCH_SIZE ?? defaultBatch);
	return {
		scaffold: flags.has('--scaffold'),
		verify: flags.has('--verify'),
		emitQueue: flags.has('--emit-queue'),
		printSteps: flags.has('--print-steps'),
		runPipeline: flags.has('--run-pipeline'),
		listPending: flags.has('--list-pending'),
		programStatus: flags.has('--program-status'),
		markComplete: markCompleteEq?.split('=')[1]?.trim() ?? null,
		pickFailures: pickFailuresFlag,
		pass2: flags.has('--pass2') || pass?.split('=')[1] === '2',
		pass1: flags.has('--pass1') || pass?.split('=')[1] === '1' || (!flags.has('--pass2') && !pass),
		batchSize,
		slugs: positional.length
			? positional
			: (process.env.PIPELINE_SLUGS?.split(',').map((s) => s.trim()).filter(Boolean) ?? []),
	};
}

function runNode(script, args = [], env = {}) {
	const r = spawnSync(process.execPath, [script, ...args], {
		stdio: 'inherit',
		env: { ...process.env, ...env },
	});
	return r.status ?? 1;
}

function runPnpm(script, env = {}) {
	const r = spawnSync('pnpm', ['run', script], { stdio: 'inherit', env: { ...process.env, ...env } });
	return r.status ?? 1;
}

function ensureProgramActiveForBatch() {
	if (isProgramActive()) return true;
	const status = getProgramStatus();
	log(0, 'remediation program complete or paused; no batch', status);
	return false;
}

function resolveSlugs(opts) {
	if (opts.slugs.length) return opts.slugs;
	if (opts.pickFailures || opts.emitQueue || opts.scaffold) {
		if (!ensureProgramActiveForBatch()) {
			return [];
		}
		const pending = listPass1RemediationSlugs();
		log(0, 'pending Pass 1 slugs', { count: pending.length });
		const slugs = pickPass1Batch(opts.batchSize);
		log(0, 'program slots', {
			remaining: remainingSlots(),
			batch: slugs.length,
		});
		return slugs;
	}
	logErr(0, 'no slugs (argv, PIPELINE_SLUGS, or --pick-failures=N)');
	process.exit(1);
}

function scaffoldSlug(slug) {
	if (researchStudyExists(slug)) {
		log(2, 'scaffold skipped (exists)', { slug });
		return 0;
	}
	return runNode('scripts/scaffold-research-study.mjs', [slug]);
}

function printAgentSteps(slugs, passLabel) {
	const lines = [
		'',
		`=== Agent steps (${passLabel}) ===`,
		`PIPELINE_SLUGS=${slugs.join(',')}`,
		'',
		'Requires EXA_API_KEY in environment (GitHub Actions secret / Cursor Automation env).',
		'Quality contract: scripts/lib/article-pipeline-contract.mjs',
		'',
		'Pass 1 (per slug, in order):',
		'1. pnpm run article:pipeline -- <slug> --force-research',
		'2. CONTENT_AUDIT_SLUGS=<slug> CONTENT_STRICT=1 PIPELINE_CONTRACT=1 pnpm run content:audit',
		'3. LINKS_AUDIT_SLUGS=<slug> LINKS_AUDIT_ENFORCE=1 PIPELINE_CONTRACT=1 pnpm run links:audit',
		'4. pnpm run research:audit -- <slug>',
		'5. Commit content-research/<slug>.md + src/content/blog/<slug>.mdx',
		'',
		'After all slugs in batch:',
		'1. PIPELINE_SLUGS=<csv> node scripts/run-article-remediation.mjs --verify',
		'2. Update config/remediation-program.json completedSlugs for each passing slug',
		'',
		'Pass 2 (corpus graph, optional after batch merge):',
		'1. LINKS_AUDIT_ENFORCE=1 pnpm run links:audit (skip links:remediate for pipelineContractVersion articles)',
		'2. pnpm run seo:guardrails',
		'',
	];
	console.log(lines.join('\n'));
}

function writeQueueFile(slugs) {
	fs.mkdirSync(path.dirname(QUEUE_PATH), { recursive: true });
	const pending = listPass1RemediationSlugs();
	const programStatus = getProgramStatus();
	const payload = {
		createdAt: new Date().toISOString(),
		pass: 1,
		batchSlugs: slugs,
		pendingTotal: pending.length,
		researchDir: RESEARCH_DIR,
		pipelineSlugs: slugs.join(','),
		program: {
			completedCount: programStatus.completedCount,
			maxArticles: programStatus.maxArticles,
			remaining: programStatus.remaining,
		},
		agentNote:
			'Run pnpm run article:pipeline -- <slug> --force-research per batch slug (EXA_API_KEY required); commit content-research/*.md and src/content/blog/*.mdx',
	};
	fs.writeFileSync(QUEUE_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
	log(3, 'wrote remediation batch queue', { path: QUEUE_PATH, slugs });
}

function verifyPass1(slugs, { updateProgram = false } = {}) {
	let failed = 0;
	for (const slug of slugs) {
		log(4, 'research:audit', { slug });
		const r = runNode('scripts/audit-research-study.mjs', [slug]);
		if (r !== 0) {
			failed++;
			logErr(4, 'research audit failed', { slug });
			continue;
		}
		log(5, 'content:audit (contract)', { slug });
		const c = runPnpm('content:audit', {
			CONTENT_AUDIT_SLUGS: slug,
			CONTENT_STRICT: '1',
			PIPELINE_CONTRACT: '1',
		});
		if (c !== 0) {
			failed++;
			logErr(5, 'content audit failed', { slug });
			continue;
		}
		log(6, 'links:audit (scoped contract)', { slug });
		const l = runPnpm('links:audit', {
			LINKS_AUDIT_SLUGS: slug,
			LINKS_AUDIT_ENFORCE: '1',
			PIPELINE_CONTRACT: '1',
			PIPELINE_SLUGS: slug,
		});
		if (l !== 0) {
			failed++;
			logErr(6, 'links audit failed', { slug });
			continue;
		}
		if (updateProgram) {
			const { added } = markSlugCompleted(slug);
			log(6, 'program mark complete', { slug, added });
		}
	}
	return failed === 0 ? 0 : 1;
}

function printProgramStatus() {
	const s = getProgramStatus();
	console.log(JSON.stringify(s, null, 2));
}

function runPass2() {
	log(6, 'Pass 2: link graph remediation');
	const steps = [
		() => runPnpm('links:remediate'),
		() => runPnpm('links:audit', { LINKS_AUDIT_ENFORCE: '1' }),
		() => runPnpm('seo:guardrails'),
	];
	for (const step of steps) {
		const code = step();
		if (code !== 0) return code;
	}
	log(6, 'Pass 2 complete');
	return 0;
}

function main() {
	const opts = parseArgs(process.argv.slice(2));
	fs.mkdirSync(researchDirPath(), { recursive: true });

	if (opts.programStatus) {
		printProgramStatus();
		process.exit(0);
	}

	if (opts.markComplete) {
		const { added, program } = markSlugCompleted(opts.markComplete);
		log(0, 'mark-complete', {
			slug: opts.markComplete,
			added,
			completed: `${program.completedSlugs.length}/${program.maxArticles}`,
		});
		process.exit(0);
	}

	if (opts.listPending) {
		const pending = listPass1RemediationSlugs();
		const status = getProgramStatus();
		for (const p of pending) {
			console.log(`${p.slug}\tresearch=${p.researchOk}\tcontent=${p.contentOk}\t${p.reasons.join(';')}`);
		}
		console.error(`[article-remediation] pending count: ${pending.length}`);
		console.error(
			`[article-remediation] program: ${status.completedCount}/${status.maxArticles} completed, active=${status.active}`,
		);
		process.exit(0);
	}

	if (opts.pass2) {
		if (opts.verify) {
			const code = runPass2();
			process.exit(code);
		}
		printAgentSteps([], 'Pass 2 only');
		log(0, 'Pass 2 manual: run links:remediate then LINKS_AUDIT_ENFORCE=1 links:audit');
		process.exit(0);
	}

	const slugs = resolveSlugs(opts);
	log(0, 'batch slugs', { count: slugs.length, slugs });

	if (slugs.length === 0) {
		log(0, 'no slugs to process (program cap or no pending)');
		process.exit(0);
	}

	if (opts.scaffold) {
		for (const slug of slugs) {
			const code = scaffoldSlug(slug);
			if (code !== 0) process.exit(code);
		}
	}

	if (opts.emitQueue) writeQueueFile(slugs);

	if (opts.printSteps) printAgentSteps(slugs, 'Pass 1');

	if (opts.runPipeline && slugs.length) {
		log(0, 'delegating to article:pipeline', { slugs: slugs.length });
		const keyCheck = runNode('scripts/check-exa-api-key.mjs');
		if (keyCheck !== 0) process.exit(keyCheck);
		const code = runNode(
			'scripts/run-article-pipeline.mjs',
			[...slugs, '--force-research'],
			{
				PIPELINE_SLUGS: slugs.join(','),
				EXA_API_KEY: process.env.EXA_API_KEY ?? '',
			},
		);
		process.exit(code);
	}

	if (opts.verify) {
		const code = verifyPass1(slugs, { updateProgram: true });
		process.exit(code);
	}

	if (!opts.scaffold && !opts.printSteps && !opts.emitQueue) {
		printAgentSteps(slugs, 'Pass 1');
		log(0, 'orchestration only; use --scaffold --emit-queue --verify when ready');
	}
}

main();
