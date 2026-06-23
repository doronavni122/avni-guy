import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { FOOTER_NAV_LINKS } from '@/lib/nav/site-nav';
import { SITE_CONTACT_EMAIL } from '@/consts';
import { cn } from '@/lib/utils';

export function Footer() {
	const today = new Date();
	return (
		<footer className="mt-auto border-t border-border bg-background">
			<div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-10">
				<div className="grid gap-0 border-x border-border md:grid-cols-12">
					<div className="flex flex-col gap-5 border-b border-border p-8 md:col-span-6 md:border-b-0 md:border-s lg:p-12">
						<p className="swiss-label">משרד גיא אבני / Practice</p>
						<p className="font-heading text-3xl font-extrabold tracking-tight text-foreground">גיא אבני, עו״ד</p>
						<p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
							תוכן מקצועי בעברית, שירותים ומאמרים שנועדו לייצר בהירות וביטחון בקבלת החלטות.
						</p>
						<div className="flex flex-wrap items-center gap-2">
							<Link className={cn(buttonVariants({ size: 'lg' }), 'rounded-sm')} href="/contact/">
								יצירת קשר
							</Link>
							<Link
								className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'rounded-sm')}
								href="/blog/"
							>
								מאמרים
							</Link>
						</div>
					</div>

					<nav
						aria-label="ניווט תחתון"
						className="flex flex-col gap-4 border-b border-border p-8 md:col-span-3 md:border-b-0 md:border-s lg:p-12"
					>
						<p className="swiss-label">ניווט / Index</p>
						<ul className="flex flex-col gap-2.5">
							{FOOTER_NAV_LINKS.map((link, index) => (
								<li key={link.href} className="flex items-baseline gap-2">
									<span className="swiss-index text-[0.6rem] text-muted-foreground" aria-hidden="true">
										{String(index + 1).padStart(2, '0')}
									</span>
									<Link
										className="text-sm font-medium text-foreground transition-colors hover:text-primary"
										href={link.href}
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					<div className="flex flex-col gap-4 p-8 md:col-span-3 md:border-s md:border-border lg:p-12">
						<p className="swiss-label">קשר / Contact</p>
						<a
							className="text-sm font-medium text-foreground transition-colors hover:text-primary"
							href={`mailto:${SITE_CONTACT_EMAIL}`}
						>
							{SITE_CONTACT_EMAIL}
						</a>
						<a
							className="text-sm font-medium text-foreground transition-colors hover:text-primary"
							href="https://x.com/AvniGuy11492"
							target="_blank"
							rel="noopener noreferrer"
						>
							X / Twitter
						</a>
					</div>
				</div>

				<div className="flex flex-col gap-2 border-x border-t border-border px-8 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-12">
					<p>&copy; {today.getFullYear()} גיא אבני. כל הזכויות שמורות.</p>
					<p className="swiss-label normal-case">קריאה נוחה / נגישות / מהירות טעינה</p>
				</div>
			</div>
		</footer>
	);
}
