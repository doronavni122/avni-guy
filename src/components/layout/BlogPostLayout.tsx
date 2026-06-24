import Link from 'next/link';
import type { ReactNode } from 'react';
import { FormattedDate } from '@/components/FormattedDate';
import { SiteShell } from '@/components/layout/SiteShell';
import { BreadcrumbNav } from '@/components/navigation/BreadcrumbNav';
import { getTagLabel, getCategoryLabel } from '@/utils/taxonomy-labels';
import type { BreadcrumbItem } from '@/utils/structured-data';
import type { BlogFrontmatter } from '@/lib/content/schema';
import type { SiteKeyword } from '@/consts';
import type { BlogPost } from '@/lib/content/schema';
import type { BlogFaqItem } from '@/lib/content/schema';
import { AuthorBio } from '@/components/blog/AuthorBio';
import { ArticleFaq } from '@/components/blog/ArticleFaq';
import { RelatedArticles } from '@/components/blog/RelatedArticles';

type BlogPostLayoutProps = {
	metaTitle: string;
	metaDescription: string;
	mainKeyword: SiteKeyword;
	data: BlogFrontmatter;
	slug: string;
	currentPath: string;
	jsonLd: Array<Record<string, unknown>>;
	breadcrumbItems: BreadcrumbItem[];
	relatedPosts?: BlogPost[];
	faqItems?: BlogFaqItem[];
	children: ReactNode;
};

export function BlogPostLayout({
	mainKeyword,
	data,
	currentPath,
	jsonLd,
	breadcrumbItems,
	relatedPosts = [],
	faqItems = [],
	children,
}: BlogPostLayoutProps) {
	const { title, pubDate, updatedDate, category, tags } = data;

	return (
		<SiteShell currentPath={currentPath} extraJsonLd={jsonLd}>
			<article className="flex flex-col">
				<BreadcrumbNav items={breadcrumbItems} />

				<header className="mt-8 flex flex-col gap-6 text-right">
					<div className="flex items-center justify-end gap-3">
						<span className="swiss-label text-primary">{mainKeyword}</span>
						<span className="h-px w-12 bg-border" aria-hidden="true" />
					</div>
					<h1 className="font-heading text-3xl font-extrabold leading-[1.1] tracking-tight text-foreground text-balance md:text-5xl">
						{title}
					</h1>
					<div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 border-y border-border py-3 text-sm text-muted-foreground">
						<span className="swiss-index">
							<FormattedDate date={pubDate} />
						</span>
						{updatedDate ? (
							<span className="swiss-index">
								עודכן: <FormattedDate date={updatedDate} />
							</span>
						) : null}
					</div>
					<div className="flex flex-wrap items-center justify-end gap-2">
						<Link
							href={`/categories/${category}/`}
							className="border border-border px-3 py-1 font-mono text-xs text-foreground no-underline transition-colors hover:border-primary hover:text-primary"
						>
							{getCategoryLabel(category)}
						</Link>
						{tags.map((tag) => (
							<Link
								key={tag}
								href={`/tags/${tag}/`}
								className="border border-border px-3 py-1 font-mono text-xs text-muted-foreground no-underline transition-colors hover:border-primary hover:text-primary"
							>
								{getTagLabel(tag)}
							</Link>
						))}
					</div>
				</header>

				<div className="mt-12 prose-legal [&_a]:underline-offset-2 [&_a]:hover:underline">{children}</div>

				<ArticleFaq items={faqItems} />

				{relatedPosts.length > 0 ? (
					<div className="mt-12 border-t border-border pt-10">
						<RelatedArticles posts={relatedPosts} />
					</div>
				) : null}

				<div className="mt-12 border-t border-border pt-10">
					<AuthorBio />
				</div>
			</article>
		</SiteShell>
	);
}
