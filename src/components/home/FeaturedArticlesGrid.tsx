import Link from 'next/link';
import { FormattedDate } from '@/components/FormattedDate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { PostPreview } from '@/lib/home/loadHomeData';

type FeaturedArticlesGridProps = {
	posts: PostPreview[];
};

export function FeaturedArticlesGrid({ posts }: FeaturedArticlesGridProps) {
	return (
		<section id="featured-articles" className="home-anchor-target flex flex-col gap-5 text-right" aria-labelledby="featured-articles-title">
			<div className="flex flex-col gap-2">
				<h2 id="featured-articles-title" className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
					מאמרים מומלצים של גיא אבני להתחלה בטוחה
				</h2>
				<div className="flex flex-wrap justify-end gap-2">
					<span className="inline-flex items-center rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-semibold text-foreground">
						תוכן נבחר
					</span>
					<span className="inline-flex items-center rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-semibold text-foreground">
						קריאה פרקטית
					</span>
				</div>
				<p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
					שישה מאמרים נבחרים עם זווית פרקטית, כדי שתוכלו לעבור מתיאוריה להחלטות טובות במהירות.{' '}
					<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/blog/">
						לכל המאמרים
					</Link>
					.
				</p>
			</div>
			<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
				{posts.map((post) => (
					<Link key={post.id} className="group block h-full no-underline" href={`/blog/${post.id}/`}>
						<Card className="h-full border-border/60 bg-card/70 shadow-sm transition-all group-hover:-translate-y-0.5 group-hover:border-primary/25 group-hover:shadow-md">
							<CardHeader className="text-right">
								<CardDescription className="text-xs text-muted-foreground">
									<FormattedDate date={post.pubDate} />
								</CardDescription>
								<CardTitle className="font-heading text-base leading-snug transition-colors group-hover:text-primary">
									{post.title}
								</CardTitle>
							</CardHeader>
							<CardContent className="text-right">
								<p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{post.description}</p>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>
		</section>
	);
}
