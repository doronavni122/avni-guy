import Link from 'next/link';
import { PageSection } from '@/components/layout/PageSection';
import { SectionHeader } from '@/components/layout/SectionHeader';
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
		'01',
		'ערכים',
		'שקיפות, זמינות וחשיבה אסטרטגית כבסיס לכל שיחה ולכל מסמך: מה כלול בליווי, מה לא, ואיך מתקבלות החלטות בזמן אמת.',
	],
	[
		'02',
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
			<div className="flex flex-col">
				<BreadcrumbNav items={breadcrumbItems} />
				<MainPageHero hero={MAIN_PAGE_HEROES['/about/']} index="01" eyebrow="אודות / About" />

				<PageSection className="mt-16">
					<SectionHeader index={1} eyebrow="עקרונות / Principles" title="ערכים ודרך עבודה" />
					<div className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-2">
					{PRINCIPLES.map(([num, title, text]) => (
						<div key={title} className="flex flex-col gap-4 bg-background p-8">
							<span className="font-mono text-xs text-muted-foreground">{num}</span>
							<h2 className="font-heading text-lg font-semibold text-foreground">{title}</h2>
							<p className="text-pretty text-sm leading-relaxed text-muted-foreground">{text}</p>
						</div>
					))}
					</div>
				</PageSection>

				<PageSection>
					<div className="grid gap-8 lg:grid-cols-12">
					<div className="lg:col-span-4">
						<span className="font-mono text-xs text-muted-foreground">02 / ערכי העבודה</span>
					</div>
					<div className="flex flex-col gap-4 text-right lg:col-span-8">
						<h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
							ערכי העבודה שמובילים את גיא אבני עו״ד
						</h2>
						<p className="max-w-3xl text-pretty leading-relaxed text-muted-foreground">
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
						<h3 className="mt-2 font-heading text-xl font-semibold text-foreground">למי זה מתאים</h3>
						<p className="max-w-3xl text-pretty leading-relaxed text-muted-foreground">
							האתר מתאים למי שמחפש ליווי מקצועי בשפה פרקטית, עם דגש על תכנון מוקדם, צעדים ישימים ותוכן שמחבר בין ידע משפטי לבין
							החלטות יומיומיות. התוכן באתר אינו תחליף לייעוץ אישי; כשיש סיכון מהותי, עדיף שיחה ממוקדת.
						</p>
					</div>
					</div>
				</PageSection>
			</div>
		</SiteShell>
	);
}
