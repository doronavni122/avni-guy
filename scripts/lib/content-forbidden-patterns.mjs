/** Shared forbidden copy patterns for article content audits. */

export const FORBIDDEN_TITLE_SUFFIX =
	'מדריך מעשי, שיטות יישום וטעויות שכדאי למנוע';

export const FORBIDDEN_OPENING_SNIPPET = 'כדי לבנות הקשר רחב לפני היישום';

export const FORBIDDEN_CLOSING_SNIPPET = 'צ׳קליסט הרחבה ליישום מיידי';

export const FORBIDDEN_30_60_90_HEADING = '## תוכנית 30/60/90 יום';

/** Fluff/stuffing patterns enforced when CONTENT_STRICT=1. */
export const FLUFF_BODY_PATTERNS = [
	/בסופו של דבר/u,
	/חשוב לציין ש/u,
	/לא סוד ש/u,
	/בעידן של היום/u,
	/מדריך מעשי, שיטות יישום/u,
];

export const BANNED_ANCHOR_PATTERNS = [
	/^קריאה פנימית\b/u,
	/^קריאה קשורה\b/u,
	/^קריאה ממוקדת\b/u,
	/^קישור פנימי\b/u,
	/^לחץ כאן\b/u,
	/^לחצו כאן\b/u,
	/^קרא עוד\b/u,
	/^קראו עוד\b/u,
	/^עמוד זה\b/u,
	/^לעמוד זה\b/u,
	/^כאן\b$/u,
	/^click here$/iu,
	/^read more$/iu,
	/^this page$/iu,
	/^here$/iu,
	/^more$/iu,
	/^למידע נוסף$/u,
	/^פרטים נוספים$/u,
];

export const STANDARD_NAV_LINK_PATHS = [
	'/',
	'/about',
	'/about/',
	'/services',
	'/services/',
	'/blog',
	'/blog/',
	'/categories',
	'/categories/',
	'/tags',
	'/tags/',
	'/contact',
	'/contact/',
];

export const YMYL_SLUGS = new Set([
	'guy-avni-israel-real-estate-delay-delivery-research',
	'guy-avni-contract-review-flow',
	'guy-avni-choosing-lawyer-israel-comprehensive-guide',
]);

export const YMYL_EXTERNAL_ALLOWLIST_HOSTS = [
	'gov.il',
	'justice.gov.il',
	'israelbar.org.il',
	'law.gov.il',
	'unsplash.com',
];
