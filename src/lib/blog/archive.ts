import type { BlogPost } from '@/lib/content/schema';

export const BLOG_ARCHIVE_POSTS_PER_PAGE = 30;

export function getBlogArchivePageCount(postCount: number): number {
	if (postCount <= 0) return 1;
	return Math.ceil(postCount / BLOG_ARCHIVE_POSTS_PER_PAGE);
}

export function paginateBlogPosts(posts: BlogPost[], page: number): BlogPost[] {
	const safePage = Math.max(1, page);
	const start = (safePage - 1) * BLOG_ARCHIVE_POSTS_PER_PAGE;
	return posts.slice(start, start + BLOG_ARCHIVE_POSTS_PER_PAGE);
}

export function getArchiveDateModified(posts: BlogPost[]): string {
	if (!posts.length) {
		return new Date().toISOString().slice(0, 10);
	}
	let latest = posts[0].data.updatedDate ?? posts[0].data.pubDate;
	for (const post of posts) {
		const candidate = post.data.updatedDate ?? post.data.pubDate;
		if (candidate > latest) {
			latest = candidate;
		}
	}
	return latest.toISOString().slice(0, 10);
}

export function getArchiveYears(posts: BlogPost[]): Array<{ year: number; count: number }> {
	const counts = new Map<number, number>();
	for (const post of posts) {
		const year = post.data.pubDate.getFullYear();
		counts.set(year, (counts.get(year) ?? 0) + 1);
	}
	return [...counts.entries()]
		.sort(([a], [b]) => b - a)
		.map(([year, count]) => ({ year, count }));
}
