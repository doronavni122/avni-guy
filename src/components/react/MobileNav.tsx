import Link from 'next/link';
import { HeaderLink } from '@/components/HeaderLink';
import { cn } from '@/lib/utils';

const NAV_LINKS: { href: string; label: string }[] = [
	{ href: '/', label: 'דף הבית' },
	{ href: '/about/', label: 'אודות' },
	{ href: '/services/', label: 'שירותים' },
	{ href: '/blog/', label: 'מאמרים' },
	{ href: '/categories/', label: 'קטגוריות' },
	{ href: '/tags/', label: 'תגיות' },
	{ href: '/contact/', label: 'יצירת קשר' },
];

type MobileNavProps = {
	currentPath: string;
};

export function MobileNav({ currentPath }: MobileNavProps) {
	return (
		<details className="group relative md:hidden">
			<summary
				className="flex size-9 cursor-pointer list-none items-center justify-center rounded-lg border border-border/80 bg-background/95 text-sm font-semibold shadow-sm [&::-webkit-details-marker]:hidden"
				aria-label="פתיחת תפריט ניווט"
			>
				<span aria-hidden="true">☰</span>
			</summary>
			<nav
				className="absolute end-0 top-full z-50 mt-2 min-w-48 rounded-xl border border-border/60 bg-background p-2 shadow-lg"
				aria-label="ניווט ראשי"
			>
				<ul className="flex flex-col gap-1">
					{NAV_LINKS.map((item) => {
						const normalizedHref = item.href.endsWith('/') ? item.href : `${item.href}/`;
						const normalizedPath = currentPath.endsWith('/') ? currentPath : `${currentPath}/`;
						const isActive =
							normalizedPath === normalizedHref ||
							(item.href !== '/' && normalizedPath.startsWith(normalizedHref));
						return (
							<li key={item.href}>
								<Link
									href={item.href}
									aria-current={isActive ? 'page' : undefined}
									className={cn(
										'block rounded-lg px-3 py-2 text-right text-sm font-medium transition-colors',
										isActive ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted',
									)}
								>
									{item.label}
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>
		</details>
	);
}
