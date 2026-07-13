import Link from 'next/link';
import { PageSection } from '@/components/layout/PageSection';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { MainPageHero } from '@/components/seo/MainPageHero';
import { EntityByline } from '@/components/seo/EntityByline';
import { SiteShell } from '@/components/layout/SiteShell';
import { MAIN_PAGE_HEROES } from '@/lib/seo/main-page-heroes';
import { buildPageMetadata } from '@/lib/metadata';
import { replaceEmDashDeep } from '@/lib/content/sanitize-user-facing-text';
import { BreadcrumbNav } from '@/components/navigation/BreadcrumbNav';
import { SITE_URL } from '@/consts';
import {
	buildBreadcrumbSchema,
	buildFaqSchema,
	buildHowToSchema,
	buildItemListSchema,
	buildWebPageSchema,
} from '@/utils/structured-data';

export const dynamic = 'force-static';

const SERVICES_OG_IMAGE = `${SITE_URL}/images/shared/guy-avni-avni-guy-law-firm-lawyer-og-law-fallback-photo-1.jpg`;
const SERVICES_DATE_MODIFIED = '2026-07-13';

export const metadata = buildPageMetadata({
	title: 'גיא אבני | שירותים - ייעוץ, ליווי ותכנון משפטי',
	description:
		'גיא אבני משרד עורכי דין: פגישת מיקוד, תכנון, ניסוח וליווי מסמכים, תקשורת מול גורמים חיצוניים ומעקב שמונע הפתעות. צעדים ברורים בכל שלב.',
	keyword: 'גיא אבני משרד עורכי דין',
	keywords: ['גיא אבני משרד עורכי דין', 'גיא אבני עורך דין', 'גיא אבני עו״ד', 'גיא אבני'],
	path: '/services/',
	absoluteTitle: true,
	image: SERVICES_OG_IMAGE,
});

const DIRECT_ANSWER =
	'גיא אבני משרד עורכי דין מציע ייעוץ, ליווי מסמכים, תקשורת מול גורמים חיצוניים ומעקב - מתחילים בפגישת מיקוד, ממשיכים בתוכנית מותאמת סיכון ותקציב.';

const SERVICES = [
	{
		num: '01',
		title: 'ייעוץ ואסטרטגיה',
		text: 'פגישת מיקוד, מיפוי מצב וזיהוי הזדמנויות: מה דחוף, מה אפשר לדחות, ואיזו תוכנית פעולה מתאימה לסיכון ולתקציב.',
	},
	{
		num: '02',
		title: 'ליווי מסמכים',
		text: 'ניסוח, בדיקה וארגון חומרים לפני חתימה או מסירה: סימון סעיפים קריטיים, סיכום סיכונים וגרסה מוכנה לדיון.',
	},
	{
		num: '03',
		title: 'תקשורת מקצועית',
		text: 'ניהול ממשקים מול לקוחות, ספקים או גורמים חיצוניים: סיכומים קצרים, שפה אחידה ותיעוד התחייבויות.',
	},
	{
		num: '04',
		title: 'מעקב ובקרה',
		text: 'בקרות תקופתיות, מדדים ברורים והתאמות כשהמצב משתנה: פחות הפתעות ויותר שליטה לאורך ההליך.',
	},
] as const;

const SERVICE_JOURNEY_STEPS = [
	{ name: 'פגישת מיקוד', text: 'שאלות ממוקדות, מיון דחיפות והבנת המצב.' },
	{ name: 'תכנון', text: 'מפת סיכונים, הזדמנויות וצעדים מומלצים.' },
	{ name: 'ניסוח וליווי', text: 'הכנת מסמכים, מו״מ ותקשורת מול גורמים חיצוניים.' },
	{ name: 'מעקב', text: 'בקרה שוטפת ועדכון כשמשהו משתנה בשטח.' },
] as const;

const PRACTICE_AREAS = [
	{ title: 'נדל״ן ומיסוי מקרקעין', href: '/categories/tax/' },
	{ title: 'חוזים וסכסוכים', href: '/categories/contracts/' },
	{ title: 'ליטיגציה אזרחית', href: '/categories/litigation/' },
	{ title: 'ליווי עסקי', href: '/categories/business/' },
] as const;

const SERVICES_FAQ = replaceEmDashDeep([
	{
		question: 'מה כוללת פגישת מיקוד?',
		answer:
			'פגישת מיקוד כוללת הבנת העובדות, מיון דחיפות, שאלות ממוקדות ותמונת צעדים ראשונית. אין חובה להביא תיק מושלם; כן כדאי מסמכים מרכזיים ושאלות כתובות.',
	},
	{
		question: 'באילו תחומים המשרד מלווה?',
		answer:
			'נדל״ן ומיסוי מקרקעין, חוזים, ליטיגציה אזרחית וליווי עסקי. פירוט נוסף בעמוד אודות, בקטגוריות הבלוג ובמאמרים הרלוונטיים לנושא שלכם.',
	},
	{
		question: 'איך נראה ליווי מסמכים?',
		answer:
			'בדיקה או ניסוח לפני חתימה, סימון סעיפים קריטיים, סיכום סיכונים בפשטות, וגרסה מוכנה לדיון או למסירה. המטרה: להיכנס לעסקה עם תמונה ברורה.',
	},
	{
		question: 'האם יש הבטחת תוצאה?',
		answer:
			'לא. השירות מתאר צעדים, אחריות ותקשורת - לא תוצאה ספציפית. כל מקרה נבחן לפי עובדות, סיכון ותקציב.',
	},
	{
		question: 'איך מתחילים?',
		answer:
			'מומלץ לקרוא מאמר או עמוד שירות רלוונטי, ואז ליצור קשר דרך עמוד יצירת הקשר או בדוא״ל info@avniguy.co.il.',
	},
	{
		question: 'מה ההבדל בין ייעוץ חד-פעמי לליווי שוטף?',
		answer:
			'ייעוץ חד-פעמי מתמקד בשאלה או מסמך אחד. ליווי שוטף כולל מעקב, עדכונים כשמשהו משתנה, ותיאום מול גורמים חיצוניים לאורך זמן.',
	},
]);

