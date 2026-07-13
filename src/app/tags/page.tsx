import Link from 'next/link';
import { PageSection } from '@/components/layout/PageSection';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { MainPageHero } from '@/components/seo/MainPageHero';
import { EntityByline } from '@/components/seo/EntityByline';
import { SiteShell } from '@/components/layout/SiteShell';
import { TagsCloudGrouped } from '@/components/tags/TagsCloudGrouped';
import { getPostsIndex, getTags } from '@/lib/content/posts';
import { buildTagCloudGroups, dedupeTagCloudGroups } from '@/lib/seo/tag-cloud-groups';
import { MAIN_PAGE_HEROES } from '@/lib/seo/main-page-heroes';
import { buildPageMetadata } from '@/lib/metadata';
import { replaceEmDashDeep } from '@/lib/content/sanitize-user-facing-text';
import { BreadcrumbNav } from '@/components/navigation/BreadcrumbNav';
import { SITE_URL } from '@/consts';
import {
	buildBreadcrumbSchema,
	buildFaqSchema,
	buildItemListSchema,
	buildWebPageSchema,
} from '@/utils/structured-data';
import { getTagLabel } from '@/utils/taxonomy-labels';

export const dynamic = 'force-static';

const TAGS_DATE_MODIFIED = '2026-07-13';

const DIRECT_ANSWER =
	'תגיות באתר גיא אבני מקבצות מאמרים לפי מצב צר - זכויות רוכש, ציות, חוזים ועוד. בחרו תגית, קראו מאמר אחד, והמשיכו לקטגוריה רחבה או ליצירת קשר.';

export const metadata = buildPageMetadata({
	title: 'תגיות לנושאים ממוקדים | גיא אבני משרד עורכי דין',
	description:
		'גיא אבני משרד עורכי דין: תגיות לנושאים צרים - זכויות רוכש, ציות, לקוחות ודין ישראלי. מצאו מאמר רלוונטי בלי לדפדף את כל הארכיון.',
	keyword: 'גיא אבני משרד עורכי דין',
	path: '/tags/',
	absoluteTitle: true,
});

const TAGS_FAQ = replaceEmDashDeep([
	{
		question: 'מה ההבדל בין תגית לקטגוריה?',
		answer:
			'קטגוריה היא תחום רחב (נדל״ן, חוזים). תגית מצמצמת למצב ספציפי (זכויות רוכש, פטור מס). התחילו מתגית כשיודעים את המילה המדויקת.',
	},
	{
		question: 'כמה תגיות יש באתר?',
		answer:
			'מאות תגיות בעברית, כל אחת מקשרת למאמרים שעוסקים באותו מושג או מצב. עמוד זה מרכז את כולן לניווט מהיר.',
	},
	{
		question: 'מתי לפנות לעורך דין אחרי קריאה?',
		answer:
			'כשיש סיכון מיידי, מועד קריטי, או שאלה שלא נענית במאמר. התוכן באתר אינו ייעוץ משפטי אישי.',
	},
]);

export default async function TagsIndexPage() {
	const tags = await getTags();
	const { posts } = await getPostsIndex();

	const countByTag = new Map<string, number>();
	for (const post of posts) {
		for (const tag of post.data.tags) {
			countByTag.set(tag, (countByTag.get(tag) ?? 0) + 1);
		}
	}

	const breadcrumbItems = [
		{ name: 'דף הבית', path: '/' },
		{ name: 'תגיות', path: '/tags/' },
	];

	const listItems = tags.map((tag) => ({
		name: getTagLabel(tag),
		url: new URL(`/tags/${tag}/`, SITE_URL).toString(),
	}));

	const jsonLd = [
		buildBreadcrumbSchema(breadcrumbItems),
		buildWebPageSchema({
			'@id': `${SITE_URL}/tags/#webpage`,
			url: `${SITE_URL}/tags/`,
			name: 'תגיות לנושאים ממוקדים | גיא אבני משרד עורכי דין',
			description: DIRECT_ANSWER,
			dateModified: TAGS_DATE_MODIFIED,
		}),
		buildItemListSchema(listItems),
		buildFaqSchema([...TAGS_FAQ]),
	];

	const hero = {
		...MAIN_PAGE_HEROES['/tags/'],
		h1: 'תגיות לנושאים ממוקדים | גיא אבני משרד עורכי דין',
		intro: `${DIRECT_ANSWER}\n\n${MAIN_PAGE_HEROES['/tags/'].intro}`,
	};

	const tagGroups = dedupeTagCloudGroups(
		buildTagCloudGroups(tags, posts, countByTag, getTagLabel),
	);

	return (
		<SiteShell currentPath="/tags/" extraJsonLd={jsonLd}>
			<div className="flex flex-col">
				<BreadcrumbNav items={breadcrumbItems} />
				<MainPageHero hero={hero} index="05" eyebrow="תגיות" />
				<EntityByline lastUpdatedLabel="יולי 2026" />

				<p className="mt-8 max-w-3xl text-pretty text-right leading-relaxed text-muted-foreground">
					תגית צרה מצמצמת רעש: פתחו נושא אחד, השוו ל־{' '}
					<Link className="link-underline" href="/categories/">
						קטגוריה רחבה
					</Link>{' '}
					רק אם צריך הקשר נוסף.
				</p>

				<PageSection className="mt-12">
					<SectionHeader
						index={1}
						eyebrow="תגיות"
						title="נושאים צרים לפי תחום"
						description="תגיות מקובצות לפי נושא רחב. השתמשו בחיפוש למציאה מהירה."
					/>
					<div className="mt-8">
						<TagsCloudGrouped groups={tagGroups} />
					</div>
				</PageSection>

				<PageSection className="mt-12">
					<SectionHeader index={2} eyebrow="שאלות נפוצות" title="שאלות על התגיות" />
					<div className="mt-8 flex max-w-3xl flex-col gap-6">
						{TAGS_FAQ.map(({ question, answer }) => (
							<div key={question} className="border-b border-border pb-6 last:border-b-0">
								<h3 className="font-heading text-lg font-semibold text-foreground">{question}</h3>
								<p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">{answer}</p>
							</div>
						))}
					</div>
				</PageSection>
			</div>
		</SiteShell>
	);
}
