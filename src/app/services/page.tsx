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
			<div className="flex flex-col">
				<BreadcrumbNav items={breadcrumbItems} />
				<MainPageHero hero={MAIN_PAGE_HEROES['/services/']} index="02" eyebrow="שירותים / Services" />

				<section className="mt-16 grid gap-px border border-border bg-border sm:grid-cols-2">
					{SERVICES.map(([num, title, text]) => (
						<article key={title} className="group flex flex-col gap-4 bg-background p-8 transition-colors hover:bg-card">
							<div className="flex items-baseline justify-between">
								<span className="font-mono text-xs text-muted-foreground">{num}</span>
								<span className="h-px w-8 bg-border transition-colors group-hover:bg-primary" aria-hidden="true" />
							</div>
							<h2 className="font-heading text-lg font-semibold text-foreground">{title}</h2>
							<p className="text-pretty text-sm leading-relaxed text-muted-foreground">{text}</p>
						</article>
					))}
				</section>

				<section className="mt-16 grid gap-8 border-t border-border pt-8 lg:grid-cols-12">
					<div className="lg:col-span-4">
						<span className="font-mono text-xs text-muted-foreground">05 / מה כולל השירות</span>
					</div>
					<div className="flex flex-col gap-4 text-right lg:col-span-8">
						<h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">מה כולל השירות</h2>
						<p className="max-w-3xl text-pretty leading-relaxed text-muted-foreground">
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
						<h3 className="mt-2 font-heading text-xl font-semibold text-foreground">תוצאה רצויה</h3>
						<p className="max-w-3xl text-pretty leading-relaxed text-muted-foreground">
							התהליך שם דגש על בהירות, התנהלות רגועה ופעולות מעשיות שמביאות תוצאה טובה לאורך זמן. אין הבטחות על תוצאה
							ספציפית; יש תיאור ברור של צעדים, אחריות ותקשורת בין שלב לשלב.
						</p>
					</div>
				</section>
			</div>
		</SiteShell>
	);
}
