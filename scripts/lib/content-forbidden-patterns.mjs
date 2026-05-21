/** Shared forbidden copy patterns for article content audits. */

export const FORBIDDEN_TITLE_SUFFIX =
	'מדריך מעשי, שיטות יישום וטעויות שכדאי למנוע';

export const FORBIDDEN_OPENING_SNIPPET = 'כדי לבנות הקשר רחב לפני היישום';

export const FORBIDDEN_CLOSING_SNIPPET = 'צ׳קליסט הרחבה ליישום מיידי';

export const FORBIDDEN_30_60_90_HEADING = '## תוכנית 30/60/90 יום';

export const BANNED_ANCHOR_PATTERNS = [
	/^קריאה פנימית\b/u,
	/^קריאה קשורה\b/u,
	/^קריאה ממוקדת\b/u,
	/^קישור פנימי\b/u,
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
