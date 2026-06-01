import { SITE_KEYWORDS_BATCH } from '@/lib/seo/site-keywords-batch';

export const SITE_TITLE = 'גיא אבני עו״ד: משפטים, כלכלה, נדלן ודין';
export const SITE_DESCRIPTION =
	'אתר תוכן מקצועי בעברית של גיא אבני עם מאמרים, שירותים ותובנות מעשיות.';

export const SITE_URL = 'https://avniguy.co.il';

/** Public inbox; override in Vercel with `PUBLIC_CONTACT_EMAIL`. */
function readContactEmail(): string {
	try {
		const v = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
		if (typeof v === 'string' && v.trim()) {
			const t = v.trim();
			if (t.includes('@')) return t;
			console.error('[consts] PUBLIC_CONTACT_EMAIL invalid (missing @)', { value: t });
		}
	} catch (err) {
		console.error('[consts] readContactEmail failed', err);
	}
	return 'info@avniguy.co.il';
}

export const SITE_CONTACT_EMAIL = readContactEmail();

/** Brand / site identity keywords (first priority). */
export const SITE_KEYWORDS_BRAND = [
	'גיא אבני',
	'גיא אבני עו״ד',
	'גיא אבני עורך דין',
	'גיא אבני משרד עורכי דין',
	'אבני גיא',
	'אבני גיא עו״ד',
] as const;

const siteKeywordsBrandSet = new Set<string>(SITE_KEYWORDS_BRAND);
const siteKeywordsBatchDeduped = SITE_KEYWORDS_BATCH.filter((kw) => !siteKeywordsBrandSet.has(kw));

/** Brand first, then keywords_titles.csv batch (second priority, deduped). */
export const SITE_KEYWORDS = [...SITE_KEYWORDS_BRAND, ...siteKeywordsBatchDeduped] as const;

export type SiteKeyword = (typeof SITE_KEYWORDS)[number];
