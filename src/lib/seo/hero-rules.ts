import { type SiteKeyword } from '@/consts';

/** U+2014 em dash is banned in all site copy and content (use `-`, `:`, or commas instead). */
export const BANNED_EM_DASH = '\u2014';

export type MainPageHero = {
	path: string;
	eyebrow: string;
	h1: string;
	/** Optional line under H1 for brand/profession without competing with entity hub H1. */
	subhead?: string;
	intro: string;
	keyword: SiteKeyword;
};
