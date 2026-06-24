import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/consts';
import { getPostsIndex } from '@/lib/content/posts';

const STATIC_PATHS = ['/', '/about/', '/services/', '/contact/', '/blog/', '/categories/', '/tags/'];

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	try {
		const { posts, categories, tags } = await getPostsIndex();
		const now = new Date();

		const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
			url: new URL(path, SITE_URL).toString(),
			lastModified: now,
			changeFrequency: path === '/' ? 'weekly' : 'monthly',
			priority: path === '/' ? 1 : 0.8,
		}));

		const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
			url: new URL(`/blog/${post.slug}/`, SITE_URL).toString(),
			lastModified: post.data.updatedDate ?? post.data.pubDate,
			changeFrequency: 'monthly',
			priority: 0.7,
		}));

		const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
			url: new URL(`/categories/${category}/`, SITE_URL).toString(),
			lastModified: now,
			changeFrequency: 'weekly',
			priority: 0.6,
		}));

		const tagEntries: MetadataRoute.Sitemap = tags.map((tag) => ({
			url: new URL(`/tags/${tag}/`, SITE_URL).toString(),
			lastModified: now,
			changeFrequency: 'weekly',
			priority: 0.5,
		}));

		return [...staticEntries, ...postEntries, ...categoryEntries, ...tagEntries];
	} catch (err) {
		console.error('[sitemap] generation failed', err);
		throw err;
	}
}
