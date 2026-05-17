import type { TocItem } from '@/lib/home/loadHomeData';

type HomeMiniTocProps = {
	items: TocItem[];
};

export function HomeMiniToc({ items }: HomeMiniTocProps) {
	return (
		<nav
			aria-label="תוכן עניינים לדף הבית"
			className="rounded-2xl border border-border/60 bg-card/70 p-5 text-right shadow-sm sm:p-6"
		>
			<p className="mb-3 text-sm font-semibold text-foreground">תוכן עניינים מהיר</p>
			<div className="mb-4 flex flex-wrap justify-end gap-2">
				<span className="inline-flex items-center rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-semibold text-foreground">
					ניווט לפי נושאים
				</span>
			</div>
			<ul className="grid gap-2 sm:grid-cols-2">
				{items.map((item) => (
					<li key={item.id}>
						<a className="text-sm font-semibold text-primary underline-offset-2 hover:underline" href={`#${item.id}`}>
							{item.label}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}
