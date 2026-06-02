#!/usr/bin/env node
/**
 * Pass 1/2 orchestration for article remediation (LLM steps are manual/agent).
 * Log: [article-remediation]
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
	listPass1RemediationSlugs,
	pickPass1Batch,
	researchDirPath,
} from './lib/list-remediation-queue.mjs';
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
	const pass = argv.find((a) => a.startsWith('--pass='));
	const batchFromArg = pickFailuresEq ? Number(pickFailuresEq.split('=')[1]) : NaN;
	const batchSize = Number.isFinite(batchFromArg)
		? batchFromArg
		: Number(process.env.REMEDIATION_BATCH_SIZE ?? 5);
	return {
		scaffold: flags.has('--scaffold'),
		verify: flags.has('--verify'),
		emitQueue: flags.has('--emit-queue'),
		printSteps: flags.has('--print-steps'),
		listPending: flags.has('--list-pending'),
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

function resolveSlugs(opts) {
	if (opts.slugs.length) return opts.slugs;
	if (opts.pickFailures || opts.emitQueue || opts.scaffold) {
		const pending = listPass1RemediationSlugs();
		log(0, 'pending Pass 1 slugs', { count: pending.length });
		return pickPass1Batch(opts.batchSize);
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
		'Pass 1 (per slug, in order):',
		'1. content-keywords-assignment-loop.mdc',
		'2. article-research-loop.mdc (complete study in content-research/<slug>.md, commit)',
		'3. pnpm run research:audit -- <slug>',
		'4. content-enhancer-loop.mdc + content-eeat-structure-loop.mdc',
		'5. internal-links-pillar-cluster + internal-links + homepage-brand loops',
		'6. CONTENT_AUDIT_SLUGS=<slug> pnpm run content:audit',
		'7. Commit MDX + content-research (studies stay tracked)',
		'',
		'Pass 2 (after all slugs in batch pass Pass 1):',
		'1. pnpm run links:remediate (if needed)',
		'2. LINKS_AUDIT_ENFORCE=1 pnpm run links:audit',
		'3. pnpm run run-article-remediation.mjs --pass2 --verify',
		'',
	];
	console.log(lines.join('\n'));
}

function writeQueueFile(slugs) {
	fs.mkdirSync(path.dirname(QUEUE_PATH), { recursive: true });
	const pending = listPass1RemediationSlugs();
	const payload = {
		createdAt: new Date().toISOString(),
		pass: 1,
		batchSlugs: slugs,
		pendingTotal: pending.length,
		researchDir: RESEARCH_DIR,
		pipelineSlugs: slugs.join(','),
		agentNote:
			'Complete article-research-loop and content-enhancer for batch slugs; commit content-research/*.md and src/content/blog/*.mdx',
	};
	fs.writeFileSync(QUEUE_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
	log(3, 'wrote remediation batch queue', { path: QUEUE_PATH, slugs });
}

function verifyPass1(slugs) {
	let failed = 0;
	for (const slug of slugs) {
		log(4, 'research:audit', { slug });
		const r = runNode('scripts/audit-research-study.mjs', [slug]);
		if (r !== 0) {
			failed++;
			logErr(4, 'research audit failed', { slug });
			continue;
		}
		log(5, 'content:audit', { slug });
		const c = runPnpm('content:audit', { CONTENT_AUDIT_SLUGS: slug });
		if (c !== 0) {
			failed++;
			logErr(5, 'content audit failed', { slug });
		}
	}
	return failed === 0 ? 0 : 1;
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

	if (opts.listPending) {
		const pending = listPass1RemediationSlugs();
		for (const p of pending) {
			console.log(`${p.slug}\tresearch=${p.researchOk}\tcontent=${p.contentOk}\t${p.reasons.join(';')}`);
		}
		console.error(`[article-remediation] pending count: ${pending.length}`);
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

	if (opts.scaffold) {
		for (const slug of slugs) {
			const code = scaffoldSlug(slug);
			if (code !== 0) process.exit(code);
		}
	}

	if (opts.emitQueue) writeQueueFile(slugs);

	if (opts.printSteps) printAgentSteps(slugs, 'Pass 1');

	if (opts.verify) {
		const code = verifyPass1(slugs);
		process.exit(code);
	}

	if (!opts.scaffold && !opts.printSteps && !opts.emitQueue) {
		printAgentSteps(slugs, 'Pass 1');
		log(0, 'orchestration only; use --scaffold --emit-queue --verify when ready');
	}
}

main();
