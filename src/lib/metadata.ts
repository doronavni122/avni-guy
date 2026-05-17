import type { Metadata } from 'next';
import type { SiteKeyword } from '@/consts';
import { SITE_TITLE, SITE_URL } from '@/consts';

const FALLBACK_OG_IMAGE = `${SITE_URL}/images/shared/guy-avni-avni-guy-law-firm-lawyer-og-law-fallback-photo-1.jpg`;

export type PageMetaInput = {
	title: string;
	description: string;
	keyword: SiteKeyword;
	path: string;
	type?: 'website' | 'article';
	image?: string;
};

export function buildPageMetadata(input: PageMetaInput): Metadata {
	try {
		const canonical = new URL(input.path, SITE_URL).toString();
		const ogImage = input.image ?? FALLBACK_OG_IMAGE;
		return {
			title: input.title,
			description: input.description,
			keywords: [input.keyword],
			authors: [{ name: 'גיא אבני' }],
			alternates: { canonical },
			openGraph: {
				type: input.type ?? 'website',
				locale: 'he_IL',
				url: canonical,
				title: input.title,
				description: input.description,
				siteName: SITE_TITLE,
				images: [{ url: ogImage }],
			},
			twitter: {
				card: 'summary_large_image',
				title: input.title,
				description: input.description,
				images: [ogImage],
			},
			robots: { index: true, follow: true },
		};
	} catch (err) {
		console.error('[metadata] buildPageMetadata failed', { input, err });
		return { title: input.title, description: input.description };
	}
}
