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

const PAGE_PATH = '/editorial-policy/';
const PAGE_OG_IMAGE = `${SITE_URL}/images/shared/guy-avni-avni-guy-law-firm-lawyer-og-law-fallback-photo-1.jpg`;
const PAGE_DATE_MODIFIED = '2026-07-14';

const HERO: MainPageHeroData = {
	path: PAGE_PATH,
	eyebrow: 'שקיפות ומקצועיות',
	h1: 'מדיניות עריכה ומתודולוגיה',
	subhead: 'איך נכתבים המאמרים באתר, מי בודק אותם, ומה כן ולא נחשב ייעוץ משפטי.',
	intro:
		'עמוד זה מסביר את תהליך הכתיבה והסקירה של התוכן ב־avniguy.co.il: מקורות, בדיקת עובדות, שיוך מקצועי ללשכת עורכי הדין, והבהרה שהתוכן אינו תחליף לייעוץ אישי.',
	keyword: 'גיא אבני עורך דין',
};

export const metadata = buildPageMetadata({
	title: 'גיא אבני | מדיניות עריכה ומתודולוגיה',
	description:
		'מדיניות עריכה של גיא אבני עורך דין: מתודולוגיית כתיבה, תהליך סקירה, שיוך ללשכת עורכי הדין, והבהרה שהתוכן באתר אינו ייעוץ משפטי אישי.',
	keyword: 'גיא אבני עורך דין',
	keywords: ['גיא אבני עורך דין', 'גיא אבני', 'גיא אבני עו״ד'],
	path: PAGE_PATH,
	absoluteTitle: true,
	image: PAGE_OG_IMAGE,
});

const REVIEW_STEPS = [
	{
		title: 'בחירת נושא ומסגרת',
		text: 'מזהים שאלה מעשית של קוראים (מיסוי, חוזים, נדל״ן או תהליך), קובעים מה בתוך היקף המאמר ומה נשאר לפגישת מיקוד.',
	},
	{
		title: 'איסוף מקורות ראשוניים',
		text: 'מתבססים על חוק, תקנות, הוראות רשות המסים או בנק ישראל ופרסומים רשמיים כשניתן. מקורות משניים משמשים להסבר בלבד ואינם מחליפים מסמך מקור.',
	},
	{
		title: 'טיוטה בעברית ברורה',
		text: 'כותבים בשפה נגישה, עם כותרות היררכיות, דוגמאות מעשיות והבחנה בין כלל לבין מקרה פרטי. נמנעים מהבטחות תוצאה.',
	},
	{
		title: 'סקירה מקצועית לפני פרסום',
		text: 'גיא אבני, עו״ד, בודק דיוק משפטי, עדכניות, והתאמה למדיניות האתר. עדכונים מתועדים בתאריך בעמוד או במטא־דאטה של המאמר.',
	},
	{
		title: 'פרסום ועדכון',
		text: 'אחרי פרסום, מאמרים מתעדכנים כשמשתנה חקיקה או הנחיה רלוונטית, או כשמזוהה פער שמצריך הבהרה.',
	},
] as const;

const PRINCIPLES = [
	[
		'01',
		'שקיפות',
		'מציינים מה ידוע ומה תלוי בעובדות התיק. אין הצגת מידע כללי כהבטחת תוצאה בתיק ספציפי.',
	],
	[
		'02',
		'עדכניות',
		'בודקים תאריכי חקיקה והנחיות לפני פרסום ועדכון. כשהחוק משתנה, מעדיפים תיקון ממוקד על פני מאמר ישן מטעה.',
	],
	[
		'03',
		'הפרדה מייעוץ',
		'התוכן נועד להכנה והבנה. ייעוץ משפטי אישי ניתן רק אחרי בירור עובדות בפגישה ממוקדת.',
	],
] as const;

const EDITORIAL_FAQ = replaceEmDashDeep([
	{
		question: 'מי כותב וסוקר את המאמרים באתר?',
		answer:
			'התוכן של גיא אבני משרד עורכי דין נכתב תחת פיקוח מקצועי של גיא אבני, עורך דין בעל רישיון לשכת עורכי הדין בישראל. סקירה מקצועית מתבצעת לפני פרסום ובמידת הצורך אחרי שינויי חקיקה.',
	},
	{
		question: 'האם המאמרים באתר הם ייעוץ משפטי?',
		answer:
			'לא. המאמרים והמדריכים הם מידע כללי בעברית להכנה לשיחה. הם אינם מחליפים ייעוץ משפטי אישי, חוות דעת כתובה או ייצוג בהליך. לכל מקרה נדרש בירור עובדתי נפרד.',
	},
	{
		question: 'איך מתעדכנים מאמרים ישנים?',
		answer:
			'כאשר משתנה חוק או הנחיה רלוונטית, או כשמזוהה אי־דיוק, המאמר מתעדכן ותאריך העדכון משקף את השינוי. מומלץ לבדוק את תאריך העדכון לפני הסתמכות על פרט ספציפי.',
	},
	{
		question: 'איפה אפשר לקרוא על הרקע המקצועי?',
		answer:
			'בעמוד אודות מופיע עמוד היישות המקצועי של גיא אבני עורך דין, כולל תחומי ליווי ודרך עבודה. מכאן אפשר לעבור לבלוג או ליצירת קשר לתיאום שיחת מיקוד.',
	},
]);

