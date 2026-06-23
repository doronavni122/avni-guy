import type { ReactNode } from 'react';
import type { MainPageHero as MainPageHeroData } from '@/lib/seo/hero-rules';
import { cn } from '@/lib/utils';

type MainPageHeroProps = {
	hero: MainPageHeroData;
	badges?: ReactNode;
	className?: string;
	/** Optional mono eyebrow override (defaults to hero.eyebrow). */
	eyebrow?: string;
	/** Optional mono section index shown before the eyebrow, e.g. "01". */
	index?: string;
};

/** Standard main-menu hero: mono eyebrow, single oversized H1, intro paragraph. Swiss grid. */
export function MainPageHero({ hero, badges, className, eyebrow, index }: MainPageHeroProps) {
	return (
		<div className={cn('relative flex flex-col gap-6 text-right', className)}>
			<div className="flex items-center justify-end gap-3">
				<p className="swiss-label">{eyebrow ?? hero.eyebrow}</p>
				{index ? <span className="swiss-index text-muted-foreground">{index}</span> : null}
				<span className="h-px w-12 bg-border" aria-hidden="true" />
			</div>
			<h1 className="font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl">
				{hero.h1}
			</h1>
			{badges ? <div className="flex flex-wrap justify-end gap-2">{badges}</div> : null}
			<p className="max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground">{hero.intro}</p>
		</div>
	);
}
