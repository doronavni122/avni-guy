import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
	checkResearchStudyFile,
	formatResearchErrors,
} from './check-research-study.mjs';
import { RESEARCH_DIR, RESEARCH_TRACKED_IN_GIT } from './research-study-rules.mjs';

function log(msg, extra) {
	if (extra !== undefined) console.error(`[research-study-io] ${msg}`, extra);
	else console.error(`[research-study-io] ${msg}`);
}

function logErr(msg, extra) {
	console.error(`[research-study-io] ERROR ${msg}`, extra ?? '');
}

/**
 * Fail fast when research study is missing or invalid.
 * @param {string} slug
 * @param {{ minDurationSec?: number }} [options]
 */
export function assertResearchStudyReady(slug, options = {}) {
	const result = checkResearchStudyFile(slug, options);
	if (!result.ok) {
		const detail = formatResearchErrors(result.errors);
		const msg = `[research-study-io] research not ready for "${slug}":\n${detail}\nRun: pnpm run research:scaffold -- ${slug} then complete study and pnpm run research:audit -- ${slug}`;
		logErr('assertResearchStudyReady failed', { slug });
		throw new Error(msg);
	}
	log('research ready', { slug, wordCount: result.wordCount });
	return result;
}

/**
 * Delete ephemeral research file only after dual audit gate.
 * @param {string} slug
 * @param {{ contentAuditPassed?: boolean }} options
 */
export function deleteResearchStudy(slug, { contentAuditPassed = false } = {}) {
	if (RESEARCH_TRACKED_IN_GIT && process.env.RESEARCH_ALLOW_DELETE !== '1') {
		log('delete skipped (tracked content-research; set RESEARCH_ALLOW_DELETE=1 to remove)', {
			slug,
		});
		return false;
	}

	if (!contentAuditPassed) {
		logErr('delete blocked: contentAuditPassed must be true after scoped content:audit');
		throw new Error(
			`deleteResearchStudy("${slug}") requires contentAuditPassed=true after scoped content:audit`,
		);
	}

	const audit = checkResearchStudyFile(slug);
	if (!audit.ok) {
		logErr('delete blocked: research audit no longer passes', { slug });
		throw new Error(`deleteResearchStudy("${slug}"): research audit failed before delete`);
	}

	const fp = path.join(process.cwd(), RESEARCH_DIR, `${slug}.md`);
	if (!fs.existsSync(fp)) {
		log('delete skipped (already absent)', { slug });
		return false;
	}

	fs.unlinkSync(fp);
	log('deleted research study', { slug });
	return true;
}

/**
 * Run scoped content:audit for slug; returns true when exit 0.
 * @param {string} slug
 */
export function runScopedContentAudit(slug) {
	const result = spawnSync('pnpm', ['run', 'content:audit'], {
		stdio: 'inherit',
		env: { ...process.env, CONTENT_AUDIT_SLUGS: slug },
	});
	return result.status === 0;
}

/**
 * Delete research after content audit passes (single code path for batch scripts).
 * @param {string} slug
 */
export function deleteResearchStudyAfterContentAudit(slug) {
	const contentOk = runScopedContentAudit(slug);
	if (!contentOk) {
		logErr('content audit failed; research file retained', { slug });
		throw new Error(`content:audit failed for "${slug}"; research file not deleted`);
	}
	return deleteResearchStudy(slug, { contentAuditPassed: true });
}

export function researchStudyPath(slug) {
	return path.join(process.cwd(), RESEARCH_DIR, `${slug}.md`);
}

export function researchStudyExists(slug) {
	return fs.existsSync(researchStudyPath(slug));
}
