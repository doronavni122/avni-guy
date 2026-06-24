import fs from 'node:fs';
import path from 'node:path';
import type { BlogFrontmatter } from './schema';

const LEGACY_IMAGE_PREFIX = 'guy-avni-';
const BLOG_IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'blog');

/** Default paragraph indices for inline figure injection (1-based paragraph count). */
export const DEFAULT_IMAGE_PLACEMENTS = [2, 5, 9] as const;

function basenameFromUrl(src: string): string | null {
	try {
		const url = src.startsWith('http') ? new URL(src) : new URL(src, 'https://avniguy.co.il');
		return path.basename(url.pathname);
	} catch (err) {
		console.error('[content:images] basenameFromUrl failed', { src, err });
		return null;
	}
}

function resolveLocalBlogImageBasename(basename: string): string {
	const direct = path.join(BLOG_IMAGES_DIR, basename);
	if (fs.existsSync(direct)) {
		return basename;
	}
	const legacy = `${LEGACY_IMAGE_PREFIX}${basename}`;
	if (fs.existsSync(path.join(BLOG_IMAGES_DIR, legacy))) {
		return legacy;
	}
	return basename;
}

/**
 * Normalizes blog image URLs to match files on disk (handles legacy filename prefix).
 */
export function resolveBlogImageSrc(src: string): string {
	const basename = basenameFromUrl(src);
	if (!basename) {
		return src;
	}
	const resolvedBasename = resolveLocalBlogImageBasename(basename);
	if (resolvedBasename === basename) {
		return src;
	}
	if (src.startsWith('/')) {
		return `/images/blog/${resolvedBasename}`;
	}
	try {
		const url = new URL(src);
		url.pathname = `/images/blog/${resolvedBasename}`;
		return url.toString();
	} catch {
		return `/images/blog/${resolvedBasename}`;
	}
}

export function normalizePostImages(images: BlogFrontmatter['images']): BlogFrontmatter['images'] {
	return images.map((image, index) => ({
		...image,
		src: resolveBlogImageSrc(image.src),
		placement: image.placement ?? { afterParagraph: DEFAULT_IMAGE_PLACEMENTS[index] ?? index + 2 },
	}));
}
