import Link from 'next/link';
import { FormattedDate } from '@/components/FormattedDate';
import type { PostPreview } from '@/lib/home/loadHomeData';

type FeaturedArticlesGridProps = {
	posts: PostPreview[];
};

/** Editorial featured section: a lead story, then a ruled column of further reading. */
export function FeaturedArticlesGrid({ posts }: FeaturedArticlesGridProps) {
	const [lead, ...rest] = posts;
	if (!lead) return null;

	return (
		<section
			id="featured-articles"
			className="home-anchor-target flex flex-col gap-8 text-right"
			aria-labelledby="featured-articles-title"
		>
			<div className="flex items-baseline justify-between gap-4 border-t-2 border-foreground pt-3">
				<p className="kicker">מאמרים נבחרים</p>
				<span className="folio text-base" aria-hidden="true">02</span>
			</div>

			<div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
				{/* Lead story */}
				<Link href={`/blog/${lead.id}/`} className="no-rule group block no-underline">
					<span className="kicker">
						<FormattedDate date={lead.pubDate} /> · כתבת השער
					</span>
					<h2
						id="featured-articles-title"
						className="mt-3 font-serif text-4xl font-extrabold leading-tight text-foreground text-balance transition-colors group-hover:text-primary sm:text-5xl"
					>
						{lead.title}
					</h2>
					<p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">{lead.description}</p>
					<span className="mt-4 inline-block font-serif text-base font-bold text-primary">המשך קריאה ←</span>
				</Link>

				{/* Further reading list */}
				<div className="flex flex-col">
					<p className="kicker mb-2">להמשך · קריאה פרקטית</p>
					<ol className="flex flex-col">
						{rest.map((post, index) => (
							<li key={post.id} className="border-t border-border">
								<Link href={`/blog/${post.id}/`} className="no-rule group flex gap-4 py-4 no-underline">
									<span className="folio mt-1 text-sm" aria-hidden="true">
										{String(index + 2).padStart(2, '0')}
									</span>
									<span className="flex flex-col gap-1">
										<span className="font-serif text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
											{post.title}
										</span>
										<span className="kicker">
											<FormattedDate date={post.pubDate} />
										</span>
									</span>
								</Link>
							</li>
						))}
					</ol>
					<Link href="/blog/" className="mt-4 font-serif text-base font-bold text-primary">
						לכל המאמרים ←
					</Link>
				</div>
			</div>
		</section>
	);
}
