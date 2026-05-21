/** Mirrors src/lib/seo/main-page-style-rules.ts for seo-guardrails. */

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
];

export const META_NAV_PATTERNS = [
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

const BANNED_EM_DASH = '\u2014';

function collectStyleViolations(text, field) {
	const errors = [];
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

export function validateMainPageStyle(hero) {
	const errors = [];
	const pagePath = hero.path;

	for (const e of collectStyleViolations(hero.h1, 'h1')) {
		errors.push(`${pagePath}: ${e}`);
	}
	for (const e of collectStyleViolations(hero.intro, 'intro')) {
		errors.push(`${pagePath}: ${e}`);
	}

	if (errors.length > 0) {
		console.error('[main-page-style-rules] validateMainPageStyle failed', { path: pagePath, errors });
		return { ok: false, errors };
	}
	return { ok: true };
}

export function validateAllMainPageStyles(heroes) {
	const errors = [];
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
