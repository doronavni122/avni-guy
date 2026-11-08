import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { MainPageHero } from '@/components/seo/MainPageHero';
import { YmylDisclaimer } from '@/components/seo/YmylDisclaimer';
import { SiteShell } from '@/components/layout/SiteShell';
import { MAIN_PAGE_HEROES } from '@/lib/seo/main-page-heroes';
import { cn } from '@/lib/utils';
import { SITE_CONTACT_EMAIL } from '@/consts';
import { buildPageMetadata } from '@/lib/metadata';
import { mainPageOgImageUrl } from '@/lib/seo/main-page-og';
import { hasVisibleOfficeNap, readOfficeNap } from '@/lib/seo/office-nap';
import { buildPersonSchema, readPersonSameAsUrls } from '@/lib/seo/schema-person';
import { BreadcrumbNav } from '@/components/navigation/BreadcrumbNav';
import {
	buildBreadcrumbSchema,
	buildContactPageSchema,
	buildFaqSchema,
} from '@/utils/structured-data';

export const dynamic = 'force-static';

const mailtoHref = `mailto:${SITE_CONTACT_EMAIL}?subject=${encodeURIComponent('פנייה מהאתר')}`;
const CONTACT_DATE_MODIFIED = '2026-11-08';

const CONTACT_FAQ = [
	{
		question: 'מה כדאי לכתוב במייל הראשון?',
		answer:
			'נושא קצר, מטרה אחת ברורה, דחיפות (ימים/שבועות), ומי מעורב בהחלטה. שלושה עד חמישה משפטים מספיקים — בלי כתב תביעה.',
	},
	{
		question: 'אילו מסמכים להכין לפני שיחת מיקוד?',
		answer:
			'טיוטת חוזה או מכתב רלוונטי, תכתובת מרכזית, ולוח זמנים ידוע (מועדי חתימה/דיווח). אין צורך בתיק מושלם; כן כדאי רשימת שאלות כתובה.',
	},
	{
		question: 'כמה זמן נמשכת פגישת המיקוד הראשונה?',
		answer:
			'בדרך כלל שיחה קצרה וממוקדת: מיפוי עובדות, סיכונים, וצעדים לשבוע הקרוב. בסופה מקבלים סיכום קצר — בלי הבטחת תוצאה.',
	},
	{
		question: 'האם פנייה בדוא״ל נחשבת לייעוץ משפטי?',
		answer:
			'לא. תיאום ושיחת מיקוד הם שלב היכרות. ייעוץ או ייצוג אישי מתחילים רק אחרי בירור עובדות והסכמה על מסגרת הליווי.',
	},
] as const;

export const metadata = buildPageMetadata({
	title: 'גיא אבני | יצירת קשר ותיאום שיחה',
	description:
		'גיא אבני: תיאום שיחה בדוא״ל, מה להכין לפני פנייה, ומה צפוי בשיחה הראשונה - סיכום קצר, צעדים ברורים וללא הבטחות בלתי אפשריות. התוכן באתר אינו תחליף לייעוץ.',
	keyword: 'גיא אבני',
	path: '/contact/',
	absoluteTitle: true,
	image: mainPageOgImageUrl('/contact/'),
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
		buildContactPageSchema({
			name: 'יצירת קשר — תיאום שיחה',
			description:
				'תיאום פגישת מיקוד בדוא״ל: מה להכין, מה צפוי בשיחה הראשונה, ופרטי קשר גלויים בדף.',
			dateModified: CONTACT_DATE_MODIFIED,
			email: SITE_CONTACT_EMAIL,
			telephone: officeNap.phone,
			areaServedName: 'Israel',
		}),
		buildFaqSchema(CONTACT_FAQ.map((item) => ({ question: item.question, answer: item.answer }))),
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
							לפני שכותבים, עצרו דקה: מה ההחלטה שאתם צריכים השבוע, ומה כבר יודעים בוודאות. הכינו פסקה אחת על
							הרקע, רשימת מסמכים מרכזיים (גם אם חלקיים), ושתיים–שלוש שאלות ממוקדות. לפני פנייה מומלץ לעבור על{' '}
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
							, ולקרוא על{' '}
							<Link className="link-underline" href="/blog/meeting-preparation-checklist/">
								הכנה לפגישה
							</Link>
							.
						</p>
						<ol className="list-decimal space-y-2 pr-5 text-sm leading-relaxed text-muted-foreground">
							<li>
								<strong className="text-foreground">מטרה:</strong> מה ייחשב הצלחה בשיחה הראשונה (בהירות / צעד
								בשבוע).
							</li>
							<li>
								<strong className="text-foreground">דחיפות:</strong> מועד חתימה, דיווח או תגובה לצד שני.
							</li>
							<li>
								<strong className="text-foreground">מסמכים:</strong> טיוטה, מכתב, או תכתובת שמגדירה את המחלוקת.
							</li>
							<li>
								<strong className="text-foreground">שאלות:</strong> כתבו אותן מראש — כך השיחה לא מתפזרת.
							</li>
						</ol>
						<h3 className="mt-2 font-heading text-xl font-semibold text-foreground">ערוץ פנייה</h3>
						<p className="text-pretty text-sm leading-relaxed text-muted-foreground">
							בשיחה הראשונה מתמקדים במיפוי עובדות, דחיפות וצעדים לשבוע הקרוב. אין צורך בתיק מושלם; כן כדאי שאלות
							כתובות ומסמכים מרכזיים. ניתן לפנות בדוא״ל — המענה ניתן במסגרת הזמינות המקצועית, בצורה עניינית
							ומכבדת.
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
						<p className="text-sm leading-relaxed text-muted-foreground">
							<strong className="text-foreground">אזור שירות:</strong> ישראל
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

				<section className="mt-14 flex flex-col gap-6 text-right" aria-labelledby="contact-faq-title">
					<h2 id="contact-faq-title" className="font-heading text-2xl font-semibold tracking-tight text-foreground">
						שאלות נפוצות לפני פנייה
					</h2>
					<div className="flex max-w-3xl flex-col gap-6">
						{CONTACT_FAQ.map((item) => (
							<div key={item.question} className="border-b border-border pb-6 last:border-b-0">
								<h3 className="font-heading text-lg font-semibold text-foreground">{item.question}</h3>
								<p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
							</div>
						))}
					</div>
				</section>

				<div className="mt-10 border-t border-border pt-6">
					<YmylDisclaimer />
				</div>
			</div>
		</SiteShell>
	);
}
