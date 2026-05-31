/** English slug → Hebrew display (URLs stay English). */
export const TAG_LABELS: Record<string, string> = {
	accident: 'תאונות',
	administrative: 'משפט מינהלי',
	analysis: 'ניתוח',
	appeal: 'ערעור',
	bank: 'בנקאות',
	benefits: 'קצבאות והטבות',
	billing: 'חיוב וגבייה',
	breach: 'הפרת חוזה',
	building: 'בנייה',
	business: 'עסקים',
	buyer: 'רוכש',
	'buyer-rights': 'זכויות רוכש',
	cancellation: 'ביטול עסקה',
	'car-insurance': 'ביטוח רכב',
	case: 'תיקים',
	'case-search': 'חיפוש תיק',
	checks: 'שיקים',
	'child-support': 'מזונות ילדים',
	choosing: 'בחירה',
	claims: 'תביעות',
	clarity: 'בהירות',
	'class-action': 'תביעה ייצוגית',
	clients: 'לקוחות',
	closure: 'סגירת תיק',
	collaboration: 'שיתוף פעולה',
	collection: 'גבייה',
	communication: 'תקשורת',
	companies: 'חברות',
	complaint: 'תלונה',
	compliance: 'תאימות',
	consumer: 'צרכנות',
	content: 'תוכן',
	contracts: 'חוזים',
	costs: 'הוצאות משפט',
	courts: 'בתי משפט',
	criminal: 'פלילי',
	damages: 'נזקים',
	debt: 'חובות',
	decisions: 'החלטות',
	defamation: 'לשון הרע',
	defect: 'ליקוי',
	disputes: 'מחלוקות',
	divorce: 'גירושין',
	documents: 'מסמכים',
	driving: 'נהיגה',
	employment: 'דיני עבודה',
	enforcement: 'הוצאה לפועל',
	ethics: 'אתיקה',
	evidence: 'ראיות',
	'exempt-dealer': 'עוסק פטור',
	expert: 'מומחים',
	experts: 'מומחים',
	family: 'דיני משפחה',
	fees: 'שכר טרחה',
	focus: 'מיקוד',
	growth: 'צמיחה',
	habits: 'הרגלים',
	harassment: 'הטרדה',
	'health-insurance': 'ביטוח בריאות',
	income: 'הכנסה',
	increase: 'העלאה',
	insurance: 'ביטוח',
	'israel-bar': 'לשכת עורכי הדין',
	'israel-law': 'דין ישראלי',
	law: 'דין',
	lawyer: 'עורך דין',
	lease: 'שכירות',
	license: 'רישוי',
	limits: 'הגבלות',
	litigation: 'ליטיגציה',
	'long-term': 'טווח ארוך',
	malpractice: 'רשלנות רפואית',
	marriage: 'נישואין',
	maternity: 'חופשת לידה',
	mediation: 'גישור',
	medical: 'רפואי',
	meetings: 'פגישות',
	'national-insurance': 'ביטוח לאומי',
	negotiation: 'משא ומתן',
	'non-compete': 'אי תחרות',
	notice: 'הודעה מוקדמת',
	onboarding: 'קליטה',
	operations: 'תפעול',
	organization: 'ארגון',
	partnership: 'שותפות',
	payments: 'תשלומים',
	penalty: 'קנס',
	permits: 'היתרים',
	planning: 'תכנון',
	'power-of-attorney': 'ייפוי כוח',
	prenup: 'הסכם ממון',
	preparation: 'הכנה',
	prevention: 'מניעה',
	priority: 'תעדוף',
	process: 'תהליכים',
	product: 'מוצר',
	professionalism: 'מקצועיות',
	purchase: 'רכישה',
	quality: 'איכות',
	readiness: 'מוכנות',
	'real-estate': 'נדל״ן',
	record: 'רישום פלילי',
	'red-flags': 'דגלים אדומים',
	refund: 'החזר כספי',
	registration: 'רישום',
	registry: 'מרשם',
	rent: 'שכירות',
	retainer: 'מקדמה',
	review: 'בדיקה',
	risk: 'סיכונים',
	routine: 'שגרה',
	sealing: 'חיסוי',
	'self-representation': 'ייצוג עצמי',
	service: 'שירות',
	settlement: 'פשרה',
	signature: 'חתימה',
	'small-claims': 'תביעות קטנות',
	statute: 'התיישנות',
	strategy: 'אסטרטגיה',
	tax: 'מיסים',
	termination: 'סיום העסקה',
	'third-party': 'צד ג׳',
	time: 'ניהול זמן',
	'travel-ban': 'עיכוב יציאה',
	trust: 'אמון',
	urgent: 'דחוף',
	wages: 'שכר',
	workflow: 'זרימת עבודה',
	writing: 'כתיבה',
};

export const CATEGORY_LABELS: Record<string, string> = {
	benefits: 'קצבאות והטבות',
	business: 'עסקים',
	communication: 'תקשורת',
	consumer: 'צרכנות',
	contracts: 'חוזים',
	criminal: 'פלילי',
	documents: 'מסמכים',
	employment: 'דיני עבודה',
	family: 'דיני משפחה',
	insurance: 'ביטוח',
	litigation: 'ליטיגציה',
	medical: 'רפואי',
	operations: 'תפעול ארגוני',
	'real-estate': 'נדל״ן',
	'real-estate-law': 'דיני נדל״ן',
	service: 'שירות',
	strategy: 'אסטרטגיה',
	tax: 'מיסים',
	traffic: 'תעבורה',
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

/** Meta description for /tags/[slug]/ - 14–18 words including multiword Hebrew label. */
export function buildTagMetaDescription(hebrewLabel: string): string {
	return `תכנים בעברית על ${hebrewLabel}, כלים מעשיים ליישום מיידי, ניווט נוח למאמרים נוספים ולעמוד יצירת קשר.`;
}

/** Document title for tag listing page (creative, includes brand). */
export function buildTagPageTitle(hebrewLabel: string): string {
	return `גיא אבני עו״ד | תגית: ${hebrewLabel}`;
}

/** Meta description for /categories/[slug]/ */
export function buildCategoryMetaDescription(hebrewLabel: string): string {
	return `מאמרים בעברית תחת תחום ${hebrewLabel}, דגשים פרקטיים, קישורים למאמרים ותגיות, ומסלול מהיר לפגישה ראשונה.`;
}

export function buildCategoryPageTitle(hebrewLabel: string): string {
	return `אבני גיא | קטגוריה: ${hebrewLabel}`;
}
