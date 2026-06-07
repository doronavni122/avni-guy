#!/usr/bin/env node
/**
 * Run live Exa research (~10 min) and write content-research/<slug>.md (≥2000 words).
 * Same Exa backend as MCP web_search_exa / web_fetch_exa. Requires EXA_API_KEY.
 * Log: [exa-research]
 */
import matter from 'gray-matter';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
	checkResearchStudyFile,
	formatResearchErrors,
} from './lib/check-research-study.mjs';
import { runExaSession } from './lib/exa-research-session.mjs';
import { buildExaResearchStudyMarkdown } from './lib/exa-research-study-builder.mjs';
import { loadEnvLocal } from './lib/load-env-local.mjs';
import { RESEARCH_DIR } from './lib/research-study-rules.mjs';
import { countWordsHe } from './lib/seo-hero-rules.mjs';

function log(step, msg, extra) {
	if (extra !== undefined) console.error(`[exa-research] step ${step}: ${msg}`, extra);
	else console.error(`[exa-research] step ${step}: ${msg}`);
}

function logErr(step, msg, extra) {
	console.error(`[exa-research] ERROR step ${step}: ${msg}`, extra ?? '');
}

function readMdxMeta(slug) {
	const fp = path.join(process.cwd(), 'src/content/blog', `${slug}.mdx`);
	if (!fs.existsSync(fp)) {
		logErr(0, 'MDX not found', fp);
		process.exit(1);
	}
	const parsed = matter(fs.readFileSync(fp, 'utf8'));
	return {
		mainKeyword: parsed.data.mainKeyword ?? parsed.data.main_keyword ?? '',
		title: parsed.data.title ?? slug,
		description: parsed.data.description ?? '',
		category: parsed.data.category ?? '',
		tags: parsed.data.tags ?? [],
		secondaryKeywords: parsed.data.secondaryKeywords ?? [],
	};
}

/**
 * @param {string} slug
 * @param {{ force?: boolean, skipAudit?: boolean, meta?: Record<string, unknown> }} [options]
 */
export async function writeExaResearchStudy(slug, options = {}) {
	const { force = false, skipAudit = false, meta: metaOverride } = options;
	const outPath = path.join(process.cwd(), RESEARCH_DIR, `${slug}.md`);
	if (fs.existsSync(outPath) && !force) {
		logErr(0, 'research file exists (use --force to overwrite)', outPath);
		return { ok: false, reason: 'exists' };
	}
	const meta = metaOverride ?? readMdxMeta(slug);
	fs.mkdirSync(path.dirname(outPath), { recursive: true });
	const session = await runExaSession(slug, meta);
	const markdown = buildExaResearchStudyMarkdown(session);
	fs.writeFileSync(outPath, markdown, 'utf8');
	const words = countWordsHe(matter(markdown).content);
	log(4, 'wrote study', { slug, path: outPath, words, sources: session.sources.length });
	if (!skipAudit) {
		const audit = checkResearchStudyFile(slug);
		if (!audit.ok) {
			logErr(4, 'research:audit failed after Exa write', formatResearchErrors(audit.errors));
			return { ok: false, reason: 'audit-failed', errors: audit.errors };
		}
		log(5, 'research:audit passed', { wordCount: audit.wordCount });
	}
	return { ok: true, path: outPath };
}

async function main() {
	loadEnvLocal();
	const argv = process.argv.slice(2);
	const force = argv.includes('--force');
	const skipAudit = argv.includes('--skip-audit');
	const slug = argv.find((a) => !a.startsWith('--'))?.trim();
	if (!slug) {
		logErr(0, 'usage: pnpm run research:exa -- <slug> [--force] [--skip-audit]');
		process.exit(1);
	}
	const result = await writeExaResearchStudy(slug, { force, skipAudit });
	if (!result.ok) process.exit(1);
	log(6, 'done', { slug, hint: 'pnpm run research:audit -- ' + slug });
}

const isCli =
	process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isCli) {
	main().catch((e) => {
		logErr(99, 'fatal', e.message);
		process.exit(1);
	});
}
