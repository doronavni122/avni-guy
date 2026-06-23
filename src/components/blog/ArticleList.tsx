import Link from 'next/link';
import { FormattedDate } from '@/components/FormattedDate';
import type { BlogPost } from '@/lib/content/schema';

type ArticleListItem = {
	slug: string;
	title: string;
	description: string;
	date?: Date;
};

type ArticleListProps = {
	posts: BlogPost[];
	/** Show the publish date column. */
	showDate?: boolean;
	/** Field used for the excerpt line. */
	excerpt?: 'metaDescription' | 'description';
};

function toItem(post: BlogPost, excerpt: 'metaDescription' | 'description'): ArticleListItem {
	return {
		slug: post.slug,
		title: post.data.title,
		description: excerpt === 'metaDescription' ? post.data.metaDescription : post.data.description,
		date: post.data.pubDate,
	};
}

/**
 * Swiss numbered article index. Hairline-separated rows, mono index + date,
 * accent-on-hover title. Replaces the old card grid across listing pages.
 */
export function ArticleList({ posts, showDate = false, excerpt = 'metaDescription' }: ArticleListProps) {
	if (!posts.length) return null;
	const items = posts.map((post) => toItem(post, excerpt));

	return (
		<ol className="flex flex-col border-t border-border">
			{items.map((item, index) => (
				<li key={item.slug} className="border-b border-border">
					<Link
						href={`/blog/${item.slug}/`}
						className="group grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 py-6 no-underline transition-colors sm:grid-cols-[3rem_1fr_auto] sm:items-baseline"
					>
						<span className="swiss-index pt-1 text-muted-foreground transition-colors group-hover:text-primary">
							{String(index + 1).padStart(2, '0')}
						</span>
						<div className="flex flex-col gap-1.5 text-right">
							<h3 className="font-heading text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
								{item.title}
							</h3>
							<p className="line-clamp-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
								{item.description}
							</p>
						</div>
						{showDate && item.date ? (
							<span className="swiss-index col-span-2 text-muted-foreground sm:col-span-1 sm:text-left">
								<FormattedDate date={item.date} />
							</span>
						) : null}
					</Link>
				</li>
			))}
		</ol>
	);
}
