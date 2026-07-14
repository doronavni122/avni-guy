import Link from 'next/link';
import { PageSection } from '@/components/layout/PageSection';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { MainPageHero } from '@/components/seo/MainPageHero';
import { AttorneyCredentialBlock } from '@/components/seo/AttorneyCredentialBlock';
import { SiteShell } from '@/components/layout/SiteShell';
import { MAIN_PAGE_HEROES } from '@/lib/seo/main-page-heroes';
import { attachSpeakable, SPEAKABLE_VOICE_CLASS } from '@/lib/seo/speakable';
import { ABOUT_SPEAKABLE_VOICE_BLOCKS } from '@/lib/seo/speakable-voice-blocks';
import { buildPageMetadata } from '@/lib/metadata';
import { replaceEmDashDeep } from '@/lib/content/sanitize-user-facing-text';
import { BreadcrumbNav } from '@/components/navigation/BreadcrumbNav';
import { buildPersonSchema, readPersonSameAsUrls } from '@/lib/seo/schema-person';
import { SITE_URL } from '@/consts';
import {
	buildBreadcrumbSchema,
	buildFaqSchema,
	buildHowToSchema,
	buildWebPageSchema,
} from '@/utils/structured-data';

export const dynamic = 'force-static';

const ABOUT_OG_IMAGE = `${SITE_URL}/images/shared/guy-avni-avni-guy-law-firm-lawyer-og-law-fallback-photo-1.jpg`;
const ABOUT_DATE_MODIFIED = '2026-07-14';

export const metadata = buildPageMetadata({
	title: 'גיא אבני עורך דין | משרד גיא אבני',
	description:
		'גיא אבני עורך דין - עמוד היישות המקצועי: ליווי בנדל״ן, מיסוי מקרקעין, חוזים וליטיגציה. שקיפות, פגישת מיקוד ומדריכים בעברית לפני ייעוץ אישי.',
	keyword: 'גיא אבני עורך דין',
	path: '/about/',
	absoluteTitle: true,
	image: ABOUT_OG_IMAGE,
});

const PRACTICE_AREAS = [
	{
		title: 'נדל״ן ומיסוי מקרקעין',
		text: 'ליווי במכירה ורכישה, פטורי מס שבח, מס רכישה, דיווח הכנסות משכירות, ירושות ורישום - עם דגש על הכנה מוקדמת ומסמכים מסודרים.',
		href: '/categories/tax/',
	},
	{
		title: 'חוזים וסכסוכים אזרחיים',
		text: 'בדיקה וניסוח חוזים לפני חתימה, סימון סיכונים וליווי מו״מ - כדי להיכנס לעסקה או להליך עם תמונה ברורה.',
		href: '/categories/contracts/',
	},
	{
		title: 'ליווי עסקי וציות',
		text: 'מסלול מיקוד-תכנון-מעקב לעסקים: חוזים, תקשורת מול גורמים חיצוניים ועדכונים רק כשיש מה לדווח.',
		href: '/categories/business/',
	},
	{
		title: 'ליטיגציה אזרחית',
		text: 'הכנה לפני תביעה, איסוף חומרים ואסטרטגיה מציאותית - עם בחינת עלות מול תועלת, לא קפיצה אוטומטית להליך.',
		href: '/categories/litigation/',
	},
] as const;

const WORKFLOW_STEPS = [
	'פנייה או תיאום דרך עמוד יצירת הקשר, רצוי אחרי קריאת מאמר או עמוד שירות רלוונטי.',
	'פגישת מיקוד: מיון דחיפות, הבנת המצב ושאלות ממוקדות.',
	'תמונת סיכונים וצעדים מומלצים - מה כלול בליווי ומה לא.',
	'ליווי מסמכים, מו״מ או הליך לפי הצורך, עם סיכומים קצרים אחרי שיחות.',
	'עדכון כשמשהו משתנה בשטח, בלי הצפת הודעות.',
] as const;

