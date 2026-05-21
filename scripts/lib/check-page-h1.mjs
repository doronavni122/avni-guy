import fs from 'node:fs';
import path from 'node:path';

function logStep(message, details) {
	if (details !== undefined) {
		console.log(`[seo-h1] ${message}`, details);
		return;
	}
	console.log(`[seo-h1] ${message}`);
}

function fail(message) {
	console.error(`[seo-h1] FAIL: ${message}`);
	process.exitCode = 1;
}

/** Blog layout must expose exactly one semantic h1 for the post title. */
export function checkBlogPostLayoutH1() {
	logStep('checking BlogPostLayout for semantic h1');
	const layoutPath = path.join(process.cwd(), 'src', 'components', 'layout', 'BlogPostLayout.tsx');
	const content = fs.readFileSync(layoutPath, 'utf8');
	if (!/<h1[^>]*>\s*\{title\}/.test(content)) {
		fail('BlogPostLayout must render post title in <h1>{title}</h1>');
	}
	if (/<p[^>]*>\s*\{title\}/.test(content)) {
		fail('BlogPostLayout must not render post title in <p> (use h1)');
	}
}

/** MDX articles must not start body with # (duplicate H1). */
export function checkMdxNoBodyH1() {
	logStep('checking blog MDX for body-level # headings');
	const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
	const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.mdx'));
	for (const file of files) {
		const raw = fs.readFileSync(path.join(blogDir, file), 'utf8');
		const body = raw.replace(/^---[\s\S]*?---\s*/m, '');
		if (/^#\s+/m.test(body)) {
			fail(`${file}: body contains markdown H1 (#); use ## or rely on layout H1`);
		}
	}
}

export function runH1Checks() {
	checkBlogPostLayoutH1();
	checkMdxNoBodyH1();
}
