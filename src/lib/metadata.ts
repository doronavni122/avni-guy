import type { Metadata } from 'next';
import type { SiteKeyword } from '@/consts';
import { SITE_TITLE, SITE_URL } from '@/consts';
import { replaceEmDashDeep, replaceEmDashInText } from '@/lib/content/sanitize-user-facing-text';

const FALLBACK_OG_IMAGE = `${SITE_URL}/images/shared/guy-avni-avni-guy-law-firm-lawyer-og-law-fallback-photo-1.jpg`;

export type PageMetaInput = {
	title: string;
	description: string;
	keyword: SiteKeyword;
	/** When set, replaces single `keyword` in meta keywords. */
	keywords?: SiteKeyword[];
	path: string;
	type?: 'website' | 'article';
	image?: string;
	/** Skip root layout title.template suffix (hub pages with self-contained titles). */
	absoluteTitle?: boolean;
	/** Override robots. Default index,follow. */
	robots?: { index: boolean; follow: boolean };
	/** When set, used as canonical instead of `path` (e.g. pagers → /blog/). */
	canonicalPath?: string;
};

export function buildPageMetadata(input: PageMetaInput): Metadata {
	try {
		const sanitized = replaceEmDashDeep({
			...input,
			title: replaceEmDashInText(input.title),
			description: replaceEmDashInText(input.description),
			keywords: input.keywords?.map((keyword) => replaceEmDashInText(keyword)),
			keyword: replaceEmDashInText(input.keyword),
		});
		const canonicalPath = sanitized.canonicalPath ?? sanitized.path;
		const canonical = new URL(canonicalPath, SITE_URL).toString();
		const ogUrl = new URL(sanitized.path, SITE_URL).toString();
		const ogImage = sanitized.image ?? FALLBACK_OG_IMAGE;
		return {
			title: sanitized.absoluteTitle ? { absolute: sanitized.title } : sanitized.title,
			description: sanitized.description,
			keywords: sanitized.keywords ?? [sanitized.keyword],
			authors: [{ name: 'גיא אבני' }],
			alternates: { canonical },
			openGraph: {
				type: sanitized.type ?? 'website',
				locale: 'he_IL',
				url: ogUrl,
				title: sanitized.title,
				description: sanitized.description,
				siteName: SITE_TITLE,
				images: [{ url: ogImage }],
			},
			twitter: {
				card: 'summary_large_image',
				title: sanitized.title,
				description: sanitized.description,
				images: [ogImage],
			},
			robots: sanitized.robots ?? { index: true, follow: true },
		};
	} catch (err) {
		console.error('[metadata] buildPageMetadata failed', { input, err });
		return { title: replaceEmDashInText(input.title), description: replaceEmDashInText(input.description) };
	}
}
