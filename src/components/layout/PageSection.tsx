import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type PageSectionProps = {
	id?: string;
	children: ReactNode;
	className?: string;
	/** Deferred paint for long below-fold sections (home). */
	deferred?: boolean;
};

export function PageSection({ id, children, className, deferred }: PageSectionProps) {
	return (
		<section
			id={id}
			className={cn(
				'section-gap flex flex-col gap-6 text-right sm:gap-8',
				deferred && 'home-deferred-section',
				id && 'home-anchor-target',
				className,
			)}
		>
			{children}
		</section>
	);
}
