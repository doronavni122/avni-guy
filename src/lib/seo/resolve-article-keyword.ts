import { SITE_KEYWORDS, SITE_KEYWORDS_BRAND, type SiteKeyword } from '@/consts';
import type { BlogFrontmatter } from '@/lib/content/schema';

const BRAND_KEYWORD_SET = new Set<string>(SITE_KEYWORDS_BRAND);
const SITE_KEYWORD_SET = new Set<string>(SITE_KEYWORDS);

function asSiteKeyword(value: string): SiteKeyword | undefined {
	return SITE_KEYWORD_SET.has(value) ? (value as SiteKeyword) : undefined;
}

function normalizeTopic(value: string): string {
	return value.replace(/[?؟]/g, '').trim();
}

/**
 * Prefer a topic keyword over brand-as-primary.
 * Brand tokens stay valid SiteKeyword values but must not win when a topic match exists.
 */
export function resolveArticleKeyword(data: Pick<BlogFrontmatter, 'title' | 'mainKeyword' | 'secondaryKeywords'>): SiteKeyword {
	try {
		if (!BRAND_KEYWORD_SET.has(data.mainKeyword)) {
			return data.mainKeyword;
		}
		const titleNorm = normalizeTopic(data.title);
		const titleHit = asSiteKeyword(data.title) ?? asSiteKeyword(titleNorm);
		if (titleHit && !BRAND_KEYWORD_SET.has(titleHit)) {
			return titleHit;
		}
		for (const keyword of SITE_KEYWORDS) {
			if (BRAND_KEYWORD_SET.has(keyword)) continue;
			if (titleNorm.includes(normalizeTopic(keyword)) || normalizeTopic(keyword).includes(titleNorm)) {
				return keyword;
			}
		}
		for (const secondary of data.secondaryKeywords ?? []) {
			const hit = asSiteKeyword(secondary);
			if (hit && !BRAND_KEYWORD_SET.has(hit)) {
				return hit;
			}
		}
		console.error('[seo] resolveArticleKeyword fell back to brand mainKeyword', {
			title: data.title,
			mainKeyword: data.mainKeyword,
		});
		return data.mainKeyword;
	} catch (err) {
		console.error('[seo] resolveArticleKeyword failed', { title: data.title, err });
		return data.mainKeyword;
	}
}

export function isBrandPrimaryKeyword(keyword: string): boolean {
	return BRAND_KEYWORD_SET.has(keyword);
}
