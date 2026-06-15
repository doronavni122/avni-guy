'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { isNavLinkActive } from '@/lib/nav/is-nav-active';
import { SITE_NAV_LINKS } from '@/lib/nav/site-nav';
import { cn } from '@/lib/utils';

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
			<SheetContent side="right" dir="rtl" className="glass-header w-[min(100%,20rem)] border-s border-border/60">
				<SheetTitle className="sr-only">תפריט ניווט ראשי</SheetTitle>
				<nav aria-label="ניווט ראשי">
					<ul className="flex flex-col gap-1 pt-8">
						{SITE_NAV_LINKS.map((item) => {
							const isActive = isNavLinkActive(item.href, currentPath);
							return (
								<li key={item.href}>
									<Link
										href={item.href}
										aria-current={isActive ? 'page' : undefined}
										onClick={() => setOpen(false)}
										className={cn(
											'block rounded-lg px-3 py-2.5 text-right text-sm font-medium transition-colors',
											isActive ? 'bg-primary/12 text-primary' : 'text-foreground hover:bg-muted/80',
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
