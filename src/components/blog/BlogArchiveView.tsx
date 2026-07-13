import Link from 'next/link';
import { BlogPagination } from '@/components/blog/BlogPagination';
import { ArticleList } from '@/components/blog/ArticleList';
import { PageSection } from '@/components/layout/PageSection';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { MainPageHero } from '@/components/seo/MainPageHero';
import { EntityByline } from '@/components/seo/EntityByline';
import { SiteShell } from '@/components/layout/SiteShell';
import { getSortedPosts, getPostsIndex } from '@/lib/content/posts';
import {
	getArchiveDateModified,
	getArchiveYears,
	getBlogArchivePageCount,
	paginateBlogPosts,
} from '@/lib/blog/archive';
import { MAIN_PAGE_HEROES } from '@/lib/seo/main-page-heroes';
import { buildPageMetadata } from '@/lib/metadata';
import { BreadcrumbNav } from '@/components/navigation/BreadcrumbNav';
import { SITE_URL } from '@/consts';
import { getCategoryLabel } from '@/utils/taxonomy-labels';
import {
	buildBreadcrumbSchema,
	buildItemListSchema,
	buildWebPageSchema,
} from '@/utils/structured-data';

export const dynamic = 'force-static';

const BLOG_OG_IMAGE = `${SITE_URL}/images/shared/guy-avni-avni-guy-law-firm-lawyer-og-law-fallback-photo-1.jpg`;
export const metadata = buildPageMetadata({
	title: 'מאמרים משפטיים מעשיים | גיא אבני עו״ד',
	description:
		'גיא אבני עו״ד: מאגר מאמרים משפטיים בעברית על חוזים, נדל״ן, לקוחות ותהליכים. קראו לפני שיחה, סמנו מאמרים והגיעו מוכנים לייעוץ.',
	keyword: 'גיא אבני עו״ד',
	path: '/blog/',
	absoluteTitle: true,
	image: BLOG_OG_IMAGE,
});

const ARCHIVE_SCOPE =
	'ארכיון מאמרים משפטיים של גיא אבני, עו״ד: נדל״ן, מיסוי, חוזים, ליטיגציה ותהליכים. המאמרים מסודרים לפי תאריך עדכון; התוכן מידע כללי ואינו ייעוץ משפטי אישי.';

type BlogArchiveViewProps = {
	page: number;
};

export async function BlogArchiveView({ page }: BlogArchiveViewProps) {
	const allPosts = await getSortedPosts();
	const { categories } = await getPostsIndex();
	const totalPages = getBlogArchivePageCount(allPosts.length);
	const safePage = Math.min(Math.max(1, page), totalPages);
	const posts = paginateBlogPosts(allPosts, safePage);
	const archiveModified = getArchiveDateModified(allPosts);
	const years = getArchiveYears(allPosts);

	const breadcrumbItems = [
		{ name: 'דף הבית', path: '/' },
		{ name: 'מאמרים', path: '/blog/' },
		...(safePage > 1 ? [{ name: `עמוד ${safePage}`, path: `/blog/page/${safePage}/` }] : []),
	];

	const listItems = posts.map((post) => ({
		name: post.data.title,
		url: new URL(`/blog/${post.slug}/`, SITE_URL).toString(),
	}));

	const jsonLd = [
		buildBreadcrumbSchema(breadcrumbItems),
		buildWebPageSchema({
			'@id': `${SITE_URL}/blog/#webpage`,
			url: safePage === 1 ? `${SITE_URL}/blog/` : `${SITE_URL}/blog/page/${safePage}/`,
			name: 'מאמרים משפטיים מעשיים | גיא אבני עו״ד',
			description:
				'ארכיון מאמרים משפטיים בעברית של גיא אבני, עו״ד: חוזים, נדל״ן, מיסוי ותהליכים.',
			dateModified: archiveModified,
			'@type': 'CollectionPage',
		}),
		...(listItems.length ? [buildItemListSchema(listItems)] : []),
	];

	const hero = {
		...MAIN_PAGE_HEROES['/blog/'],
		h1: 'מאמרים משפטיים מעשיים | גיא אבני עו״ד',
	};

	return (
		<SiteShell currentPath="/blog/" extraJsonLd={jsonLd}>
			<div className="flex flex-col">
				<BreadcrumbNav items={breadcrumbItems} />
				<MainPageHero hero={hero} index="03" eyebrow="מאמרים / Journal" />
				<p className="mt-6 max-w-3xl text-pretty text-right text-sm leading-relaxed text-muted-foreground">
					{ARCHIVE_SCOPE}
				</p>
				<EntityByline lastUpdatedLabel="יולי 2026" />

				<PageSection className="mt-12">
					<SectionHeader
						index={1}
						eyebrow="ניווט / Navigation"
						title="מצאו מאמרים לפי נושא או שנה"
					/>
					<div className="mt-6 flex flex-col gap-4 text-right text-sm text-muted-foreground">
						<p>
							<Link className="link-underline" href="/categories/">
								קטגוריות
							</Link>
							{' · '}
							<Link className="link-underline" href="/tags/">
								תגיות
							</Link>
							{' · '}
							<Link className="link-underline" href="/services/">
								שירותים
							</Link>
						</p>
						<p className="flex flex-wrap justify-end gap-x-3 gap-y-1">
							{categories.slice(0, 8).map((category) => (
								<Link key={category} className="link-underline" href={`/categories/${category}/`}>
									{getCategoryLabel(category)}
								</Link>
							))}
						</p>
						<p className="flex flex-wrap justify-end gap-x-3 gap-y-1">
							{years.map(({ year, count }) => (
								<span key={year} className="text-muted-foreground">
									{year} ({count})
								</span>
							))}
						</p>
					</div>
				</PageSection>

				<PageSection className="mt-8">
					<SectionHeader
						index={2}
						eyebrow="ארכיון / Archive"
						title="כל המאמרים לפי סדר עדכני"
					/>
					<div className="mt-4 flex items-end justify-between border-b border-border pb-3">
						<span className="swiss-label">
							{String(allPosts.length).padStart(2, '0')} מאמרים · עמוד {safePage} מתוך {totalPages}
						</span>
						<span className="swiss-label">ארכיון</span>
					</div>
					<ArticleList posts={posts} showDate excerpt="metaDescription" />
					<BlogPagination currentPage={safePage} totalPages={totalPages} />
				</PageSection>
			</div>
		</SiteShell>
	);
}
