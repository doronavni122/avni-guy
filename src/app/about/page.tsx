import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MainPageHero } from '@/components/seo/MainPageHero';
import { SiteShell } from '@/components/layout/SiteShell';
import { MAIN_PAGE_HEROES } from '@/lib/seo/main-page-heroes';
import { buildPageMetadata } from '@/lib/metadata';
import { buildBreadcrumbSchema } from '@/utils/structured-data';

export const dynamic = 'force-static';

export const metadata = buildPageMetadata({
	title: 'גיא אבני עו״ד | ערכים, ניסיון ודרך עבודה מקצועית',
	description:
		'גיא אבני עו״ד מציג ערכים, ניסיון ודרך עבודה: שקיפות, סיכומים אחרי שיחות, מיפוי סיכונים וציפיות ברורות מהיום הראשון. קראו לפני פגישת מיקוד.',
	keyword: 'גיא אבני עו״ד',
	path: '/about/',
});

export default function AboutPage() {
	const jsonLd = buildBreadcrumbSchema([
		{ name: 'דף הבית', path: '/' },
		{ name: 'אודות', path: '/about' },
	]);

	return (
		<SiteShell currentPath="/about/" extraJsonLd={jsonLd}>
			<section className="flex flex-col gap-10">
				<MainPageHero hero={MAIN_PAGE_HEROES['/about/']} />
				<div className="grid gap-6 lg:grid-cols-2">
					<Card className="border-border/60 bg-card/70 shadow-sm">
						<CardContent className="flex flex-col gap-3 p-8 text-right">
							<p className="font-heading text-lg font-semibold text-foreground">ערכים</p>
							<p className="text-pretty text-sm leading-relaxed text-muted-foreground">
								שקיפות, זמינות וחשיבה אסטרטגית כבסיס לכל שיחה ולכל מסמך: מה כלול בליווי, מה לא, ואיך מתקבלות החלטות
								בזמן אמת.
							</p>
						</CardContent>
					</Card>
					<Card className="border-border/60 bg-card/70 shadow-sm">
						<CardContent className="flex flex-col gap-3 p-8 text-right">
							<p className="font-heading text-lg font-semibold text-foreground">דרך עבודה</p>
							<p className="text-pretty text-sm leading-relaxed text-muted-foreground">
								מיפוי צעדים, סיכומים ברורים אחרי שיחות ובקרה שוטפת: פגישת מיקוד, תמונת סיכונים, ועדכון כשמשהו משתנה
								בשטח.
							</p>
						</CardContent>
					</Card>
				</div>
				<Separator className="bg-border/60" />
				<div className="flex flex-col gap-4 text-right">
					<h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">ערכי העבודה שמובילים את גיא אבני עו״ד</h2>
					<p className="max-w-3xl text-pretty leading-relaxed text-muted-foreground">
						העבודה שלי נשענת על שקיפות, זמינות וחשיבה אסטרטגית. אפשר להעמיק דרך עמוד{' '}
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/services/">
							השירותים
						</Link>
						, לקרוא את{' '}
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/blog/">
							הבלוג
						</Link>
						, לעיין ב־
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/categories/">
							קטגוריות
						</Link>
						, לנווט לפי{' '}
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/tags/">
							תגיות
						</Link>
						, לבדוק את{' '}
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/">
							דף הבית
						</Link>
						, לעבור ל־{' '}
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/contact/">
							יצירת קשר
						</Link>{' '}
						ולקרוא על{' '}
						<Link
							className="font-medium text-primary underline-offset-2 hover:underline"
							href="/blog/guy-avni-document-readiness-guide/"
						>
							מוכנות מסמכים
						</Link>
						.
					</p>
					<h3 className="font-heading text-xl font-semibold text-foreground">למי זה מתאים</h3>
					<p className="max-w-3xl text-pretty leading-relaxed text-muted-foreground">
						האתר מתאים למי שמחפש ליווי מקצועי בשפה פרקטית, עם דגש על תכנון מוקדם, צעדים ישימים ותוכן שמחבר בין ידע משפטי לבין
						החלטות יומיומיות. התוכן באתר אינו תחליף לייעוץ אישי; כשיש סיכון מהותי, עדיף שיחה ממוקדת.
					</p>
				</div>
			</section>
		</SiteShell>
	);
}
