import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { buttonVariants } from '@/components/ui/button';
import { FOOTER_NAV_LINKS } from '@/lib/nav/site-nav';
import { cn } from '@/lib/utils';

export function Footer() {
	const today = new Date();
	return (
		<footer className="mt-auto border-t border-border/60 bg-card/50">
			<div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-14">
				<div className="grid gap-10 md:grid-cols-[1.2fr_1fr] lg:grid-cols-[1.4fr_1fr_1fr]">
					<div className="flex flex-col gap-4 text-right">
						<p className="font-heading text-xl font-semibold tracking-tight text-foreground">גיא אבני</p>
						<p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
							תוכן מקצועי בעברית, שירותים ומאמרים שנועדו לייצר בהירות וביטחון בקבלת החלטות.
						</p>
						<div className="flex flex-wrap items-center justify-end gap-2">
							<Link className={cn(buttonVariants({ size: 'sm' }))} href="/contact/">
								יצירת קשר
							</Link>
							<Link className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))} href="/blog/">
								מאמרים
							</Link>
						</div>
					</div>
					<div className="flex flex-col gap-3 text-right">
						<p className="text-sm font-semibold text-foreground">ניווט</p>
						<ul className="flex flex-col gap-2">
							{FOOTER_NAV_LINKS.map((link) => (
								<li key={link.href}>
									<Link
										className="text-sm text-muted-foreground transition-colors hover:text-primary"
										href={link.href}
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
					<div className="flex flex-col gap-3 text-right md:col-span-2 lg:col-span-1">
						<p className="text-sm font-semibold text-foreground">עקבו</p>
						<a
							className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-fit')}
							href="https://x.com/AvniGuy11492"
							target="_blank"
							rel="noopener noreferrer"
						>
							X / Twitter
						</a>
						<p className="text-xs text-muted-foreground">&copy; {today.getFullYear()} גיא אבני. כל הזכויות שמורות.</p>
					</div>
				</div>
				<Separator className="my-8 bg-border/60" />
				<p className="text-center text-xs text-muted-foreground">
					האתר מותאם לקריאה נוחה, נגישות בסיסית ומהירות טעינה גבוהה.
				</p>
			</div>
		</footer>
	);
}
