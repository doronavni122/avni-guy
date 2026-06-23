import type { MainPageHero } from '@/lib/seo/hero-rules';
import { MAIN_PAGE_HEROES as heroesFromMjs } from './main-page-heroes.mjs';

/**
 * SSOT for main-menu page heroes (H1 + intro). Data in main-page-heroes.mjs for shared import.
 */
export const MAIN_PAGE_HEROES = heroesFromMjs as Record<string, MainPageHero>;

export const MAIN_PAGE_PATHS = Object.keys(MAIN_PAGE_HEROES) as (keyof typeof MAIN_PAGE_HEROES)[];

export function getMainPageHero(path: string): MainPageHero | undefined {
	return MAIN_PAGE_HEROES[path];
}
