import Link from 'next/link';
import { PageSection } from '@/components/layout/PageSection';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { MainPageHero } from '@/components/seo/MainPageHero';
import { SiteShell } from '@/components/layout/SiteShell';
import { MAIN_PAGE_HEROES } from '@/lib/seo/main-page-heroes';
import { buildPageMetadata } from '@/lib/metadata';
import { BreadcrumbNav } from '@/components/navigation/BreadcrumbNav';
import { buildPersonSchema, readPersonSameAsUrls } from '@/lib/seo/schema-person';
import { buildBreadcrumbSchema, buildFaqSchema } from '@/utils/structured-data';

export const dynamic = 'force-static';

export const metadata = buildPageMetadata({
	title: 'גיא אבני | עורך דין',
	description:
		'גיא אבני עורך דין — עמוד היישות המקצועי: תחומי ליווי, ניסיון, דרך עבודה ויצירת קשר. נקודת עוגן לחיפוש גיא אבני וגיא אבני עורך דין.',
	keyword: 'גיא אבני עורך דין',
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

const KNOWS_ABOUT = [
	'דיני נדל״ן ומיסוי מקרקעין',
	'חוזים וסכסוכים אזרחיים',
	'ליווי עסקי וציות',
	'תכנון מוקדם לפני תביעה או חתימה',
] as const;

const BRAND_FAQ = [
	{
		question: 'מי זה גיא אבני?',
		answer:
			'גיא אבני הוא עורך דין המלווה פרטיים ועסקים בנדל״ן, מיסוי, חוזים וליטיגציה. עמוד זה הוא עמוד היישות המקצועי של avniguy.co.il.',
	},
	{
		question: 'גיא אבני עורך דין — באילו תחומים?',
		answer:
			'תחומי ליווי עיקריים: נדל״ן ומיסוי מקרקעין, חוזים, סכסוכים אזרחיים, וליווי שוטף לעסקים. פירוט נוסף בעמוד השירותים ובמאמרי הבלוג.',
	},
	{
		question: 'איך ליצור קשר עם גיא אבני?',
		answer:
			'ניתן ליצור קשר דרך עמוד יצירת הקשר באתר לתיאום שיחת מיקוד. מומלץ לקרוא מאמר רלוונטי או עמוד שירות לפני הפנייה.',
	},
] as const;

export default function AboutPage() {
	const breadcrumbItems = [
		{ name: 'דף הבית', path: '/' },
		{ name: 'גיא אבני עורך דין', path: '/about' },
	];
	const sameAs = readPersonSameAsUrls();
	const jsonLd = [
		buildBreadcrumbSchema(breadcrumbItems),
		buildPersonSchema({ sameAs: sameAs.length ? sameAs : undefined }),
		buildFaqSchema([...BRAND_FAQ]),
	];

	return (
		<SiteShell currentPath="/about/" extraJsonLd={jsonLd}>
			<div className="flex flex-col">
				<BreadcrumbNav items={breadcrumbItems} />
				<MainPageHero hero={MAIN_PAGE_HEROES['/about/']} index="01" eyebrow="גיא אבני · עורך דין" />

				<PageSection className="mt-16">
					<SectionHeader index={1} eyebrow="Entity home" title="עמוד יישות — גיא אבני עורך דין" />
					<p className="mt-6 max-w-3xl text-pretty leading-relaxed text-muted-foreground">
						עמוד זה הוא עמוד היישות המקצועי של האתר: כאן מרוכזים אותות מותג, סמכות ויצירת קשר עבור חיפושים על גיא אבני
						ועורך הדין גיא אבני. המאמרים בבלוג, עמוד השירותים ודף הבית מקשרים לכאן כנקודת עוגן אחת.
					</p>
				</PageSection>

				<PageSection>
					<SectionHeader index={2} eyebrow="Credentials" title="תחומי התמחות וניסיון" />
					<ul className="mt-6 flex max-w-3xl list-disc flex-col gap-2 pr-6 text-muted-foreground">
						{KNOWS_ABOUT.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
				</PageSection>

				<PageSection>
					<SectionHeader index={3} eyebrow="עקרונות / Principles" title="ערכים ודרך עבודה" />
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
							<span className="font-mono text-xs text-muted-foreground">04 / המשך ביקור</span>
						</div>
						<div className="flex flex-col gap-4 text-right lg:col-span-8">
							<h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
								המשך מעמוד היישות
							</h2>
							<p className="max-w-3xl text-pretty leading-relaxed text-muted-foreground">
								<Link className="link-underline" href="/services/">
									שירותים
								</Link>
								,{' '}
								<Link className="link-underline" href="/blog/">
									בלוג
								</Link>
								,{' '}
								<Link className="link-underline" href="/contact/">
									יצירת קשר
								</Link>
								.
							</p>
						</div>
					</div>
				</PageSection>
			</div>
		</SiteShell>
	);
}
