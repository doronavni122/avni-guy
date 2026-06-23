import { notFound } from 'next/navigation';
import { ArticleList } from '@/components/blog/ArticleList';
import { SiteShell } from '@/components/layout/SiteShell';
import { getPostsIndex, getTags } from '@/lib/content/posts';
import { buildPageMetadata } from '@/lib/metadata';
import { BreadcrumbNav } from '@/components/navigation/BreadcrumbNav';
import { buildBreadcrumbSchema } from '@/utils/structured-data';
import { buildTagMetaDescription, buildTagPageTitle, getTagLabel } from '@/utils/taxonomy-labels';

export const dynamic = 'force-static';

type PageProps = { params: Promise<{ tag: string }> };

export async function generateStaticParams() {
	const tags = await getTags();
	return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: PageProps) {
	const { tag } = await params;
	const tagHe = getTagLabel(tag);
	return buildPageMetadata({
		title: buildTagPageTitle(tagHe),
		description: buildTagMetaDescription(tagHe),
		keyword: 'גיא אבני עו״ד',
		path: `/tags/${tag}/`,
	});
}

export default async function TagPage({ params }: PageProps) {
	const { tag } = await params;
	const { posts: allPosts, tags } = await getPostsIndex();
	const posts = allPosts.filter((post) => post.data.tags.includes(tag));
	if (posts.length === 0) {
		if (!tags.includes(tag)) notFound();
	}
	const tagHe = getTagLabel(tag);
	const breadcrumbItems = [
		{ name: 'דף הבית', path: '/' },
		{ name: 'תגיות', path: '/tags' },
		{ name: tagHe, path: `/tags/${tag}/` },
	];
	const jsonLd = buildBreadcrumbSchema(breadcrumbItems);

	return (
		<SiteShell currentPath={`/tags/${tag}/`} extraJsonLd={jsonLd}>
			<div className="flex flex-col">
				<BreadcrumbNav items={breadcrumbItems} />
				<header className="mt-8 flex flex-col gap-5 border-t-2 border-foreground pt-6 text-right">
					<p className="kicker text-primary">תגית · Tag</p>
					<h1 className="font-serif text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl">
						גיא אבני עו״ד - תגית {tagHe}
					</h1>
				</header>
				<section className="mt-14">
					<div className="flex items-baseline justify-between">
						<p className="kicker">מאמרים בתגית</p>
						<span className="folio text-base text-muted-foreground" aria-hidden="true">
							{String(posts.length).padStart(2, '0')}
						</span>
					</div>
					<div className="mt-4">
						<ArticleList posts={posts} excerpt="description" />
					</div>
				</section>
			</div>
		</SiteShell>
	);
}
