import Link from 'next/link';
import { MainPageHero } from '@/components/seo/MainPageHero';
import { SiteShell } from '@/components/layout/SiteShell';
import { MAIN_PAGE_HEROES } from '@/lib/seo/main-page-heroes';
import { buildPageMetadata } from '@/lib/metadata';
import { BreadcrumbNav } from '@/components/navigation/BreadcrumbNav';
import { buildBreadcrumbSchema } from '@/utils/structured-data';

export const dynamic = 'force-static';

export const metadata = buildPageMetadata({
	title: 'גיא אבני עו״ד | ערכים, ניסיון ודרך עבודה מקצועית',
	description:
		'גיא אבני עו״ד מציג ערכים, ניסיון ודרך עבודה: שקיפות, סיכומים אחרי שיחות, מיפוי סיכונים וציפיות ברורות מהיום הראשון. קראו לפני פגישת מיקוד.',
	keyword: 'גיא אבני עו״ד',
	path: '/about/',
});

const PRINCIPLES = [
	[
		'I',
		'ערכים',
		'שקיפות, זמינות וחשיבה אסטרטגית כבסיס לכל שיחה ולכל מסמך: מה כלול בליווי, מה לא, ואיך מתקבלות החלטות בזמן אמת.',
	],
	[
		'II',
		'דרך עבודה',
		'מיפוי צעדים, סיכומים ברורים אחרי שיחות ובקרה שוטפת: פגישת מיקוד, תמונת סיכונים, ועדכון כשמשהו משתנה בשטח.',
	],
] as const;

export default function AboutPage() {
	const breadcrumbItems = [
		{ name: 'דף הבית', path: '/' },
		{ name: 'אודות', path: '/about' },
	];
	const jsonLd = buildBreadcrumbSchema(breadcrumbItems);

	return (
		<SiteShell currentPath="/about/" extraJsonLd={jsonLd}>
			<article className="flex flex-col">
				<BreadcrumbNav items={breadcrumbItems} />
				<MainPageHero hero={MAIN_PAGE_HEROES['/about/']} eyebrow="אודות · About" />

				<section className="mt-16 border-t-2 border-foreground pt-10" aria-label="עקרונות">
					<p className="kicker mb-8">העקרונות שמנחים את העבודה</p>
					<div className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
						{PRINCIPLES.map(([num, title, text]) => (
							<div key={title} className="flex gap-5">
								<span className="folio mt-1 shrink-0 text-2xl leading-none text-primary" aria-hidden="true">
									{num}
								</span>
								<div className="flex flex-col gap-2 border-t border-border pt-3">
									<h2 className="font-serif text-2xl font-extrabold text-foreground">{title}</h2>
									<p className="text-pretty leading-relaxed text-muted-foreground">{text}</p>
								</div>
							</div>
						))}
					</div>
				</section>

				<section className="mt-16 grid gap-x-12 gap-y-6 border-t border-border pt-10 lg:grid-cols-12">
					<header className="lg:col-span-4">
						<p className="kicker">ערכי העבודה</p>
						<h2 className="mt-3 font-serif text-3xl font-extrabold leading-tight tracking-tight text-foreground text-balance">
							ערכי העבודה שמובילים את גיא אבני עו״ד
						</h2>
					</header>
					<div className="flex flex-col gap-5 text-right lg:col-span-8">
						<p className="drop-cap max-w-2xl text-pretty text-lg leading-relaxed text-foreground">
							העבודה שלי נשענת על שקיפות, זמינות וחשיבה אסטרטגית. אפשר להעמיק דרך עמוד{' '}
							<Link className="link-underline" href="/services/">
								השירותים
							</Link>
							, לקרוא את{' '}
							<Link className="link-underline" href="/blog/">
								הבלוג
							</Link>
							, לעיין ב־
							<Link className="link-underline" href="/categories/">
								קטגוריות
							</Link>
							, לנווט לפי{' '}
							<Link className="link-underline" href="/tags/">
								תגיות
							</Link>
							, לבדוק את{' '}
							<Link className="link-underline" href="/">
								דף הבית
							</Link>
							, לעבור ל־{' '}
							<Link className="link-underline" href="/contact/">
								יצירת קשר
							</Link>{' '}
							ולקרוא על{' '}
							<Link className="link-underline" href="/blog/document-readiness-guide/">
								מוכנות מסמכים
							</Link>
							.
						</p>
						<h3 className="mt-4 font-serif text-2xl font-bold text-foreground">למי זה מתאים</h3>
						<p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">
							האתר מתאים למי שמחפש ליווי מקצועי בשפה פרקטית, עם דגש על תכנון מוקדם, צעדים ישימים ותוכן שמחבר בין ידע משפטי לבין
							החלטות יומיומיות. התוכן באתר אינו תחליף לייעוץ אישי; כשיש סיכון מהותי, עדיף שיחה ממוקדת.
						</p>
					</div>
				</section>
			</article>
		</SiteShell>
	);
}
