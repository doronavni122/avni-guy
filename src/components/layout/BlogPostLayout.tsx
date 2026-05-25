import Link from 'next/link';
import type { ReactNode } from 'react';
import { OptimizedImage } from '@/components/media/OptimizedImage';
import { badgeVariants } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FormattedDate } from '@/components/FormattedDate';
import { SiteShell } from '@/components/layout/SiteShell';
import { cn } from '@/lib/utils';
import { labelForInternalLink } from '@/utils/link-labels';
import { getTagLabel } from '@/utils/taxonomy-labels';
import type { BlogFrontmatter } from '@/lib/content/schema';
import type { SiteKeyword } from '@/consts';

type BlogPostLayoutProps = {
	metaTitle: string;
	metaDescription: string;
	mainKeyword: SiteKeyword;
	data: BlogFrontmatter;
	slug: string;
	currentPath: string;
	jsonLd: Array<Record<string, unknown>>;
	children: ReactNode;
};

export function BlogPostLayout({ mainKeyword, data, slug, currentPath, jsonLd, children }: BlogPostLayoutProps) {
	const { title, description, pubDate, updatedDate, category, tags, images, internalLinks } = data;

	return (
		<SiteShell currentPath={currentPath} extraJsonLd={jsonLd}>
			<article className="flex flex-col gap-10">
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{images.map((imageItem, index) => (
						<figure
							key={imageItem.src}
							className="group overflow-hidden rounded-xl ring-1 ring-border/60 shadow-sm transition-shadow hover:shadow-md"
						>
							<OptimizedImage
								src={imageItem.src}
								alt={imageItem.alt}
								title={imageItem.title}
								priority={index === 0}
								className="aspect-[3/2] h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
							/>
							<figcaption className="sr-only">{imageItem.description}</figcaption>
						</figure>
					))}
				</div>

				<Card className="border-border/60 shadow-sm">
					<CardHeader className="gap-4 text-right">
						<div className="flex flex-col gap-2 text-sm text-muted-foreground">
							<FormattedDate date={pubDate} />
							{updatedDate ? (
								<p className="text-xs italic">
									עודכן לאחרונה: <FormattedDate date={updatedDate} />
								</p>
							) : null}
						</div>
						<CardDescription className="text-xs font-medium uppercase tracking-wide text-primary">
							{mainKeyword}
						</CardDescription>
						<h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">{title}</h1>
						<div className="flex flex-wrap items-center justify-end gap-2">
							<Link
								href={`/categories/${category}/`}
								className={cn(badgeVariants({ variant: 'outline' }), 'no-underline hover:bg-muted')}
							>
								קטגוריה: {category}
							</Link>
							{tags.map((tag) => (
								<Link
									key={tag}
									href={`/tags/${tag}/`}
									className={cn(badgeVariants({ variant: 'secondary' }), 'no-underline hover:bg-secondary/80')}
								>
									{getTagLabel(tag)}
								</Link>
							))}
						</div>
					</CardHeader>
					<Separator />
					<CardContent className="pt-6">
						<section className="mb-8 rounded-xl border border-border/50 bg-muted/30 p-4 text-right">
							<h2 className="mb-2 font-heading text-sm font-semibold text-foreground">מקורות תמונה חינמיים</h2>
							<ul className="flex flex-col gap-2 text-sm text-muted-foreground">
								{images.map((imageItem) => (
									<li key={imageItem.source}>
										<a
											className="text-primary underline-offset-2 hover:underline"
											href={imageItem.source}
											rel="noopener noreferrer"
											target="_blank"
										>
											{imageItem.source}
										</a>
									</li>
								))}
							</ul>
						</section>
						<div className="max-w-none space-y-4 text-right text-base leading-relaxed text-foreground [&_a]:underline-offset-2 [&_a]:hover:underline [&_h2]:mt-8 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h3]:mt-6 [&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-semibold [&_p]:text-pretty">
							{children}
						</div>
					</CardContent>
					<CardFooter className="flex flex-col items-stretch gap-4 border-t border-border/60 bg-muted/20 p-6 text-right">
						<h2 className="font-heading text-lg font-semibold text-foreground">קישורים פנימיים מומלצים</h2>
						<ul className="flex flex-col gap-2 text-sm">
							{internalLinks.map((link) => (
								<li key={link}>
									<Link className="font-medium text-primary underline-offset-2 hover:underline" href={link}>
										{labelForInternalLink(link)}
									</Link>
								</li>
							))}
						</ul>
					</CardFooter>
				</Card>
			</article>
		</SiteShell>
	);
}
