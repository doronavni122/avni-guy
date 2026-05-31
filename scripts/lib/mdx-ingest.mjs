import fs from 'node:fs/promises';
import path from 'node:path';
import fg from 'fast-glob';
import matter from 'gray-matter';
import { MAIN_PAGE_HEROES } from '../../src/lib/seo/main-page-heroes.mjs';

const CONTENT_DIR = path.join(process.cwd(), 'src/content/blog');
const SITE_URL = 'https://avniguy.co.il';

function slugFromFilePath(filePath) {
	const base = path.basename(filePath).replace(/\.(md|mdx)$/, '');
	if (base === 'index') {
		return path.basename(path.dirname(filePath));
	}
	return base;
}

/**
 * @returns {Promise<Array<{ id: string; title: string; url: string; text: string; source: 'mdx' | 'hero' }>>}
 */
export async function loadMdxDocuments() {
	const files = await fg('**/*.{md,mdx}', { cwd: CONTENT_DIR, absolute: true });
	const docs = [];

	for (const filePath of files) {
		try {
			const raw = await fs.readFile(filePath, 'utf8');
			const { data, content } = matter(raw);
			const slug = slugFromFilePath(filePath);
			const title = data.title ?? slug;
			const description = data.description ?? '';
			const text = `${title}\n${description}\n${content}`;
			docs.push({
				id: slug,
				title,
				url: new URL(`/blog/${slug}/`, SITE_URL).toString(),
				text,
				source: 'mdx',
			});
		} catch (err) {
			console.error('[mdx-ingest] read failed', { filePath, err });
		}
	}

	return docs;
}

/**
 * @returns {Array<{ id: string; title: string; url: string; text: string; source: 'hero' }>}
 */
export function loadMainPageDocuments() {
	const docs = [];
	for (const [route, hero] of Object.entries(MAIN_PAGE_HEROES)) {
		const normalized = route.endsWith('/') ? route : `${route}/`;
		docs.push({
			id: `main${normalized.replace(/\//g, '-')}`,
			title: hero.h1,
			url: new URL(normalized, SITE_URL).toString(),
			text: `${hero.h1}\n${hero.intro}`,
			source: 'hero',
		});
	}
	return docs;
}

/**
 * @param {string} url
 * @returns {string | null}
 */
export function blogSlugFromUrl(url) {
	try {
		const u = new URL(url);
		const match = u.pathname.match(/^\/blog\/([^/]+)\/?$/);
		return match ? match[1] : null;
	} catch {
		return null;
	}
}

/**
 * Main pages that should be extracted via Tavily if not fully covered by heroes.
 * @param {string[]} mappedUrls
 * @param {Set<string>} coveredUrls
 * @returns {string[]}
 */
export function findExtractGapUrls(mappedUrls, coveredUrls) {
	const staticPaths = new Set(['/', '/about/', '/services/', '/blog/', '/categories/', '/tags/', '/contact/']);
	const gaps = [];

	for (const raw of mappedUrls) {
		let pathname;
		try {
			pathname = new URL(raw).pathname;
		} catch {
			continue;
		}
		const normalized = pathname.endsWith('/') ? pathname : `${pathname}/`;
		if (blogSlugFromUrl(raw)) continue;
		if (!staticPaths.has(normalized)) continue;
		const full = new URL(normalized, SITE_URL).toString();
		if (!coveredUrls.has(full)) {
			gaps.push(full);
		}
	}

	return [...new Set(gaps)];
}

export { SITE_URL };
