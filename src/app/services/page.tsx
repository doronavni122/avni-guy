import Link from 'next/link';
import { MainPageHero } from '@/components/seo/MainPageHero';
import { SiteShell } from '@/components/layout/SiteShell';
import { MAIN_PAGE_HEROES } from '@/lib/seo/main-page-heroes';
import { buildPageMetadata } from '@/lib/metadata';
import { BreadcrumbNav } from '@/components/navigation/BreadcrumbNav';
import { buildBreadcrumbSchema } from '@/utils/structured-data';

export const dynamic = 'force-static';

export const metadata = buildPageMetadata({
	title: 'גיא אבני משרד עורכי דין | ייעוץ, ליווי ותכנון משפטי',
	description:
		'גיא אבני משרד עורכי דין: פגישת מיקוד, תכנון, ניסוח וליווי מסמכים, תקשורת מול גורמים חיצוניים ומעקב שמונע הפתעות. צעדים ברורים בכל שלב.',
	keyword: 'גיא אבני משרד עורכי דין',
	path: '/services/',
});

const SERVICES = [
	[
		'01',
		'ייעוץ ואסטרטגיה',
		'פגישת מיקוד, מיפוי מצב וזיהוי הזדמנויות: מה דחוף, מה אפשר לדחות, ואיזו תוכנית פעולה מתאימה לסיכון ולתקציב.',
	],
	[
		'02',
		'ליווי מסמכים',
		'ניסוח, בדיקה וארגון חומרים לפני חתימה או מסירה: סימון סעיפים קריטיים, סיכום סיכונים וגרסה מוכנה לדיון.',
	],
	[
		'03',
		'תקשורת מקצועית',
		'ניהול ממשקים מול לקוחות, ספקים או גורמים חיצוניים: סיכומים קצרים, שפה אחידה ותיעוד התחייבויות.',
	],
	[
		'04',
		'מעקב ובקרה',
		'בקרות תקופתיות, מדדים ברורים והתאמות כשהמצב משתנה: פחות הפתעות ויותר שליטה לאורך ההליך.',
	],
] as const;

export default function ServicesPage() {
	const breadcrumbItems = [
		{ name: 'דף הבית', path: '/' },
		{ name: 'שירותים', path: '/services' },
	];
	const jsonLd = buildBreadcrumbSchema(breadcrumbItems);

	return (
		<SiteShell currentPath="/services/" extraJsonLd={jsonLd}>
			<article className="flex flex-col">
				<BreadcrumbNav items={breadcrumbItems} />
				<MainPageHero hero={MAIN_PAGE_HEROES['/services/']} eyebrow="שירותים · Services" />

				<section className="mt-16 border-t-2 border-foreground" aria-label="תחומי ליווי">
					<p className="kicker mb-2 mt-6">מדור · תחומי הליווי</p>
					<ol className="flex flex-col">
						{SERVICES.map(([num, title, text]) => (
							<li
								key={title}
								className="group grid items-baseline gap-x-6 gap-y-2 border-b border-border py-7 sm:grid-cols-[auto_1fr] lg:grid-cols-[auto_minmax(0,18rem)_1fr]"
							>
								<span className="folio text-3xl leading-none text-muted-foreground transition-colors group-hover:text-primary" aria-hidden="true">
									{num}
								</span>
								<h2 className="font-serif text-2xl font-extrabold text-foreground sm:col-span-1">{title}</h2>
								<p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground sm:col-span-2 lg:col-span-1">
									{text}
								</p>
							</li>
						))}
					</ol>
				</section>

				<section className="mt-16 grid gap-x-12 gap-y-6 border-t border-border pt-10 lg:grid-cols-12">
					<header className="lg:col-span-4">
						<p className="kicker">פירוט</p>
						<h2 className="mt-3 font-serif text-3xl font-extrabold leading-tight tracking-tight text-foreground text-balance">
							מה כולל השירות
						</h2>
					</header>
					<div className="flex flex-col gap-5 text-right lg:col-span-8">
						<p className="drop-cap max-w-2xl text-pretty text-lg leading-relaxed text-foreground">
							השירות כולל פגישת מיקוד, בניית מפת סיכונים והזדמנויות, הכנת מסמכים וניהול תקשורת מקצועית. מומלץ להמשיך גם ל־{' '}
							<Link className="link-underline" href="/about/">
								אודות
							</Link>
							,{' '}
							<Link className="link-underline" href="/blog/">
								מאמרים
							</Link>
							,{' '}
							<Link className="link-underline" href="/categories/">
								קטגוריות
							</Link>
							,{' '}
							<Link className="link-underline" href="/tags/">
								תגיות
							</Link>
							,{' '}
							<Link className="link-underline" href="/contact/">
								יצירת קשר
							</Link>
							,{' '}
							<Link className="link-underline" href="/">
								דף הבית
							</Link>{' '}
							ולמאמר{' '}
							<Link className="link-underline" href="/blog/negotiation-clarity-principles/">
								עקרונות משא ומתן
							</Link>
							.
						</p>
						<h3 className="mt-4 font-serif text-2xl font-bold text-foreground">תוצאה רצויה</h3>
						<p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">
							התהליך שם דגש על בהירות, התנהלות רגועה ופעולות מעשיות שמביאות תוצאה טובה לאורך זמן. אין הבטחות על תוצאה
							ספציפית; יש תיאור ברור של צעדים, אחריות ותקשורת בין שלב לשלב.
						</p>
					</div>
				</section>
			</article>
		</SiteShell>
	);
}
