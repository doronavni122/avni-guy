'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type HeaderLinkProps = {
	href: string;
	children: React.ReactNode;
};

export function HeaderLink({ href, children }: HeaderLinkProps) {
	const pathname = usePathname();
	const normalizedHref = href.endsWith('/') ? href : `${href}/`;
	const normalizedPath = pathname?.endsWith('/') ? pathname : `${pathname}/`;
	const isActive = normalizedPath === normalizedHref || (href !== '/' && normalizedPath.startsWith(normalizedHref));

	return (
		<Link
			href={href}
			className={cn(
				'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
				isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
			)}
		>
			{children}
		</Link>
	);
}
