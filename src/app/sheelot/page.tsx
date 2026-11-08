import Link from 'next/link';
import { PageSection } from '@/components/layout/PageSection';
import { MainPageHero } from '@/components/seo/MainPageHero';
import { EntityByline } from '@/components/seo/EntityByline';
import { SiteShell } from '@/components/layout/SiteShell';
import { buildPageMetadata } from '@/lib/metadata';
import { replaceEmDashDeep } from '@/lib/content/sanitize-user-facing-text';
import { BreadcrumbNav } from '@/components/navigation/BreadcrumbNav';
import { SITE_URL } from '@/consts';
import { mainPageOgImageUrl } from '@/lib/seo/main-page-og';
import type { MainPageHero as MainPageHeroData } from '@/lib/seo/hero-rules';
import {
	buildBreadcrumbSchema,
	buildFaqSchema,
	buildWebPageSchema,
} from '@/utils/structured-data';

export const dynamic = 'force-static';

const PAGE_PATH = '/sheelot/';
const PAGE_OG_IMAGE = mainPageOgImageUrl('/sheelot/');
const PAGE_DATE_MODIFIED = '2026-11-08';

const HERO: MainPageHeroData = {
	path: PAGE_PATH,
	eyebrow: 'שאלות נפוצות',
	h1: 'שאלות נפוצות על נדל״ן, מיסוי ומקרקעין',
	subhead: 'תשובות קצרות בעברית לשאלות שמופיעות בחיפוש - לפני פגישת מיקוד.',
	intro:
		'עמוד זה מרכז שאלות בסגנון People Also Ask על קניית דירה, מסים, חוזים ובחירת עורך דין. התשובות הן מידע כללי להכנה - לא ייעוץ משפטי אישי. לפירוט נוסף: מאמרי הבלוג, עמוד השירותים ועמוד האודות.',
	keyword: 'איך בוחרים עורך דין מקרקעין טוב',
};

export const metadata = buildPageMetadata({
	title: 'גיא אבני | שאלות נפוצות - נדל״ן, מיסוי ומקרקעין',
	description:
		'שאלות ותשובות בעברית על קניית דירה, מס שבח, מס רכישה, חוזים ובחירת עורך דין מקרקעין - תשובות קצרות לפני פגישת מיקוד עם גיא אבני.',
	keyword: 'איך בוחרים עורך דין מקרקעין טוב',
	keywords: [
		'איך בוחרים עורך דין מקרקעין טוב',
		'האם חובה עורך דין בקניית דירה',
		'גיא אבני עורך דין',
		'גיא אבני',
	],
	path: PAGE_PATH,
	absoluteTitle: true,
	image: PAGE_OG_IMAGE,
});

