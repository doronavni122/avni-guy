/** Shared hero validation for seo-guardrails (mirrors src/lib/seo/hero-rules.ts). */

export const MAIN_PAGE_INTRO_MIN_WORDS = 130;
export const MAIN_PAGE_INTRO_MAX_WORDS = 200;

export const GENERIC_HERO_BLOCKLIST = [
	'רשימת מאמרים',
	'בחירה מהירה לפי נושא',
	'קטגוריות תוכן',
	'תגיות תוכן',
];

export const SITE_KEYWORDS = [
	'גיא אבני',
	'גיא אבני עו״ד',
	'גיא אבני עורך דין',
	'גיא אבני משרד עורכי דין',
	'אבני גיא',
	'אבני גיא עו״ד',
];

export function countWordsHe(text) {
	const normalized = text
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/<[^>]+>/g, ' ')
		.replace(/[^\p{L}\p{N}\s'-]/gu, ' ')
		.trim();
	if (!normalized) return 0;
	return normalized.split(/\s+/).filter(Boolean).length;
}

export function containsSiteKeyword(text, keywords = SITE_KEYWORDS) {
	return keywords.some((kw) => kw.length > 0 && text.includes(kw));
}

export function isGenericHeroText(text) {
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

export function validateMainPageHero(hero) {
	const errors = [];
	const path = hero.path;

	if (!hero.h1?.trim()) errors.push(`${path}: h1 is empty`);
	if (!hero.intro?.trim()) errors.push(`${path}: intro is empty`);
	if (!SITE_KEYWORDS.includes(hero.keyword)) {
		errors.push(`${path}: keyword "${hero.keyword}" is not in SITE_KEYWORDS`);
	}
	if (isGenericHeroText(hero.h1)) errors.push(`${path}: h1 uses generic or nav-label copy`);
	if (isGenericHeroText(hero.intro)) errors.push(`${path}: intro uses generic or nav-label copy`);

	const wordCount = countWordsHe(hero.intro);
	if (wordCount < MAIN_PAGE_INTRO_MIN_WORDS || wordCount > MAIN_PAGE_INTRO_MAX_WORDS) {
		errors.push(
			`${path}: intro word count ${wordCount} (required ${MAIN_PAGE_INTRO_MIN_WORDS}-${MAIN_PAGE_INTRO_MAX_WORDS})`,
		);
	}
	if (!containsSiteKeyword(hero.intro)) {
		errors.push(`${path}: intro must include at least one SITE_KEYWORDS phrase`);
	}

	if (errors.length > 0) {
		console.error('[seo-hero-rules] validateMainPageHero failed', { path, errors });
		return { ok: false, errors };
	}
	return { ok: true };
}

export function validateAllMainPageHeroes(heroes) {
	const errors = [];
	for (const hero of heroes) {
		const result = validateMainPageHero(hero);
		if (!result.ok) errors.push(...result.errors);
	}
	if (errors.length > 0) {
		console.error('[seo-hero-rules] validateAllMainPageHeroes failed', { count: errors.length });
		return { ok: false, errors };
	}
	return { ok: true };
}
