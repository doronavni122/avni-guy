import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { MainPageHero } from '@/components/seo/MainPageHero';
import { SiteShell } from '@/components/layout/SiteShell';
import { MAIN_PAGE_HEROES } from '@/lib/seo/main-page-heroes';
import { cn } from '@/lib/utils';
import { SITE_CONTACT_EMAIL } from '@/consts';
import { buildPageMetadata } from '@/lib/metadata';
import { hasVisibleOfficeNap, readOfficeNap } from '@/lib/seo/office-nap';
import { buildPersonSchema, readPersonSameAsUrls } from '@/lib/seo/schema-person';
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
	absoluteTitle: true,
});

export default function ContactPage() {
	const breadcrumbItems = [
		{ name: 'דף הבית', path: '/' },
		{ name: 'יצירת קשר', path: '/contact' },
	];
	const officeNap = readOfficeNap();
	const sameAs = readPersonSameAsUrls();
	const jsonLd = [
		buildBreadcrumbSchema(breadcrumbItems),
		buildPersonSchema({ sameAs: sameAs.length ? sameAs : undefined }),
	];

	return (
		<SiteShell currentPath="/contact/" extraJsonLd={jsonLd}>
			<div className="flex flex-col">
				<BreadcrumbNav items={breadcrumbItems} />
				<MainPageHero hero={MAIN_PAGE_HEROES['/contact/']} index="07" eyebrow="יצירת קשר / Contact" />

				<div className="mt-16 grid gap-px border border-border bg-border lg:grid-cols-12">
					<div className="flex flex-col gap-6 bg-background p-8 text-right lg:col-span-7 lg:p-10">
						<h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">מה להכין לפני פנייה</h2>
						<p className="text-pretty leading-relaxed text-muted-foreground">
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
						<h3 className="mt-2 font-heading text-xl font-semibold text-foreground">ערוץ פנייה</h3>
						<p className="text-pretty text-sm leading-relaxed text-muted-foreground">
							בשיחה הראשונה מתמקדים במיפוי עובדות, דחיפות וצעדים לשבוע הקרוב. אין צורך בתיק מושלם; כן כדאי שאלות
							כתובות ומסמכים מרכזיים.
						</p>
						<p className="text-pretty leading-relaxed text-muted-foreground">
							ניתן לפנות בדוא״ל - המענה ניתן במסגרת הזמינות המקצועית, בצורה עניינית ומכבדת.
						</p>
					</div>

					<aside className="flex flex-col gap-5 bg-card p-8 text-right lg:col-span-5 lg:p-10">
						<span className="swiss-label">פנייה ישירה</span>
						<h2 className="font-heading text-xl font-semibold text-foreground">יצירת קשר</h2>
						<p className="text-pretty text-sm leading-relaxed text-muted-foreground">
							כתבו בקצרה את הנושא והמטרה - נחזור עם הצעדים הבאים המתאימים.
						</p>
						<div className="swiss-rule" />
						{hasVisibleOfficeNap(officeNap) ? (
							<address className="not-italic text-sm leading-relaxed text-muted-foreground">
								{officeNap.street ? (
									<span className="block">
										<strong className="text-foreground">כתובת:</strong> {officeNap.street}
									</span>
								) : null}
								{officeNap.locality ? (
									<span className="block">
										<strong className="text-foreground">יישוב:</strong> {officeNap.locality}
									</span>
								) : null}
								{officeNap.phone ? (
									<span className="block">
										<strong className="text-foreground">טלפון:</strong>{' '}
										<a className="link-underline" href={`tel:${officeNap.phone.replace(/\s+/g, '')}`}>
											{officeNap.phone}
										</a>
									</span>
								) : null}
							</address>
						) : null}
						<p className="text-sm leading-relaxed text-muted-foreground">
							<strong className="text-foreground">דוא״ל:</strong>{' '}
							<a className="link-underline" href={mailtoHref}>
								{SITE_CONTACT_EMAIL}
							</a>
						</p>
						<a
							className={cn(buttonVariants({ className: 'w-full justify-center rounded-sm' }), 'no-underline')}
							href={mailtoHref}
						>
							פתיחת דוא״ל
						</a>
						<p className="text-xs text-muted-foreground">
							ניתן לשנות כתובת יעד בפריסה באמצעות משתנה סביבה{' '}
							<code className="rounded-sm bg-muted px-1">NEXT_PUBLIC_CONTACT_EMAIL</code>.
						</p>
					</aside>
				</div>
			</div>
		</SiteShell>
	);
}
