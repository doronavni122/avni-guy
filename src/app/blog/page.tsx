import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FormattedDate } from '@/components/FormattedDate';
import { SiteShell } from '@/components/layout/SiteShell';
import { getSortedPosts } from '@/lib/content/posts';
import { buildPageMetadata } from '@/lib/metadata';
import { buildBreadcrumbSchema } from '@/utils/structured-data';

export const dynamic = 'force-static';

export const metadata = buildPageMetadata({
	title: 'אבני גיא עוד | מאמרים משפטיים, מעשיים ועדכניים',
	description:
		'באבני גיא עוד מאגר מאמרים משפטיים בעברית, תכנים חיוביים, מעודכנים ומקושרים למסלולי עבודה פרקטיים במשרד העורך דין.',
	keyword: 'אבני גיא עוד',
	path: '/blog/',
});

export default async function BlogIndexPage() {
	const posts = await getSortedPosts();
	const jsonLd = buildBreadcrumbSchema([
		{ name: 'דף הבית', path: '/' },
		{ name: 'מאמרים', path: '/blog' },
	]);

	return (
		<SiteShell extraJsonLd={jsonLd}>
			<section className="flex flex-col gap-10">
				<div className="flex flex-col gap-4 text-right">
					<p className="text-sm font-medium text-primary">אבני גיא עוד</p>
					<h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
						אבני גיא עוד - מאמרים מקצועיים בעברית
					</h1>
					<p className="max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground">
						עמוד זה מרכז את כל המאמרים לפי סדר עדכני. ניתן לקפוץ גם ל־{' '}
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/categories">
							קטגוריות
						</Link>
						,{' '}
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/tags">
							תגיות
						</Link>
						,{' '}
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/services">
							שירותים
						</Link>
						,{' '}
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/about">
							אודות
						</Link>
						,{' '}
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/contact">
							יצירת קשר
						</Link>
						,{' '}
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/">
							דף הבית
						</Link>{' '}
						ולמאמר{' '}
						<Link
							className="font-medium text-primary underline-offset-2 hover:underline"
							href="/blog/guy-avni-client-trust-roadmap/"
						>
							מפת אמון לקוח
						</Link>
						.
					</p>
				</div>
				<Separator className="bg-border/60" />
				<div className="flex flex-col gap-4 text-right">
					<h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">רשימת מאמרים</h2>
					<h3 className="text-lg font-medium text-muted-foreground">בחירה מהירה לפי נושא</h3>
				</div>
				<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
					{posts.map((post) => (
						<Link key={post.slug} className="group block h-full no-underline" href={`/blog/${post.slug}/`}>
							<Card className="h-full border-border/60 bg-card/70 shadow-sm transition-all group-hover:-translate-y-0.5 group-hover:border-primary/25 group-hover:shadow-md">
								<CardHeader className="text-right">
									<CardDescription className="text-xs text-muted-foreground">
										<FormattedDate date={post.data.pubDate} />
									</CardDescription>
									<CardTitle className="font-heading text-base leading-snug transition-colors group-hover:text-primary">
										{post.data.title}
									</CardTitle>
								</CardHeader>
								<CardContent className="text-right">
									<p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{post.data.description}</p>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
				<p className="text-right text-sm text-muted-foreground">
					בחרו מאמר אחד להתחלה, ואז עברו לפי קישורי ההמשך בכל עמוד כדי לבנות תמונת מצב מלאה ופרקטית.
				</p>
			</section>
		</SiteShell>
	);
}
