import Link from 'next/link';
import { PageSection } from '@/components/layout/PageSection';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { MainPageHero } from '@/components/seo/MainPageHero';
import { EntityByline } from '@/components/seo/EntityByline';
import { AttorneyCredentialBlock } from '@/components/seo/AttorneyCredentialBlock';
import { SiteShell } from '@/components/layout/SiteShell';
import { buildPageMetadata } from '@/lib/metadata';
import { replaceEmDashDeep } from '@/lib/content/sanitize-user-facing-text';
import { BreadcrumbNav } from '@/components/navigation/BreadcrumbNav';
import { SITE_URL } from '@/consts';
import { buildPersonSchema, readPersonSameAsUrls, SITE_PERSON_ID } from '@/lib/seo/schema-person';
import type { MainPageHero as MainPageHeroData } from '@/lib/seo/hero-rules';
import {
	buildBreadcrumbSchema,
	buildFaqSchema,
	buildWebPageSchema,
} from '@/utils/structured-data';

export const dynamic = 'force-static';

const PAGE_PATH = '/guy-avni/';
const PAGE_OG_IMAGE = `${SITE_URL}/images/shared/guy-avni-avni-guy-law-firm-lawyer-og-law-fallback-photo-1.jpg`;
const PAGE_DATE_MODIFIED = '2026-07-14';

const HERO: MainPageHeroData = {
	path: PAGE_PATH,
	eyebrow: 'Guy Avni · תעתיק לטיני',
	h1: 'Guy Avni - גיא אבני עורך דין',
	subhead: 'כרטיס יישות לתעתיק הלטיני: מי זה גיא אבני, במה הוא מלווה, ואיפה עמוד האודות המלא.',
	intro:
		'אם חיפשתם Guy Avni או guy-avni באנגלית או בתעתיק - הגעתם לכרטיס גשר בעברית. עמוד היישות המקצועי המלא נמצא ב־/about/; כאן תמצאו זהות, תחומי ליווי וקישור ישיר לשם.',
	keyword: 'גיא אבני עורך דין',
};

export const metadata = buildPageMetadata({
	title: 'Guy Avni | גיא אבני עורך דין',
	description:
		'Guy Avni (גיא אבני) עורך דין - כרטיס תעתיק לטיני: זהות מקצועית, תחומי ליווי, וקישור לעמוד היישות המלא ב־/about/.',
	keyword: 'גיא אבני עורך דין',
	keywords: ['גיא אבני עורך דין', 'גיא אבני'],
	path: PAGE_PATH,
	absoluteTitle: true,
	image: PAGE_OG_IMAGE,
});

const IDENTITY_FACTS = [
	{
		title: 'שם בעברית',
		text: 'גיא אבני - עורך דין ישראלי. זהו השם הרשמי בעמוד היישות ובתוכן האתר.',
	},
	{
		title: 'תעתיק לטיני',
		text: 'Guy Avni / guy-avni הוא התעתיק הלטיני של אותו אדם - לא מותג נפרד ולא אתר באנגלית.',
	},
	{
		title: 'עמוד יישות',
		text: 'העוגן המקצועי לחיפושי מותג בעברית הוא /about/ - תחומי ליווי, תהליך עבודה ושאלות נפוצות.',
	},
] as const;

const PRACTICE_LINKS = [
	{
		title: 'נדל״ן ומיסוי מקרקעין',
		text: 'מכירה, רכישה, מס שבח, מס רכישה ורישום - הכנה מוקדמת לפני חתימה.',
		href: '/categories/tax/',
	},
	{
		title: 'חוזים וסכסוכים',
		text: 'בדיקת חוזה, סימון סיכונים וליווי מו״מ לפני התחייבות.',
		href: '/categories/contracts/',
	},
	{
		title: 'ליווי עסקי וליטיגציה',
		text: 'חוזים שוטפים, ציות, והכנה להליך אזרחי כשיש צורך.',
		href: '/services/',
	},
] as const;

const BRIDGE_FAQ = replaceEmDashDeep([
	{
		question: 'מי זה Guy Avni?',
		answer:
			'Guy Avni הוא התעתיק הלטיני של גיא אבני, עורך דין ישראלי. עמוד זה הוא כרטיס גשר לתעתיק; עמוד היישות המלא הוא /about/.',
	},
	{
		question: 'למה קיים עמוד /guy-avni/ בנוסף ל־/about/?',
		answer:
			'חיפושים ומקורות באנגלית או בתעתיק לטיני (Guy Avni, guy-avni) צריכים כתובת ברורה בעברית שמזהה את האדם ומפנה לעמוד היישות. זה לא אתר אנגלי ולא דף ריק.',
	},
	{
		question: 'באילו תחומים מלווה גיא אבני?',
		answer:
			'נדל״ן ומיסוי מקרקעין, חוזים, סכסוכים אזרחיים, ליטיגציה וליווי שוטף לעסקים. פירוט מלא בעמוד השירותים ובעמוד האודות.',
	},
	{
		question: 'האם התוכן כאן הוא ייעוץ משפטי?',
		answer:
			'לא. הכרטיס והמדריכים באתר נועדו לזהות ולהכנה בלבד. ייעוץ אישי ניתן רק אחרי בירור עובדות בפגישת מיקוד.',
	},
]);

