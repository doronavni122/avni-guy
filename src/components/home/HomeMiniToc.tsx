import type { TocItem } from '@/lib/home/loadHomeData';

type HomeMiniTocProps = {
	items: TocItem[];
};

/** Editorial "In this issue" contents index: serif entries with folio numerals and leader rules. */
export function HomeMiniToc({ items }: HomeMiniTocProps) {
	return (
		<nav aria-label="תוכן עניינים לדף הבית" className="border-y-2 border-foreground py-6 text-right">
			<p className="kicker mb-5">במהדורה הזו · תוכן עניינים</p>
			<ol className="grid gap-x-12 gap-y-1 sm:grid-cols-2">
				{items.map((item, index) => (
					<li key={item.id}>
						<a
							href={`#${item.id}`}
							className="no-rule group flex items-baseline gap-3 py-1.5 no-underline"
						>
							<span className="folio text-sm" aria-hidden="true">
								{String(index + 1).padStart(2, '0')}
							</span>
							<span className="font-serif text-lg text-foreground transition-colors group-hover:text-primary">
								{item.label}
							</span>
							<span className="mx-1 h-px flex-1 translate-y-[-0.2em] bg-border" aria-hidden="true" />
						</a>
					</li>
				))}
			</ol>
		</nav>
	);
}
