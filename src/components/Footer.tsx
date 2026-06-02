import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Footer() {
	const today = new Date();
	return (
		<footer className="mt-auto border-t border-border/60 bg-card/40">
			<div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6">
				<div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
					<div className="flex max-w-md flex-col gap-3 text-right">
						<p className="font-heading text-lg font-semibold tracking-tight text-foreground">גיא אבני</p>
						<p className="text-sm leading-relaxed text-muted-foreground">
							תוכן מקצועי בעברית, שירותים ומאמרים שנועדו לייצר בהירות וביטחון בקבלת החלטות.
						</p>
					</div>
					<div className="flex flex-col gap-3 text-right md:items-end">
						<p className="text-sm text-muted-foreground">&copy; {today.getFullYear()} גיא אבני. כל הזכויות שמורות.</p>
						<div className="flex flex-wrap items-center justify-end gap-2">
							<Link className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }))} href="/contact/">
								יצירת קשר
							</Link>
							<Link className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))} href="/blog/">
								מאמרים
							</Link>
							<a
								className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
								href="https://x.com/AvniGuy11492"
								target="_blank"
								rel="noopener noreferrer"
							>
								X
							</a>
						</div>
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
