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
						className="rounded-sm md:hidden"
						aria-label="פתיחת תפריט ניווט"
					/>
				}
			>
				<MenuIcon />
			</SheetTrigger>
			<SheetContent side="right" dir="rtl" className="w-[min(100%,22rem)] border-s border-border bg-background p-0">
				<SheetTitle className="sr-only">תפריט ניווט ראשי</SheetTitle>
				<div className="swiss-label border-b border-border px-6 py-5 normal-case">תפריט / Menu</div>
				<nav aria-label="ניווט ראשי">
					<ul className="flex flex-col">
						{SITE_NAV_LINKS.map((item, index) => {
							const isActive = isNavLinkActive(item.href, currentPath);
							return (
								<li key={item.href} className="border-b border-border">
									<Link
										href={item.href}
										aria-current={isActive ? 'page' : undefined}
										onClick={() => setOpen(false)}
										className={cn(
											'flex items-center gap-3 px-6 py-4 text-right text-base font-semibold transition-colors',
											isActive ? 'bg-foreground text-background' : 'text-foreground hover:bg-muted',
										)}
									>
										<span
											className={cn(
												'swiss-index text-xs',
												isActive ? 'text-background/70' : 'text-muted-foreground',
											)}
											aria-hidden="true"
										>
											{String(index + 1).padStart(2, '0')}
										</span>
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
