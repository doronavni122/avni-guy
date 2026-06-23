import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
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
			<article className="flex flex-col">
				<BreadcrumbNav items={breadcrumbItems} />
				<MainPageHero hero={MAIN_PAGE_HEROES['/contact/']} eyebrow="יצירת קשר · Contact" />

				<div className="mt-16 grid gap-x-12 gap-y-10 border-t-2 border-foreground pt-10 lg:grid-cols-12">
					<section className="flex flex-col gap-5 text-right lg:col-span-7">
						<p className="kicker">לפני שמתחילים</p>
						<h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground text-balance">
							מה להכין לפני פנייה
						</h2>
						<p className="drop-cap max-w-2xl text-pretty text-lg leading-relaxed text-foreground">
							כדאי להכין רקע קצר, מסמכים מרכזיים ושאלות ממוקדות. לפני פנייה מומלץ לעבור על{' '}
							<Link className="link-underline" href="/services/">
								השירותים
							</Link>
							, לקרוא ב־{' '}
							<Link className="link-underline" href="/blog/">
								בלוג
							</Link>
							, לבדוק{' '}
							<Link className="link-underline" href="/categories/">
								קטגוריות
							</Link>{' '}
							ו־{' '}
							<Link className="link-underline" href="/tags/">
								תגיות
							</Link>
							, לעיין ב־{' '}
							<Link className="link-underline" href="/about/">
								אודות
							</Link>
							, לחזור ל־{' '}
							<Link className="link-underline" href="/">
								דף הבית
							</Link>
							, ולקרוא על{' '}
							<Link className="link-underline" href="/blog/meeting-preparation-checklist/">
								הכנה לפגישה
							</Link>
							.
						</p>
						<h3 className="mt-4 font-serif text-2xl font-bold text-foreground">ערוץ פנייה</h3>
						<p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">
							בשיחה הראשונה מתמקדים במיפוי עובדות, דחיפות וצעדים לשבוע הקרוב. אין צורך בתיק מושלם; כן כדאי שאלות
							כתובות ומסמכים מרכזיים.
						</p>
						<p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">
							ניתן לפנות בדוא״ל - המענה ניתן במסגרת הזמינות המקצועית, בצורה עניינית ומכבדת.
						</p>
					</section>

					<aside className="lg:col-span-5">
						<div className="flex flex-col gap-5 border-2 border-foreground bg-card p-8 text-right">
							<p className="kicker">פנייה ישירה</p>
							<h2 className="font-serif text-2xl font-extrabold text-foreground">יצירת קשר</h2>
							<p className="text-pretty leading-relaxed text-muted-foreground">
								כתבו בקצרה את הנושא והמטרה - נחזור עם הצעדים הבאים המתאימים.
							</p>
							<hr className="border-border" />
							<p className="leading-relaxed text-muted-foreground">
								<span className="kicker block">דוא״ל</span>
								<a className="link-underline text-lg" href={mailtoHref}>
									{SITE_CONTACT_EMAIL}
								</a>
							</p>
							<a
								className={cn(buttonVariants({ className: 'w-full justify-center' }), 'no-underline')}
								href={mailtoHref}
							>
								פתיחת דוא״ל
							</a>
							<p className="text-xs leading-relaxed text-muted-foreground">
								ניתן לשנות כתובת יעד בפריסה באמצעות משתנה סביבה{' '}
								<code className="bg-muted px-1 font-mono">NEXT_PUBLIC_CONTACT_EMAIL</code>.
							</p>
						</div>
					</aside>
				</div>
			</article>
		</SiteShell>
	);
}
