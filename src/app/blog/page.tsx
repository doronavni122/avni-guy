import Link from 'next/link';
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
				<MainPageHero hero={MAIN_PAGE_HEROES['/blog/']} eyebrow="מאמרים · Journal" />

				<section className="mt-16 grid gap-x-12 gap-y-6 border-t-2 border-foreground pt-10 lg:grid-cols-12">
					<header className="lg:col-span-4">
						<p className="kicker">קריאה מומלצת</p>
						<h2 className="mt-3 font-serif text-3xl font-extrabold leading-tight tracking-tight text-foreground text-balance">
							מה כדאי לקרוא השבוע - לפי סדר עדכני
						</h2>
					</header>
					<p className="drop-cap max-w-2xl text-pretty text-lg leading-relaxed text-foreground lg:col-span-8">
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
				</section>

				<section className="mt-16">
					<div className="flex items-baseline justify-between">
						<p className="kicker">הארכיון המלא</p>
						<span className="folio text-base text-muted-foreground" aria-hidden="true">
							{String(posts.length).padStart(2, '0')}
						</span>
					</div>
					<div className="mt-4">
						<ArticleList posts={posts} showDate excerpt="metaDescription" />
					</div>
				</section>

				<p className="mt-10 max-w-2xl text-right leading-relaxed text-muted-foreground">
					בחרו מאמר אחד להתחלה, ואז עברו לפי קישורי ההמשך בכל עמוד כדי לבנות תמונת מצב מלאה ופרקטית.
				</p>
			</div>
		</SiteShell>
	);
}
