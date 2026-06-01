import type { BlogPost } from '@/lib/content/schema';

/**
 * Score related posts by shared tags and category; return top N by score.
 */
export function scoreRelatedPosts(current: BlogPost, allPosts: BlogPost[], limit = 4): BlogPost[] {
	try {
		const tagSet = new Set(current.data.tags);
		const scored = allPosts
			.filter((p) => p.slug !== current.slug)
			.map((p) => {
				let score = 0;
				if (p.data.category === current.data.category) score += 3;
				for (const t of p.data.tags) {
					if (tagSet.has(t)) score += 2;
				}
				return { post: p, score };
			})
			.filter((s) => s.score > 0)
			.sort((a, b) => b.score - a.score || b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf());
		return scored.slice(0, limit).map((s) => s.post);
	} catch (err) {
		console.error('[related-posts] scoreRelatedPosts failed', { slug: current.slug, err });
		return [];
	}
}
