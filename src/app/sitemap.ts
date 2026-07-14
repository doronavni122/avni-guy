import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/consts';
import { getArchiveDateModified, getBlogArchivePageCount } from '@/lib/blog/archive';
import { getPostsIndex } from '@/lib/content/posts';

const STATIC_PATHS = [
	'/',
	'/about/',
	'/search/',
	'/services/',
	'/contact/',
	'/blog/',
	'/categories/',
	'/tags/',
	'/editorial-policy/',
	'/sheelot/',
];

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	try {
		const { posts, categories } = await getPostsIndex();
		const blogArchiveModified = new Date(getArchiveDateModified(posts));
		const totalBlogPages = getBlogArchivePageCount(posts.length);

		const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
			url: new URL(path, SITE_URL).toString(),
			lastModified: path === '/blog/' ? blogArchiveModified : new Date(),
			changeFrequency: path === '/' ? 'weekly' : 'monthly',
			priority: path === '/' ? 1 : 0.8,
		}));

		const blogPaginationEntries: MetadataRoute.Sitemap = Array.from(
			{ length: Math.max(0, totalBlogPages - 1) },
			(_, i) => {
				const page = i + 2;
				return {
					url: new URL(`/blog/page/${page}/`, SITE_URL).toString(),
					lastModified: blogArchiveModified,
					changeFrequency: 'monthly' as const,
					priority: 0.6,
				};
			},
		);

		const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
			url: new URL(`/blog/${post.slug}/`, SITE_URL).toString(),
			lastModified: post.data.updatedDate ?? post.data.pubDate,
			changeFrequency: 'monthly',
			priority: 0.7,
		}));

		const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
			url: new URL(`/categories/${category}/`, SITE_URL).toString(),
			lastModified: blogArchiveModified,
			changeFrequency: 'weekly',
			priority: 0.6,
		}));

		return [...staticEntries, ...blogPaginationEntries, ...postEntries, ...categoryEntries];
	} catch (err) {
		console.error('[sitemap] generation failed', err);
		throw err;
	}
}
