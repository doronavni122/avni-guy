import type { TocItem } from '@/lib/home/loadHomeData';

type HomeMiniTocProps = {
	items: TocItem[];
};

export function HomeMiniToc({ items }: HomeMiniTocProps) {
	return (
		<nav aria-label="תוכן עניינים לדף הבית" className="rounded-sm border border-border bg-card text-right">
			<div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3.5 sm:px-6">
				<p className="text-sm font-semibold text-foreground">תוכן עניינים מהיר</p>
				<span className="swiss-label">ניווט / Index</span>
			</div>
			<ul className="grid sm:grid-cols-2">
				{items.map((item, index) => (
					<li key={item.id} className="border-b border-border sm:[&:nth-last-child(-n+1)]:border-b-0 sm:odd:border-s">
						<a
							className="flex items-baseline gap-3 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary sm:px-6"
							href={`#${item.id}`}
						>
							<span className="swiss-index text-xs text-muted-foreground" aria-hidden="true">
								{String(index + 1).padStart(2, '0')}
							</span>
							{item.label}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}
