#!/usr/bin/env node
/**
 * Strips legacy `guy-avni-` prefix from blog image basenames under public/images/blog/.
 * MDX frontmatter URLs already omit this prefix after slug rename.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const BLOG_IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'blog');
const LEGACY_PREFIX = 'guy-avni-';

async function main() {
	const entries = await fs.readdir(BLOG_IMAGES_DIR);
	let renamed = 0;
	let skipped = 0;

	for (const name of entries) {
		if (!name.startsWith(LEGACY_PREFIX)) {
			skipped++;
			continue;
		}
		const newName = name.slice(LEGACY_PREFIX.length);
		const from = path.join(BLOG_IMAGES_DIR, name);
		const to = path.join(BLOG_IMAGES_DIR, newName);
		try {
			await fs.access(to);
			console.error('[rename-blog-image-files] ERROR target exists', { from: name, to: newName });
			process.exit(1);
		} catch {
			/* ok */
		}
		await fs.rename(from, to);
		renamed++;
	}

	console.log('[rename-blog-image-files] done', { renamed, skipped, total: entries.length });
}

main().catch((err) => {
	console.error('[rename-blog-image-files] ERROR', err);
	process.exit(1);
});
