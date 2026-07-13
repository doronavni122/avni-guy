import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { BlogArchiveView } from '@/components/blog/BlogArchiveView';
import { getSortedPosts } from '@/lib/content/posts';
import { getBlogArchivePageCount } from '@/lib/blog/archive';
import { buildPageMetadata } from '@/lib/metadata';

export const dynamic = 'force-static';

type PageProps = { params: Promise<{ page: string }> };

export async function generateStaticParams() {
	const posts = await getSortedPosts();
	const totalPages = getBlogArchivePageCount(posts.length);
	return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
		page: String(i + 2),
	}));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { page: pageParam } = await params;
	const page = Number.parseInt(pageParam, 10);
	if (!Number.isFinite(page) || page < 2) {
		return buildPageMetadata({
			title: 'מאמרים משפטיים מעשיים | גיא אבני עו״ד',
			description: 'ארכיון מאמרים משפטיים בעברית.',
			keyword: 'גיא אבני עו״ד',
			path: '/blog/',
			absoluteTitle: true,
		});
	}
	return buildPageMetadata({
		title: `מאמרים משפטיים | עמוד ${page} | גיא אבני עו״ד`,
		description: `ארכיון מאמרים משפטיים - עמוד ${page}.`,
		keyword: 'גיא אבני עו״ד',
		path: `/blog/page/${page}/`,
		absoluteTitle: true,
	});
}

export default async function BlogArchivePaginatedPage({ params }: PageProps) {
	const { page: pageParam } = await params;
	const page = Number.parseInt(pageParam, 10);
	const posts = await getSortedPosts();
	const totalPages = getBlogArchivePageCount(posts.length);

	if (!Number.isFinite(page) || page < 2 || page > totalPages) {
		notFound();
	}

	return <BlogArchiveView page={page} />;
}
