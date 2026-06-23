import { ArticleList } from '@/components/blog/ArticleList';
import type { BlogPost } from '@/lib/content/schema';

type RelatedArticlesProps = {
	posts: BlogPost[];
};

export function RelatedArticles({ posts }: RelatedArticlesProps) {
	if (!posts.length) return null;

	return (
		<section className="flex flex-col gap-2 text-right" aria-labelledby="related-articles-heading">
			<p className="kicker">המשך קריאה</p>
			<h2 id="related-articles-heading" className="font-serif text-3xl font-extrabold text-foreground">
				מאמרים קשורים
			</h2>
			<p className="max-w-2xl leading-relaxed text-muted-foreground">
				מאמרים קשורים לפי נושא - משלימים את הקישורים בתוך גוף המאמר, לא מחליפים אותם.
			</p>
			<div className="mt-4">
				<ArticleList posts={posts} excerpt="metaDescription" />
			</div>
		</section>
	);
}
