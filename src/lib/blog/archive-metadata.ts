import { SITE_URL } from '@/consts';
import { buildPageMetadata } from '@/lib/metadata';

export const BLOG_OG_IMAGE = `${SITE_URL}/images/shared/guy-avni-avni-guy-law-firm-lawyer-og-law-fallback-photo-1.jpg`;

export const BLOG_ARCHIVE_TITLE = 'מאמרים משפטיים מעשיים | גיא אבני עו״ד';

export const BLOG_ARCHIVE_DESCRIPTION =
	'גיא אבני עו״ד: מאגר מאמרים משפטיים בעברית על חוזים, נדל״ן, לקוחות ותהליכים. קראו לפני שיחה, סמנו מאמרים והגיעו מוכנים לייעוץ.';

export const blogIndexMetadata = buildPageMetadata({
	title: BLOG_ARCHIVE_TITLE,
	description: BLOG_ARCHIVE_DESCRIPTION,
	keyword: 'גיא אבני עו״ד',
	path: '/blog/',
	absoluteTitle: true,
	image: BLOG_OG_IMAGE,
});