export default function ServicesPage() {
	const breadcrumbItems = [
		{ name: 'דף הבית', path: '/' },
		{ name: 'שירותים', path: '/services/' },
	];

	const itemListEntries = SERVICES.map((service) => ({
		name: service.title,
		url: `${SITE_URL}/services/#${encodeURIComponent(service.title)}`,
	}));

	const jsonLd = [
		buildBreadcrumbSchema(breadcrumbItems),
		buildWebPageSchema({
			'@id': `${SITE_URL}/services/#webpage`,
			url: `${SITE_URL}/services/`,
			name: 'גיא אבני | שירותים - ייעוץ, ליווי ותכנון משפטי',
			description: DIRECT_ANSWER,
			dateModified: SERVICES_DATE_MODIFIED,
		}),
		buildItemListSchema(itemListEntries),
		buildFaqSchema([...SERVICES_FAQ]),
		buildHowToSchema({
			name: 'איך עובד ליווי משפטי עם גיא אבני',
			description: 'מסלול מיקוד, תכנון, ליווי ומעקב.',
			steps: [...SERVICE_JOURNEY_STEPS],
		}),
	];

	return (
		<SiteShell currentPath="/services/" extraJsonLd={jsonLd}>
			<div className="flex flex-col">
				<BreadcrumbNav items={breadcrumbItems} />
				<MainPageHero hero={MAIN_PAGE_HEROES['/services/']} index="02" eyebrow="שירותים" />
				<p className="mt-6 max-w-3xl text-pretty text-right text-base leading-relaxed text-foreground">
					{DIRECT_ANSWER}
				</p>
				<EntityByline lastUpdatedLabel="יולי 2026" />

				<PageSection className="mt-16">
					<SectionHeader index={1} eyebrow="שירותים" title="מה אנחנו מציעים" />
					<div className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-2">
						{SERVICES.map(({ num, title, text }) => (
							<article key={title} id={title} className="group flex flex-col gap-4 bg-background p-8 transition-colors hover:bg-card">
								<div className="flex items-baseline justify-between">
									<span className="font-mono text-xs text-muted-foreground">{num}</span>
									<span className="h-px w-8 bg-border transition-colors group-hover:bg-primary" aria-hidden="true" />
								</div>
								<h2 className="font-heading text-lg font-semibold text-foreground">{title}</h2>
								<p className="text-pretty text-sm leading-relaxed text-muted-foreground">{text}</p>
							</article>
						))}
					</div>
				</PageSection>

				<PageSection>
					<SectionHeader index={2} eyebrow="תחומים" title="תחומי ליווי" />
					<ul className="mt-6 flex max-w-3xl flex-wrap justify-end gap-x-4 gap-y-2 text-sm">
						{PRACTICE_AREAS.map(({ title, href }) => (
							<li key={title}>
								<Link className="link-underline" href={href}>
									{title}
								</Link>
							</li>
						))}
					</ul>
				</PageSection>

				<PageSection>
					<SectionHeader index={3} eyebrow="שאלות נפוצות" title="שאלות על השירותים" />
					<div className="mt-8 flex max-w-3xl flex-col gap-6">
						{SERVICES_FAQ.map(({ question, answer }) => (
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
							<span className="font-mono text-xs text-muted-foreground">04 / המשך</span>
						</div>
						<div className="flex flex-col gap-4 text-right lg:col-span-8">
							<h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">מה כולל השירות</h2>
							<p className="max-w-3xl text-pretty leading-relaxed text-muted-foreground">
								לפני פנייה מומלץ לקרוא את{' '}
								<Link className="link-underline" href="/about/">
									עמוד אודות
								</Link>{' '}
								או את{' '}
								<Link className="link-underline" href="/blog/find-winning-lawyer-israel-bar-members/">
									מדריך בחירת עורך דין
								</Link>
								. לנושאי מיסוי ונדל״ן:{' '}
								<Link className="link-underline" href="/categories/tax/">
									קטגוריית מיסוי
								</Link>
								.
							</p>
							<h3 className="mt-2 font-heading text-xl font-semibold text-foreground">תוצאה רצויה</h3>
							<p className="max-w-3xl text-pretty leading-relaxed text-muted-foreground">
								התהליך שם דגש על בהירות, התנהלות רגועה ופעולות מעשיות. אין הבטחות על תוצאה ספציפית; יש תיאור ברור של
								צעדים, אחריות ותקשורת בין שלב לשלב.
							</p>
						</div>
					</div>
				</PageSection>
			</div>
		</SiteShell>
	);
}
