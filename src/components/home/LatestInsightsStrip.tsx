import Link from 'next/link';
import { FormattedDate } from '@/components/FormattedDate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PostPreview } from '@/lib/home/loadHomeData';

type LatestInsightsStripProps = {
	posts: PostPreview[];
};

export function LatestInsightsStrip({ posts }: LatestInsightsStripProps) {
	return (
		<section id="latest-insights" className="home-anchor-target flex flex-col gap-4 text-right" aria-labelledby="latest-insights-title">
			<div className="flex items-end justify-between gap-4">
				<div className="flex flex-col gap-2">
					<h2 id="latest-insights-title" className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
						תובנות אחרונות מגיא אבני עורך דין - עדכונים מהמשרד
					</h2>
					<div className="flex flex-wrap justify-end gap-2">
						<span className="inline-flex items-center rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-semibold text-foreground">
							חדש באתר
						</span>
					</div>
					<p className="text-sm text-muted-foreground">שלושה עדכונים חדשים שיעזרו לכם לשמור על בהירות ותנועה קדימה.</p>
				</div>
				<Link className="text-sm font-semibold text-primary underline-offset-2 hover:underline" href="/blog/">
					להמשך קריאה בבלוג
				</Link>
			</div>
			<div className="grid gap-4 md:grid-cols-3">
				{posts.map((post) => (
					<Link key={post.id} className="group block no-underline" href={`/blog/${post.id}/`}>
						<Card className="card-interactive h-full group-hover:border-primary/25">
							<CardHeader className="gap-2 text-right">
								<p className="text-xs text-muted-foreground">
									<FormattedDate date={post.pubDate} />
								</p>
								<CardTitle className="font-heading text-base leading-snug transition-colors group-hover:text-primary">
									{post.title}
								</CardTitle>
							</CardHeader>
							<CardContent className="text-right">
								<p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{post.description}</p>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>
		</section>
	);
}
