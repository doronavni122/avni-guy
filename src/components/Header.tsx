import Image from 'next/image';
import Link from 'next/link';
import { MobileNav } from '@/components/react/MobileNav';
import { HeaderLink } from '@/components/HeaderLink';
import { SITE_TITLE } from '@/consts';

export function Header() {
	return (
		<header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
			<div className="container mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
				<Link
					className="group flex min-w-0 items-center gap-3 text-foreground no-underline transition-opacity hover:opacity-90"
					href="/"
				>
					<figure className="m-0 contents">
						<Image
							src="/images/branding/guy-avni-avni-guy-law-firm-lawyer-brand-logo.svg"
							alt="Guy Avni Avni Guy law firm lawyer brand logo 1 - לוגו גיא אבני"
							title="Guy Avni Avni Guy law firm lawyer brand logo 1"
							width={44}
							height={44}
							priority
							className="size-11 shrink-0 rounded-xl ring-1 ring-border/60 shadow-sm"
						/>
						<figcaption className="sr-only">
							Description 1: guy-avni avni-guy law-firm lawyer brand logo for site header.
						</figcaption>
					</figure>
					<span className="hidden min-w-0 truncate font-heading text-sm font-semibold tracking-tight sm:inline sm:text-base">
						{SITE_TITLE}
					</span>
				</Link>
				<nav className="hidden flex-wrap items-center justify-end gap-1 md:flex" aria-label="ניווט ראשי">
					<HeaderLink href="/">דף הבית</HeaderLink>
					<HeaderLink href="/about">אודות</HeaderLink>
					<HeaderLink href="/services">שירותים</HeaderLink>
					<HeaderLink href="/blog">מאמרים</HeaderLink>
					<HeaderLink href="/categories">קטגוריות</HeaderLink>
					<HeaderLink href="/tags">תגיות</HeaderLink>
					<HeaderLink href="/contact">יצירת קשר</HeaderLink>
				</nav>
				<div className="flex shrink-0 items-center gap-2 md:hidden">
					<MobileNav />
				</div>
			</div>
		</header>
	);
}
