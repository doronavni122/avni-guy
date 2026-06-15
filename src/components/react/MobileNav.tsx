'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MenuIcon } from 'lucide-react';
import { isNavLinkActive } from '@/components/HeaderLink';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
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
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				render={
					<Button
						variant="outline"
						size="icon-sm"
						className="md:hidden"
						aria-label="פתיחת תפריט ניווט"
					/>
				}
			>
				<MenuIcon />
			</SheetTrigger>
			<SheetContent side="right" dir="rtl" className="w-[min(100%,20rem)]">
				<SheetTitle className="sr-only">תפריט ניווט ראשי</SheetTitle>
				<nav aria-label="ניווט ראשי">
					<ul className="flex flex-col gap-1 pt-6">
						{NAV_LINKS.map((item) => {
							const isActive = isNavLinkActive(item.href, currentPath);
							return (
								<li key={item.href}>
									<Link
										href={item.href}
										aria-current={isActive ? 'page' : undefined}
										onClick={() => setOpen(false)}
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
			</SheetContent>
		</Sheet>
	);
}
