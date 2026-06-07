/**
 * Slugs that still need Pass 1 remediation (research and/or content audit).
 */
import fs from 'node:fs';
import path from 'node:path';
import { runArticleContentChecks } from './check-article-content.mjs';
import { checkResearchStudyFile } from './check-research-study.mjs';
import {
    effectiveBatchSize,
    filterPendingForProgram,
    isProgramActive,
    loadProgram,
} from './remediation-program.mjs';
import { RESEARCH_DIR } from './research-study-rules.mjs';

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');

function logErr(msg, extra) {
	console.error(`[remediation-queue] ERROR ${msg}`, extra ?? '');
}

export function listAllBlogSlugs() {
	try {
		return fs
			.readdirSync(BLOG_DIR)
			.filter((f) => f.endsWith('.mdx'))
			.map((f) => f.replace(/\.mdx$/, ''))
			.sort();
	} catch (err) {
		logErr('listAllBlogSlugs failed', err.message);
		throw err;
	}
}

/**
 * @param {string} slug
 * @returns {{ slug: string, researchOk: boolean, contentOk: boolean, reasons: string[] }}
 */
export function assessSlugRemediation(slug) {
	const reasons = [];
	const research = checkResearchStudyFile(slug);
	const researchOk = research.ok === true;
	if (!researchOk) {
		for (const e of research.errors ?? []) {
			reasons.push(`research:${e.ruleId ?? 'FAIL'}`);
		}
	}

	const prevStrict = process.env.CONTENT_STRICT;
	const prevContract = process.env.PIPELINE_CONTRACT;
	process.env.CONTENT_STRICT = '1';
	process.env.PIPELINE_CONTRACT = '1';
	const content = runArticleContentChecks({ slugFilter: [slug] });
	if (prevStrict === undefined) delete process.env.CONTENT_STRICT;
	else process.env.CONTENT_STRICT = prevStrict;
	if (prevContract === undefined) delete process.env.PIPELINE_CONTRACT;
	else process.env.PIPELINE_CONTRACT = prevContract;
	const contentOk = content.ok === true;
	if (!contentOk) {
		for (const e of content.errors ?? []) {
			reasons.push(`content:${e.slice(0, 80)}`);
		}
	}

	return { slug, researchOk, contentOk, reasons };
}

/** Slugs needing Pass 1 (missing/invalid research or content audit fail). */
export function listPass1RemediationSlugs() {
	const slugs = listAllBlogSlugs();
	const pending = [];
	for (const slug of slugs) {
		const a = assessSlugRemediation(slug);
		if (!a.researchOk || !a.contentOk) pending.push(a);
	}
	return pending;
}

/** Pick first N slugs (stable sort by slug), respecting remediation program cap. */
export function pickPass1Batch(batchSize) {
	const program = loadProgram();
	if (!isProgramActive(program)) {
		return [];
	}
	const pending = filterPendingForProgram(listPass1RemediationSlugs(), program);
	const n = effectiveBatchSize(batchSize, program);
	if (n === 0 || pending.length === 0) {
		return [];
	}
	return pending.slice(0, n).map((p) => p.slug);
}

export function researchDirPath() {
	return path.join(process.cwd(), RESEARCH_DIR);
}
