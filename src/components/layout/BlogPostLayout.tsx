import Link from 'next/link';
import type { ReactNode } from 'react';
import { OptimizedImage } from '@/components/media/OptimizedImage';
import { FormattedDate } from '@/components/FormattedDate';
import { SiteShell } from '@/components/layout/SiteShell';
import { BreadcrumbNav } from '@/components/navigation/BreadcrumbNav';
import { getTagLabel, getCategoryLabel } from '@/utils/taxonomy-labels';
import type { BreadcrumbItem } from '@/utils/structured-data';
import type { BlogFrontmatter } from '@/lib/content/schema';
import type { SiteKeyword } from '@/consts';
import type { BlogPost } from '@/lib/content/schema';
import { AuthorBio } from '@/components/blog/AuthorBio';
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
	children: ReactNode;
};

export function BlogPostLayout({
	mainKeyword,
	data,
	currentPath,
	jsonLd,
	breadcrumbItems,
	relatedPosts = [],
	children,
}: BlogPostLayoutProps) {
	const { title, pubDate, updatedDate, category, tags, images } = data;
	const lead = images[0];
	const rest = images.slice(1);

	return (
		<SiteShell currentPath={currentPath} extraJsonLd={jsonLd}>
			<article className="mx-auto flex w-full max-w-3xl flex-col">
				<BreadcrumbNav items={breadcrumbItems} />

				{/* Article masthead */}
				<header className="mt-8 flex flex-col gap-5 text-right">
					<p className="kicker text-primary">{mainKeyword}</p>
					<h1 className="font-serif text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground text-balance md:text-5xl">
						{title}
					</h1>
					<div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 border-y border-border py-3">
						<span className="kicker">
							<FormattedDate date={pubDate} />
						</span>
						{updatedDate ? (
							<span className="kicker">
								<span className="opacity-70">עודכן ·</span> <FormattedDate date={updatedDate} />
							</span>
						) : null}
					</div>
					<div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
						<Link
							href={`/categories/${category}/`}
							className="kicker no-rule text-primary no-underline transition-opacity hover:opacity-70"
						>
							{getCategoryLabel(category)}
						</Link>
						{tags.map((tag) => (
							<Link
								key={tag}
								href={`/tags/${tag}/`}
								className="kicker no-rule no-underline transition-colors hover:text-primary"
							>
								{getTagLabel(tag)}
							</Link>
						))}
					</div>
				</header>

				{/* Lead image */}
				{lead ? (
					<figure className="mt-10">
						<OptimizedImage
							src={lead.src}
							alt={lead.alt}
							title={lead.title}
							priority
							className="aspect-[16/9] h-auto w-full object-cover"
						/>
						<figcaption className="kicker mt-3 border-t border-border pt-2">{lead.title}</figcaption>
					</figure>
				) : null}

				{/* Body */}
				<div className="mt-12 prose-legal prose-dropcap [&_a]:underline-offset-2 [&_a]:hover:underline">{children}</div>

				{/* Secondary images */}
				{rest.length > 0 ? (
					<div className="mt-12 flex flex-col gap-8">
						{rest.map((imageItem) => (
							<figure key={imageItem.src}>
								<OptimizedImage
									src={imageItem.src}
									alt={imageItem.alt}
									title={imageItem.title}
									className="aspect-[3/2] h-auto w-full object-cover"
								/>
								<figcaption className="kicker mt-3 border-t border-border pt-2">{imageItem.title}</figcaption>
							</figure>
						))}
					</div>
				) : null}

				{/* Image sources */}
				<section className="mt-14 border-t border-border pt-6 text-right">
					<p className="kicker mb-3">מקורות תמונה חינמיים</p>
					<ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
						{images.map((imageItem) => (
							<li key={imageItem.source}>
								<a className="link-underline" href={imageItem.source} rel="noopener noreferrer" target="_blank">
									{imageItem.source}
								</a>
							</li>
						))}
					</ul>
				</section>

				{relatedPosts.length > 0 ? (
					<div className="mt-14 border-t-2 border-foreground pt-10">
						<RelatedArticles posts={relatedPosts} />
					</div>
				) : null}

				<div className="mt-14 border-t border-border pt-10">
					<AuthorBio />
				</div>
			</article>
		</SiteShell>
	);
}
