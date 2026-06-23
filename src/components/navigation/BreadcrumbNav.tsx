import Link from 'next/link';
import { Fragment } from 'react';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import type { BreadcrumbItem as BreadcrumbItemData } from '@/utils/structured-data';

type BreadcrumbNavProps = {
	items: BreadcrumbItemData[];
};

/** Visible RTL breadcrumb trail; paths must match `buildBreadcrumbSchema` inputs on the same page. */
export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
	if (!items.length) return null;

	return (
		<Breadcrumb dir="rtl" aria-label="מסלול ניווט" className="text-right">
			<BreadcrumbList className="flex-row-reverse justify-end gap-1.5">
				{items.map((item, index) => {
					const isLast = index === items.length - 1;
					return (
						<Fragment key={`${item.path}-${index}`}>
							<BreadcrumbItem>
								{isLast ? (
									<BreadcrumbPage className="kicker max-w-[min(100%,42rem)] truncate text-foreground">
										{item.name}
									</BreadcrumbPage>
								) : (
									<BreadcrumbLink
										render={<Link href={item.path} />}
										className="kicker no-rule no-underline transition-colors hover:text-primary"
									>
										{item.name}
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
							{!isLast ? (
								<BreadcrumbSeparator className="kicker select-none [&>svg]:hidden">
									·
								</BreadcrumbSeparator>
							) : null}
						</Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