/** Visible Q&A and FAQPage schema must stay identical. Each answer points to one unique article. */
const PAA_ITEMS = replaceEmDashDeep([
	{
		question: 'האם חובה עורך דין בקניית דירה?',
		answer:
			'אין חובה חוקית כלל־ארצית לשכור עו״ד בכל רכישת דירה, אבל בעסקת מקרקעין הסיכון הוא על הכסף והרישום. בפרקטיקה בודקים לפני חתימה: נסח טאבו/זכויות, שעבודים והערות אזהרה, התאמת החוזה למצב בפועל, ולוחות דיווח מס. צעד עבודה: (1) אספו נסח ומסמכי מוכר, (2) סמנו סעיפים לא ברורים, (3) תאמו שיחת מיקוד לפני שמשלמים מקדמה משמעותית. טעות בשלב זה יקרה לתקן אחרי כן.',
		href: '/blog/lawyer-required-apartment-purchase/',
		linkLabel: 'מדריך: האם חובה עורך דין בקניית דירה',
		citeHref: 'https://www.gov.il/he/departments/israel_tax_authority',
		citeLabel: 'רשות המסים — מידע כללי',
	},
	{
		question: 'מה לבדוק לפני רכישת דירה מקבלן?',
		answer:
			'מול קבלן הסדר שונה מיד־שנייה: זהות היזם/המוכר, היתרים ותוכניות, נספחי מפרט, מועדי מסירה, ערבות לפי חוק המכר (דירות), סנקציות על איחור, והתאמה למשכנתא ולתקציב. צעדים: קראו את החוזה לפני חתימה (לא אחרי), השוו מפרט מול דירה לדוגמה, וודאו מה קורה אם יש עיכוב רישום. אל תסתמכו על מצג שיווקי במקום על הנספחים החתומים.',
		href: '/blog/buying-from-contractor-checklist/',
		linkLabel: 'רשימת בדיקה לרכישה מקבלן',
		citeHref: 'https://www.nevo.co.il/law_html/law01/055_001.htm',
		citeLabel: 'חוק המכר (דירות) — מקור לדיון (Nevo)',
	},
	{
		question: 'מה זו ערבות חוק מכר ולמה היא חשובה?',
		answer:
			'ערבות לפי חוק המכר (דירות) נועדה להגן על רוכש שמקדם כספים לקבלן לפני רישום או מסירה. בלי ערבות מתאימה הסיכון על הכסף גבוה. בפרקטיקה: בדקו סוג הערבות, מי המוציא, מה מכוסה, ומתי היא פוקעת — והתאימו את לוח התשלומים לערבות בפועל, לא להבטחה בעל־פה.',
		href: '/blog/sale-law-guarantee-importance/',
		linkLabel: 'מהי ערבות חוק מכר',
		citeHref: 'https://www.nevo.co.il/law_html/law01/055_001.htm',
		citeLabel: 'חוק המכר (דירות)',
	},
	{
		question: 'האם יש פטור ממס רכישה לדירה ראשונה?',
		answer:
			'לדירת מגורים יחידה חלות מדרגות מס רכישה מוטבות (לעיתים מכונות בשיח הציבורי «פטור» במדרגה הנמוכה), בכפוף להגדרות בחוק מיסוי מקרקעין ובתקנות במועד העסקה. הסכומים משתנים: בודקים לפי תאריך החוזה, סוג הזכות, ומצב הנכסים שלכם. מקור רשמי לעדכון מדרגות — רשות המסים. אל תסתמכו על טבלה ישנה מוואטסאפ.',
		href: '/blog/purchase-tax-exemption-first-apartment/',
		linkLabel: 'פטור ומדרגות מס רכישה לדירה ראשונה',
		citeHref: 'https://www.gov.il/he/departments/topics/real_estate_taxation/govil-landing-page',
		citeLabel: 'רשות המסים — מיסוי מקרקעין',
	},
	{
		question: 'כמה מס שבח משלמים על מכירת דירה שנייה?',
		answer:
			'מס שבח מחושב על השבח (הרווח) לפי כללי חוק מיסוי מקרקעין — לא כאחוז קבוע לכולם. משפיעים: עלות מתואמת, פחת, תקופת החזקה, פטורים/הקלות, ודיווח במועד. צעד עבודה לפני חתימת מכר: אספו רכישה מקורית + שיפורים מתועדים, בדקו אם יש פטור דירה יחידה או חישוב לינארי, ותכננו דיווח מול רשות המסים. מספר סופי נקבע לפי הנתונים שלכם — לא לפי כלל אצבע.',
		href: '/blog/capital-gains-exemption-single-apartment-2026/',
		linkLabel: 'מס שבח ופטור דירה יחידה 2026',
		citeHref: 'https://www.gov.il/he/departments/topics/real_estate_taxation/govil-landing-page',
		citeLabel: 'רשות המסים — מיסוי מקרקעין',
	},
	{
		question: 'מה ההבדל בין תמא 38 לפינוי בינוי?',
		answer:
			'תמ״א 38 מתמקדת בחיזוק/תוספת בבניין קיים מול יזם; פינוי־בינוי הוא מסלול רחב יותר של הריסה ובנייה מחדש, לרוב עם הסכמות דיירים וליווי תכנוני שונה. הזכויות, הסיכונים, הערבויות ולוחות הזמנים שונים. לפני חתימה על הסכם דיירים: הבינו מה מקבלים בפועל (שטח, חניה, ערבויות), מה קורה אם הפרויקט נתקע, ומי נושא בעלויות ביניים.',
		href: '/blog/tama38-vs-evacuation-reconstruction/',
		linkLabel: 'תמ״א 38 מול פינוי בינוי',
		citeHref: 'https://www.gov.il/he/departments/ministry_of_construction_and_housing',
		citeLabel: 'משרד הבינוי והשיכון — מידע כללי',
	},
	{
		question: 'מה כולל הסכם מכר דירה יד שנייה?',
		answer:
			'הסכם מכר יד־שנייה כולל לרוב פרטי הצדדים והנכס, מחיר ותנאי תשלום, מועדי מסירה ורישום, מצגי מוכר, תנאים מתלים (למשל משכנתא), וסנקציות. בפרקטיקה חשוב ליישר נספחים עם נסח הטאבו והמצב בשטח (חריגות, שוכרים, מטלטלין). לפני חתימה: סמנו סעיפים שתלויים בצד שלישי, בדקו מועדי תשלום מול בנק, ואל תערבבו בין «מצג שיווקי» לבין התחייבות חוזית.',
		href: '/blog/second-hand-apartment-sale-agreement/',
		linkLabel: 'מה כולל הסכם מכר יד שנייה',
		citeHref: 'https://www.gov.il/he/departments/land_registry_and_settlement_of_rights',
		citeLabel: 'רשות הרישום והסדר זכויות מקרקעין',
	},
	{
		question: 'איך בוחרים עורך דין מקרקעין טוב?',
		answer:
			'בודקים ניסיון בעסקאות דומות לשלכם, שקיפות לגבי היקף השירות ושכר טרחה, זמינות לתשובות לפני חתימה, והסבר בשפה ברורה — לא הבטחת תוצאה. צעד עבודה: קראו מדריך בחירה, הכינו 5 שאלות על סיכונים בעסקה, ותאמו שיחת מיקוד. אפשר גם לאמת רישוי בלשכת עורכי הדין לפני התקשרות.',
		href: '/blog/choose-real-estate-lawyer/',
		linkLabel: 'איך בוחרים עורך דין מקרקעין',
		citeHref: 'https://www.israelbar.org.il/',
		citeLabel: 'לשכת עורכי הדין בישראל',
	},
]);

