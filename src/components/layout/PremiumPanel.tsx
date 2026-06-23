import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type PremiumPanelProps = {
	children: ReactNode;
	className?: string;
	variant?: 'default' | 'accent' | 'hero';
};

/* Editorial paper blocks. Hierarchy via rules and a terracotta margin, not elevation. */
const variantClasses: Record<NonNullable<PremiumPanelProps['variant']>, string> = {
	default: 'border-y border-border bg-transparent',
	accent: 'border-e-2 border-primary bg-primary/[0.06] ps-6',
	hero: 'border-t-2 border-foreground bg-transparent',
};

export function PremiumPanel({ children, className, variant = 'default' }: PremiumPanelProps) {
	return (
		<div
			className={cn(
				'premium-panel relative py-8 sm:py-10',
				variant === 'accent' && 'py-6',
				variantClasses[variant],
				className,
			)}
		>
			{children}
		</div>
	);
}
