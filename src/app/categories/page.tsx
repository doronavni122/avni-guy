import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SiteShell } from '@/components/layout/SiteShell';
import { getCategories } from '@/lib/content/posts';
import { buildPageMetadata } from '@/lib/metadata';
import { buildBreadcrumbSchema } from '@/utils/structured-data';

export const dynamic = 'force-static';

export const metadata = buildPageMetadata({
	title: 'גיא אבני עורך דין | קטגוריות מאמרים לפי תחום',
	description:
		'קטגוריות מאמרים של גיא אבני עורך דין, ניווט מהיר בנושאים, קישורים למאמרים, תגיות, שירותים ויצירת קשר.',
	keyword: 'גיא אבני עורך דין',
	path: '/categories/',
});

export default async function CategoriesIndexPage() {
	const categories = await getCategories();
	const jsonLd = buildBreadcrumbSchema([
		{ name: 'דף הבית', path: '/' },
		{ name: 'קטגוריות', path: '/categories' },
	]);

	return (
		<SiteShell extraJsonLd={jsonLd}>
			<section className="flex flex-col gap-10">
				<div className="flex flex-col gap-4 text-right">
					<p className="text-sm font-medium text-primary">גיא אבני עורך דין</p>
					<h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
						גיא אבני עורך דין - קטגוריות תוכן
					</h1>
					<p className="max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground">
						כאן אפשר לנווט לפי תחום עניין ולמצוא מאמרים ממוקדים במהירות.
					</p>
				</div>
				<Separator className="bg-border/60" />
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{categories.map((category) => (
						<Link key={category} className="group block no-underline" href={`/categories/${category}/`}>
							<Card className="border-border/60 bg-card/70 shadow-sm transition-all group-hover:border-primary/25 group-hover:shadow-md">
								<CardHeader className="text-right">
									<CardTitle className="font-heading text-lg transition-colors group-hover:text-primary">{category}</CardTitle>
								</CardHeader>
								<CardContent className="text-right text-sm text-muted-foreground">מעבר למאמרים בקטגוריה</CardContent>
							</Card>
						</Link>
					))}
				</div>
			</section>
		</SiteShell>
	);
}