const CLIENT_PROFILES = [
	'פרטיים שמוכרים או קונים דירה, מטפלים בירושה או מתלבטים לפני חתימה.',
	'משכירים שרוצים להבין דיווח מס והתחייבויות.',
	'עסקים קטנים ובינוניים שצריכים חוזים, ליווי שוטף וציות.',
	'מי שמחפש עורך דין בעברית, עם מדריכים מקצועיים לפני שיחה ראשונה.',
] as const;

const PRINCIPLES = [
	[
		'01',
		'ערכים',
		'שקיפות, זמינות וחשיבה אסטרטגית כבסיס לכל שיחה ולכל מסמך: מה כלול בליווי, מה לא, ואיך מתקבלות החלטות בזמן אמת.',
	],
	[
		'02',
		'דרך עבודה',
		'מיפוי צעדים, סיכומים ברורים אחרי שיחות ובקרה שוטפת: פגישת מיקוד, תמונת סיכונים, ועדכון כשמשהו משתנה בשטח.',
	],
] as const;

const BRAND_FAQ = replaceEmDashDeep([
	{
		question: 'מי זה גיא אבני?',
		answer:
			'גיא אבני הוא עורך דין ישראלי המלווה פרטיים ועסקים בנדל״ן, מיסוי מקרקעין, חוזים וליטיגציה אזרחית. עמוד זה הוא עמוד היישות המקצועי של avniguy.co.il - נקודת העוגן לחיפושים על גיא אבני וגיא אבני עורך דין.',
	},
	{
		question: 'גיא אבני עורך דין - באילו תחומים?',
		answer:
			'תחומי ליווי עיקריים: נדל״ן ומיסוי מקרקעין, חוזים, סכסוכים אזרחיים, ליטיגציה וליווי שוטף לעסקים. פירוט נוסף בעמוד השירותים, בקטגוריות הבלוג ובמאמרים על מיסוי ונדל״ן.',
	},
	{
		question: 'איך נראית פגישה ראשונה עם גיא אבני?',
		answer:
			'מומלץ לקרוא מאמר או עמוד שירות רלוונטי לפני הפנייה. בשיחת מיקוד בודקים מה קרה, מה דחוף, ומה הצעדים הסבירים להמשך. אין חובה להביא תיק מושלם; כן כדאי עובדות מרכזיות ושאלות כתובות.',
	},
	{
		question: 'האם התוכן באתר מהווה ייעוץ משפטי?',
		answer:
			'לא. המאמרים והמדריכים באתר נועדו להבהיר נושאים ולהכין לשיחה. ייעוץ אישי ניתן רק לאחר בירור התיק בפגישה ממוקדת.',
	},
	{
		question: 'איך ליצור קשר עם גיא אבני?',
		answer:
			'ניתן ליצור קשר דרך עמוד יצירת הקשר באתר לתיאום שיחת מיקוד, או בדוא״ל info@avniguy.co.il. מומלץ לציין נושא קצר ומה כבר קראתם באתר.',
	},
	{
		question: 'למה כדאי לקרוא את הבלוג לפני פנייה?',
		answer:
			'מאמרי הבלוג מסבירים תהליכים במילים פשוטות - מיסוי דירות, בחירת עורך דין, חוזים ועוד. קריאה ממוקדת חוסכת זמן בפגישה ומאפשרת שאלות חדות יותר.',
	},
]);

