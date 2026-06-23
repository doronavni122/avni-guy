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
 * Editorial article register. Ruled rows with a serif folio numeral, a serif
 * headline, a dek line and an optional dateline. Used across all listing pages.
 */
export function ArticleList({ posts, showDate = false, excerpt = 'metaDescription' }: ArticleListProps) {
	if (!posts.length) return null;
	const items = posts.map((post) => toItem(post, excerpt));

	return (
		<ol className="flex flex-col border-t-2 border-foreground">
			{items.map((item, index) => (
				<li key={item.slug} className="border-b border-border">
					<Link
						href={`/blog/${item.slug}/`}
						className="group grid grid-cols-[2.5rem_1fr] gap-x-5 gap-y-2 py-7 no-underline transition-colors sm:grid-cols-[3.5rem_1fr_auto] sm:items-baseline"
					>
						<span className="folio text-2xl text-muted-foreground transition-colors group-hover:text-primary sm:text-3xl">
							{String(index + 1).padStart(2, '0')}
						</span>
						<div className="flex flex-col gap-1.5 text-right">
							<h3 className="font-serif text-xl font-extrabold leading-tight text-foreground transition-colors group-hover:text-primary sm:text-2xl">
								{item.title}
							</h3>
							<p className="line-clamp-2 max-w-2xl leading-relaxed text-muted-foreground">{item.description}</p>
						</div>
						{showDate && item.date ? (
							<span className="kicker col-span-2 sm:col-span-1 sm:self-start sm:pt-2 sm:text-left">
								<FormattedDate date={item.date} />
							</span>
						) : null}
					</Link>
				</li>
			))}
		</ol>
	);
}
