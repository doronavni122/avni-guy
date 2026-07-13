import Link from 'next/link';

type BlogPaginationProps = {
	currentPage: number;
	totalPages: number;
};

export function BlogPagination({ currentPage, totalPages }: BlogPaginationProps) {
	if (totalPages <= 1) return null;

	const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

	return (
		<nav className="mt-8 flex flex-wrap justify-center gap-2 text-sm" aria-label="עימוד ארכיון מאמרים">
			{pages.map((page) => {
				const href = page === 1 ? '/blog/' : `/blog/page/${page}/`;
				const isCurrent = page === currentPage;
				return (
					<Link
						key={page}
						href={href}
						className={
							isCurrent
								? 'rounded border border-primary bg-primary px-3 py-1 font-medium text-primary-foreground no-underline'
								: 'rounded border border-border px-3 py-1 text-foreground no-underline transition-colors hover:bg-card'
						}
						aria-current={isCurrent ? 'page' : undefined}
					>
						{page}
					</Link>
				);
			})}
		</nav>
	);
}
