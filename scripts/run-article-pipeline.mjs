#!/usr/bin/env node
/**
 * Unified article pipeline: keywords → Exa research → cleanup + MDX → scoped links → verify.
 * Log: [article-pipeline]
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { applyResearchToMdx } from './lib/apply-research-to-mdx.mjs';
import { serializeFrontmatter } from './lib/article-body-kit.mjs';
import { backfillKeywordsFromStudy } from './lib/keywords-backfill.mjs';
import { assertKeywordsGate } from './lib/keywords-gate.mjs';
import { loadEnvLocal } from './lib/load-env-local.mjs';
import { remediateLinksScoped } from './lib/remediate-links-scoped.mjs';
import { assertResearchStudyReady, runExaResearchStudyAsync } from './lib/research-study-io.mjs';
import { RESEARCH_DIR } from './lib/research-study-rules.mjs';

const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog');

function log(step, msg, extra) {
	if (extra !== undefined) console.error(`[article-pipeline] step ${step}: ${msg}`, extra);
	else console.error(`[article-pipeline] step ${step}: ${msg}`);
}

function logErr(step, msg, extra) {
	console.error(`[article-pipeline] ERROR step ${step}: ${msg}`, extra ?? '');
}

function parseArgs(argv) {
	const flags = new Set(argv.filter((a) => a.startsWith('--')));
	return {
		forceResearch: flags.has('--force-research'),
		skipResearch: flags.has('--skip-research'),
		skipLinks: flags.has('--skip-links'),
		dryRun: flags.has('--dry-run'),
		continueOnError: flags.has('--continue-on-error'),
		fullVerify: flags.has('--full-verify'),
		noStrict: flags.has('--no-strict'),
		help: flags.has('--help'),
		slugs: argv.filter((a) => !a.startsWith('--')),
	};
}

function resolveSlugs(argvSlugs) {
	if (argvSlugs.length) return argvSlugs;
	const env = process.env.PIPELINE_SLUGS?.trim();
	if (!env) return [];
	return env.split(',').map((s) => s.trim()).filter(Boolean);
}

function runNode(script, args = [], env = {}) {
	const result = spawnSync(process.execPath, [script, ...args], {
		stdio: 'inherit',
		env: { ...process.env, ...env },
	});
	return result.status ?? 1;
}

function runPnpm(script, env = {}) {
	const result = spawnSync('pnpm', ['run', script], { stdio: 'inherit', env: { ...process.env, ...env } });
	return result.status ?? 1;
}

function readStudy(slug) {
	const fp = path.join(process.cwd(), RESEARCH_DIR, `${slug}.md`);
	return fs.readFileSync(fp, 'utf8');
}

function writeMdxSlug(slug, rawMdx, data, studyMarkdown) {
	const imagesMatch = rawMdx.match(/^images:\n[\s\S]*?(?=\n---)/m);
	const imagesSection = imagesMatch
		? imagesMatch[0]
		: 'images:\n  - src: ""\n    alt: ""\n    title: ""';
	const { data: fm, body } = applyResearchToMdx(slug, data, studyMarkdown, imagesSection);
	const frontmatter = serializeFrontmatter(fm, imagesSection);
	fs.writeFileSync(path.join(BLOG_DIR, `${slug}.mdx`), `${frontmatter}\n\n${body}`, 'utf8');
}

/**
 * @param {string[]} slugs
 * @param {ReturnType<typeof parseArgs>} opts
 */
