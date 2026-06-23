import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type SectionHeaderProps = {
	id?: string;
	title: string;
	description?: string;
	badges?: ReactNode;
	/** Optional mono eyebrow shown above the title. */
	eyebrow?: string;
	/** Optional zero-padded index shown in the corner. */
	index?: number;
	className?: string;
};

export function SectionHeader({ id, title, description, badges, eyebrow, index, className }: SectionHeaderProps) {
	return (
		<div className={cn('flex flex-col gap-4 text-right', className)}>
			<div className="flex items-center justify-between gap-4 border-t border-border pt-4">
				{eyebrow ? <p className="swiss-label">{eyebrow}</p> : <span />}
				{typeof index === 'number' ? (
					<span className="swiss-index text-xs text-muted-foreground" aria-hidden="true">
						{String(index).padStart(2, '0')}
					</span>
				) : null}
			</div>
			<h2 id={id} className="font-heading text-2xl font-bold tracking-tight text-foreground text-balance sm:text-3xl">
				{title}
			</h2>
			{badges ? <div className="flex flex-wrap justify-end gap-2">{badges}</div> : null}
			{description ? (
				<p className="max-w-3xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
					{description}
				</p>
			) : null}
		</div>
	);
}
