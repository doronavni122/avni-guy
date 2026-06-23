import Image from 'next/image';
import Link from 'next/link';
import { MobileNav } from '@/components/react/MobileNav';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { isNavLinkActive } from '@/lib/nav/is-nav-active';
import { SITE_NAV_LINKS } from '@/lib/nav/site-nav';
import { cn } from '@/lib/utils';

type HeaderProps = {
	currentPath: string;
};

export function Header({ currentPath }: HeaderProps) {
	return (
		<header className="glass-header sticky top-0 z-50 border-b border-border">
			<div className="mx-auto flex max-w-screen-xl items-stretch justify-between gap-4 px-4 sm:px-6 lg:px-10">
				<Link
					className="group flex min-w-0 items-center gap-3 py-3.5 text-foreground no-underline"
					href="/"
				>
					<figure className="m-0 contents">
						<Image
							src="/images/branding/guy-avni-avni-guy-law-firm-lawyer-brand-logo.svg"
							alt="Guy Avni Avni Guy law firm lawyer brand logo 1 - לוגו גיא אבני"
							title="Guy Avni Avni Guy law firm lawyer brand logo 1"
							width={40}
							height={40}
							priority
							className="size-10 shrink-0 rounded-sm border border-border"
						/>
						<figcaption className="sr-only">
							Description 1: guy-avni avni-guy law-firm lawyer brand logo for site header.
						</figcaption>
					</figure>
					<span className="flex min-w-0 flex-col leading-none">
						<span className="font-heading text-base font-extrabold tracking-tight">גיא אבני</span>
						<span className="swiss-label mt-1 normal-case">עו״ד / Avni Guy</span>
					</span>
				</Link>

				<nav className="hidden md:flex" aria-label="ניווט ראשי">
					<NavigationMenu className="h-full max-w-none">
						<NavigationMenuList className="h-full items-stretch justify-end gap-0">
							{SITE_NAV_LINKS.map((item, index) => {
								const isActive = isNavLinkActive(item.href, currentPath);
								return (
									<NavigationMenuItem key={item.href} className="flex items-stretch">
										<NavigationMenuLink
											render={<Link href={item.href} aria-current={isActive ? 'page' : undefined} />}
											className={cn(
												'group/navlink flex items-center gap-1.5 border-s border-border px-4 text-sm font-medium transition-colors first:border-s-0',
												isActive
													? 'bg-foreground text-background'
													: 'text-foreground hover:bg-muted',
											)}
										>
											<span
												className={cn(
													'swiss-index text-[0.6rem]',
													isActive ? 'text-background/70' : 'text-muted-foreground',
												)}
												aria-hidden="true"
											>
												{String(index + 1).padStart(2, '0')}
											</span>
											{item.label}
										</NavigationMenuLink>
									</NavigationMenuItem>
								);
							})}
						</NavigationMenuList>
					</NavigationMenu>
				</nav>

				<div className="flex shrink-0 items-center gap-2 py-2.5">
					<ThemeToggle />
					<div className="md:hidden">
						<MobileNav currentPath={currentPath} />
					</div>
				</div>
			</div>
		</header>
	);
}
