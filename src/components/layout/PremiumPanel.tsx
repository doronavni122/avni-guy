import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type PremiumPanelProps = {
	children: ReactNode;
	className?: string;
	variant?: 'default' | 'accent' | 'hero';
};

/* Flat, bordered Swiss blocks. No elevation or gradients; hierarchy via borders + fill. */
const variantClasses: Record<NonNullable<PremiumPanelProps['variant']>, string> = {
	default: 'border-border bg-card',
	accent: 'border-primary bg-primary/5',
	hero: 'border-border bg-card',
};

export function PremiumPanel({ children, className, variant = 'default' }: PremiumPanelProps) {
	return (
		<div
			className={cn(
				'premium-panel relative overflow-hidden rounded-sm border p-6 sm:p-8 lg:p-10',
				variantClasses[variant],
				className,
			)}
		>
			{children}
		</div>
	);
}
