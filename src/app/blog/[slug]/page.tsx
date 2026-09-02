import { notFound } from 'next/navigation';
import { BlogPostLayout } from '@/components/layout/BlogPostLayout';
import { injectEntityLinks } from '@/lib/content/inject-entity-links';
import { injectArticleFigures } from '@/lib/content/inject-figures';
import { renderMdxContent } from '@/lib/content/mdx';
import { getAllPosts, getPostBySlug } from '@/lib/content/posts';
import { scoreRelatedPosts } from '@/lib/content/related-posts';
import { buildPageMetadata } from '@/lib/metadata';
import { articleDocumentTitle } from '@/lib/seo/article-document-title';
import { isQuarantinedBlogSlug } from '@/lib/seo/indexation';
import { resolveArticleKeyword } from '@/lib/seo/resolve-article-keyword';
import { SITE_URL } from '@/consts';
import { bodyForRender, resolveArticleFaq } from '@/lib/content/faq';
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
	const topicKeyword = resolveArticleKeyword(post.data);
	const quarantined = isQuarantinedBlogSlug(slug);
	return buildPageMetadata({
		title: articleDocumentTitle(post.data.title),
		description: post.data.metaDescription,
		keyword: topicKeyword,
		path: `/blog/${slug}/`,
		type: 'article',
		image: post.data.images[0]?.src,
		absoluteTitle: true,
		robots: { index: !quarantined, follow: true },
	});
}

export default async function BlogPostPage({ params }: PageProps) {
	const { slug } = await params;
	const post = await getPostBySlug(slug);
	if (!post) {
		console.error('[blog:slug] post not found', { slug });
		notFound();
	}

	const renderBody = bodyForRender(post.data, post.content);
	const withEntityLinks = injectEntityLinks(renderBody, { slug });
	const contentWithFigures = injectArticleFigures(withEntityLinks, post.data.images);
	const content = await renderMdxContent(contentWithFigures);
	const allPosts = await getAllPosts();
	const relatedPosts = scoreRelatedPosts(post, allPosts, 4);
	const canonicalUrl = new URL(`/blog/${slug}/`, SITE_URL).toString();

	const faqItems = resolveArticleFaq(post.data, post.content);
	const topicKeyword = resolveArticleKeyword(post.data);
	const keywordTags = [
		topicKeyword,
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
			mainKeyword={topicKeyword}
			data={post.data}
			slug={slug}
			currentPath={`/blog/${slug}/`}
			jsonLd={jsonLd}
			breadcrumbItems={breadcrumbItems}
			relatedPosts={relatedPosts}
			faqItems={faqItems}
		>
			{content}
		</BlogPostLayout>
	);
}
