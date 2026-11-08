import { buildPageMetadata } from '@/lib/metadata';
import { mainPageOgImageUrl } from '@/lib/seo/main-page-og';

export const BLOG_OG_IMAGE = mainPageOgImageUrl('/blog/');

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
