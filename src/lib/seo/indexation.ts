/** Categories with fewer published posts than this are noindex,follow. */
export const THIN_CATEGORY_INDEX_MIN_POSTS = 4;

/** Overlapping hubs that stay published but must not compete in the index. */
export const NOINDEX_OVERLAP_CATEGORIES = new Set<string>(['real-estate-law']);

export function shouldIndexCategory(category: string, postCount: number): boolean {
	try {
		if (NOINDEX_OVERLAP_CATEGORIES.has(category)) {
			return false;
		}
		if (postCount < THIN_CATEGORY_INDEX_MIN_POSTS) {
			return false;
		}
		return true;
	} catch (err) {
		console.error('[seo] shouldIndexCategory failed', { category, postCount, err });
		return false;
	}
}
