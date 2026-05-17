import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SiteShell } from '@/components/layout/SiteShell';
import { buildPageMetadata } from '@/lib/metadata';
import { buildBreadcrumbSchema } from '@/utils/structured-data';

export const dynamic = 'force-static';

export const metadata = buildPageMetadata({
	title: 'גיא אבני משרד עורכי דין | ייעוץ, ליווי ותכנון משפטי',
	description:
		'במשרד גיא אבני ייעוץ משפטי, ליווי מסמכים ותכנון שקוף, יעדים ברורים ותיאום ציפיות מהיום הראשון לכל לקוח.',
	keyword: 'גיא אבני משרד עורכי דין',
	path: '/services/',
});

export default function ServicesPage() {
	const jsonLd = buildBreadcrumbSchema([
		{ name: 'דף הבית', path: '/' },
		{ name: 'שירותים', path: '/services' },
	]);

	return (
		<SiteShell extraJsonLd={jsonLd}>
			<section className="flex flex-col gap-10">
				<div className="flex flex-col gap-4 text-right">
					<p className="text-sm font-medium text-primary">גיא אבני משרד עורכי דין</p>
					<h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
						גיא אבני משרד עורכי דין - שירותים מקצועיים
					</h1>
					<p className="max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground">
						השירותים בנויים למסלול ברור: אבחון, תכנון, ביצוע ומעקב. המטרה היא לתת ודאות ולשמור על התקדמות אפקטיבית לאורך כל
						הדרך.
					</p>
				</div>
				<div className="grid gap-6 md:grid-cols-2">
					{[
						['ייעוץ ואסטרטגיה', 'מיפוי מצב, זיהוי הזדמנויות ובניית תוכנית פעולה מדויקת לפי סדר עדיפויות.'],
						['ליווי מסמכים', 'ניסוח, בדיקה וארגון חומרים כדי לייצר תיק עבודה ברור ומוכן לכל שלב.'],
						['תקשורת מקצועית', 'ניהול ממשקים, סיכומים שוטפים ושמירה על שפה אחידה בין כל הצדדים.'],
						['מעקב ובקרה', 'בקרות קצרות, מדדים ברורים והתאמות עדינות כדי לשמור על איכות גבוהה לאורך זמן.'],
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
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/about">
							אודות
						</Link>
						,{' '}
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/blog">
							מאמרים
						</Link>
						,{' '}
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/categories">
							קטגוריות
						</Link>
						,{' '}
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/tags">
							תגיות
						</Link>
						,{' '}
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/contact">
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
						התהליך שם דגש על בהירות, התנהלות רגועה ופעולות מעשיות שמביאות תוצאה טובה לאורך זמן.
					</p>
				</div>
			</section>
		</SiteShell>
	);
}
