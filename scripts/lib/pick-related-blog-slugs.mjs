/**
 * Graph-based related blog slugs for link plan. Log: [pick-related-blog-slugs]
 */
import { loadAllPosts } from './internal-link-graph.mjs';
import { isGlobalPillarSlug, primaryPillarForCategory } from './pillar-cluster-registry.mjs';

const MAX_RELATED = 4;

/**
 * @param {string} slug
 * @param {string} category
 * @returns {string[]}
 */
export function pickRelatedBlogSlugs(slug, category) {
	const posts = loadAllPosts();
	const sameCat = posts
		.filter((p) => p.slug !== slug && p.category === category)
		.map((p) => p.slug);
	const pillar = primaryPillarForCategory(category, slug);
	const out = [];
	if (pillar && pillar !== slug && !isGlobalPillarSlug(slug)) {
		out.push(pillar);
	}
	for (const s of sameCat) {
		if (out.includes(s)) continue;
		out.push(s);
		if (out.length >= MAX_RELATED) break;
	}
	if (!out.length) {
		for (const p of posts) {
			if (p.slug === slug) continue;
			out.push(p.slug);
			if (out.length >= MAX_RELATED) break;
		}
	}
	return out.slice(0, MAX_RELATED);
}
