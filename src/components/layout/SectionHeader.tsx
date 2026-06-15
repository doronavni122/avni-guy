import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type SectionHeaderProps = {
	id?: string;
	title: string;
	description?: string;
	badges?: ReactNode;
	className?: string;
};

export function SectionHeader({ id, title, description, badges, className }: SectionHeaderProps) {
	return (
		<div className={cn('flex flex-col gap-3 text-right', className)}>
			<div className="flex flex-col gap-2">
				<h2
					id={id}
					className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
				>
					{title}
				</h2>
				{badges ? <div className="flex flex-wrap justify-end gap-2">{badges}</div> : null}
			</div>
			{description ? (
				<p className="max-w-3xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
					{description}
				</p>
			) : null}
		</div>
	);
}
