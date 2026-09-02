import Link from 'next/link';
import { PageSection } from '@/components/layout/PageSection';
import { MainPageHero } from '@/components/seo/MainPageHero';
import { EntityByline } from '@/components/seo/EntityByline';
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

const PAGE_PATH = '/sheelot/';
const PAGE_OG_IMAGE = `${SITE_URL}/images/shared/guy-avni-avni-guy-law-firm-lawyer-og-law-fallback-photo-1.jpg`;
const PAGE_DATE_MODIFIED = '2026-09-02';

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
			'אין חובה חוקית כללית, אבל בעסקת מקרקעין מומלץ בחום ליווי משפטי: בדיקת זכויות, שעבודים, תנאי חוזה ומסמכי מס לפני חתימה. טעות בשלב זה יקרה לתקן אחרי כן.',
		href: '/blog/lawyer-required-apartment-purchase/',
		linkLabel: 'מדריך: האם חובה עורך דין בקניית דירה',
	},
	{
		question: 'מה לבדוק לפני רכישת דירה מקבלן?',
		answer:
			'בודקים זהות המוכר והיתרים, נספחים לחוזה, מועדי מסירה, ערבות חוק מכר, סנקציות על איחור, והתאמה לתקציב ולמשכנתא. כדאי לעבור על החוזה לפני חתימה, לא אחרי.',
		href: '/blog/buying-from-contractor-checklist/',
		linkLabel: 'רשימת בדיקה לרכישה מקבלן',
	},
	{
		question: 'מה זו ערבות חוק מכר ולמה היא חשובה?',
		answer:
			'ערבות חוק מכר נועדה להגן על רוכש דירה מקבלן כשמקדמים כספים לפני רישום או מסירה. בלי ערבות מתאימה הסיכון על הכסף גבוה יותר - יש לוודא סוג הערבות ותנאיה בחוזה.',
		href: '/blog/sale-law-guarantee-importance/',
		linkLabel: 'מהי ערבות חוק מכר',
	},
	{
		question: 'האם יש פטור ממס רכישה לדירה ראשונה?',
		answer:
			'לדירת מגורים יחידה קיימים מדרגות מס רכישה מוטבות (לעיתים מכונות פטור חלקי במדרגה הנמוכה), בכפוף לתנאי החוק והתקנות במועד העסקה. הסכום והמדרגות משתנים - בודקים לפי תאריך החוזה ומצב הנכסים שלכם.',
		href: '/blog/purchase-tax-exemption-first-apartment/',
		linkLabel: 'פטור ומדרגות מס רכישה לדירה ראשונה',
	},
	{
		question: 'כמה מס שבח משלמים על מכירת דירה שנייה?',
		answer:
			'מס שבח על דירה שאינה דירת מגורים יחידה מחושב על הרווח (שבח) לפי כללי חישוב, פטורים והקלות רלוונטיים. אין אחוז קבוע לכולם - תלוי בעלות מתואמת, פחת, תקופת החזקה ופטורים אישיים.',
		href: '/blog/capital-gains-exemption-single-apartment-2026/',
		linkLabel: 'מס שבח ופטור דירה יחידה 2026',
	},
	{
		question: 'מה ההבדל בין תמא 38 לפינוי בינוי?',
		answer:
			'תמ״א 38 מתמקדת בחיזוק/תוספת בבניין קיים מול יזם. פינוי בינוי הוא מסלול רחב יותר של הריסה ובנייה מחדש, לרוב עם הסכמות דיירים וליווי תכנוני שונה. הזכויות, הסיכונים ולוחות הזמנים שונים בכל מסלול.',
		href: '/blog/tama38-vs-evacuation-reconstruction/',
		linkLabel: 'תמ״א 38 מול פינוי בינוי',
	},
	{
		question: 'מה כולל הסכם מכר דירה יד שנייה?',
		answer:
			'הסכם מכר יד שנייה כולל לרוב פרטי הצדדים והנכס, מחיר ותנאי תשלום, מועדי מסירה ורישום, מצגי המוכר, תנאים מתלים (כמו משכנתא), וסנקציות. חשוב ליישר את הנספחים עם נסח הטאבו והמצב בפועל.',
		href: '/blog/second-hand-apartment-sale-agreement/',
		linkLabel: 'מה כולל הסכם מכר יד שנייה',
	},
	{
		question: 'איך בוחרים עורך דין מקרקעין טוב?',
		answer:
			'בודקים ניסיון בעסקאות דומות, שקיפות לגבי היקף השירות ושכר טרחה, זמינות לתשובות לפני חתימה, והסבר בשפה ברורה - לא הבטחת תוצאה. כדאי לקרוא מדריך בחירה באתר ואז לתאם שיחת מיקוד.',
		href: '/blog/choose-real-estate-lawyer/',
		linkLabel: 'איך בוחרים עורך דין מקרקעין',
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
						{PAA_ITEMS.map(({ question, answer, href, linkLabel }, index) => (
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
