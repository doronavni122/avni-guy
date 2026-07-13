/** One-line Hebrew blurbs for category index cards (CAT-012 SSOT). */

const CATEGORY_INDEX_BLURBS: Record<string, string> = {
	benefits: 'קצבאות, זכויות והטבות מול גופים ציבוריים וביטוח לאומי.',
	business: 'ליווי עסקי, חברות, שותפויות וסיכונים מול ספקים ולקוחות.',
	communication: 'תקשורת עם לקוחות, ניהול ציפיות ושקיפות בייצוג.',
	consumer: 'זכויות צרכנים, ליקויים, החזרים ותביעות מול ספקים.',
	contracts: 'חוזים, סקירת טיוטות, הפרות וביטול עסקאות.',
	criminal: 'מעורבות פלילית, רישום פלילי וייצוג בחקירות.',
	documents: 'מסמכים, טפסים, רישום ותיעוד לפני חתימה.',
	employment: 'יחסי עבודה, פיטורים, זכויות שכיר וסכסוכי מעסיק.',
	family: 'גירושין, מזונות, הסכמי ממון וחלוקת נכסים.',
	insurance: 'ביטוח, תביעות מול חברות ביטוח וכיסוי נזקים.',
	litigation: 'תביעות אזרחיות, גבייה, הוצל"פ וגישור.',
	medical: 'רשלנות רפואית, זכויות מטופל ותביעות נגד גופים רפואיים.',
	operations: 'תפעול ארגוני, נהלים פנימיים וציות משפטי.',
	'real-estate': 'קנייה, מכירה, שכירות והתחדשות עירונית.',
	'real-estate-law': 'דיני מקרקעין, רישום, זכויות בנכס ועסקאות.',
	service: 'בחירת ייצוג, עלויות, אתיקה וציפיות מעורך דין.',
	strategy: 'אסטרטגיה משפטית, תכנון מוקדם וקבלת החלטות.',
	tax: 'מיסוי מקרקעין, מס רכישה, שבח וערעורים מול רשות המיסים.',
	traffic: 'עבירות תעבורה, נקודות, פסילה וייצוג בבית משפט.',
};

const DEFAULT_BLURB = 'מאמרים בעברית בתחום זה — קראו לפני פנייה לייעוץ.';

export function getCategoryIndexBlurb(category: string): string {
	const blurb = CATEGORY_INDEX_BLURBS[category];
	if (!blurb) {
		console.error('[category-index-blurbs] missing blurb', { category });
		return DEFAULT_BLURB;
	}
	return blurb;
}