export default function GuyAvniBridgePage() {
	let jsonLd: Record<string, unknown>[] = [];
	try {
		const breadcrumbItems = [
			{ name: 'דף הבית', path: '/' },
			{ name: 'Guy Avni', path: PAGE_PATH },
		];
		const sameAs = readPersonSameAsUrls();

		jsonLd = [
			buildBreadcrumbSchema(breadcrumbItems),
			buildPersonSchema({ sameAs: sameAs.length ? sameAs : undefined }),
			buildWebPageSchema({
				'@id': `${SITE_URL}${PAGE_PATH}#webpage`,
				url: `${SITE_URL}${PAGE_PATH}`,
				name: 'Guy Avni | גיא אבני עורך דין',
				description:
					'כרטיס תעתיק לטיני לגיא אבני עורך דין: זהות, תחומי ליווי וקישור לעמוד היישות /about/.',
				dateModified: PAGE_DATE_MODIFIED,
				'@type': 'WebPage',
				mainEntity: { '@id': SITE_PERSON_ID },
			}),
			buildFaqSchema([...BRIDGE_FAQ]),
		];

		return (
			<SiteShell currentPath={PAGE_PATH} extraJsonLd={jsonLd}>
				<div className="flex flex-col">
					<BreadcrumbNav items={breadcrumbItems} />
					<MainPageHero hero={HERO} index="11" eyebrow="Guy Avni · גיא אבני" />
					<EntityByline lastUpdatedLabel="יולי 2026" />
					<AttorneyCredentialBlock />

					<PageSection className="mt-16">
						<SectionHeader index={1} eyebrow="גשר תעתיק" title="למה קיים כרטיס /guy-avni/" />
						<div className="mt-6 flex max-w-3xl flex-col gap-4 text-pretty leading-relaxed text-muted-foreground">
							<p>
								עמוד זה מזהה את התעתיק הלטיני Guy Avni עם{' '}
								<Link className="link-underline" href="/about/">
									גיא אבני עורך דין
								</Link>
								. הוא קצר במכוון: כרטיס זהות + כיוון לעמוד היישות, לא שכפול מלא של /about/ ולא אתר באנגלית.
							</p>
						</div>
					</PageSection>

					<PageSection>
						<SectionHeader index={2} eyebrow="זהות" title="עובדות זהות בקצרה" />
						<div className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-3">
							{IDENTITY_FACTS.map(({ title, text }) => (
								<div key={title} className="flex flex-col gap-3 bg-background p-8">
									<h3 className="font-heading text-lg font-semibold text-foreground">{title}</h3>
									<p className="text-pretty text-sm leading-relaxed text-muted-foreground">{text}</p>
								</div>
							))}
						</div>
					</PageSection>

					<PageSection>
						<SectionHeader index={3} eyebrow="תחומים" title="תחומי ליווי מקושרים" />
						<div className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-3">
							{PRACTICE_LINKS.map(({ title, text, href }) => (
								<div key={title} className="flex flex-col gap-3 bg-background p-8">
									<h3 className="font-heading text-lg font-semibold text-foreground">
										<Link className="link-underline text-foreground" href={href}>
											{title}
										</Link>
									</h3>
									<p className="text-pretty text-sm leading-relaxed text-muted-foreground">{text}</p>
								</div>
							))}
						</div>
					</PageSection>

					<PageSection>
						<SectionHeader index={4} eyebrow="עמוד יישות" title="המשך לעמוד האודות" />
						<div className="mt-6 flex max-w-3xl flex-col gap-4 text-pretty leading-relaxed text-muted-foreground">
							<p>
								לפירוט מלא על דרך העבודה, פגישת מיקוד ושאלות נפוצות - עברו ל
								<Link className="link-underline" href="/about/">
									עמוד היישות /about/
								</Link>
								. לשירותים ולפנייה:{' '}
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
					</PageSection>

					<PageSection>
						<SectionHeader index={5} eyebrow="שאלות נפוצות" title="שאלות על Guy Avni / גיא אבני" />
						<div className="mt-8 flex max-w-3xl flex-col gap-6">
							{BRIDGE_FAQ.map(({ question, answer }) => (
								<div key={question} className="border-b border-border pb-6 last:border-b-0">
									<h3 className="font-heading text-lg font-semibold text-foreground">{question}</h3>
									<p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">{answer}</p>
								</div>
							))}
						</div>
					</PageSection>

					<PageSection>
						<div className="grid gap-8 lg:grid-cols-12">
							<div className="lg:col-span-4">
								<span className="font-mono text-xs text-muted-foreground">06 / CTA</span>
							</div>
							<div className="flex flex-col gap-4 text-right lg:col-span-8">
								<h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
									עמוד היישות המלא
								</h2>
								<p className="max-w-3xl text-pretty leading-relaxed text-muted-foreground">
									<Link className="link-underline font-medium text-foreground" href="/about/">
										לעמוד /about/ - גיא אבני עורך דין
									</Link>
								</p>
							</div>
						</div>
					</PageSection>
				</div>
			</SiteShell>
		);
	} catch (err) {
		console.error('[guy-avni] page render failed', { err });
		throw err;
	}
}
