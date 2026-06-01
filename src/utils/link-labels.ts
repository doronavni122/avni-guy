import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog');

/** Build-time map: /blog/{slug}/ -> post title */
function buildBlogTitleMap(): Record<string, string> {
	const map: Record<string, string> = {};
	try {
		const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'));
		for (const f of files) {
			const slug = f.replace(/\.mdx$/, '');
			const raw = fs.readFileSync(path.join(BLOG_DIR, f), 'utf8');
			const { data } = matter(raw);
			if (data.title) {
				map[`/blog/${slug}/`] = String(data.title);
			}
		}
	} catch (err) {
		console.error('[link-labels] buildBlogTitleMap failed', err);
	}
	return map;
}

const BLOG_TITLE_MAP = buildBlogTitleMap();

/** Maps internal hrefs to short Hebrew labels for navigation UI. */
export function labelForInternalLink(href: string): string {
	try {
		const normalized = href.replace(/\/+$/, '') || '/';
		const withSlash = normalized === '/' ? '/' : `${normalized}/`;
		const staticLabels: Record<string, string> = {
			'/': 'דף הבית',
			'/about': 'אודות',
			'/services': 'שירותים',
			'/blog': 'מאמרים',
			'/categories': 'קטגוריות',
			'/tags': 'תגיות',
			'/contact': 'יצירת קשר',
		};
		if (staticLabels[normalized]) return staticLabels[normalized];
		if (withSlash.startsWith('/blog/') && withSlash !== '/blog/') {
			return BLOG_TITLE_MAP[withSlash] ?? href;
		}
		if (normalized.startsWith('/categories/')) {
			const cat = normalized.replace('/categories/', '');
			return `קטגוריה: ${cat}`;
		}
		if (normalized.startsWith('/tags/')) {
			const tag = normalized.replace('/tags/', '');
			return `תגית: ${tag}`;
		}
		return href;
	} catch (err) {
		console.error('[link-labels] labelForInternalLink failed', { href, err });
		return href;
	}
}

/** Title label for a blog slug path (for footer curation). */
export function blogTitleForPath(href: string): string | undefined {
	const normalized = href.replace(/\/+$/, '') || '/';
	const withSlash = `${normalized}/`;
	return BLOG_TITLE_MAP[withSlash.startsWith('/blog/') ? withSlash : `/blog/${normalized.replace(/^\/blog\//, '')}/`];
}
