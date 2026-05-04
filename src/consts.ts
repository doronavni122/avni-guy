export const SITE_TITLE = 'גיא אבני - אתר תוכן ומשפט';
export const SITE_DESCRIPTION =
	'אתר תוכן מקצועי בעברית של גיא אבני עם מאמרים, שירותים ותובנות מעשיות.';

export const SITE_URL = 'https://avni-guy.vercel.app';

export const SITE_KEYWORDS = [
	'גיא אבני',
	'גיא אבני עוד',
	'גיא אבני עורך דין',
	'גיא אבני משרד עורכי דין',
	'אבני גיא',
	'אבני גיא עוד',
] as const;

export type SiteKeyword = (typeof SITE_KEYWORDS)[number];
