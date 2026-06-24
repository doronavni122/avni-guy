import Link from 'next/link';
import { PageSection } from '@/components/layout/PageSection';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { MainPageHero } from '@/components/seo/MainPageHero';
import { SiteShell } from '@/components/layout/SiteShell';
import { getTags } from '@/lib/content/posts';
import { MAIN_PAGE_HEROES } from '@/lib/seo/main-page-heroes';
import { buildPageMetadata } from '@/lib/metadata';
import { BreadcrumbNav } from '@/components/navigation/BreadcrumbNav';
import { buildBreadcrumbSchema } from '@/utils/structured-data';
import { getTagLabel } from '@/utils/taxonomy-labels';

export const dynamic = 'force-static';

export const metadata = buildPageMetadata({
	title: 'גיא אבני משרד עורכי דין | תגיות לנושאים ממוקדים',
	description:
		'גיא אבני משרד עורכי דין: תגיות לנושאים צרים - זכויות רוכש, ציות, לקוחות ודין ישראלי. מצאו מאמר רלוונטי בלי לדפדף את כל הארכיון.',
	keyword: 'גיא אבני משרד עורכי דין',
	path: '/tags/',
});

export default async function TagsIndexPage() {
	const tags = await getTags();
	const breadcrumbItems = [
		{ name: 'דף הבית', path: '/' },
		{ name: 'תגיות', path: '/tags' },
	];
	const jsonLd = buildBreadcrumbSchema(breadcrumbItems);

	return (
		<SiteShell currentPath="/tags/" extraJsonLd={jsonLd}>
			<div className="flex flex-col">
				<BreadcrumbNav items={breadcrumbItems} />
				<MainPageHero hero={MAIN_PAGE_HEROES['/tags/']} index="05" eyebrow="תגיות / Tags" />

				<p className="mt-8 max-w-3xl text-pretty text-right leading-relaxed text-muted-foreground">
					תגית צרה מצמצמת רעש: פתחו נושא אחד, השוו ל־{' '}
					<Link className="link-underline" href="/categories/">
						קטגוריה רחבה
					</Link>{' '}
					רק אם צריך הקשר נוסף, ואז המשיכו למאמר המלא מהארכיון.
				</p>

				<PageSection className="mt-12">
					<SectionHeader
						index={1}
						eyebrow="תגיות / Tags"
						title="נושאים צרים לקריאה מהירה"
						description="תגית מצמצמת רעש ומובילה ישירות למאמרים רלוונטיים."
					/>
					<div className="mt-8 flex flex-wrap justify-end gap-px border border-border bg-border">
					{tags.map((tag) => (
						<Link
							key={tag}
							className="bg-background px-5 py-3 font-heading text-sm font-semibold text-foreground no-underline transition-colors hover:bg-primary hover:text-primary-foreground"
							href={`/tags/${tag}/`}
						>
							{getTagLabel(tag)}
						</Link>
					))}
					</div>
				</PageSection>
			</div>
		</SiteShell>
	);
}
