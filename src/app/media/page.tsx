import Link from 'next/link';
import { PageSection } from '@/components/layout/PageSection';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { MainPageHero } from '@/components/seo/MainPageHero';
import { EntityByline } from '@/components/seo/EntityByline';
import { AttorneyCredentialBlock } from '@/components/seo/AttorneyCredentialBlock';
import { SiteShell } from '@/components/layout/SiteShell';
import { buildPageMetadata } from '@/lib/metadata';
import { replaceEmDashDeep } from '@/lib/content/sanitize-user-facing-text';
import { BreadcrumbNav } from '@/components/navigation/BreadcrumbNav';
import { SITE_URL } from '@/consts';
import type { MainPageHero as MainPageHeroData } from '@/lib/seo/hero-rules';
import {
	buildBreadcrumbSchema,
	buildFaqSchema,
	buildWebPageSchema,
} from '@/utils/structured-data';

export const dynamic = 'force-static';

const PAGE_PATH = '/media/';
const PAGE_OG_IMAGE = `${SITE_URL}/images/shared/guy-avni-avni-guy-law-firm-lawyer-og-law-fallback-photo-1.jpg`;
const PAGE_DATE_MODIFIED = '2026-07-14';

const HERO: MainPageHeroData = {
	path: PAGE_PATH,
	eyebrow: 'מדיה והופעות',
	h1: 'מדיה והופעות של גיא אבני',
	subhead: 'ריכוז ערוצים בבעלות המשרד והופעות מתועדות - בלי קישורים שלא אומתו.',
	intro:
		'עמוד זה הוא מרכז המדיה של גיא אבני עורך דין: מדריכים בעברית באתר, עדכונים דרך RSS, ומקום להופעות חיצוניות (פודקאסט, כנס, ראיון) רק אחרי שיש כתובת חיה ומאומתת.',
	keyword: 'גיא אבני עורך דין',
};

export const metadata = buildPageMetadata({
	title: 'גיא אבני | מדיה והופעות',
	description:
		'מדיה והופעות של גיא אבני עורך דין: ערוצים בבעלות המשרד, מדריכים בעברית, והופעות מתועדות בלבד. מידע כללי - לא ייעוץ משפטי אישי.',
	keyword: 'גיא אבני עורך דין',
	keywords: ['גיא אבני עורך דין', 'גיא אבני', 'גיא אבני עו״ד'],
	path: PAGE_PATH,
	absoluteTitle: true,
	image: PAGE_OG_IMAGE,
});

/** Owned surfaces only — never invent earned-press URLs. */
const OWNED_CHANNELS = [
	{
		title: 'בלוג מקצועי',
		text: 'מדריכים בעברית על נדל״ן, מיסוי מקרקעין, חוזים וליטיגציה - נקודת הכניסה העיקרית לתוכן.',
		href: '/blog/',
		cta: 'למאמרים',
	},
	{
		title: 'מדיניות עריכה',
		text: 'איך נכתבים ונבדקים המאמרים, שיוך ללשכת עורכי הדין, והבהרה שהתוכן אינו ייעוץ אישי.',
		href: '/editorial-policy/',
		cta: 'למדיניות',
	},
	{
		title: 'עמוד האודות',
		text: 'עמוד היישות המקצועי של גיא אבני עורך דין - תחומי ליווי ודרך עבודה.',
		href: '/about/',
		cta: 'לאודות',
	},
] as const;

/**
 * Documented external appearances. Append only when listing_url is live and operator-verified.
 * Empty by design until ops logs real placements (earned-offsite / podcast scopes).
 */
const DOCUMENTED_APPEARANCES: ReadonlyArray<{
	venue: string;
	title: string;
	href: string;
	dateLabel: string;
	summary: string;
}> = [];

const MEDIA_FAQ = replaceEmDashDeep([
	{
		question: 'מה מופיע בעמוד המדיה?',
		answer:
			'ערוצים בבעלות המשרד (בלוג, מדיניות עריכה, אודות) והופעות חיצוניות מתועדות בלבד. אין כאן קישורים לכתבות או פודקאסטים שלא אומתו בכתובת חיה.',
	},
	{
		question: 'איך מתעדכנות הופעות חדשות?',
		answer:
			'כשמתפרסמת הופעה מאומתת (ראיון, פודקאסט, כנס), היא מתווספת לרשימת ההופעות המתועדות עם תאריך, מקום וקישור. עד אז הרשימה עשויה להיות ריקה בכוונה.',
	},
	{
		question: 'איך פונים לראיון או להופעת אורח?',
		answer:
			'דרך עמוד יצירת הקשר. מציינים פורמט, נושא רצוי ותאריך משוער. התוכן יישאר בתחומי העיסוק: נדל״ן, מיסוי מקרקעין, חוזים וליטיגציה אזרחית.',
	},
	{
		question: 'האם התוכן כאן הוא ייעוץ משפטי?',
		answer:
			'לא. העמוד והקישורים ממנו נועדו להפניה ולהכנה בלבד. ייעוץ משפטי אישי ניתן רק אחרי בירור עובדות בפגישת מיקוד.',
	},
]);

