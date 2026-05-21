import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SiteShell } from '@/components/layout/SiteShell';
import { getSortedPosts, getTags } from '@/lib/content/posts';
import { buildPageMetadata } from '@/lib/metadata';
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
	const posts = (await getSortedPosts()).filter((post) => post.data.tags.includes(tag));
	if (posts.length === 0) {
		const known = await getTags();
		if (!known.includes(tag)) notFound();
	}
	const tagHe = getTagLabel(tag);
	const jsonLd = buildBreadcrumbSchema([
		{ name: 'דף הבית', path: '/' },
		{ name: 'תגיות', path: '/tags' },
		{ name: tagHe, path: `/tags/${tag}/` },
	]);

	return (
		<SiteShell extraJsonLd={jsonLd}>
			<section className="flex flex-col gap-10">
				<div className="flex flex-col gap-4 text-right">
					<p className="text-sm font-medium text-primary">גיא אבני עו״ד</p>
					<h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
						גיא אבני עו״ד - תגית {tagHe}
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
