/** English slug → Hebrew display (URLs stay English). */
export const TAG_LABELS: Record<string, string> = {
	time: 'ניהול זמן',
	focus: 'מיקוד',
	operations: 'תפעול',
	service: 'שירות',
	quality: 'איכות',
	clients: 'לקוחות',
	risk: 'סיכונים',
	routine: 'שגרה',
	planning: 'תכנון',
	process: 'תהליכים',
	case: 'תיקים',
	organization: 'ארגון',
	documents: 'מסמכים',
	negotiation: 'משא ומתן',
	clarity: 'בהירות',
	communication: 'תקשורת',
	meetings: 'פגישות',
	preparation: 'הכנה',
	strategy: 'אסטרטגיה',
	'long-term': 'טווח ארוך',
	writing: 'כתיבה',
	content: 'תוכן',
	evidence: 'ראיות',
	priority: 'תעדוף',
	analysis: 'ניתוח',
	ethics: 'אתיקה',
	decisions: 'החלטות',
	professionalism: 'מקצועיות',
	readiness: 'מוכנות',
	workflow: 'זרימת עבודה',
	disputes: 'מחלוקות',
	prevention: 'מניעה',
	contracts: 'חוזים',
	review: 'בדיקה',
	collaboration: 'שיתוף פעולה',
	experts: 'מומחים',
	trust: 'אמון',
	growth: 'צמיחה',
	onboarding: 'קליטה',
	business: 'עסקים',
	habits: 'הרגלים',
	compliance: 'תאימות',
	'real-estate': 'נדל״ן',
	'israel-law': 'דין ישראלי',
	'buyer-rights': 'זכויות רוכש',
};

export const CATEGORY_LABELS: Record<string, string> = {
	strategy: 'אסטרטגיה',
	operations: 'תפעול ארגוני',
	communication: 'תקשורת',
	documents: 'מסמכים',
	service: 'שירות',
	'real-estate-law': 'דיני נדל״ן',
};

export function getTagLabel(slug: string): string {
	const label = TAG_LABELS[slug];
	if (!label) {
		console.error('[taxonomy-labels] missing TAG_LABELS entry', { slug });
		return slug;
	}
	return label;
}

export function getCategoryLabel(slug: string): string {
	const label = CATEGORY_LABELS[slug];
	if (!label) {
		console.error('[taxonomy-labels] missing CATEGORY_LABELS entry', { slug });
		return slug;
	}
	return label;
}

/** Meta description for /tags/[slug]/ — 14–18 words including multiword Hebrew label. */
export function buildTagMetaDescription(hebrewLabel: string): string {
	return `תכנים בעברית על ${hebrewLabel}, כלים מעשיים ליישום מיידי, ניווט נוח למאמרים נוספים ולעמוד יצירת קשר.`;
}

/** Document title for tag listing page (creative, includes brand). */
export function buildTagPageTitle(hebrewLabel: string): string {
	return `גיא אבני עוד | תגית: ${hebrewLabel}`;
}

/** Meta description for /categories/[slug]/ */
export function buildCategoryMetaDescription(hebrewLabel: string): string {
	return `מאמרים בעברית תחת תחום ${hebrewLabel}, דגשים פרקטיים, קישורים למאמרים ותגיות, ומסלול מהיר לפגישה ראשונה.`;
}

export function buildCategoryPageTitle(hebrewLabel: string): string {
	return `אבני גיא | קטגוריה: ${hebrewLabel}`;
}
