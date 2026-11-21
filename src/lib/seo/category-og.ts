import { SITE_URL } from '@/consts';

/** Unique OG photo per audited category hub. Do not reuse across pages. */
const CATEGORY_OG = {
	'real-estate': {
		path: '/images/og/og-category-real-estate-keyhole-macro.jpg',
		sourceUrl: 'https://commons.wikimedia.org/wiki/File:Key_hole.jpg',
		license: 'CC BY-SA 4.0',
	},
	tax: {
		path: '/images/og/og-category-tax-calculator-macro.jpg',
		sourceUrl: 'https://commons.wikimedia.org/wiki/File:Aurora_electronic_calculator_DT210_05.jpg',
		license: 'CC BY-SA 3.0',
	},
	litigation: {
		path: '/images/og/og-category-litigation-gavel-macro.jpg',
		sourceUrl:
			'https://commons.wikimedia.org/wiki/File:Minneapolis_City_Council_Chambers_gavel_close_up.jpg',
		license: 'CC0',
	},
	contracts: {
		path: '/images/og/og-category-contracts-pen-macro.jpg',
		sourceUrl: 'https://commons.wikimedia.org/wiki/File:Macro_Biro_writing2.jpg',
		license: 'CC BY-SA 2.5',
	},
} as const;

export type CategoryOgSlug = keyof typeof CATEGORY_OG;

export function categoryOgImageUrl(category: string): string | undefined {
	try {
		if (!Object.prototype.hasOwnProperty.call(CATEGORY_OG, category)) {
			return undefined;
		}
		const entry = CATEGORY_OG[category as CategoryOgSlug];
		return new URL(entry.path, SITE_URL).toString();
	} catch (err) {
		console.error('[category-og] categoryOgImageUrl failed', { category, err });
		return undefined;
	}
}
