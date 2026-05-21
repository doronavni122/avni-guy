import type { MainPageHero } from '@/lib/seo/hero-rules';
import { BANNED_EM_DASH } from '@/lib/seo/hero-rules';

/** Phrases that describe writing tone instead of delivering content ("show don't tell"). */
export const STYLE_META_BLOCKLIST = [
	'מגזינית',
	'בגובה העיניים',
	'שפה ישירה',
	'שפה פשוטה',
	'לא סיסמאות',
	'סיסמאות ריקות',
	'תמונה שיווקית',
	'תמונה אמיתית',
	'בלי ז׳רגון',
	'בלי זרגון',
	'בלי להתנשאות',
	'בלי להעמיס מונחים',
	'בלי ערפל',
	'לא כמו תהליך בירוקרטי',
	'לא כמו טופס',
	'לא כמו מבוך',
	'קראו בקצב',
	'שפה אחידה',
	'עברית רהוטה',
	'מידע כללי',
] as const;

/** Repeated or tutorial/meta navigation patterns in hero intro. */
export const META_NAV_PATTERNS: readonly RegExp[] = [
	/המטרה היא אותה מטרה/u,
	/בדף הזה ת(?:מצאו|ראו)/u,
	/אם אתם כאן בפעם הראשונה/u,
	/לפני ש(?:כותבים|מתקשרים).*כדאי/u,
	/זכרו:\s*ה(?:מידע|תוכן)/u,
	/אפשר להתחיל מ/u,
	/המשיכו ל(?:מסלול|שירותים)/u,
	/זה המקום להתחיל/u,
	/מתאים גם ל.*וגם ל/u,
];

export type StyleValidationResult = { ok: true } | { ok: false; errors: string[] };

function collectStyleViolations(text: string, field: 'h1' | 'intro'): string[] {
	const errors: string[] = [];
	const trimmed = text.trim();
	if (!trimmed) return errors;

	if (text.includes(BANNED_EM_DASH)) {
		errors.push(`${field} contains banned em dash (U+2014)`);
	}

	for (const phrase of STYLE_META_BLOCKLIST) {
		if (trimmed.includes(phrase)) {
			errors.push(`${field} uses style-meta phrase "${phrase}"`);
		}
	}

	for (const pattern of META_NAV_PATTERNS) {
		if (pattern.test(trimmed)) {
			errors.push(`${field} matches meta-navigation pattern ${pattern.source}`);
		}
	}

	return errors;
}

export function validateMainPageStyle(hero: MainPageHero): StyleValidationResult {
	const errors: string[] = [];
	const pagePath = hero.path;

	errors.push(...collectStyleViolations(hero.h1, 'h1').map((e) => `${pagePath}: ${e}`));
	errors.push(...collectStyleViolations(hero.intro, 'intro').map((e) => `${pagePath}: ${e}`));

	if (errors.length > 0) {
		console.error('[main-page-style-rules] validateMainPageStyle failed', { path: pagePath, errors });
		return { ok: false, errors };
	}
	return { ok: true };
}

export function validateAllMainPageStyles(heroes: MainPageHero[]): StyleValidationResult {
	const errors: string[] = [];
	for (const hero of heroes) {
		const result = validateMainPageStyle(hero);
		if (!result.ok) errors.push(...result.errors);
	}
	if (errors.length > 0) {
		console.error('[main-page-style-rules] validateAllMainPageStyles failed', { count: errors.length });
		return { ok: false, errors };
	}
	return { ok: true };
}