export default function SheelotPage() {
	const breadcrumbItems = [
		{ name: 'דף הבית', path: '/' },
		{ name: 'שאלות נפוצות', path: PAGE_PATH },
	];

	const jsonLd = [
		buildBreadcrumbSchema(breadcrumbItems),
		buildWebPageSchema({
			'@id': `${SITE_URL}${PAGE_PATH}#webpage`,
			url: `${SITE_URL}${PAGE_PATH}`,
			name: 'גיא אבני | שאלות נפוצות - נדל״ן, מיסוי ומקרקעין',
			description:
				'שאלות ותשובות בעברית על קניית דירה, מסים, חוזים ובחירת עורך דין מקרקעין.',
			dateModified: PAGE_DATE_MODIFIED,
			'@type': 'WebPage',
		}),
		buildFaqSchema([...PAA_ITEMS]),
	];

	return (
		<SiteShell currentPath={PAGE_PATH} extraJsonLd={jsonLd}>
			<div className="flex flex-col">
				<BreadcrumbNav items={breadcrumbItems} />
				<MainPageHero hero={HERO} index="09" eyebrow="שאלות נפוצות" />
				<EntityByline lastUpdatedLabel="יולי 2026" />

				<p className="mt-6 max-w-3xl text-pretty text-sm leading-relaxed text-muted-foreground">
					המידע בעמוד זה כללי בלבד ואינו מחליף ייעוץ משפטי אישי. לתיאום שיחת מיקוד:{' '}
					<Link className="link-underline" href="/contact/">
						יצירת קשר
					</Link>
					. לעמוד היישות:{' '}
					<Link className="link-underline" href="/about/">
						גיא אבני עורך דין
					</Link>
					.
				</p>

				<PageSection className="mt-16">
					<div className="flex max-w-3xl flex-col gap-10">
						{PAA_ITEMS.map(({ question, answer, href, linkLabel, citeHref, citeLabel }, index) => (
							<article key={question} className="border-b border-border pb-10 last:border-b-0">
								<span className="font-mono text-xs text-muted-foreground">
									{String(index + 1).padStart(2, '0')}
								</span>
								<h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground text-balance sm:text-3xl">
									{question}
								</h2>
								<p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">{answer}</p>
								<p className="mt-3 text-sm">
									<Link className="link-underline" href={href}>
										{linkLabel}
									</Link>
									{' · '}
									<a
										className="link-underline"
										href={citeHref}
										target="_blank"
										rel="noopener noreferrer"
									>
										{citeLabel}
									</a>
								</p>
							</article>
						))}
					</div>
				</PageSection>

				<PageSection>
					<div className="grid gap-8 lg:grid-cols-12">
						<div className="lg:col-span-4">
							<span className="font-mono text-xs text-muted-foreground">המשך</span>
						</div>
						<div className="flex flex-col gap-4 text-right lg:col-span-8">
							<p className="max-w-3xl text-pretty leading-relaxed text-muted-foreground">
								להעמקה:{' '}
								<Link className="link-underline" href="/blog/">
									בלוג
								</Link>
								,{' '}
								<Link className="link-underline" href="/categories/tax/">
									קטגוריית מיסוי
								</Link>
								,{' '}
								<Link className="link-underline" href="/services/">
									שירותים
								</Link>
								,{' '}
								<Link className="link-underline" href="/blog/find-winning-lawyer-israel-bar-members/">
									מדריך בחירת עורך דין
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
