import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type PremiumPanelProps = {
	children: ReactNode;
	className?: string;
	variant?: 'default' | 'accent' | 'hero';
};

const variantClasses: Record<NonNullable<PremiumPanelProps['variant']>, string> = {
	default: 'border-border/60 bg-card/80 ring-1 ring-border/40',
	accent: 'border-primary/20 bg-primary/5 ring-1 ring-primary/15',
	hero: 'border-border/60 bg-card/85 ring-1 ring-primary/10 shadow-md',
};

export function PremiumPanel({ children, className, variant = 'default' }: PremiumPanelProps) {
	return (
		<div
			className={cn(
				'premium-panel relative overflow-hidden rounded-2xl border p-6 shadow-sm sm:p-8 lg:p-10',
				variantClasses[variant],
				className,
			)}
		>
			<div
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_100%_0%,oklch(0.45_0.08_165/0.1),transparent_55%)]"
				aria-hidden="true"
			/>
			<div className="relative">{children}</div>
		</div>
	);
}
