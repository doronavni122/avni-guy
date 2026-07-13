import Link from 'next/link';
import { PageSection } from '@/components/layout/PageSection';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { MainPageHero } from '@/components/seo/MainPageHero';
import { EntityByline } from '@/components/seo/EntityByline';
import { SiteShell } from '@/components/layout/SiteShell';
import { getCategories, getPostsIndex } from '@/lib/content/posts';
import { getCategoryLabel } from '@/utils/taxonomy-labels';
import { MAIN_PAGE_HEROES } from '@/lib/seo/main-page-heroes';
import { buildPageMetadata } from '@/lib/metadata';
import { replaceEmDashDeep } from '@/lib/content/sanitize-user-facing-text';
import { BreadcrumbNav } from '@/components/navigation/BreadcrumbNav';
import { SITE_URL } from '@/consts';
import {
	buildBreadcrumbSchema,
	buildFaqSchema,
	buildItemListSchema,
	buildWebPageSchema,
} from '@/utils/structured-data';

export const dynamic = 'force-static';

const CATEGORIES_DATE_MODIFIED = '2026-07-13';

const FEATURED_CATEGORIES = ['real-estate', 'contracts', 'litigation', 'tax'] as const;

export const metadata = buildPageMetadata({
	title: 'קטגוריות מאמרים לפי תחום | גיא אבני עורך דין',
	description:
		'גיא אבני עורך דין: קטגוריות מאמרים לפי תחום - אסטרטגיה, שירות, מסמכים ונדל״ן. בחרו נושא, קראו שני מאמרים והחליטו על הצעד הבא.',
	keyword: 'גיא אבני עורך דין',
	path: '/categories/',
	absoluteTitle: true,
});

const CATEGORIES_FAQ = replaceEmDashDeep([
	{
		question: 'איך לבחור קטגוריה?',
		answer:
			'בחרו את התחום שמציק עכשיו - נדל״ן, חוזים, מיסוי או ליטיגציה. קראו שני מאמרים שלא חוזרים על אותו מסר, ואז החליטו אם צריך ייעוץ.',
	},
	{
		question: 'מה ההבדל בין קטגוריה לתגית?',
		answer:
			'קטגוריה היא תחום רחב (למשל נדל״ן). תגית מצמצמת למצב ספציפי (למשל זכויות רוכש). התחילו מקטגוריה; עברו לתגית כשצריך זווית צרה.',
	},
	{
		question: 'מי מסדר את הקטגוריות?',
		answer:
			'גיא אבני, עו״ד, מארגן את המאמרים לפי תחומי ליווי מעשיים. כל קטגוריה מרכזת מאמרים בעברית שנכתבו לקריאה לפני שיחה.',
	},
]);

export default async function CategoriesIndexPage() {
	const categories = await getCategories();
	const { posts } = await getPostsIndex();

	const countByCategory = new Map<string, number>();
	for (const post of posts) {
		const category = post.data.category;
		countByCategory.set(category, (countByCategory.get(category) ?? 0) + 1);
	}

	const breadcrumbItems = [
		{ name: 'דף הבית', path: '/' },
		{ name: 'קטגוריות', path: '/categories/' },
	];

	const listItems = categories.map((category) => ({
		name: getCategoryLabel(category),
		url: new URL(`/categories/${category}/`, SITE_URL).toString(),
	}));

	const jsonLd = [
		buildBreadcrumbSchema(breadcrumbItems),
		buildWebPageSchema({
			'@id': `${SITE_URL}/categories/#webpage`,
			url: `${SITE_URL}/categories/`,
			name: 'קטגוריות מאמרים לפי תחום | גיא אבני עורך דין',
			description: 'מפת קטגוריות מאמרים משפטיים בעברית.',
			dateModified: CATEGORIES_DATE_MODIFIED,
			'@type': 'CollectionPage',
		}),
		buildItemListSchema(listItems),
		buildFaqSchema([...CATEGORIES_FAQ]),
	];

	const featured = FEATURED_CATEGORIES.filter((c) => categories.includes(c));

	return (
		<SiteShell currentPath="/categories/" extraJsonLd={jsonLd}>
			<div className="flex flex-col">
				<BreadcrumbNav items={breadcrumbItems} />
				<MainPageHero hero={MAIN_PAGE_HEROES['/categories/']} index="04" eyebrow="נושאים" />
				<EntityByline lastUpdatedLabel="יולי 2026" />
				<p className="mt-4 max-w-3xl text-pretty text-right text-sm leading-relaxed text-muted-foreground">
					גיא אבני, עו״ד, מארגן מאמרים לפי תחומי ליווי.{' '}
					<Link className="link-underline" href="/about/">
						מדיניות עריכה ורקע מקצועי
					</Link>
					.
				</p>

				<p className="mt-8 max-w-3xl text-pretty text-right leading-relaxed text-muted-foreground">
					בחרו תחום אחד, קראו שני מאמרים שלא חוזרים על אותו מסר, ואז עברו ל־{' '}
					<Link className="link-underline" href="/tags/">
						תגיות
					</Link>
					,{' '}
					<Link className="link-underline" href="/services/">
						שירותים
					</Link>
					,{' '}
					<Link className="link-underline" href="/blog/">
						מאמרים
					</Link>{' '}
					או ל־{' '}
					<Link className="link-underline" href="/contact/">
						יצירת קשר
					</Link>{' '}
					אם נשארה שאלה פתוחה.
				</p>

				{featured.length ? (
					<PageSection className="mt-12">
						<SectionHeader index={1} eyebrow="מומלצים" title="קטגוריות מובילות" />
						<ul className="mt-6 flex flex-wrap justify-end gap-x-4 gap-y-2 text-sm">
							{featured.map((category) => (
								<li key={category}>
									<Link className="link-underline font-medium" href={`/categories/${category}/`}>
										{getCategoryLabel(category)} ({countByCategory.get(category) ?? 0})
									</Link>
								</li>
							))}
						</ul>
					</PageSection>
				) : null}

				<PageSection className="mt-12">
					<SectionHeader
						index={2}
						eyebrow="קטגוריות"
						title="בחרו תחום וקראו מאמרים ממוקדים"
						description="כל קטגוריה מרכזת מאמרים באותו תחום משפטי."
					/>
					<div className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
						{categories.map((category, index) => (
							<Link
								key={category}
								className="group flex flex-col gap-6 bg-background p-8 no-underline transition-colors hover:bg-card"
								href={`/categories/${category}/`}
							>
								<div className="flex items-center justify-between">
									<span className="font-mono text-xs text-muted-foreground">
										{String(index + 1).padStart(2, '0')}
									</span>
									<span className="h-px w-8 bg-border transition-colors group-hover:bg-primary" aria-hidden="true" />
								</div>
								<div className="flex flex-col gap-1 text-right">
									<h3 className="font-heading text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
										{getCategoryLabel(category)}
									</h3>
									<span className="text-sm text-muted-foreground">
										{countByCategory.get(category) ?? 0} מאמרים
									</span>
								</div>
							</Link>
						))}
					</div>
				</PageSection>

				<PageSection className="mt-12">
					<SectionHeader index={3} eyebrow="שאלות נפוצות" title="שאלות על הקטגוריות" />
					<div className="mt-8 flex max-w-3xl flex-col gap-6">
						{CATEGORIES_FAQ.map(({ question, answer }) => (
							<div key={question} className="border-b border-border pb-6 last:border-b-0">
								<h3 className="font-heading text-lg font-semibold text-foreground">{question}</h3>
								<p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">{answer}</p>
							</div>
						))}
					</div>
				</PageSection>
			</div>
		</SiteShell>
	);
}
