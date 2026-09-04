import { PUBLIC_RECORD_SPEAKABLE } from '@/lib/seo/public-record';

/**
 * Short Hebrew voice-answer blocks for Speakable surfaces.
 * Visible text on the page MUST match `answer` exactly when Speakable is emitted.
 */

export type SpeakableVoiceBlock = {
	id: string;
	question: string;
	answer: string;
};

/** Entity/home brand surface — short TTS-friendly answers. */
export const ABOUT_SPEAKABLE_VOICE_BLOCKS: SpeakableVoiceBlock[] = [
	{
		id: 'who',
		question: 'מי זה גיא אבני?',
		answer:
			'גיא אבני הוא עורך דין ישראלי המלווה פרטיים ועסקים בנדל״ן, מיסוי מקרקעין, חוזים וליטיגציה אזרחית.',
	},
	PUBLIC_RECORD_SPEAKABLE,
	{
		id: 'practice',
		question: 'באילו תחומים גיא אבני מלווה?',
		answer:
			'תחומי ליווי עיקריים: נדל״ן ומיסוי מקרקעין, חוזים, סכסוכים אזרחיים, ליטיגציה וליווי שוטף לעסקים.',
	},
	{
		id: 'contact',
		question: 'איך ליצור קשר עם גיא אבני?',
		answer:
			'ניתן ליצור קשר דרך עמוד יצירת הקשר באתר לתיאום שיחת מיקוד, או בדוא״ל info@avniguy.co.il.',
	},
];

/** Top services hub — short TTS-friendly answers. */
export const SERVICES_SPEAKABLE_VOICE_BLOCKS: SpeakableVoiceBlock[] = [
	{
		id: 'what',
		question: 'מה מציע משרד גיא אבני?',
		answer:
			'גיא אבני משרד עורכי דין מציע ייעוץ, ליווי מסמכים, תקשורת מול גורמים חיצוניים ומעקב - מתחילים בפגישת מיקוד.',
	},
	{
		id: 'focus',
		question: 'מה כוללת פגישת מיקוד?',
		answer:
			'פגישת מיקוד כוללת הבנת העובדות, מיון דחיפות, שאלות ממוקדות ותמונת צעדים ראשונית.',
	},
	{
		id: 'start',
		question: 'איך מתחילים ליווי?',
		answer:
			'מומלץ לקרוא מאמר או עמוד שירות רלוונטי, ואז ליצור קשר דרך עמוד יצירת הקשר או בדוא״ל info@avniguy.co.il.',
	},
];

/** Top category hubs — one short voice lead per slug (speakable-only when rendered with class). */
export const CATEGORY_SPEAKABLE_VOICE_BLOCKS: Record<string, SpeakableVoiceBlock> = {
	tax: {
		id: 'tax',
		question: 'מה יש בקטגוריית מיסוי?',
		answer:
			'קטגוריית מיסוי מרכזת מדריכים על מס רכישה, מס שבח, פטורים וערעורים מול רשות המיסים - לפני מכירה או רכישה.',
	},
	'real-estate': {
		id: 'real-estate',
		question: 'מה יש בקטגוריית נדל״ן?',
		answer:
			'קטגוריית נדל״ן מרכזת ליווי בקנייה, מכירה, שכירות והתחדשות עירונית - עם דגש על בדיקות לפני חתימה.',
	},
	contracts: {
		id: 'contracts',
		question: 'מה יש בקטגוריית חוזים?',
		answer:
			'קטגוריית חוזים מסבירה סקירת טיוטה, סעיפי סיכון, ביטול עסקה והתיישנות - לפני שחותמים.',
	},
	litigation: {
		id: 'litigation',
		question: 'מה יש בקטגוריית ליטיגציה?',
		answer:
			'קטגוריית ליטיגציה מכסה תביעות אזרחיות, גבייה והוצל״פ - עם הכנה מוקדמת ובחינת עלות מול תועלת.',
	},
	business: {
		id: 'business',
		question: 'מה יש בקטגוריית עסקים?',
		answer:
			'קטגוריית עסקים מרכזת ליווי חוזים, ציות ותהליכים פנימיים לעסקים קטנים ובינוניים.',
	},
	service: {
		id: 'service',
		question: 'מה יש בקטגוריית שירות משפטי?',
		answer:
			'קטגוריית שירות משפטי מסבירה בחירת ייצוג, עלויות וציפיות מהליווי - לפני פגישת מיקוד.',
	},
};

export function getCategorySpeakableVoiceBlock(category: string): SpeakableVoiceBlock | null {
	try {
		return CATEGORY_SPEAKABLE_VOICE_BLOCKS[category] ?? null;
	} catch (err) {
		console.error('[speakable-voice-blocks] getCategorySpeakableVoiceBlock failed', {
			category,
			err,
		});
		return null;
	}
}
