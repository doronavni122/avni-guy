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
				<header className="mt-8 flex flex-col gap-6 text-right">
					<div className="flex items-center justify-end gap-3">
						<p className="swiss-label">תגית / Tag</p>
						<span className="h-px w-12 bg-border" aria-hidden="true" />
					</div>
					<h1 className="font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl">
						גיא אבני עו״ד - תגית {tagHe}
					</h1>
				</header>
				<section className="mt-12">
					<div className="flex items-end justify-between border-b border-border pb-3">
						<span className="swiss-label">{String(posts.length).padStart(2, '0')} מאמרים</span>
						<span className="swiss-label">{tagHe}</span>
					</div>
					<ArticleList posts={posts} excerpt="description" />
				</section>
			</div>
		</SiteShell>
	);
}
