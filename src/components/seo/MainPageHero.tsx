import type { ReactNode } from 'react';
import type { MainPageHero as MainPageHeroData } from '@/lib/seo/hero-rules';
import { cn } from '@/lib/utils';

type MainPageHeroProps = {
	hero: MainPageHeroData;
	badges?: ReactNode;
	className?: string;
};

/** Renders the standard main-menu hero block: eyebrow, single H1, intro paragraph. */
export function MainPageHero({ hero, badges, className }: MainPageHeroProps) {
	return (
		<div className={cn('relative flex flex-col gap-4 text-right', className)}>
			<div
				className="pointer-events-none absolute -inset-x-4 -top-4 h-32 bg-[radial-gradient(600px_circle_at_100%_0%,oklch(0.45_0.08_165/0.14),transparent_70%)] sm:-inset-x-6"
				aria-hidden="true"
			/>
			<div className="relative flex flex-col gap-4">
				<p className="text-sm font-semibold tracking-wide text-primary">{hero.eyebrow}</p>
				<h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
					{hero.h1}
				</h1>
				{badges ? <div className="flex flex-wrap justify-end gap-2">{badges}</div> : null}
				<p className="max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground">{hero.intro}</p>
			</div>
		</div>
	);
}
