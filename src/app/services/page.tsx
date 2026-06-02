import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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

export default function ServicesPage() {
	const breadcrumbItems = [
		{ name: 'דף הבית', path: '/' },
		{ name: 'שירותים', path: '/services' },
	];
	const jsonLd = buildBreadcrumbSchema(breadcrumbItems);

	return (
		<SiteShell currentPath="/services/" extraJsonLd={jsonLd}>
			<section className="flex flex-col gap-10">
				<BreadcrumbNav items={breadcrumbItems} />
				<MainPageHero hero={MAIN_PAGE_HEROES['/services/']} />
				<div className="grid gap-6 md:grid-cols-2">
					{[
						[
							'ייעוץ ואסטרטגיה',
							'פגישת מיקוד, מיפוי מצב וזיהוי הזדמנויות: מה דחוף, מה אפשר לדחות, ואיזו תוכנית פעולה מתאימה לסיכון ולתקציב.',
						],
						[
							'ליווי מסמכים',
							'ניסוח, בדיקה וארגון חומרים לפני חתימה או מסירה: סימון סעיפים קריטיים, סיכום סיכונים וגרסה מוכנה לדיון.',
						],
						[
							'תקשורת מקצועית',
							'ניהול ממשקים מול לקוחות, ספקים או גורמים חיצוניים: סיכומים קצרים, שפה אחידה ותיעוד התחייבויות.',
						],
						[
							'מעקב ובקרה',
							'בקרות תקופתיות, מדדים ברורים והתאמות כשהמצב משתנה: פחות הפתעות ויותר שליטה לאורך ההליך.',
						],
					].map(([title, text]) => (
						<Card key={title} className="border-border/60 bg-card/70 shadow-sm">
							<CardHeader className="text-right">
								<CardTitle className="font-heading text-lg">{title}</CardTitle>
							</CardHeader>
							<CardContent className="text-right text-sm leading-relaxed text-muted-foreground">{text}</CardContent>
						</Card>
					))}
				</div>
				<Separator className="bg-border/60" />
				<div className="flex flex-col gap-4 text-right">
					<h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">מה כולל השירות</h2>
					<p className="max-w-3xl text-pretty leading-relaxed text-muted-foreground">
						השירות כולל פגישת מיקוד, בניית מפת סיכונים והזדמנויות, הכנת מסמכים וניהול תקשורת מקצועית. מומלץ להמשיך גם ל־{' '}
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/about/">
							אודות
						</Link>
						,{' '}
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/blog/">
							מאמרים
						</Link>
						,{' '}
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/categories/">
							קטגוריות
						</Link>
						,{' '}
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/tags/">
							תגיות
						</Link>
						,{' '}
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/contact/">
							יצירת קשר
						</Link>
						,{' '}
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/">
							דף הבית
						</Link>{' '}
						ולמאמר{' '}
						<Link
							className="font-medium text-primary underline-offset-2 hover:underline"
							href="/blog/guy-avni-negotiation-clarity-principles/"
						>
							עקרונות משא ומתן
						</Link>
						.
					</p>
					<h3 className="font-heading text-xl font-semibold text-foreground">תוצאה רצויה</h3>
					<p className="max-w-3xl text-pretty leading-relaxed text-muted-foreground">
						התהליך שם דגש על בהירות, התנהלות רגועה ופעולות מעשיות שמביאות תוצאה טובה לאורך זמן. אין הבטחות על תוצאה
						ספציפית; יש תיאור ברור של צעדים, אחריות ותקשורת בין שלב לשלב.
					</p>
				</div>
			</section>
		</SiteShell>
	);
}
