import Link from 'next/link';
import type { BreadcrumbItem } from '@/utils/structured-data';

type BreadcrumbNavProps = {
	items: BreadcrumbItem[];
};

/** Visible RTL breadcrumb trail; paths must match `buildBreadcrumbSchema` inputs on the same page. */
export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
	if (!items.length) return null;

	return (
		<nav aria-label="מסלול ניווט" dir="rtl" className="text-right">
			<ol className="flex flex-row-reverse flex-wrap items-center justify-end gap-x-1 gap-y-1 text-sm text-muted-foreground">
				{items.map((item, index) => {
					const isLast = index === items.length - 1;
					return (
						<li key={`${item.path}-${index}`} className="inline-flex flex-row-reverse items-center gap-1">
							{isLast ? (
								<span aria-current="page" className="max-w-[min(100%,42rem)] truncate font-medium text-foreground">
									{item.name}
								</span>
							) : (
								<Link
									href={item.path}
									className="text-primary underline-offset-2 transition-colors hover:text-primary/80 hover:underline"
								>
									{item.name}
								</Link>
							)}
							{!isLast ? (
								<span aria-hidden="true" className="select-none text-border">
									/
								</span>
							) : null}
						</li>
					);
				})}
			</ol>
		</nav>
	);
}
