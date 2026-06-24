import { ArticleList } from '@/components/blog/ArticleList';
import { PremiumPanel } from '@/components/layout/PremiumPanel';
import type { BlogPost } from '@/lib/content/schema';

type RelatedArticlesProps = {
	posts: BlogPost[];
};

export function RelatedArticles({ posts }: RelatedArticlesProps) {
	if (!posts.length) return null;

	return (
		<PremiumPanel variant="accent" className="text-right">
			<section className="flex flex-col gap-4" aria-labelledby="related-articles-heading">
			<div className="flex items-center justify-end gap-3">
				<span className="swiss-label">המשך קריאה / More</span>
				<span className="h-px w-12 bg-border" aria-hidden="true" />
			</div>
			<div className="flex flex-col gap-1">
				<h2 id="related-articles-heading" className="font-heading text-2xl font-semibold text-foreground">
					המשך קריאה
				</h2>
				<p className="text-sm text-muted-foreground">
					מאמרים קשורים לפי נושא - משלימים את הקישורים בתוך גוף המאמר, לא מחליפים אותם.
				</p>
			</div>
			<ArticleList posts={posts} excerpt="metaDescription" />
			</section>
		</PremiumPanel>
	);
}
