'use client';

import Link from 'next/link';
import { MenuIcon } from 'lucide-react';

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

const NAV_LINKS: { href: string; label: string }[] = [
	{ href: "/", label: "דף הבית" },
	{ href: "/about", label: "אודות" },
	{ href: "/services", label: "שירותים" },
	{ href: "/blog", label: "מאמרים" },
	{ href: "/categories", label: "קטגוריות" },
	{ href: "/tags", label: "תגיות" },
	{ href: "/contact", label: "יצירת קשר" },
];

export function MobileNav() {
	return (
		<Sheet>
			<SheetTrigger
				className={cn(
					buttonVariants({ variant: "outline", size: "icon" }),
					"md:hidden",
					"border-border/80 bg-background/80 shadow-sm backdrop-blur-sm",
				)}
				aria-label="פתיחת תפריט ניווט"
			>
				<MenuIcon data-icon="inline-start" />
			</SheetTrigger>
			<SheetContent side="right" className="flex w-full max-w-sm flex-col gap-0 border-border/80 p-0">
				<SheetHeader className="border-b border-border/60 px-4 py-4 text-right">
					<SheetTitle className="text-base">ניווט</SheetTitle>
				</SheetHeader>
				<nav className="flex flex-col gap-1 px-2 py-4" aria-label="ניווט ראשי">
					{NAV_LINKS.map((item) => (
						<SheetClose
							key={item.href}
							className="rounded-lg px-4 py-3 text-right text-sm font-medium text-foreground transition-colors hover:bg-muted"
							render={<Link href={item.href} />}
						>
							{item.label}
						</SheetClose>
					))}
				</nav>
			</SheetContent>
		</Sheet>
	);
}
