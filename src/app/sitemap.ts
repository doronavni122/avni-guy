import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/consts';
import { getArchiveDateModified } from '@/lib/blog/archive';
import { getPostsIndex } from '@/lib/content/posts';
import { isQuarantinedBlogSlug, shouldIndexCategory } from '@/lib/seo/indexation';

/**
 * Honest lastmod for static routes — bump only when that page’s content genuinely
 * changes (mirrors page-level DATE_MODIFIED where those exist). Never use new Date()
 * at build time for unchanging pages.
 */
const STATIC_PATH_LASTMOD: Record<string, string> = {
	'/': '2026-07-09',
	'/about/': '2026-07-13',
	'/services/': '2026-07-13',
	'/contact/': '2026-07-01',
	'/categories/': '2026-07-13',
	'/tags/': '2026-07-13',
	'/editorial-policy/': '2026-07-14',
	'/sheelot/': '2026-07-14',
	'/nedlan-lawyer-guy-avni/': '2026-07-14',
	'/contracts-lawyer-guy-avni/': '2026-07-14',
	'/media/': '2026-07-14',
	'/guy-avni/': '2026-07-14',
};

const STATIC_PATHS = Object.keys(STATIC_PATH_LASTMOD).concat(['/blog/']);

export const dynamic = 'force-static';

function staticLastModified(path: string, blogArchiveModified: Date): Date {
	if (path === '/blog/') {
		return blogArchiveModified;
	}
	const iso = STATIC_PATH_LASTMOD[path];
	if (!iso) {
		console.error('[sitemap] missing STATIC_PATH_LASTMOD for path', { path });
		return blogArchiveModified;
	}
	return new Date(iso);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	try {
		const { posts, categories } = await getPostsIndex();
		const blogArchiveModified = new Date(getArchiveDateModified(posts));

		const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
			url: new URL(path, SITE_URL).toString(),
			lastModified: staticLastModified(path, blogArchiveModified),
			changeFrequency: path === '/' ? 'weekly' : 'monthly',
			priority: path === '/' ? 1 : 0.8,
		}));

		const postEntries: MetadataRoute.Sitemap = posts
			.filter((post) => !isQuarantinedBlogSlug(post.slug))
			.map((post) => ({
				url: new URL(`/blog/${post.slug}/`, SITE_URL).toString(),
				lastModified: post.data.updatedDate ?? post.data.pubDate,
				changeFrequency: 'monthly' as const,
				priority: 0.7,
			}));

		const categoryEntries: MetadataRoute.Sitemap = categories
			.filter((category) => {
				const postCount = posts.filter((post) => post.data.category === category).length;
				return shouldIndexCategory(category, postCount);
			})
			.map((category) => ({
				url: new URL(`/categories/${category}/`, SITE_URL).toString(),
				lastModified: blogArchiveModified,
				changeFrequency: 'weekly' as const,
				priority: 0.6,
			}));

		return [...staticEntries, ...postEntries, ...categoryEntries];
	} catch (err) {
		console.error('[sitemap] generation failed', err);
		throw err;
	}
}
