import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MainPageHero } from '@/components/seo/MainPageHero';
import { SiteShell } from '@/components/layout/SiteShell';
import { getCategories } from '@/lib/content/posts';
import { getCategoryLabel } from '@/utils/taxonomy-labels';
import { MAIN_PAGE_HEROES } from '@/lib/seo/main-page-heroes';
import { buildPageMetadata } from '@/lib/metadata';
import { buildBreadcrumbSchema } from '@/utils/structured-data';

export const dynamic = 'force-static';

export const metadata = buildPageMetadata({
	title: 'גיא אבני עורך דין | קטגוריות מאמרים לפי תחום',
	description:
		'גיא אבני עורך דין: קטגוריות מאמרים לפי תחום - אסטרטגיה, שירות, מסמכים ונדל״ן. בחרו נושא, קראו שני מאמרים והחליטו על הצעד הבא.',
	keyword: 'גיא אבני עורך דין',
	path: '/categories/',
});

export default async function CategoriesIndexPage() {
	const categories = await getCategories();
	const jsonLd = buildBreadcrumbSchema([
		{ name: 'דף הבית', path: '/' },
		{ name: 'קטגוריות', path: '/categories' },
	]);

	return (
		<SiteShell currentPath="/categories/" extraJsonLd={jsonLd}>
			<section className="flex flex-col gap-10">
				<MainPageHero hero={MAIN_PAGE_HEROES['/categories/']} />
				<Separator className="bg-border/60" />
				<p className="max-w-3xl text-pretty text-right leading-relaxed text-muted-foreground">
					בחרו תחום אחד, קראו שני מאמרים שלא חוזרים על אותו מסר, ואז עברו ל־{' '}
					<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/tags/">
						תגיות
					</Link>{' '}
					או ל־{' '}
					<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/contact/">
						יצירת קשר
					</Link>{' '}
					אם נשארה שאלה פתוחה.
				</p>
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{categories.map((category) => (
						<Link key={category} className="group block no-underline" href={`/categories/${category}/`}>
							<Card className="border-border/60 bg-card/70 shadow-sm transition-all group-hover:border-primary/25 group-hover:shadow-md">
								<CardHeader className="text-right">
									<CardTitle className="font-heading text-lg transition-colors group-hover:text-primary">
										{getCategoryLabel(category)}
									</CardTitle>
								</CardHeader>
								<CardContent className="text-right text-sm text-muted-foreground">מעבר למאמרים בקטגוריה</CardContent>
							</Card>
						</Link>
					))}
				</div>
			</section>
		</SiteShell>
	);
}