export default function EditorialPolicyPage() {
	const breadcrumbItems = [
		{ name: 'דף הבית', path: '/' },
		{ name: 'מדיניות עריכה', path: PAGE_PATH },
	];

	const jsonLd = [
		buildBreadcrumbSchema(breadcrumbItems),
		buildWebPageSchema({
			'@id': `${SITE_URL}${PAGE_PATH}#webpage`,
			url: `${SITE_URL}${PAGE_PATH}`,
			name: 'גיא אבני | מדיניות עריכה ומתודולוגיה',
			description:
				'מתודולוגיית כתיבה וסקירה, שיוך ללשכת עורכי הדין, והבהרה שהתוכן אינו ייעוץ משפטי אישי.',
			dateModified: PAGE_DATE_MODIFIED,
			'@type': 'WebPage',
		}),
		buildFaqSchema([...EDITORIAL_FAQ]),
	];

	return (
		<SiteShell currentPath={PAGE_PATH} extraJsonLd={jsonLd}>
			<div className="flex flex-col">
				<BreadcrumbNav items={breadcrumbItems} />
				<MainPageHero hero={HERO} index="08" eyebrow="מדיניות עריכה" />
				<EntityByline lastUpdatedLabel="יולי 2026" />
				<AttorneyCredentialBlock />

				<PageSection className="mt-16">
					<SectionHeader index={1} eyebrow="מטרה" title="למה יש עמוד מדיניות עריכה" />
					<div className="mt-6 flex max-w-3xl flex-col gap-4 text-pretty leading-relaxed text-muted-foreground">
						<p>
							בנושאי YMYL (בריאות, כסף ומשפט) הקוראים צריכים להבין מי עומד מאחורי הטקסט ואיך הוא נבדק. עמוד זה
							מתאר את המתודולוגיה של{' '}
							<Link className="link-underline" href="/about/">
								גיא אבני עורך דין
							</Link>{' '}
							כפי שהיא מיושמת ב־
							<Link className="link-underline" href="/blog/">
								מאמרי הבלוג
							</Link>
							.
						</p>
					</div>
				</PageSection>

				<PageSection>
					<SectionHeader index={2} eyebrow="תהליך" title="תהליך כתיבה וסקירה" />
					<ol className="mt-8 flex max-w-3xl list-decimal flex-col gap-6 pr-6 text-muted-foreground">
						{REVIEW_STEPS.map(({ title, text }) => (
							<li key={title} className="text-pretty leading-relaxed">
								<span className="font-heading font-semibold text-foreground">{title}. </span>
								{text}
							</li>
						))}
					</ol>
				</PageSection>

				<PageSection>
					<SectionHeader index={3} eyebrow="שיוך מקצועי" title="לשכת עורכי הדין והאחריות על התוכן" />
					<div className="mt-6 flex max-w-3xl flex-col gap-4 text-pretty leading-relaxed text-muted-foreground">
						<p>
							גיא אבני הוא עורך דין ישראלי בעל רישיון לשכת עורכי הדין. התוכן באתר מתפרסם תחת אחריותו המקצועית של
							המשרד, עם דגש על דיוק, שקיפות והימנעות מהבטחות בלתי מבוססות.
						</p>
						<p>
							פירוט תחומי הליווי ודרך העבודה מופיע ב־
							<Link className="link-underline" href="/about/">
								עמוד האודות
							</Link>{' '}
							וב־
							<Link className="link-underline" href="/services/">
								עמוד השירותים
							</Link>
							.
						</p>
					</div>
				</PageSection>

				<PageSection>
					<SectionHeader index={4} eyebrow="עקרונות" title="עקרונות עריכה" />
					<div className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-3">
						{PRINCIPLES.map(([num, title, text]) => (
							<div key={title} className="flex flex-col gap-4 bg-background p-8">
								<span className="font-mono text-xs text-muted-foreground">{num}</span>
								<h3 className="font-heading text-lg font-semibold text-foreground">{title}</h3>
								<p className="text-pretty text-sm leading-relaxed text-muted-foreground">{text}</p>
							</div>
						))}
					</div>
				</PageSection>

				<PageSection>
					<SectionHeader index={5} eyebrow="הבהרה" title="הבהרה משפטית - התוכן אינו ייעוץ אישי" />
					<div className="mt-6 flex max-w-3xl flex-col gap-4 text-pretty leading-relaxed text-muted-foreground">
						<p>
							המאמרים, המדריכים והעמודים באתר זה נועדו למסירת מידע כללי ולהכנה לשיחה מקצועית. הם{' '}
							<strong className="font-semibold text-foreground">אינם מהווים ייעוץ משפטי</strong>, חוות דעת, או
							הצעה לייצוג. כל מקרה תלוי בעובדותיו, במסמכים ובמועדים הרלוונטיים.
						</p>
						<p>
							אין להסתמך על התוכן כתחליף לייעוץ מותאם. לתיאום שיחת מיקוד:{' '}
							<Link className="link-underline" href="/contact/">
								יצירת קשר
							</Link>
							.
						</p>
					</div>
				</PageSection>

				<PageSection>
					<SectionHeader index={6} eyebrow="שאלות נפוצות" title="שאלות על מדיניות העריכה" />
					<div className="mt-8 flex max-w-3xl flex-col gap-6">
						{EDITORIAL_FAQ.map(({ question, answer }) => (
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
							<span className="font-mono text-xs text-muted-foreground">07 / המשך</span>
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
								<Link className="link-underline" href="/categories/">
									קטגוריות
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
