'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { isNavLinkActive } from '@/lib/nav/is-nav-active';
import { SITE_CONTACT_EMAIL } from '@/consts';
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
						variant="ghost"
						size="icon-sm"
						className="rounded-sm md:hidden"
						aria-label="פתיחת תפריט ניווט"
					/>
				}
			>
				<MenuIcon />
			</SheetTrigger>
			<SheetContent side="right" dir="rtl" className="w-[min(100%,24rem)] border-s border-border bg-background p-0">
				<SheetTitle className="sr-only">תפריט ניווט ראשי</SheetTitle>
				<div className="border-b border-border px-7 py-6">
					<p className="kicker">תוכן עניינים</p>
					<p className="mt-2 font-serif text-2xl font-extrabold text-foreground">גיא אבני, עו״ד</p>
				</div>
				<nav aria-label="ניווט ראשי" className="px-3 py-2">
					<ul className="flex flex-col">
						{SITE_NAV_LINKS.map((item, index) => {
							const isActive = isNavLinkActive(item.href, currentPath);
							return (
								<li key={item.href}>
									<Link
										href={item.href}
										aria-current={isActive ? 'page' : undefined}
										onClick={() => setOpen(false)}
										className={cn(
											'flex items-baseline justify-between gap-3 rounded-sm px-4 py-3.5 no-underline transition-colors',
											isActive ? 'text-primary' : 'text-foreground hover:bg-muted',
										)}
									>
										<span className="font-serif text-xl font-bold">{item.label}</span>
										<span className="folio text-sm" aria-hidden="true">
											{String(index + 1).padStart(2, '0')}
										</span>
									</Link>
								</li>
							);
						})}
					</ul>
				</nav>
				<div className="mt-auto border-t border-border px-7 py-6">
					<p className="kicker">צרו קשר</p>
					<a
						href={`mailto:${SITE_CONTACT_EMAIL}`}
						className="mt-2 block font-serif text-lg text-foreground no-underline transition-colors hover:text-primary"
					>
						{SITE_CONTACT_EMAIL}
					</a>
				</div>
			</SheetContent>
		</Sheet>
	);
}
