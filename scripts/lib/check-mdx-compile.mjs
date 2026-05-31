import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import fg from 'fast-glob';
import { compileMDX } from 'next-mdx-remote/rsc';

const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog');

function logErr(step, message, extra) {
	console.error(`[check-mdx-compile] ERROR step=${step} ${message}`, extra ?? '');
}

function slugFilterFromEnv() {
	const raw = process.env.CONTENT_AUDIT_SLUGS?.trim();
	if (!raw) return null;
	return new Set(raw.split(',').map((s) => s.trim()).filter(Boolean));
}

/**
 * @returns {Promise<{ ok: boolean, errors: string[] }>}
 */
export async function runMdxCompileChecks() {
	const filter = slugFilterFromEnv();
	const files = fg.sync('*.mdx', { cwd: BLOG_DIR, absolute: true });
	const errors = [];

	for (const filePath of files) {
		const slug = path.basename(filePath, '.mdx');
		if (filter && !filter.has(slug)) continue;
		let body;
		try {
			const raw = fs.readFileSync(filePath, 'utf8');
			body = matter(raw).content;
		} catch (err) {
			logErr('read', `slug=${slug}`, err);
			errors.push(`${slug}: failed to read MDX file`);
			continue;
		}
		try {
			await compileMDX({ source: body, options: { parseFrontmatter: false } });
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			logErr('compile', `slug=${slug} message=${message}`);
			errors.push(`${slug}: MDX compile failed - ${message}`);
		}
	}

	return { ok: errors.length === 0, errors };
}
