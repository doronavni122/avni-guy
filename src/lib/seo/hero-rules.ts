import { SITE_KEYWORDS, type SiteKeyword } from '@/consts';

/** Minimum/maximum word count for main-menu hero intro paragraphs. */
export const MAIN_PAGE_INTRO_MIN_WORDS = 130;
export const MAIN_PAGE_INTRO_MAX_WORDS = 200;

/** Banned generic phrases in main-page H1 or hero intro (nav-label / index boilerplate). */
export const GENERIC_HERO_BLOCKLIST = [
	'רשימת מאמרים',
	'בחירה מהירה לפי נושא',
	'קטגוריות תוכן',
	'תגיות תוכן',
] as const;

export type MainPageHero = {
	path: string;
	eyebrow: string;
	h1: string;
	intro: string;
	keyword: SiteKeyword;
};

export function countWordsHe(text: string): number {
	const normalized = text
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/<[^>]+>/g, ' ')
		.replace(/[^\p{L}\p{N}\s'-]/gu, ' ')
		.trim();
	if (!normalized) return 0;
	return normalized.split(/\s+/).filter(Boolean).length;
}

export function containsSiteKeyword(text: string, keywords: readonly string[] = SITE_KEYWORDS): boolean {
	return keywords.some((kw) => kw.length > 0 && text.includes(kw));
}

export function isGenericHeroText(text: string): boolean {
	const trimmed = text.trim();
	if (!trimmed) return true;
	for (const phrase of GENERIC_HERO_BLOCKLIST) {
		if (trimmed.includes(phrase)) return true;
	}
	const navOnlyH1 =
		/^(קטגוריות|תגיות|מאמרים|דף הבית|שירותים|אודות|יצירת קשר)(\s|$)/u.test(trimmed) &&
		trimmed.length < 40;
	if (navOnlyH1) return true;
	return false;
}

export type HeroValidationResult = { ok: true } | { ok: false; errors: string[] };

export function validateMainPageHero(hero: MainPageHero): HeroValidationResult {
	const errors: string[] = [];
	const path = hero.path;

	if (!hero.h1.trim()) {
		errors.push(`${path}: h1 is empty`);
	}
	if (!hero.intro.trim()) {
		errors.push(`${path}: intro is empty`);
	}
	if (!SITE_KEYWORDS.includes(hero.keyword)) {
		errors.push(`${path}: keyword "${hero.keyword}" is not in SITE_KEYWORDS`);
	}

	if (isGenericHeroText(hero.h1)) {
		errors.push(`${path}: h1 uses generic or nav-label copy`);
	}
	if (isGenericHeroText(hero.intro)) {
		errors.push(`${path}: intro uses generic or nav-label copy`);
	}

	const wordCount = countWordsHe(hero.intro);
	if (wordCount < MAIN_PAGE_INTRO_MIN_WORDS || wordCount > MAIN_PAGE_INTRO_MAX_WORDS) {
		errors.push(
			`${path}: intro word count ${wordCount} (required ${MAIN_PAGE_INTRO_MIN_WORDS}-${MAIN_PAGE_INTRO_MAX_WORDS})`,
		);
	}

	const introHasKeyword = containsSiteKeyword(hero.intro);
	const h1HasKeyword = containsSiteKeyword(hero.h1);
	if (!introHasKeyword && !h1HasKeyword) {
		errors.push(`${path}: intro and h1 must include a SITE_KEYWORDS phrase naturally`);
	}

	if (!introHasKeyword) {
		errors.push(`${path}: intro must include at least one SITE_KEYWORDS phrase`);
	}

	if (errors.length > 0) {
		console.error('[hero-rules] validateMainPageHero failed', { path, errors });
		return { ok: false, errors };
	}
	return { ok: true };
}

export function assertMainPageHero(hero: MainPageHero): void {
	const result = validateMainPageHero(hero);
	if (!result.ok) {
		throw new Error(`Main page hero invalid for ${hero.path}: ${result.errors.join('; ')}`);
	}
}

export function validateAllMainPageHeroes(heroes: MainPageHero[]): HeroValidationResult {
	const errors: string[] = [];
	for (const hero of heroes) {
		const result = validateMainPageHero(hero);
		if (!result.ok) errors.push(...result.errors);
	}
	if (errors.length > 0) {
		console.error('[hero-rules] validateAllMainPageHeroes failed', { count: errors.length });
		return { ok: false, errors };
	}
	return { ok: true };
}
