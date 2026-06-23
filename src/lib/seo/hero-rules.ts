import { type SiteKeyword } from '@/consts';

/** U+2014 em dash is banned in all site copy and content (use `-`, `:`, or commas instead). */
export const BANNED_EM_DASH = '\u2014';

export type MainPageHero = {
	path: string;
	eyebrow: string;
	h1: string;
	intro: string;
	keyword: SiteKeyword;
};
