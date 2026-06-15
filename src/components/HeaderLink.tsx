import Link from 'next/link';
import { cn } from '@/lib/utils';

type HeaderLinkProps = {
	href: string;
	currentPath: string;
	children: React.ReactNode;
};

function normalizePath(value: string): string {
	return value.endsWith('/') ? value : `${value}/`;
}

export function isNavLinkActive(href: string, currentPath: string): boolean {
	const normalizedHref = normalizePath(href);
	const normalizedPath = normalizePath(currentPath);
	return normalizedPath === normalizedHref || (href !== '/' && normalizedPath.startsWith(normalizedHref));
}

export function HeaderLink({ href, currentPath, children }: HeaderLinkProps) {
	const isActive = isNavLinkActive(href, currentPath);

	return (
		<Link
			href={href}
			aria-current={isActive ? 'page' : undefined}
			className={cn(
				'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
				isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
			)}
		>
			{children}
		</Link>
	);
}
