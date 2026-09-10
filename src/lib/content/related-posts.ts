import type { BlogPost } from '@/lib/content/schema';
import { isQuarantinedBlogSlug } from '@/lib/seo/indexation';

const SAME_CATEGORY_SCORE = 3;
const SHARED_TAG_SCORE = 2;
const INTERNAL_LINK_SLUG_SCORE = 8;
const BLOG_INTERNAL_HREF = /^\/blog\/([^/]+)\/?$/;

function slugsFromInternalLinks(links: string[], currentSlug: string): Set<string> {
	const out = new Set<string>();
	try {
		for (const href of links) {
			const match = BLOG_INTERNAL_HREF.exec(href);
			const slug = match?.[1];
			if (!slug || slug === currentSlug) {
				continue;
			}
			if (isQuarantinedBlogSlug(slug)) {
				continue;
			}
			out.add(slug);
		}
	} catch (err) {
		console.error('[related-posts] slugsFromInternalLinks failed', { currentSlug, err });
	}
	return out;
}

/**
 * Score related posts: editorial internalLinks slugs first, then tags/category; skip quarantined.
 */
export function scoreRelatedPosts(current: BlogPost, allPosts: BlogPost[], limit = 4): BlogPost[] {
	try {
		const tagSet = new Set(current.data.tags);
		const manifestSlugs = slugsFromInternalLinks(current.data.internalLinks, current.slug);
		const scored = allPosts
			.filter((p) => p.slug !== current.slug)
			.filter((p) => {
				try {
					return !isQuarantinedBlogSlug(p.slug);
				} catch (err) {
					console.error('[related-posts] quarantine filter failed', { slug: p.slug, err });
					return false;
				}
			})
			.map((p) => {
				let score = 0;
				if (manifestSlugs.has(p.slug)) {
					score += INTERNAL_LINK_SLUG_SCORE;
				}
				if (p.data.category === current.data.category) {
					score += SAME_CATEGORY_SCORE;
				}
				for (const t of p.data.tags) {
					if (tagSet.has(t)) {
						score += SHARED_TAG_SCORE;
					}
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
