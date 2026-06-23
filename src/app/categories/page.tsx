import Link from 'next/link';
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
				<MainPageHero hero={MAIN_PAGE_HEROES['/categories/']} eyebrow="נושאים · Topics" />

				<p className="mt-8 max-w-2xl text-pretty text-right text-lg leading-relaxed text-muted-foreground">
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

				<section className="mt-14">
					<p className="kicker mb-2">מדור · נושאי הליבה</p>
					<ol className="flex flex-col border-t-2 border-foreground">
						{categories.map((category, index) => (
							<li key={category} className="border-b border-border">
								<Link
									className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-5 py-7 no-underline"
									href={`/categories/${category}/`}
								>
									<span className="folio text-2xl text-muted-foreground transition-colors group-hover:text-primary sm:text-3xl">
										{String(index + 1).padStart(2, '0')}
									</span>
									<h2 className="font-serif text-2xl font-extrabold text-foreground transition-colors group-hover:text-primary sm:text-3xl">
										{getCategoryLabel(category)}
									</h2>
									<span className="kicker self-center transition-colors group-hover:text-primary">קריאה ←</span>
								</Link>
							</li>
						))}
					</ol>
				</section>
			</div>
		</SiteShell>
	);
}
