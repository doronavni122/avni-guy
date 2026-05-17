import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SiteShell } from '@/components/layout/SiteShell';
import { getCategories, getSortedPosts } from '@/lib/content/posts';
import { buildPageMetadata } from '@/lib/metadata';
import { buildBreadcrumbSchema } from '@/utils/structured-data';
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
	const posts = (await getSortedPosts()).filter((post) => post.data.category === category);
	if (posts.length === 0) {
		const known = await getCategories();
		if (!known.includes(category)) notFound();
	}
	const categoryHe = getCategoryLabel(category);
	const jsonLd = buildBreadcrumbSchema([
		{ name: 'דף הבית', path: '/' },
		{ name: 'קטגוריות', path: '/categories' },
		{ name: categoryHe, path: `/categories/${category}/` },
	]);

	return (
		<SiteShell extraJsonLd={jsonLd}>
			<section className="flex flex-col gap-10">
				<div className="flex flex-col gap-4 text-right">
					<p className="text-sm font-medium text-primary">אבני גיא</p>
					<h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
						אבני גיא - קטגוריה {categoryHe}
					</h1>
				</div>
				<Separator className="bg-border/60" />
				<div className="grid gap-4 sm:grid-cols-2">
					{posts.map((post) => (
						<Link key={post.slug} className="group block no-underline" href={`/blog/${post.slug}/`}>
							<Card className="h-full border-border/60 bg-card/70 shadow-sm transition-all group-hover:border-primary/25 group-hover:shadow-md">
								<CardHeader className="text-right">
									<CardTitle className="font-heading text-base leading-snug transition-colors group-hover:text-primary">
										{post.data.title}
									</CardTitle>
								</CardHeader>
								<CardContent className="text-right text-sm text-muted-foreground">{post.data.description}</CardContent>
							</Card>
						</Link>
					))}
				</div>
			</section>
		</SiteShell>
	);
}
