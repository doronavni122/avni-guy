import Link from 'next/link';
import { FOOTER_NAV_LINKS } from '@/lib/nav/site-nav';
import { SITE_CONTACT_EMAIL } from '@/consts';

export function Footer() {
	const today = new Date();
	return (
		<footer className="mt-auto border-t-2 border-foreground bg-background">
			<div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-10">
				{/* Masthead wordmark */}
				<div className="flex flex-col gap-6 py-12 lg:flex-row lg:items-end lg:justify-between lg:py-16">
					<div className="max-w-xl">
						<p className="kicker">משרד עורך דין · עברית</p>
						<p className="mt-3 font-serif text-5xl font-black leading-none tracking-tight text-foreground sm:text-6xl">
							גיא אבני
						</p>
						<p className="mt-5 max-w-md text-pretty leading-relaxed text-muted-foreground">
							תוכן מקצועי בעברית, שירותים ומאמרים שנועדו לייצר בהירות וביטחון בקבלת החלטות.
						</p>
					</div>
					<div className="flex flex-col gap-3">
						<Link
							href="/contact/"
							className="no-rule inline-flex items-center justify-center border-b-2 border-primary pb-1 font-serif text-2xl font-bold text-foreground no-underline transition-colors hover:text-primary"
						>
							תיאום פגישה →
						</Link>
					</div>
				</div>

				{/* Index + contact columns */}
				<div className="grid gap-8 border-t border-border py-10 sm:grid-cols-2 lg:grid-cols-4">
					<nav aria-label="ניווט תחתון" className="sm:col-span-2 lg:col-span-2">
						<p className="kicker mb-4">מדור · ניווט</p>
						<ul className="columns-2 gap-8">
							{FOOTER_NAV_LINKS.map((link) => (
								<li key={link.href} className="mb-2.5 break-inside-avoid">
									<Link
										className="font-serif text-lg text-foreground no-underline transition-colors hover:text-primary"
										href={link.href}
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					<div>
						<p className="kicker mb-4">קשר</p>
						<a
							className="no-rule block font-serif text-lg text-foreground no-underline transition-colors hover:text-primary"
							href={`mailto:${SITE_CONTACT_EMAIL}`}
						>
							{SITE_CONTACT_EMAIL}
						</a>
					</div>

					<div>
						<p className="kicker mb-4">רשתות</p>
						<a
							className="no-rule block font-serif text-lg text-foreground no-underline transition-colors hover:text-primary"
							href="https://x.com/AvniGuy11492"
							target="_blank"
							rel="noopener noreferrer"
						>
							X / Twitter
						</a>
					</div>
				</div>

				{/* Colophon */}
				<div className="flex flex-col gap-2 border-t border-border py-6 sm:flex-row sm:items-center sm:justify-between">
					<p className="kicker">© {today.getFullYear()} גיא אבני · כל הזכויות שמורות</p>
					<p className="kicker">נגישות · קריאה נוחה · מהירות טעינה</p>
				</div>
			</div>
		</footer>
	);
}