export default function AboutPage() {
	const breadcrumbItems = [
		{ name: 'דף הבית', path: '/' },
		{ name: 'גיא אבני עורך דין', path: '/about/' },
	];
	const sameAs = readPersonSameAsUrls();
	const jsonLd = [
		buildBreadcrumbSchema(breadcrumbItems),
		attachSpeakable(
			buildWebPageSchema({
				'@id': `${SITE_URL}/about/#webpage`,
				url: `${SITE_URL}/about/`,
				name: 'גיא אבני עורך דין | משרד גיא אבני',
				description:
					'עמוד היישות המקצועי של גיא אבני, עורך דין: נדל״ן, מיסוי, חוזים וליטיגציה.',
				dateModified: ABOUT_DATE_MODIFIED,
				'@type': 'AboutPage',
				mainEntity: { '@id': `${SITE_URL}/about/#person` },
			}),
		),
		buildPersonSchema({ sameAs: sameAs.length ? sameAs : undefined }),
		buildFaqSchema([...BRAND_FAQ]),
		buildHowToSchema({
			name: 'איך מתחילים לעבוד עם גיא אבני עורך דין',
			description: 'מסלול מיקוד, תמונת סיכונים וליווי מסודר.',
			steps: WORKFLOW_STEPS.map((step, index) => ({
				name: `שלב ${index + 1}`,
				text: step,
			})),
		}),
	];

	return (
		<SiteShell currentPath="/about/" extraJsonLd={jsonLd}>
			<div className="flex flex-col">
				<BreadcrumbNav items={breadcrumbItems} />
				<MainPageHero hero={MAIN_PAGE_HEROES['/about/']} index="01" eyebrow="גיא אבני · עורך דין" />
				<div id="person" className="home-anchor-target">
					<AttorneyCredentialBlock />
				</div>

				<PageSection id="entity" className="mt-16">
					<SectionHeader index={1} eyebrow="עמוד יישות" title="עמוד יישות - גיא אבני עורך דין" />
					<div className="mt-6 flex max-w-3xl flex-col gap-4 text-pretty leading-relaxed text-muted-foreground">
						<p>
							אם הגעתם מחיפוש על &quot;גיא אבני&quot; או &quot;גיא אבני עורך דין&quot;, כאן תמצאו תשובה ישירה לפני שעוברים ל
							<Link className="link-underline" href="/services/">
								שירותים
							</Link>
							,{' '}
							<Link className="link-underline" href="/blog/">
								מאמרים
							</Link>{' '}
							או{' '}
							<Link className="link-underline" href="/contact/">
								יצירת קשר
							</Link>
							.
						</p>
						<p>
							עמוד זה הוא נקודת העוגן המקצועית באתר avniguy.co.il: מי זה גיא אבני, באילו תחומים הוא מלווה, איך
							נראית פגישת מיקוד, ואיך להמשיך למאמרים או לשירותים בלי ליצור עמודי יישות דקים נפרדים. כל הסעיפים
							כאן ניתנים לעיגון ישיר מהבית ומדפי האתר - אל היישות, אל תחומי הליווי ואל מסלול העבודה.
						</p>
					</div>
				</PageSection>

				<PageSection id="speakable">
					<SectionHeader index={2} eyebrow="תשובות קצרות" title="תשובות קוליות קצרות על גיא אבני" />
					<div className="mt-8 flex max-w-3xl flex-col gap-6">
						{ABOUT_SPEAKABLE_VOICE_BLOCKS.map(({ id, question, answer }) => (
							<div key={id} id={`speakable-${id}`} className="border-b border-border pb-6 last:border-b-0">
								<h3 className="font-heading text-lg font-semibold text-foreground">{question}</h3>
								<p
									className={`${SPEAKABLE_VOICE_CLASS} mt-3 text-pretty text-sm leading-relaxed text-muted-foreground`}
								>
									{answer}
								</p>
							</div>
						))}
					</div>
				</PageSection>

				<PageSection id="practice">
					<SectionHeader index={3} eyebrow="תחומי ליווי" title="תחומי ליווי מעשיים של גיא אבני עורך דין" />
					<p className="mt-4 max-w-3xl text-pretty text-sm leading-relaxed text-muted-foreground">
						גיא אבני עורך דין מתמקד בליווי שמחבר בין מסמכים, מס וסיכון תפעולי - לא ברשימת תחומים גנרית. כל מקבץ
						להלן מוביל לקטגוריה או מדריך רלוונטי באתר, כדי להעמיק לפני שיחת מיקוד.
					</p>
					<div className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-2">
						{PRACTICE_AREAS.map(({ title, text, href }) => (
							<div key={title} className="flex flex-col gap-3 bg-background p-8">
								<h3 className="font-heading text-lg font-semibold text-foreground">
									<Link className="link-underline text-foreground" href={href}>
										{title}
									</Link>
								</h3>
								<p className="text-pretty text-sm leading-relaxed text-muted-foreground">{text}</p>
							</div>
						))}
					</div>
				</PageSection>

				<PageSection id="audience">
					<SectionHeader index={4} eyebrow="לקוחות" title="למי הליווי של גיא אבני מתאים" />
					<ul className="mt-6 flex max-w-3xl list-disc flex-col gap-2 pr-6 text-muted-foreground">
						{CLIENT_PROFILES.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
					<p className="mt-6 max-w-3xl text-pretty text-sm leading-relaxed text-muted-foreground">
						לפני פנייה מומלץ לעיין במדריך{' '}
						<Link className="link-underline" href="/blog/find-winning-lawyer-israel-bar-members/">
							איך לבחור עורך דין בישראל
						</Link>{' '}
						או ב
						<Link className="link-underline" href="/categories/tax/">
							{' '}
							קטגוריית המיסוי
						</Link>{' '}
						אם הנושא שלכם קשור למקרקעין או מס. המטרה: להגיע לפגישה עם שאלות חדות, לא עם רשימת מונחים בלבד.
					</p>
				</PageSection>

				<PageSection id="workflow">
					<SectionHeader index={5} eyebrow="תהליך" title="איך מתחילים לעבוד עם גיא אבני" />
					<p className="mt-4 max-w-3xl text-pretty text-sm leading-relaxed text-muted-foreground">
						המסלול קבוע וברור: מיקוד לפני מסמכים, תמונת סיכונים לפני התחייבות, ועדכונים רק כשיש מה לדווח. כך נמנעים
						מעומס תקשורת ומקבלים החלטות בזמן אמת.
					</p>
					<ol className="mt-6 flex max-w-3xl list-decimal flex-col gap-3 pr-6 text-muted-foreground">
						{WORKFLOW_STEPS.map((step) => (
							<li key={step} className="text-pretty leading-relaxed">
								{step}
							</li>
						))}
					</ol>
				</PageSection>

				<PageSection id="principles">
					<SectionHeader index={6} eyebrow="עקרונות" title="ערכים ודרך עבודה אצל גיא אבני" />
					<div className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-2">
						{PRINCIPLES.map(([num, title, text]) => (
							<div key={title} className="flex flex-col gap-4 bg-background p-8">
								<span className="font-mono text-xs text-muted-foreground">{num}</span>
								<h3 className="font-heading text-lg font-semibold text-foreground">{title}</h3>
								<p className="text-pretty text-sm leading-relaxed text-muted-foreground">{text}</p>
							</div>
						))}
					</div>
				</PageSection>

				<PageSection id="faq">
					<SectionHeader index={7} eyebrow="שאלות נפוצות" title="שאלות נפוצות על גיא אבני עורך דין" />
					<div className="mt-8 flex max-w-3xl flex-col gap-6">
						{BRAND_FAQ.map(({ question, answer }) => (
							<div key={question} className="border-b border-border pb-6 last:border-b-0">
								<h3 className="font-heading text-lg font-semibold text-foreground">{question}</h3>
								<p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">{answer}</p>
							</div>
						))}
					</div>
				</PageSection>

				<PageSection id="next">
					<div className="grid gap-8 lg:grid-cols-12">
						<div className="lg:col-span-4">
							<span className="font-mono text-xs text-muted-foreground">08 / המשך ביקור</span>
						</div>
						<div className="flex flex-col gap-4 text-right lg:col-span-8">
							<h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
								המשך מעמוד היישות של גיא אבני
							</h2>
							<p className="max-w-3xl text-pretty leading-relaxed text-muted-foreground">
								<Link className="link-underline" href="/services/">
									שירותים
								</Link>
								,{' '}
								<Link className="link-underline" href="/blog/">
									בלוג
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
