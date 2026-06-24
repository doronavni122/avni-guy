import { notFound } from 'next/navigation';
import { BlogPostLayout } from '@/components/layout/BlogPostLayout';
import { injectArticleFigures } from '@/lib/content/inject-figures';
import { renderMdxContent } from '@/lib/content/mdx';
import { getAllPosts, getPostBySlug } from '@/lib/content/posts';
import { scoreRelatedPosts } from '@/lib/content/related-posts';
import { buildPageMetadata } from '@/lib/metadata';
import { SITE_URL } from '@/consts';
import { resolveArticleFaq } from '@/lib/content/faq';
import {
	buildBlogPostingSchema,
	buildBreadcrumbSchema,
	buildFaqSchema,
	type BreadcrumbItem,
} from '@/utils/structured-data';

export const dynamic = 'force-static';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
	try {
		const posts = await getAllPosts();
		return posts.map((post) => ({ slug: post.slug }));
	} catch (err) {
		console.error('[blog:slug] generateStaticParams failed', err);
		return [];
	}
}

export async function generateMetadata({ params }: PageProps) {
	const { slug } = await params;
	const post = await getPostBySlug(slug);
	if (!post) return {};
	return buildPageMetadata({
		title: post.data.metaTitle,
		description: post.data.metaDescription,
		keyword: post.data.mainKeyword,
		path: `/blog/${slug}/`,
		type: 'article',
		image: post.data.images[0]?.src,
	});
}

export default async function BlogPostPage({ params }: PageProps) {
	const { slug } = await params;
	const post = await getPostBySlug(slug);
	if (!post) {
		console.error('[blog:slug] post not found', { slug });
		notFound();
	}

	const contentWithFigures = injectArticleFigures(post.content, post.data.images);
	const content = await renderMdxContent(contentWithFigures);
	const allPosts = await getAllPosts();
	const relatedPosts = scoreRelatedPosts(post, allPosts, 4);
	const canonicalUrl = new URL(`/blog/${slug}/`, SITE_URL).toString();

	const faqItems = resolveArticleFaq(post.data, post.content);
	const keywordTags = [
		post.data.mainKeyword,
		...(post.data.secondaryKeywords ?? []),
		...(post.data.geoKeywords ?? []),
	];

	const breadcrumbItems: BreadcrumbItem[] = [
		{ name: 'דף הבית', path: '/' },
		{ name: 'מאמרים', path: '/blog' },
		{ name: post.data.title, path: `/blog/${slug}/` },
	];

	const jsonLd: Array<Record<string, unknown>> = [
		buildBreadcrumbSchema(breadcrumbItems),
		buildBlogPostingSchema({
			headline: post.data.title,
			description: post.data.metaDescription ?? post.data.description,
			datePublished: post.data.pubDate.toISOString(),
			dateModified: (post.data.updatedDate ?? post.data.pubDate).toISOString(),
			keywords: keywordTags,
			articleSection: post.data.category,
			canonicalUrl,
			imageUrls: post.data.images.map((item) => item.src),
			authorName: 'גיא אבני',
			authorUrl: new URL('/about/', SITE_URL).toString(),
		}),
	];
	if (faqItems.length >= 4) {
		jsonLd.push(buildFaqSchema(faqItems));
	}

	return (
		<BlogPostLayout
			metaTitle={post.data.metaTitle}
			metaDescription={post.data.metaDescription}
			mainKeyword={post.data.mainKeyword}
			data={post.data}
			slug={slug}
			currentPath={`/blog/${slug}/`}
			jsonLd={jsonLd}
			breadcrumbItems={breadcrumbItems}
			relatedPosts={relatedPosts}
		>
			{content}
		</BlogPostLayout>
	);
}
