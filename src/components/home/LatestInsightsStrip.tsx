import Link from 'next/link';
import { FormattedDate } from '@/components/FormattedDate';
import type { PostPreview } from '@/lib/home/loadHomeData';

type LatestInsightsStripProps = {
	posts: PostPreview[];
};

/** Editorial "latest dispatches" row: three ruled columns with serif headlines. */
export function LatestInsightsStrip({ posts }: LatestInsightsStripProps) {
	return (
		<section
			id="latest-insights"
			className="home-anchor-target flex flex-col gap-8 text-right"
			aria-labelledby="latest-insights-title"
		>
			<div className="flex items-baseline justify-between gap-4 border-t-2 border-foreground pt-3">
				<p className="kicker">חדש באתר · עדכוני המשרד</p>
				<span className="folio text-base" aria-hidden="true">06</span>
			</div>
			<h2
				id="latest-insights-title"
				className="max-w-3xl font-serif text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl"
			>
				תובנות אחרונות מגיא אבני עורך דין - עדכונים מהמשרד
			</h2>

			<div className="grid gap-x-10 gap-y-8 sm:grid-cols-3">
				{posts.map((post, index) => (
					<Link
						key={post.id}
						href={`/blog/${post.id}/`}
						className="no-rule group flex flex-col gap-2 border-t border-border pt-4 no-underline"
					>
						<span className="kicker">
							<span className="folio not-italic">{String(index + 1).padStart(2, '0')}</span> ·{' '}
							<FormattedDate date={post.pubDate} />
						</span>
						<h3 className="font-serif text-xl font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
							{post.title}
						</h3>
						<p className="line-clamp-3 leading-relaxed text-muted-foreground">{post.description}</p>
					</Link>
				))}
			</div>

			<Link href="/blog/" className="font-serif text-base font-bold text-primary">
				להמשך קריאה בבלוג ←
			</Link>
		</section>
	);
}
