import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type SectionHeaderProps = {
	id?: string;
	title: string;
	description?: string;
	badges?: ReactNode;
	/** Optional kicker shown above the title. */
	eyebrow?: string;
	/** Optional folio number shown in the corner. */
	index?: number;
	className?: string;
};

/** Editorial section opener: an ink top rule, a kicker + folio row, then a serif headline. */
export function SectionHeader({ id, title, description, badges, eyebrow, index, className }: SectionHeaderProps) {
	return (
		<div className={cn('flex flex-col gap-4 text-right', className)}>
			<div className="flex items-center justify-between gap-4 border-t-2 border-foreground pt-3">
				<p className="kicker">{eyebrow ?? 'מדור'}</p>
				{typeof index === 'number' ? (
					<span className="folio text-base" aria-hidden="true">
						{String(index).padStart(2, '0')}
					</span>
				) : null}
			</div>
			<h2 id={id} className="font-serif text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl">
				{title}
			</h2>
			{badges ? <div className="flex flex-wrap gap-2">{badges}</div> : null}
			{description ? (
				<p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">{description}</p>
			) : null}
		</div>
	);
}
