import Link from 'next/link';
import { PageSection } from '@/components/layout/PageSection';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { MainPageHero } from '@/components/seo/MainPageHero';
import { SiteShell } from '@/components/layout/SiteShell';
import { getCategories } from '@/lib/content/posts';
import { getCategoryLabel } from '@/utils/taxonomy-labels';
import { MAIN_PAGE_HEROES } from '@/lib/seo/main-page-heroes';
import { buildPageMetadata } from '@/lib/metadata';
import { BreadcrumbNav } from '@/components/navigation/BreadcrumbNav';
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
	const breadcrumbItems = [
		{ name: 'דף הבית', path: '/' },
		{ name: 'קטגוריות', path: '/categories' },
	];
	const jsonLd = buildBreadcrumbSchema(breadcrumbItems);

	return (
		<SiteShell currentPath="/categories/" extraJsonLd={jsonLd}>
			<div className="flex flex-col">
				<BreadcrumbNav items={breadcrumbItems} />
				<MainPageHero hero={MAIN_PAGE_HEROES['/categories/']} index="04" eyebrow="נושאים / Topics" />

				<p className="mt-8 max-w-3xl text-pretty text-right leading-relaxed text-muted-foreground">
					בחרו תחום אחד, קראו שני מאמרים שלא חוזרים על אותו מסר, ואז עברו ל־{' '}
					<Link className="link-underline" href="/tags/">
						תגיות
					</Link>{' '}
					או ל־{' '}
					<Link className="link-underline" href="/contact/">
						יצירת קשר
					</Link>{' '}
					אם נשארה שאלה פתוחה.
				</p>

				<PageSection className="mt-12">
					<SectionHeader
						index={1}
						eyebrow="קטגוריות / Categories"
						title="בחרו תחום וקראו מאמרים ממוקדים"
						description="כל קטגוריה מרכזת מאמרים באותו תחום משפטי."
					/>
					<div className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
					{categories.map((category, index) => (
						<Link
							key={category}
							className="group flex flex-col gap-6 bg-background p-8 no-underline transition-colors hover:bg-card"
							href={`/categories/${category}/`}
						>
							<div className="flex items-center justify-between">
								<span className="font-mono text-xs text-muted-foreground">
									{String(index + 1).padStart(2, '0')}
								</span>
								<span className="h-px w-8 bg-border transition-colors group-hover:bg-primary" aria-hidden="true" />
							</div>
							<div className="flex flex-col gap-1 text-right">
								<h2 className="font-heading text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
									{getCategoryLabel(category)}
								</h2>
								<span className="text-sm text-muted-foreground">מעבר למאמרים בקטגוריה</span>
							</div>
						</Link>
					))}
					</div>
				</PageSection>
			</div>
		</SiteShell>
	);
}