export default function MediaAppearancesPage() {
	const breadcrumbItems = [
		{ name: 'דף הבית', path: '/' },
		{ name: 'מדיה והופעות', path: PAGE_PATH },
	];

	const jsonLd = [
		buildBreadcrumbSchema(breadcrumbItems),
		buildWebPageSchema({
			'@id': `${SITE_URL}${PAGE_PATH}#webpage`,
			url: `${SITE_URL}${PAGE_PATH}`,
			name: 'גיא אבני | מדיה והופעות',
			description:
				'מרכז מדיה והופעות של גיא אבני עורך דין: ערוצים בבעלות המשרד והופעות מתועדות בלבד.',
			dateModified: PAGE_DATE_MODIFIED,
			'@type': 'WebPage',
		}),
		buildFaqSchema([...MEDIA_FAQ]),
	];

	return (
		<SiteShell currentPath={PAGE_PATH} extraJsonLd={jsonLd}>
			<div className="flex flex-col">
				<BreadcrumbNav items={breadcrumbItems} />
				<MainPageHero hero={HERO} index="10" eyebrow="מדיה והופעות" />
				<EntityByline lastUpdatedLabel="יולי 2026" />
				<AttorneyCredentialBlock />

				<PageSection className="mt-16">
					<SectionHeader index={1} eyebrow="מטרה" title="למה יש עמוד מדיה נפרד" />
					<div className="mt-6 flex max-w-3xl flex-col gap-4 text-pretty leading-relaxed text-muted-foreground">
						<p>
							חיפושים על{' '}
							<Link className="link-underline" href="/about/">
								גיא אבני עורך דין
							</Link>{' '}
							צריכים מקום ברור להופעות ומדיה - בלי לערבב את זה עם עמוד השירותים או עם רשימת מאמרים ארוכה.
							כאן מרוכזים ערוצים בבעלות המשרד, ורשימת הופעות חיצוניות רק כשיש הוכחה חיה.
						</p>
					</div>
				</PageSection>

				<PageSection>
					<SectionHeader index={2} eyebrow="בבעלות המשרד" title="ערוצי מדיה מאומתים" />
					<div className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-3">
						{OWNED_CHANNELS.map(({ title, text, href, cta }) => (
							<div key={title} className="flex flex-col gap-4 bg-background p-8">
								<h3 className="font-heading text-lg font-semibold text-foreground">{title}</h3>
								<p className="text-pretty text-sm leading-relaxed text-muted-foreground">{text}</p>
								<Link className="link-underline text-sm font-medium text-foreground" href={href}>
									{cta}
								</Link>
							</div>
						))}
					</div>
				</PageSection>

				<PageSection>
					<SectionHeader index={3} eyebrow="חיצוני" title="הופעות מתועדות" />
					<div className="mt-6 flex max-w-3xl flex-col gap-4 text-pretty leading-relaxed text-muted-foreground">
						{DOCUMENTED_APPEARANCES.length === 0 ? (
							<p>
								כרגע אין הופעות חיצוניות מתועדות ברשימה זו. כשיתפרסם ראיון, פודקאסט או כנס עם קישור חי
								ומאומת - הוא יופיע כאן עם תאריך, מקום וסיכום קצר. לא מפרסמים כאן כתובות מדומיינות.
							</p>
						) : (
							<ul className="flex list-disc flex-col gap-6 pr-6">
								{DOCUMENTED_APPEARANCES.map(({ venue, title, href, dateLabel, summary }) => (
									<li key={href} className="text-pretty leading-relaxed">
										<span className="font-mono text-xs text-muted-foreground">{dateLabel}</span>
										<span className="mt-1 block font-heading font-semibold text-foreground">
											{venue}: {title}
										</span>
										<span className="mt-1 block">{summary}</span>
										<Link className="link-underline mt-2 inline-block" href={href}>
											למקור
										</Link>
									</li>
								))}
							</ul>
						)}
					</div>
				</PageSection>

				<PageSection>
					<SectionHeader index={4} eyebrow="פנייה" title="בקשת ראיון או הופעת אורח" />
					<div className="mt-6 flex max-w-3xl flex-col gap-4 text-pretty leading-relaxed text-muted-foreground">
						<p>
							לתיאום ראיון, פודקאסט או הרצאה בתחומי העיסוק - פנו דרך{' '}
							<Link className="link-underline" href="/contact/">
								יצירת קשר
							</Link>
							. מומלץ לציין פורמט, קהל יעד ומועד משוער.
						</p>
						<p>
							לפירוט שירותים:{' '}
							<Link className="link-underline" href="/services/">
								עמוד השירותים
							</Link>
							.
						</p>
					</div>
				</PageSection>

				<PageSection>
					<SectionHeader index={5} eyebrow="שאלות נפוצות" title="שאלות על מדיה והופעות" />
					<div className="mt-8 flex max-w-3xl flex-col gap-6">
						{MEDIA_FAQ.map(({ question, answer }) => (
							<div key={question} className="border-b border-border pb-6 last:border-b-0">
								<h3 className="font-heading text-lg font-semibold text-foreground">{question}</h3>
								<p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">{answer}</p>
							</div>
						))}
					</div>
				</PageSection>

				<PageSection>
					<div className="grid gap-8 lg:grid-cols-12">
						<div className="lg:col-span-4">
							<span className="font-mono text-xs text-muted-foreground">06 / המשך</span>
						</div>
						<div className="flex flex-col gap-4 text-right lg:col-span-8">
							<h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">המשך קריאה</h2>
							<p className="max-w-3xl text-pretty leading-relaxed text-muted-foreground">
								<Link className="link-underline" href="/about/">
									אודות
								</Link>
								,{' '}
								<Link className="link-underline" href="/blog/">
									בלוג
								</Link>
								,{' '}
								<Link className="link-underline" href="/editorial-policy/">
									מדיניות עריכה
								</Link>
								,{' '}
								<Link className="link-underline" href="/contact/">
									יצירת קשר
								</Link>
								.
							</p>
						</div>
					</div>
				</PageSection>
			</div>
		</SiteShell>
	);
}
