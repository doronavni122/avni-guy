#!/usr/bin/env node
/**
 * Lightweight orchestrator: manifest → research preflight → checklist hint → scoped audit.
 * Does not auto-run agent enhancer/links (use batch scripts or Cursor loops).
 * Log: [content-pipeline-2026]
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { runArticleContentChecks } from './lib/check-article-content.mjs';
import { KEYWORD_STUB_SLUGS } from './lib/keyword-stub-slugs.mjs';

const CHECKLISTS = [
	'temp_articles_checklist.txt',
	'temp_internal_links_checklist.txt',
	'temp_homepage_brand_internal_links_checklist.txt',
];

function log(step, msg, extra) {
	if (extra !== undefined) console.error(`[content-pipeline-2026] step ${step}: ${msg}`, extra);
	else console.error(`[content-pipeline-2026] step ${step}: ${msg}`);
}

function logErr(step, msg, extra) {
	console.error(`[content-pipeline-2026] ERROR step ${step}: ${msg}`, extra ?? '');
}

function runNode(script, args = [], env = {}) {
	const result = spawnSync(process.execPath, [script, ...args], {
		stdio: 'inherit',
		env: { ...process.env, ...env },
	});
	return result.status ?? 1;
}

function resolveSlugs(argv) {
	if (argv.length) return argv;
	const env = process.env.PIPELINE_SLUGS?.trim();
	if (env) return env.split(',').map((s) => s.trim()).filter(Boolean);
	return [];
}

function ensureChecklists(slugs) {
	if (!slugs.length) return;
	const line = (slug) => `- [ ] src/content/blog/${slug}.mdx`;
	for (const checklistPath of CHECKLISTS) {
		if (fs.existsSync(checklistPath)) {
			log(2, 'checklist exists', { checklistPath });
			continue;
		}
		const body = `${slugs.map(line).join('\n')}\n`;
		fs.writeFileSync(checklistPath, body, 'utf8');
		log(2, 'checklist created', { checklistPath, count: slugs.length });
	}
}

function main() {
	console.error('[content-pipeline-2026] DEPRECATED: use pnpm run article:pipeline -- <slug>');
	process.exit(1);
	const argv = process.argv.slice(2);
	const skipManifest = argv.includes('--skip-manifest');
	const skipResearch = argv.includes('--skip-research');
	const skipAudit = argv.includes('--skip-audit');
	const slugs = resolveSlugs(argv.filter((a) => !a.startsWith('--')));

	if (skipResearch && slugs.length) {
		logErr(0, '--skip-research blocked when scoped slugs are set');
		process.exit(1);
	}

	log(0, 'pipeline run start', {
		slugs: slugs.length || 'none',
		skipManifest,
		skipResearch,
		skipAudit,
	});

	if (!skipManifest) {
		log(1, 'running manifest sync');
		const write = process.argv.includes('--write-manifest') ? ['--write'] : [];
		const code = runNode('scripts/sync-article-manifest.mjs', write);
		if (code !== 0) {
			logErr(1, 'manifest failed');
			process.exit(code);
		}
	}

	if (!skipResearch) {
		log(3, 'research preflight');
		const preflightEnv =
			slugs.length > 0 ? { REQUIRE_RESEARCH: '1' } : {};
		const code = runNode('scripts/run-research-preflight.mjs', slugs, preflightEnv);
		if (code !== 0) {
			logErr(3, 'research preflight failed');
			process.exit(code);
		}
	}

	const checklistSlugs = slugs.length ? slugs : KEYWORD_STUB_SLUGS;
	ensureChecklists(checklistSlugs);

	if (!slugs.length) {
		log(4, 'no slugs for scoped audit; run agent loops per content-pipeline-loop.mdc');
		log(4, 'done (manifest-only mode)');
		return;
	}

	if (skipAudit) {
		log(5, 'audit skipped');
		return;
	}

	log(5, 'scoped content audit', { slugs: slugs.length });
	const audit = runArticleContentChecks({ slugFilter: slugs });
	if (!audit.ok) {
		logErr(5, 'content audit failed', { count: audit.errors.length });
		for (const err of audit.errors.slice(0, 25)) logErr(5, err);
		process.exit(1);
	}

	log(6, 'pipeline run complete', { slugs: slugs.length });
}

main();
