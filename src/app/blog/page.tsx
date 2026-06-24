import Link from 'next/link';
import { PageSection } from '@/components/layout/PageSection';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ArticleList } from '@/components/blog/ArticleList';
import { MainPageHero } from '@/components/seo/MainPageHero';
import { SiteShell } from '@/components/layout/SiteShell';
import { getSortedPosts } from '@/lib/content/posts';
import { MAIN_PAGE_HEROES } from '@/lib/seo/main-page-heroes';
import { buildPageMetadata } from '@/lib/metadata';
import { BreadcrumbNav } from '@/components/navigation/BreadcrumbNav';
import { buildBreadcrumbSchema } from '@/utils/structured-data';

export const dynamic = 'force-static';

export const metadata = buildPageMetadata({
	title: 'גיא אבני עו״ד | מאמרים משפטיים מעשיים',
	description:
		'גיא אבני עו״ד: מאגר מאמרים משפטיים בעברית על חוזים, נדל״ן, לקוחות ותהליכים. קראו לפני שיחה, סמנו מאמרים והגיעו מוכנים לייעוץ.',
	keyword: 'גיא אבני עו״ד',
	path: '/blog/',
});

export default async function BlogIndexPage() {
	const posts = await getSortedPosts();
	const breadcrumbItems = [
		{ name: 'דף הבית', path: '/' },
		{ name: 'מאמרים', path: '/blog' },
	];
	const jsonLd = buildBreadcrumbSchema(breadcrumbItems);

	return (
		<SiteShell currentPath="/blog/" extraJsonLd={jsonLd}>
			<div className="flex flex-col">
				<BreadcrumbNav items={breadcrumbItems} />
				<MainPageHero hero={MAIN_PAGE_HEROES['/blog/']} index="03" eyebrow="מאמרים / Journal" />

				<PageSection className="mt-16">
					<SectionHeader
						index={1}
						eyebrow="קריאה מומלצת / Reading"
						title="מה כדאי לקרוא השבוע - לפי סדר עדכני"
					/>
					<p className="max-w-3xl text-pretty text-muted-foreground">
							להעמקה לפי נושא, אפשר לעבור ל־{' '}
							<Link className="link-underline" href="/categories/">
								קטגוריות
							</Link>
							,{' '}
							<Link className="link-underline" href="/tags/">
								תגיות
							</Link>
							,{' '}
							<Link className="link-underline" href="/services/">
								שירותים
							</Link>
							. מומלץ גם:{' '}
							<Link className="link-underline" href="/blog/lawyer-required-apartment-purchase/">
								עורך דין לקניית דירה
							</Link>
							,{' '}
							<Link className="link-underline" href="/blog/tax-authority-appeal-process/">
								ערעור מול רשות המיסים
							</Link>
							,{' '}
							<Link className="link-underline" href="/blog/cancel-apartment-purchase-contract/">
								ביטול חוזה רכישת דירה
							</Link>
							,{' '}
							<Link className="link-underline" href="/blog/seize-single-apartment-debts/">
								עיקול דירה יחידה בחובות
							</Link>
							.
					</p>
				</PageSection>

				<PageSection>
					<div className="flex items-end justify-between border-b border-border pb-3">
						<span className="swiss-label">{String(posts.length).padStart(2, '0')} מאמרים</span>
						<span className="swiss-label">ארכיון</span>
					</div>
					<ArticleList posts={posts} showDate excerpt="metaDescription" />
				</PageSection>

				<p className="mt-8 text-right text-sm text-muted-foreground">
					בחרו מאמר אחד להתחלה, ואז עברו לפי קישורי ההמשך בכל עמוד כדי לבנות תמונת מצב מלאה ופרקטית.
				</p>
			</div>
		</SiteShell>
	);
}
