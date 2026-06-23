import Link from 'next/link';
import { MainPageHero } from '@/components/seo/MainPageHero';
import { SiteShell } from '@/components/layout/SiteShell';
import { getTags } from '@/lib/content/posts';
import { MAIN_PAGE_HEROES } from '@/lib/seo/main-page-heroes';
import { buildPageMetadata } from '@/lib/metadata';
import { BreadcrumbNav } from '@/components/navigation/BreadcrumbNav';
import { buildBreadcrumbSchema } from '@/utils/structured-data';
import { getTagLabel } from '@/utils/taxonomy-labels';

export const dynamic = 'force-static';

export const metadata = buildPageMetadata({
	title: 'גיא אבני משרד עורכי דין | תגיות לנושאים ממוקדים',
	description:
		'גיא אבני משרד עורכי דין: תגיות לנושאים צרים - זכויות רוכש, ציות, לקוחות ודין ישראלי. מצאו מאמר רלוונטי בלי לדפדף את כל הארכיון.',
	keyword: 'גיא אבני משרד עורכי דין',
	path: '/tags/',
});

export default async function TagsIndexPage() {
	const tags = await getTags();
	const breadcrumbItems = [
		{ name: 'דף הבית', path: '/' },
		{ name: 'תגיות', path: '/tags' },
	];
	const jsonLd = buildBreadcrumbSchema(breadcrumbItems);

	return (
		<SiteShell currentPath="/tags/" extraJsonLd={jsonLd}>
			<div className="flex flex-col">
				<BreadcrumbNav items={breadcrumbItems} />
				<MainPageHero hero={MAIN_PAGE_HEROES['/tags/']} eyebrow="תגיות · Tags" />

				<p className="mt-8 max-w-2xl text-pretty text-right text-lg leading-relaxed text-muted-foreground">
					תגית צרה מצמצמת רעש: פתחו נושא אחד, השוו ל־{' '}
					<Link className="link-underline" href="/categories/">
						קטגוריה רחבה
					</Link>{' '}
					רק אם צריך הקשר נוסף, ואז המשיכו למאמר המלא מהארכיון.
				</p>

				<section className="mt-14">
					<p className="kicker mb-5">מפתח · תגיות</p>
					<ul className="flex flex-wrap justify-end gap-x-8 gap-y-4 border-t-2 border-foreground pt-6">
						{tags.map((tag) => (
							<li key={tag}>
								<Link
									className="font-serif text-xl font-bold text-foreground no-underline transition-colors hover:text-primary sm:text-2xl"
									href={`/tags/${tag}/`}
								>
									{getTagLabel(tag)}
								</Link>
							</li>
						))}
					</ul>
				</section>
			</div>
		</SiteShell>
	);
}
