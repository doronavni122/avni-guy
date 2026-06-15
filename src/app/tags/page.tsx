import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
			<section className="flex flex-col gap-10">
				<BreadcrumbNav items={breadcrumbItems} />
				<MainPageHero hero={MAIN_PAGE_HEROES['/tags/']} />
				<Separator className="bg-border/60" />
				<p className="max-w-3xl text-pretty text-right leading-relaxed text-muted-foreground">
					תגית צרה מצמצמת רעש: פתחו נושא אחד, השוו ל־{' '}
					<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/categories/">
						קטגוריה רחבה
					</Link>{' '}
					רק אם צריך הקשר נוסף, ואז המשיכו למאמר המלא מהארכיון.
				</p>
				<div className="flex flex-wrap justify-end gap-3">
					{tags.map((tag) => (
						<Link key={tag} className="no-underline" href={`/tags/${tag}/`}>
							<Card className="card-interactive transition-all hover:border-primary/25">
								<CardHeader className="p-0 text-right">
									<CardTitle className="font-heading text-sm font-semibold text-primary">{getTagLabel(tag)}</CardTitle>
								</CardHeader>
							</Card>
						</Link>
					))}
				</div>
			</section>
		</SiteShell>
	);
}
