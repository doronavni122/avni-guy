import type { ReactNode } from 'react';
import type { MainPageHero as MainPageHeroData } from '@/lib/seo/hero-rules';
import { cn } from '@/lib/utils';

type MainPageHeroProps = {
	hero: MainPageHeroData;
	badges?: ReactNode;
	className?: string;
	/** Optional kicker override (defaults to hero.eyebrow). */
	eyebrow?: string;
	/** Optional folio marker shown beside the kicker, e.g. "01". */
	index?: string;
};

/**
 * Editorial masthead hero: a kicker dateline over an oversized serif headline,
 * with a lead paragraph set in a comfortable measure and a drop cap.
 */
export function MainPageHero({ hero, badges, className, eyebrow, index }: MainPageHeroProps) {
	return (
		<header className={cn('flex flex-col gap-7 text-right', className)}>
			<div className="flex items-center gap-3 border-b border-border pb-4">
				{index ? (
					<span className="folio text-lg" aria-hidden="true">
						{index}
					</span>
				) : null}
				<p className="kicker">{eyebrow ?? hero.eyebrow}</p>
			</div>
			<h1 className="font-serif text-5xl font-black leading-[1.04] tracking-tight text-foreground text-balance sm:text-6xl lg:text-7xl">
				{hero.h1}
			</h1>
			{badges ? <div className="flex flex-wrap gap-2">{badges}</div> : null}
			<p className="drop-cap max-w-2xl text-pretty text-xl leading-relaxed text-muted-foreground">
				{hero.intro}
			</p>
		</header>
	);
}
