import type { MainPageHero as MainPageHeroData } from '@/lib/seo/hero-rules';

type MainPageHeroProps = {
	hero: MainPageHeroData;
};

/** Renders the standard main-menu hero block: eyebrow, single H1, intro paragraph. */
export function MainPageHero({ hero }: MainPageHeroProps) {
	return (
		<div className="flex flex-col gap-4 text-right">
			<p className="text-sm font-medium text-primary">{hero.eyebrow}</p>
			<h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
				{hero.h1}
			</h1>
			<p className="max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground">{hero.intro}</p>
		</div>
	);
}
