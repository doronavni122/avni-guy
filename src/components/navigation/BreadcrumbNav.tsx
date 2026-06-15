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
			<BreadcrumbList className="flex-row-reverse justify-end">
				{items.map((item, index) => {
					const isLast = index === items.length - 1;
					return (
						<Fragment key={`${item.path}-${index}`}>
							<BreadcrumbItem>
								{isLast ? (
									<BreadcrumbPage className="max-w-[min(100%,42rem)] truncate font-medium">
										{item.name}
									</BreadcrumbPage>
								) : (
									<BreadcrumbLink
										render={<Link href={item.path} />}
										className="text-primary underline-offset-2 hover:text-primary/80 hover:underline"
									>
										{item.name}
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
							{!isLast ? (
								<BreadcrumbSeparator className="select-none text-border [&>svg]:hidden">
									/
								</BreadcrumbSeparator>
							) : null}
						</Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
