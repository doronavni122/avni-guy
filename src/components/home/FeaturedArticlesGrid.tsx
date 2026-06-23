import Link from 'next/link';
import { FormattedDate } from '@/components/FormattedDate';
import type { PostPreview } from '@/lib/home/loadHomeData';

type FeaturedArticlesGridProps = {
	posts: PostPreview[];
};

export function FeaturedArticlesGrid({ posts }: FeaturedArticlesGridProps) {
	return (
		<section id="featured-articles" className="home-anchor-target flex flex-col gap-6 text-right" aria-labelledby="featured-articles-title">
			<div className="flex items-start justify-between gap-6 border-t border-border pt-5">
				<div className="flex max-w-3xl flex-col gap-3">
					<h2 id="featured-articles-title" className="font-heading text-2xl font-bold tracking-tight text-foreground text-balance sm:text-3xl">
						מאמרים מומלצים של גיא אבני להתחלה בטוחה
					</h2>
					<div className="flex flex-wrap items-center gap-x-6 gap-y-2">
						<span className="swiss-label">תוכן נבחר</span>
						<span className="swiss-label">קריאה פרקטית</span>
					</div>
					<p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
						שישה מאמרים נבחרים עם זווית פרקטית, כדי שתוכלו לעבור מתיאוריה להחלטות טובות במהירות.{' '}
						<Link className="font-semibold text-primary underline-offset-4 hover:underline" href="/blog/">
							לכל המאמרים
						</Link>
						.
					</p>
				</div>
				<span className="swiss-index shrink-0 text-sm text-muted-foreground" aria-hidden="true">
					09
				</span>
			</div>
			<div className="grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2 xl:grid-cols-3">
				{posts.map((post, index) => (
					<Link key={post.id} className="group flex h-full flex-col gap-3 bg-card p-6 no-underline transition-colors hover:bg-muted" href={`/blog/${post.id}/`}>
						<div className="flex items-center justify-between gap-3">
							<span className="swiss-index text-xs text-muted-foreground" aria-hidden="true">
								{String(index + 1).padStart(2, '0')}
							</span>
							<span className="swiss-label normal-case">
								<FormattedDate date={post.pubDate} />
							</span>
						</div>
						<h3 className="font-heading text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
							{post.title}
						</h3>
						<p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{post.description}</p>
					</Link>
				))}
			</div>
		</section>
	);
}
