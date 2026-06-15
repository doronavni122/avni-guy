import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BlogPost } from '@/lib/content/schema';

type RelatedArticlesProps = {
	posts: BlogPost[];
};

export function RelatedArticles({ posts }: RelatedArticlesProps) {
	if (!posts.length) return null;

	return (
		<section className="flex flex-col gap-4 text-right" aria-labelledby="related-articles-heading">
			<div className="flex flex-col gap-1">
				<h2 id="related-articles-heading" className="font-heading text-lg font-semibold text-foreground">
					המשך קריאה
				</h2>
				<p className="text-sm text-muted-foreground">
					מאמרים קשורים לפי נושא - משלימים את הקישורים בתוך גוף המאמר, לא מחליפים אותם.
				</p>
			</div>
			<div className="grid gap-3 sm:grid-cols-2">
				{posts.map((post) => (
					<Link key={post.slug} className="group block no-underline" href={`/blog/${post.slug}/`}>
						<Card className="card-interactive h-full group-hover:border-primary/25">
							<CardHeader className="pb-2 text-right">
								<CardTitle className="font-heading text-sm leading-snug transition-colors group-hover:text-primary">
									{post.data.title}
								</CardTitle>
							</CardHeader>
							<CardContent className="text-right">
								<p className="line-clamp-2 text-xs text-muted-foreground">{post.data.metaDescription}</p>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>
		</section>
	);
}
