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
import { SITE_CONTACT_EMAIL } from '@/consts';
import { SITE_NAV_LINKS } from '@/lib/nav/site-nav';
import { cn } from '@/lib/utils';

type HeaderProps = {
	currentPath: string;
};

export function Header({ currentPath }: HeaderProps) {
	return (
		<header className="glass-header sticky top-0 z-50 border-b border-border">
			{/* Dateline strip */}
			<div className="hidden border-b border-border/70 sm:block">
				<div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-1.5 sm:px-6 lg:px-10">
					<span className="kicker">מהדורה דיגיטלית · ייעוץ וליווי משפטי</span>
					<a
						href={`mailto:${SITE_CONTACT_EMAIL}`}
						className="kicker no-rule transition-colors hover:text-primary"
					>
						{SITE_CONTACT_EMAIL}
					</a>
				</div>
			</div>

			{/* Masthead */}
			<div className="mx-auto flex max-w-screen-xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
				<div className="flex w-24 items-center sm:w-32">
					<ThemeToggle />
					<div className="md:hidden">
						<MobileNav currentPath={currentPath} />
					</div>
				</div>

				<Link href="/" className="group flex min-w-0 flex-col items-center text-center text-foreground no-underline">
					<span className="flex items-center gap-2.5">
						<Image
							src="/images/branding/guy-avni-avni-guy-law-firm-lawyer-brand-logo.svg"
							alt="Guy Avni Avni Guy law firm lawyer brand logo 1 - לוגו גיא אבני"
							title="Guy Avni Avni Guy law firm lawyer brand logo 1"
							width={28}
							height={28}
							priority
							className="size-7 shrink-0"
						/>
						<span className="font-serif text-2xl font-extrabold leading-none tracking-tight sm:text-3xl">
							גיא אבני
						</span>
					</span>
					<span className="kicker mt-1.5">עורך דין · The Avni Review</span>
				</Link>

				<div className="flex w-24 justify-end sm:w-32">
					<Link
						href="/contact/"
						className="hidden items-center border-b-2 border-primary pb-0.5 font-serif text-base font-bold text-foreground no-underline transition-colors hover:text-primary lg:inline-flex"
					>
						תיאום פגישה
					</Link>
				</div>
			</div>

			{/* Nav rule bar */}
			<nav className="hidden border-t border-border md:block" aria-label="ניווט ראשי">
				<NavigationMenu className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-10">
					<NavigationMenuList className="flex items-stretch justify-center gap-0">
						{SITE_NAV_LINKS.map((item) => {
							const isActive = isNavLinkActive(item.href, currentPath);
							return (
								<NavigationMenuItem key={item.href}>
									<NavigationMenuLink
										render={<Link href={item.href} aria-current={isActive ? 'page' : undefined} />}
										className={cn(
											'group/navlink relative px-5 py-2.5 font-serif text-[0.95rem] no-underline transition-colors',
											isActive ? 'text-primary' : 'text-foreground hover:text-primary',
										)}
									>
										{item.label}
										<span
											className={cn(
												'absolute inset-x-3 bottom-0 h-px bg-primary transition-transform duration-200',
												isActive ? 'scale-x-100' : 'scale-x-0 group-hover/navlink:scale-x-100',
											)}
											aria-hidden="true"
										/>
									</NavigationMenuLink>
								</NavigationMenuItem>
							);
						})}
					</NavigationMenuList>
				</NavigationMenu>
			</nav>
		</header>
	);
}
