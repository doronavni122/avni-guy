import { SITE_URL } from '@/consts';

/**
 * Unique OG image path per main hub (absolute URL).
 * Do not reuse homepage slot assets or the shared law fallback on these hubs.
 */
export const MAIN_PAGE_OG_PATHS = {
	'/services/': '/images/og/og-services-fountain-pen-contract-macro.jpg',
	'/contact/': '/images/og/og-contact-desk-telephone-macro.jpg',
	'/categories/': '/images/og/og-categories-law-book-spines-macro.jpg',
	'/tags/': '/images/og/og-tags-index-tabs-macro.jpg',
	'/sheelot/': '/images/og/og-sheelot-question-notebook-macro.jpg',
	'/media/': '/images/og/og-media-microphone-grille-macro.jpg',
	'/editorial-policy/': '/images/og/og-editorial-red-pencil-macro.jpg',
	'/guy-avni/': '/images/og/og-guy-avni-nameplate-macro.jpg',
	'/blog/': '/images/og/og-blog-leather-journal-macro.jpg',
} as const;

export type MainPageOgPath = keyof typeof MAIN_PAGE_OG_PATHS;

export function mainPageOgImageUrl(path: MainPageOgPath): string {
	try {
		return new URL(MAIN_PAGE_OG_PATHS[path], SITE_URL).toString();
	} catch (err) {
		console.error('[main-page-og] mainPageOgImageUrl failed', { path, err });
		return new URL(MAIN_PAGE_OG_PATHS['/services/'], SITE_URL).toString();
	}
}
