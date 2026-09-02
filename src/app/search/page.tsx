import { Suspense } from 'react';
import Link from 'next/link';
import { SiteShell } from '@/components/layout/SiteShell';
import { buildPageMetadata } from '@/lib/metadata';
import { BreadcrumbNav } from '@/components/navigation/BreadcrumbNav';
import { buildBreadcrumbSchema } from '@/utils/structured-data';
import { SearchResults } from '@/components/search/SearchResults';

export const dynamic = 'force-static';

export const metadata = buildPageMetadata({
	title: 'חיפוש באתר | גיא אבני',
	description: 'חיפוש מאמרים ותוכן משפטי באתר avniguy.co.il.',
	keyword: 'גיא אבני',
	path: '/search/',
	absoluteTitle: true,
});

export default function SearchPage() {
	const breadcrumbItems = [
		{ name: 'דף הבית', path: '/' },
		{ name: 'חיפוש', path: '/search/' },
	];
	const jsonLd = buildBreadcrumbSchema(breadcrumbItems);

	return (
		<SiteShell currentPath="/search/" extraJsonLd={jsonLd}>
			<BreadcrumbNav items={breadcrumbItems} />
			<h1 className="font-heading text-3xl font-bold text-foreground">חיפוש באתר</h1>
			<p className="mt-4 max-w-2xl text-muted-foreground">
				הזינו מונח חיפוש. לדוגמה:{' '}
				<Link className="link-underline" href="/search/?q=חוזה">
					חוזה
				</Link>
			</p>
			<Suspense fallback={<p className="mt-8 text-muted-foreground">טוען תוצאות…</p>}>
				<SearchResults />
			</Suspense>
		</SiteShell>
	);
}
