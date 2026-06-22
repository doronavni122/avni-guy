import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MainPageHero } from '@/components/seo/MainPageHero';
import { SiteShell } from '@/components/layout/SiteShell';
import { MAIN_PAGE_HEROES } from '@/lib/seo/main-page-heroes';
import { cn } from '@/lib/utils';
import { SITE_CONTACT_EMAIL } from '@/consts';
import { buildPageMetadata } from '@/lib/metadata';
import { BreadcrumbNav } from '@/components/navigation/BreadcrumbNav';
import { buildBreadcrumbSchema } from '@/utils/structured-data';

export const dynamic = 'force-static';

const mailtoHref = `mailto:${SITE_CONTACT_EMAIL}?subject=${encodeURIComponent('פנייה מהאתר')}`;

export const metadata = buildPageMetadata({
	title: 'גיא אבני | יצירת קשר ותיאום שיחה',
	description:
		'גיא אבני: תיאום שיחה בדוא״ל, מה להכין לפני פנייה, ומה צפוי בשיחה הראשונה - סיכום קצר, צעדים ברורים וללא הבטחות בלתי אפשריות. התוכן באתר אינו תחליף לייעוץ.',
	keyword: 'גיא אבני',
	path: '/contact/',
});

export default function ContactPage() {
	const breadcrumbItems = [
		{ name: 'דף הבית', path: '/' },
		{ name: 'יצירת קשר', path: '/contact' },
	];
	const jsonLd = buildBreadcrumbSchema(breadcrumbItems);

	return (
		<SiteShell currentPath="/contact/" extraJsonLd={jsonLd}>
			<section className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-14">
				<div className="flex max-w-xl flex-col gap-4 text-right">
					<BreadcrumbNav items={breadcrumbItems} />
					<MainPageHero hero={MAIN_PAGE_HEROES['/contact/']} />
					<Separator className="bg-border/60" />
					<div className="flex flex-col gap-4">
						<h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">מה להכין לפני פנייה</h2>
						<p className="text-pretty leading-relaxed text-muted-foreground">
							כדאי להכין רקע קצר, מסמכים מרכזיים ושאלות ממוקדות. לפני פנייה מומלץ לעבור על{' '}
							<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/services/">
								השירותים
							</Link>
							, לקרוא ב־{' '}
							<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/blog/">
								בלוג
							</Link>
							, לבדוק{' '}
							<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/categories/">
								קטגוריות
							</Link>{' '}
							ו־{' '}
							<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/tags/">
								תגיות
							</Link>
							, לעיין ב־{' '}
							<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/about/">
								אודות
							</Link>
							, לחזור ל־{' '}
							<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/">
								דף הבית
							</Link>
							, ולקרוא על{' '}
							<Link
								className="font-medium text-primary underline-offset-2 hover:underline"
								href="/blog/meeting-preparation-checklist/"
							>
								הכנה לפגישה
							</Link>
							.
						</p>
						<h3 className="font-heading text-xl font-semibold text-foreground">ערוץ פנייה</h3>
						<p className="text-pretty text-sm leading-relaxed text-muted-foreground">
							בשיחה הראשונה מתמקדים במיפוי עובדות, דחיפות וצעדים לשבוע הקרוב. אין צורך בתיק מושלם; כן כדאי שאלות
							כתובות ומסמכים מרכזיים.
						</p>
						<p className="text-pretty leading-relaxed text-muted-foreground">
							ניתן לפנות בדוא״ל - המענה ניתן במסגרת הזמינות המקצועית, בצורה עניינית ומכבדת.
						</p>
					</div>
				</div>

				<Card className="w-full max-w-lg shrink-0 border-border/60 shadow-md lg:sticky lg:top-24">
					<CardHeader className="text-right">
						<CardTitle className="font-heading text-xl">יצירת קשר</CardTitle>
						<CardDescription className="text-pretty">
							כתבו בקצרה את הנושא והמטרה - נחזור עם הצעדים הבאים המתאימים.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-4 text-right">
						<p className="text-sm leading-relaxed text-muted-foreground">
							<strong className="text-foreground">דוא״ל:</strong>{' '}
							<a className="font-medium text-primary underline-offset-2 hover:underline" href={mailtoHref}>
								{SITE_CONTACT_EMAIL}
							</a>
						</p>
						<p className="text-xs text-muted-foreground">
							ניתן לשנות כתובת יעד בפריסה באמצעות משתנה סביבה{' '}
							<code className="rounded bg-muted px-1">NEXT_PUBLIC_CONTACT_EMAIL</code>.
						</p>
						<a className={cn(buttonVariants({ className: 'w-full justify-center' }), 'no-underline')} href={mailtoHref}>
							פתיחת דוא״ל
						</a>
					</CardContent>
				</Card>
			</section>
		</SiteShell>
	);
}
