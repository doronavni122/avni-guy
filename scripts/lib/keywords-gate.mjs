/**
 * Pre-research frontmatter gate. Log: [keywords-gate]
 */
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { SITE_KEYWORDS } from './seo-hero-rules.mjs';

const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog');

function logErr(msg, extra) {
	console.error(`[keywords-gate] ERROR ${msg}`, extra ?? '');
}

/**
 * @param {string} slug
 * @returns {{ ok: boolean, errors: string[], data?: Record<string, unknown> }}
 */
export function validateKeywordsGate(slug) {
	const fp = path.join(BLOG_DIR, `${slug}.mdx`);
	const errors = [];
	if (!fs.existsSync(fp)) {
		logErr('MDX not found', { slug, fp });
		return { ok: false, errors: [`${slug}: MDX file missing`] };
	}
	const parsed = matter(fs.readFileSync(fp, 'utf8'));
	const data = parsed.data ?? {};
	const mainKeyword = String(data.mainKeyword ?? '').trim();
	const title = String(data.title ?? '').trim();
	const category = String(data.category ?? '').trim();

	if (!title) errors.push(`${slug}: missing title`);
	if (!category) errors.push(`${slug}: missing category`);
	if (!mainKeyword) {
		errors.push(`${slug}: missing mainKeyword`);
	} else if (!SITE_KEYWORDS.includes(mainKeyword)) {
		errors.push(`${slug}: mainKeyword not in SITE_KEYWORDS: "${mainKeyword}"`);
	}

	if (errors.length) {
		for (const e of errors) logErr(e);
		return { ok: false, errors, data };
	}
	return { ok: true, errors: [], data };
}

/**
 * @param {string} slug
 */
export function assertKeywordsGate(slug) {
	const result = validateKeywordsGate(slug);
	if (!result.ok) {
		throw new Error(`[keywords-gate] failed for ${slug}:\n${result.errors.join('\n')}`);
	}
	return result.data;
}
