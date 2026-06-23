import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleList } from '@/components/blog/ArticleList';
import { SiteShell } from '@/components/layout/SiteShell';
import { getCategories, getPostsIndex } from '@/lib/content/posts';
import { buildPageMetadata } from '@/lib/metadata';
import { BreadcrumbNav } from '@/components/navigation/BreadcrumbNav';
import { buildBreadcrumbSchema } from '@/utils/structured-data';
import { getCategoryHubIntro } from '@/lib/seo/category-hub-intros';
import {
	buildCategoryMetaDescription,
	buildCategoryPageTitle,
	getCategoryLabel,
} from '@/utils/taxonomy-labels';

export const dynamic = 'force-static';

type PageProps = { params: Promise<{ category: string }> };

export async function generateStaticParams() {
	const categories = await getCategories();
	return categories.map((category) => ({ category }));
}

export async function generateMetadata({ params }: PageProps) {
	const { category } = await params;
	const categoryHe = getCategoryLabel(category);
	return buildPageMetadata({
		title: buildCategoryPageTitle(categoryHe),
		description: buildCategoryMetaDescription(categoryHe),
		keyword: 'אבני גיא',
		path: `/categories/${category}/`,
	});
}

export default async function CategoryPage({ params }: PageProps) {
	const { category } = await params;
	const { posts: allPosts, categories } = await getPostsIndex();
	const posts = allPosts.filter((post) => post.data.category === category);
	if (posts.length === 0) {
		if (!categories.includes(category)) notFound();
	}
	const categoryHe = getCategoryLabel(category);
	const hubIntro = getCategoryHubIntro(category);
	const breadcrumbItems = [
		{ name: 'דף הבית', path: '/' },
		{ name: 'קטגוריות', path: '/categories' },
		{ name: categoryHe, path: `/categories/${category}/` },
	];
	const jsonLd = buildBreadcrumbSchema(breadcrumbItems);

	return (
		<SiteShell currentPath={`/categories/${category}/`} extraJsonLd={jsonLd}>
			<div className="flex flex-col">
				<BreadcrumbNav items={breadcrumbItems} />
				<header className="mt-8 flex flex-col gap-6 text-right">
					<div className="flex items-center justify-end gap-3">
						<p className="swiss-label">קטגוריה / Category</p>
						<span className="h-px w-12 bg-border" aria-hidden="true" />
					</div>
					<h1 className="font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl">
						אבני גיא - קטגוריה {categoryHe}
					</h1>
					<p className="max-w-4xl text-pretty text-lg leading-relaxed text-muted-foreground">
						{hubIntro.paragraph}{' '}
						{hubIntro.pillarLinks.map((link, i) => (
							<span key={link.href}>
								{i > 0 ? (i === hubIntro.pillarLinks.length - 1 ? ' ו-' : ', ') : ''}
								<Link className="link-underline" href={link.href}>
									{link.label}
								</Link>
							</span>
						))}
						.
					</p>
				</header>
				<section className="mt-12">
					<div className="flex items-end justify-between border-b border-border pb-3">
						<span className="swiss-label">{String(posts.length).padStart(2, '0')} מאמרים</span>
						<span className="swiss-label">{categoryHe}</span>
					</div>
					<ArticleList posts={posts} excerpt="description" />
				</section>
			</div>
		</SiteShell>
	);
}
