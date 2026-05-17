export const SITE_TITLE = 'גיא אבני - אתר תוכן ומשפט';
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

export const SITE_KEYWORDS = [
	'גיא אבני',
	'גיא אבני עוד',
	'גיא אבני עורך דין',
	'גיא אבני משרד עורכי דין',
	'אבני גיא',
	'אבני גיא עוד',
] as const;

export type SiteKeyword = (typeof SITE_KEYWORDS)[number];
