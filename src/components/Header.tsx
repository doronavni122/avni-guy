import Image from 'next/image';
import Link from 'next/link';
import { MobileNav } from '@/components/react/MobileNav';
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { SITE_TITLE } from '@/consts';
import { isNavLinkActive } from '@/lib/nav/is-nav-active';
import { SITE_NAV_LINKS } from '@/lib/nav/site-nav';
import { cn } from '@/lib/utils';

type HeaderProps = {
	currentPath: string;
};

export function Header({ currentPath }: HeaderProps) {
	return (
		<header className="glass-header sticky top-0 z-50 border-b border-border/50 shadow-sm">
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
							className="size-11 shrink-0 rounded-xl ring-1 ring-border/60 shadow-sm transition-shadow group-hover:shadow-md"
						/>
						<figcaption className="sr-only">
							Description 1: guy-avni avni-guy law-firm lawyer brand logo for site header.
						</figcaption>
					</figure>
					<span className="hidden min-w-0 truncate font-heading text-sm font-semibold tracking-tight sm:inline sm:text-base">
						{SITE_TITLE}
					</span>
				</Link>
				<nav className="hidden md:flex" aria-label="ניווט ראשי">
					<NavigationMenu className="max-w-none">
						<NavigationMenuList className="justify-end gap-0.5">
							{SITE_NAV_LINKS.map((item) => {
								const isActive = isNavLinkActive(item.href, currentPath);
								return (
									<NavigationMenuItem key={item.href}>
										<NavigationMenuLink
											render={<Link href={item.href} aria-current={isActive ? 'page' : undefined} />}
											className={cn(
												'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
												isActive
													? 'bg-primary/12 text-primary shadow-sm'
													: 'text-muted-foreground hover:bg-muted/80 hover:text-foreground',
											)}
										>
											{item.label}
										</NavigationMenuLink>
									</NavigationMenuItem>
								);
							})}
						</NavigationMenuList>
					</NavigationMenu>
				</nav>
				<div className="flex shrink-0 items-center gap-2 md:hidden">
					<MobileNav currentPath={currentPath} />
				</div>
			</div>
		</header>
	);
}