async function runPipeline(slugs, opts) {
	/** @type {{ ok: boolean, failed: { slug: string, phase: string, errors: string[] }[] }} */
	const summary = { ok: true, failed: [] };

	for (const slug of slugs) {
		log(1, 'slug start', { slug });
		try {
			log(2, 'keywords gate', { slug });
			let data = assertKeywordsGate(slug);
			const mdxPath = path.join(BLOG_DIR, `${slug}.mdx`);
			const rawMdx = fs.readFileSync(mdxPath, 'utf8');

			const studyPath = path.join(process.cwd(), RESEARCH_DIR, `${slug}.md`);
			if (!opts.skipResearch) {
				if (!fs.existsSync(studyPath)) {
					log(3, 'scaffold research', { slug });
					if (!opts.dryRun) {
						const code = runNode('scripts/scaffold-research-study.mjs', [slug]);
						if (code !== 0) throw new Error('scaffold failed');
					}
				}
				const studyExists = fs.existsSync(studyPath);
				if (!studyExists || opts.forceResearch) {
					log(4, 'exa research', { slug, force: opts.forceResearch, studyExists });
					if (!opts.dryRun) {
						const ok = await runExaResearchStudyAsync(slug, {
							force: opts.forceResearch || !studyExists,
						});
						if (!ok) throw new Error('exa research failed');
					}
				} else {
					log(4, 'reuse existing study', { slug });
				}
				if (!opts.dryRun) {
					assertResearchStudyReady(slug);
					const auditCode = runNode('scripts/audit-research-study.mjs', [slug]);
					if (auditCode !== 0) throw new Error('research audit failed');
				}
			} else if (!opts.dryRun) {
				assertResearchStudyReady(slug);
			}

			log(5, 'keywords backfill + apply study', { slug });
			if (!opts.dryRun) {
				const studyMarkdown = readStudy(slug);
				const backfill = backfillKeywordsFromStudy(slug, data, studyMarkdown);
				data = backfill.data;
				writeMdxSlug(slug, rawMdx, data, studyMarkdown);
			}
			log(6, 'slug done', { slug });
		} catch (e) {
			const message = e instanceof Error ? e.message : String(e);
			logErr(6, 'slug failed', { slug, message });
			summary.ok = false;
			summary.failed.push({ slug, phase: 'pipeline', errors: [message] });
			if (!opts.continueOnError) break;
		}
	}

	if (!opts.skipLinks && slugs.length && !opts.dryRun && process.env.PIPELINE_CONTRACT === '0') {
		log(7, 'scoped links remediate (legacy)', { count: slugs.length });
		remediateLinksScoped(slugs, { dryRun: false });
		process.env.PIPELINE_SLUGS = slugs.join(',');
		runNode('scripts/fix-duplicate-paragraph-links.mjs');
	} else if (!opts.skipLinks && slugs.length && !opts.dryRun) {
		log(7, 'skip legacy remediate (study-anchor contract)', { count: slugs.length });
	}

	if (slugs.length && !opts.dryRun) {
		const csv = slugs.join(',');
		const strictEnv = opts.noStrict
			? { PIPELINE_CONTRACT: '0' }
			: { CONTENT_STRICT: '1', PIPELINE_CONTRACT: '1' };
		log(8, 'verify research audit', { slugs: csv });
		const rCode = runNode('scripts/audit-research-study.mjs', slugs);
		if (rCode !== 0) {
			summary.ok = false;
			if (!opts.continueOnError) {
				console.log(JSON.stringify(summary, null, 2));
				process.exit(rCode);
			}
		}
		log(9, 'verify content audit', { slugs: csv });
		const cCode = runPnpm('content:audit', { CONTENT_AUDIT_SLUGS: csv, ...strictEnv });
		if (cCode !== 0) {
			summary.ok = false;
			if (!opts.continueOnError) {
				console.log(JSON.stringify(summary, null, 2));
				process.exit(cCode);
			}
		}
		log(10, 'verify links audit', { slugs: csv });
		const lCode = runPnpm('links:audit', {
			LINKS_AUDIT_ENFORCE: '1',
			LINKS_AUDIT_SLUGS: csv,
			PIPELINE_SLUGS: csv,
			...strictEnv,
		});
		if (lCode !== 0) {
			summary.ok = false;
			if (!opts.continueOnError) {
				console.log(JSON.stringify(summary, null, 2));
				process.exit(lCode);
			}
		}
		log(11, 'seo guardrails', { slugs: csv });
		const gCode = runPnpm('seo:guardrails', { CONTENT_AUDIT_ENFORCE: '0', ...strictEnv });
		if (gCode !== 0) {
			summary.ok = false;
			if (!opts.continueOnError) {
				console.log(JSON.stringify(summary, null, 2));
				process.exit(gCode);
			}
		}
		if (opts.fullVerify) {
			log(12, 'full verify', { slugs: csv });
			const vCode = runPnpm('verify:content', {
				CONTENT_AUDIT_SLUGS: csv,
				RESEARCH_AUDIT_SLUGS: csv,
				...strictEnv,
			});
			if (vCode !== 0) summary.ok = false;
		}
	}

	console.log(JSON.stringify(summary, null, 2));
	if (!summary.ok) process.exit(1);
	log(13, 'pipeline complete', { slugs: slugs.length });
}

async function main() {
	loadEnvLocal();
	const opts = parseArgs(process.argv.slice(2));
	if (opts.help) {
		console.log(`Usage: pnpm run article:pipeline -- <slug> [slug2 ...] [flags]

Flags:
  --force-research   Re-run Exa even if study exists
  --skip-research    Use existing study (must pass audit)
  --skip-links       Research + MDX only
  --dry-run          Log phases only
  --continue-on-error
  --full-verify      verify:content + seo:guardrails
  --no-strict        Skip CONTENT_STRICT=1 on content audit

Env: PIPELINE_SLUGS=slug-a,slug-b  EXA_API_KEY required for research`);
		process.exit(0);
	}
	const slugs = resolveSlugs(opts.slugs);
	if (!slugs.length) {
		logErr(0, 'no slugs (argv or PIPELINE_SLUGS)');
		process.exit(1);
	}
	log(0, 'pipeline start', { slugs: slugs.length, dryRun: opts.dryRun });
	await runPipeline(slugs, opts);
}

main().catch((e) => {
	logErr(99, 'fatal', e.message);
	process.exit(1);
});
