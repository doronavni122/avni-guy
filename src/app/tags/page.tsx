import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SiteShell } from '@/components/layout/SiteShell';
import { getTags } from '@/lib/content/posts';
import { buildPageMetadata } from '@/lib/metadata';
import { buildBreadcrumbSchema } from '@/utils/structured-data';
import { getTagLabel } from '@/utils/taxonomy-labels';

export const dynamic = 'force-static';

export const metadata = buildPageMetadata({
	title: 'גיא אבני משרד עורכי דין | תגיות לנושאים ממוקדים',
	description:
		'תגיות תוכן באתר גיא אבני משרד עורכי דין, דיוק מהיר בנושא, קישורים למאמרים, קטגוריות, שירותים ואודות המשרד.',
	keyword: 'גיא אבני משרד עורכי דין',
	path: '/tags/',
});

export default async function TagsIndexPage() {
	const tags = await getTags();
	const jsonLd = buildBreadcrumbSchema([
		{ name: 'דף הבית', path: '/' },
		{ name: 'תגיות', path: '/tags' },
	]);

	return (
		<SiteShell extraJsonLd={jsonLd}>
			<section className="flex flex-col gap-10">
				<div className="flex flex-col gap-4 text-right">
					<p className="text-sm font-medium text-primary">גיא אבני משרד עורכי דין</p>
					<h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
						גיא אבני משרד עורכי דין - תגיות תוכן
					</h1>
				</div>
				<Separator className="bg-border/60" />
				<div className="flex flex-wrap justify-end gap-3">
					{tags.map((tag) => (
						<Link key={tag} className="no-underline" href={`/tags/${tag}/`}>
							<Card className="border-border/60 bg-card/70 px-4 py-3 shadow-sm transition-all hover:border-primary/25 hover:shadow-md">
								<CardHeader className="p-0 text-right">
									<CardTitle className="font-heading text-sm font-semibold text-primary">{getTagLabel(tag)}</CardTitle>
								</CardHeader>
							</Card>
						</Link>
					))}
				</div>
			</section>
		</SiteShell>
	);
}
