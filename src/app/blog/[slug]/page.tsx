import { notFound } from 'next/navigation';
import { BlogPostLayout } from '@/components/layout/BlogPostLayout';
import { renderMdxContent } from '@/lib/content/mdx';
import { getAllPosts, getPostBySlug } from '@/lib/content/posts';
import { buildPageMetadata } from '@/lib/metadata';
import { SITE_URL } from '@/consts';
import {
	buildBlogPostingSchema,
	buildBreadcrumbSchema,
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

	const content = await renderMdxContent(post.content);
	const canonicalUrl = new URL(`/blog/${slug}/`, SITE_URL).toString();

	const jsonLd = [
		buildBreadcrumbSchema([
			{ name: 'דף הבית', path: '/' },
			{ name: 'מאמרים', path: '/blog' },
			{ name: post.data.title, path: `/blog/${slug}/` },
		]),
		buildBlogPostingSchema({
			headline: post.data.title,
			description: post.data.metaDescription ?? post.data.description,
			datePublished: post.data.pubDate.toISOString(),
			dateModified: (post.data.updatedDate ?? post.data.pubDate).toISOString(),
			keywords: [post.data.mainKeyword],
			articleSection: post.data.category,
			canonicalUrl,
			imageUrls: post.data.images.map((item) => item.src),
			authorName: 'גיא אבני',
			authorUrl: new URL('/about/', SITE_URL).toString(),
		}),
	];

	return (
		<BlogPostLayout
			metaTitle={post.data.metaTitle}
			metaDescription={post.data.metaDescription}
			mainKeyword={post.data.mainKeyword}
			data={post.data}
			slug={slug}
			jsonLd={jsonLd}
		>
			{content}
		</BlogPostLayout>
	);
}
