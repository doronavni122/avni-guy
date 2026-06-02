/**
 * Pass 1 batch 6 compact MDX bodies (link-density compliant).
 */
import { buildFaqSection, buildTldrBlock } from './article-body-kit.mjs';
import { buildCompactBody } from './pass1-batch-remediation-content.mjs';

const UNIQUE_PARAS = {
	'guy-avni-capital-gains-tax-assessment-appeal': [
		'השגה על שומת מס שבח נפתחת רק בשומה למיטב השפיטה שנמסרה בהודעה: 30 יום ממועד המסירה. טופס 7013 חייב לכלול סכום לא שנוי במחלוקת וחישוב חלופי מנומק (2026).',
		'שומה עצמית שהתקבלה אינה ניתנת להשגה; טעות בחישוב מטופלת לרוב בבקשה לתיקון שומה (טופס 7085) בכפוף לעילה.',
		'ממלאים טופס 7013 עם אסמכתאות: חוזי מכר ורכישה, שמאות, הוצאות מוכרות, ופירוק טענות לשווי מכירה, עלות ופטורים.',
		'פספוס 30 יום מצמצם אפשרויות; נשאר ערר לוועדת ערר או בקשה לתיקון שומה. ארכת מועד אפשרית במקרים חריגים בלבד.',
		'אחרי הגשה, המנהל רשאי לזמן לדיון; החלטה מנומקת אמורה להינתן תוך שמונה חודשים או 30 יום מסיום הבאת מסמכים.',
		'טעויות: הגשה ללא מספרים, התעלמות מהוצאות, בלבול בין השגה לערר, תשלום מלא לפני הליך.',
		'לפני הגשה כדאי לבנות טבלת חישוב חלופית ולהשוות לשומה.',
		'סיכום: תיעוד ומועדים קובעים את סיכויי ההצלחה מול רשות המיסים.',
	],
	'guy-avni-capital-gains-tax-evacuation-reconstruction': [
		'בפינוי בינוי הדייר מפנה דירה ישנה ומקבל חדשה; מבחינת מס זה עשוי להיחשב מכירת זכויות. פטור שבח לדייר משתתף כפוף לתנאים ולבקשה (2026).',
		'הפטור אינו אוטומטי: פרויקט מוכר, תמורה סבירה, והגשה לרשות המיסים. היזם לעיתים מסייע בניירת אך האחריות על הדייר.',
		'מכירת זכות אחרי הריסת הבניין עלולה לחייב במס; מומלץ לממש זכויות לפני הריסה כשמתכננים פטור.',
		'רשות המיסים עלולה לחייב לפי שווי שוק, אך עסקה בתום לב במחיר חוזי עשויה להימס לפי המחיר בפועל.',
		'מיסים נוספים: מס רכישה על דירה חדשה, היטל השבחה, ולעיתים מע"מ על שירותי בנייה.',
		'טעויות: הנחת פטור מובן מאליו, מכירה מאוחרת, אי דיווח, חוזה בלי סעיף מיסוי.',
		'טבלת תפקידים: דייר מגיש, יזם מסייע, מקצוען בודק תזמון.',
		'סיכום: תכנון מס לפני חתימה על הסכם פינוי בינוי.',
	],
	'guy-avni-capital-gains-tax-installment-payment': [
		'פריסת שבח לפי סעיף 48א מחלקת רווח לעד ארבע שנים מס קודמות; זה שונה מפריסת תשלומים שהיא הסדר גבייה בלבד.',
		'פריסה משתלמת כשבשנים קודמות היו הכנסות נמוכות או זיכויים שלא נוצלו; פחות תועילת כשכל הרווח בשנת המכירה.',
		'מגישים טופס 7003 עם תחשיב ודוחות 1301 לשנים הרלוונטיות; בלי דוחות תקינים הבקשה עלולה להידחות.',
		'פריסת תשלומים רלוונטית לקושי תזרימי כשאין הפחתת מס; שילוב נכון דורש תיאום עם פקיד גבייה.',
		'פריסת שבח משפיעה גם על חלוק הכנסה הונית ועל מס יסף ב-2026.',
		'טעויות: בקשה בלי דוחות, הנחה שהרשות תציע, תשלום מלא ואז בקשה להחזר.',
		'סימולציה לפני מכירה עדיפה על תיקון אחרי שומה.',
		'סיכום: הבחנה בין הפחתת חבות לבין דחיית תשלום.',
	],
	'guy-avni-capital-gains-tax-second-apartment': [
		'דירה שנייה אינה זכאית לפטור 49ב; המס על שבח ריאלי 25% ו-30% מעל תקרה בערך 6.47 מיליון ש"ח ב-2026.',
		'עלות מקרקעין כוללת רכישה מוצמדת, מס רכישה, שיפוצים מוכחים, ועמלות; לא ארנונה שוטפת.',
		'דוגמה: רכישה 1.2M, מכירה 2.1M, הוצאות 184K יוצרות מס בערך 119K לפני התאמות.',
		'נכס לפני 1.1.2014 עשוי לזכות בלינארי; תכנון כולל גם מס רכישה בכניסה.',
		'משפר דיור: רכישה חדשה לפני מכירת ישנה עם מועדים מחייבים; איחור מייקר.',
		'דיווח בטופס 4 תוך 30 יום; תשלום תוך 60 יום; איחור מייצר ריבית.',
		'טעויות: הנחת פטור יחידה, שיפוץ בלי קבלות, מכירה בלי סימולציה.',
		'סיכום: חישוב נטו לפני חתימה על הסכם מכר.',
	],
};

function batchSpec(slug, partial) {
	const lexicon = partial.topicLexicon ?? [];
	const entry = {
		slug,
		...partial,
		topicLexicon: lexicon,
		uniqueParagraphs: UNIQUE_PARAS[slug] ?? [],
		ymyl: true,
		buildBody() {
			return buildCompactBody(entry);
		},
	};
	return entry;
}

/** @type {Record<string, ReturnType<typeof batchSpec>>} */
export const BATCH6_MDX_SPECS = {
	'guy-avni-capital-gains-tax-assessment-appeal': batchSpec(
		'guy-avni-capital-gains-tax-assessment-appeal',
		{
			pillarAnchor: 'פטור מס רכישה ראשונה',
			blogAnchor: 'חישוב לינארי מס שבח',
			blogAnchor2: 'מס שבח דירה שנייה',
			blogAnchor3: 'פטור דירה יחידה 2026',
			title: 'איך מגישים השגה על שומת מס שבח',
			description:
				'מדריך להגשת השגה על שומת מס שבח: טופס 7013, מועד 30 יום, שומה עצמית מול למיטב השפיטה.',
			metaTitle: 'גיא אבני עורך דין | השגה על שומת מס שבח',
			metaDescription:
				'איך מגישים השגה על שומת מס שבח? 30 יום, טופס 7013 ונימוקים. גיא אבני עורך דין מסביר מועדים וטעויות.',
			mainKeyword: 'גיא אבני עורך דין',
			category: 'tax',
			tags: ['tax', 'capital-gains', 'appeal'],
			relatedBlogSlugs: [
				'guy-avni-purchase-tax-exemption-first-apartment',
				'guy-avni-linear-capital-gains-tax-benefit',
				'guy-avni-capital-gains-tax-second-apartment',
				'guy-avni-capital-gains-exemption-single-apartment-2026',
			],
			firstH2: 'מתי נפתחת זכות להשגה על שומת מס שבח',
			topicLexicon: ['שומת מס שבח', 'טופס 7013', 'שומה למיטב השפיטה', 'ועדת ערר'],
			sectionBlueprints: [
				{ heading: 'שומה עצמית מול שומה למיטב השפיטה', focus: 'מתי אין השגה' },
				{ heading: 'מילוי טופס 7013', focus: 'נימוקים ואסמכתאות' },
				{ heading: 'מועדים קשיחים', focus: '30 יום וארכות' },
				{ heading: 'טעויות נפוצות', focus: 'תיעוד ותשלום' },
			],
			uniqueOpener:
				'השגה על שומת מס שבח נפתחת תוך 30 יום מהודעת שומה למיטב השפיטה, בטופס 7013 מנומק.',
		},
	),
	'guy-avni-capital-gains-tax-evacuation-reconstruction': batchSpec(
		'guy-avni-capital-gains-tax-evacuation-reconstruction',
		{
			pillarAnchor: 'פטור מס רכישה ראשונה',
			blogAnchor: 'מס שבח דירה שנייה',
			blogAnchor2: 'פטור דירה יחידה 2026',
			blogAnchor3: 'פריסת מס שבח',
			title: 'מי משלם מס שבח בפרויקט פינוי בינוי',
			description:
				'מי משלם מס שבח בפינוי בינוי: פטורים, תנאים, מכירה לפני הריסה, ומימוש ההטבה.',
			metaTitle: 'גיא אבני עורך דין | מס שבח בפינוי בינוי',
			metaDescription:
				'מי משלם מס שבח בפינוי בינוי? פטור, תנאים ותזמון. גיא אבני עורך דין מסביר חלוקת נטל.',
			mainKeyword: 'גיא אבני עורך דין',
			category: 'tax',
			tags: ['tax', 'capital-gains', 'urban-renewal'],
			relatedBlogSlugs: [
				'guy-avni-purchase-tax-exemption-first-apartment',
				'guy-avni-capital-gains-tax-second-apartment',
				'guy-avni-capital-gains-exemption-single-apartment-2026',
				'guy-avni-capital-gains-tax-installment-payment',
			],
			firstH2: 'מי בכלל מוכר בפינוי בינוי',
			topicLexicon: ['פינוי בינוי', 'פטור מס שבח', 'התחדשות עירונית', 'מכירת זכות'],
			sectionBlueprints: [
				{ heading: 'פטור לדיירים משתתפים', focus: 'תנאים ודיווח' },
				{ heading: 'מכירה לפני הריסה', focus: 'תזמון זכויות' },
				{ heading: 'שווי העסקה', focus: 'מחיר חוזי מול שוק' },
				{ heading: 'טעויות יקרות', focus: 'פטור ודיווח' },
			],
			uniqueOpener:
				'בפינוי בינוי מס שבח תלוי בתנאי פטור, בתזמון מכירת זכות, ובדיווח לרשות המיסים.',
		},
	),
	'guy-avni-capital-gains-tax-installment-payment': batchSpec(
		'guy-avni-capital-gains-tax-installment-payment',
		{
			pillarAnchor: 'פטור מס רכישה ראשונה',
			blogAnchor: 'מס יסף מי משלם',
			blogAnchor2: 'מס שבח דירה שנייה',
			blogAnchor3: 'פטור דירה יחידה 2026',
			title: 'איך מבקשים פריסת מס שבח לתשלומים',
			description:
				'פריסת מס שבח: סעיף 48א מול פריסת תשלומים, טופס 7003 ותנאים למוכרי דירה.',
			metaTitle: 'גיא אבני עורך דין | פריסת מס שבח',
			metaDescription:
				'איך מבקשים פריסת מס שבח? טופס 7003, סעיף 48א והבדל מפריסת תשלומים. גיא אבני עורך דין מסביר.',
			mainKeyword: 'גיא אבני עורך דין',
			category: 'tax',
			tags: ['tax', 'capital-gains', 'installments'],
			relatedBlogSlugs: [
				'guy-avni-purchase-tax-exemption-first-apartment',
				'guy-avni-additional-tax-who-pays',
				'guy-avni-capital-gains-tax-second-apartment',
				'guy-avni-capital-gains-exemption-single-apartment-2026',
			],
			firstH2: 'פריסת שבח מול פריסת תשלומים',
			topicLexicon: ['פריסת מס שבח', 'טופס 7003', 'סעיף 48א', 'פריסת תשלומים'],
			sectionBlueprints: [
				{ heading: 'מתי פריסת שבח משתלמת', focus: 'שנות מס קודמות' },
				{ heading: 'הגשת טופס 7003', focus: 'דוחות 1301' },
				{ heading: 'פריסת תשלומים', focus: 'הסדר גבייה' },
				{ heading: 'טעויות נפוצות', focus: 'בלבול מנגנונים' },
			],
			uniqueOpener:
				'פריסת שבח לפי סעיף 48א מפחיתה מס; פריסת תשלומים רק דוחה גבייה.',
		},
	),
	'guy-avni-capital-gains-tax-second-apartment': batchSpec(
		'guy-avni-capital-gains-tax-second-apartment',
		{
			pillarAnchor: 'פטור מס רכישה ראשונה',
			blogAnchor: 'חישוב מס רכישה דירה שנייה',
			blogAnchor2: 'חישוב לינארי מס שבח',
			blogAnchor3: 'פטור דירה יחידה 2026',
			title: 'כמה מס שבח באמת תשלמו על מכירת דירה שנייה',
			description:
				'חישוב מס שבח על דירה שנייה: 25% ריאלי, 30% מעל תקרה, הוצאות מוכרות ולינארי.',
			metaTitle: 'גיא אבני עורך דין | מס שבח דירה שנייה',
			metaDescription:
				'כמה מס שבח על דירה שנייה? חישוב שבח, 25% וניכויים. גיא אבני עורך דין מסביר דוגמאות.',
			mainKeyword: 'גיא אבני עורך דין',
			category: 'tax',
			tags: ['tax', 'capital-gains', 'second-apartment'],
			relatedBlogSlugs: [
				'guy-avni-purchase-tax-exemption-first-apartment',
				'guy-avni-second-apartment-purchase-tax-calculation',
				'guy-avni-linear-capital-gains-tax-benefit',
				'guy-avni-capital-gains-exemption-single-apartment-2026',
			],
			firstH2: 'למה מכירת דירה שנייה ממוסה אחרת',
			topicLexicon: ['מס שבח דירה שנייה', 'שבח ריאלי', 'הוצאות מוכרות', 'לינארי'],
			sectionBlueprints: [
				{ heading: 'נוסחת השבח', focus: 'הוצאות מוכרות' },
				{ heading: 'לינארי ותקרה', focus: 'תכנון מס' },
				{ heading: 'תזמון מכירות', focus: 'משפר דיור' },
				{ heading: 'טעויות נפוצות', focus: 'פטור ותיעוד' },
			],
			uniqueOpener:
				'דירה שנייה אינה זכאית לפטור 49ב; מס השבח מחושב על רווח ריאלי ב-25% ו-30% מעל תקרה.',
		},
	),
};

const FAQ_BY_SLUG = {
	'guy-avni-capital-gains-tax-assessment-appeal': [
		{ question: 'האם אפשר להשיג על שומה עצמית?', answer: 'בדרך כלל לא; המסלול הוא תיקון שומה.' },
		{ question: 'מה אם פספסתי 30 יום?', answer: 'לעיתים ערר או בקשה לתיקון שומה.' },
		{ question: 'האם חייבים עורך דין?', answer: 'לא חובה, אך בשומות גבוהות מומלץ.' },
		{ question: 'מה לצרף לטופס 7013?', answer: 'חוזים, שמאות והוצאות מוכרות.' },
	],
	'guy-avni-capital-gains-tax-evacuation-reconstruction': [
		{ question: 'האם הפטור אוטומטי?', answer: 'לא; יש תנאים ובקשה.' },
		{ question: 'מה אחרי הריסה?', answer: 'מכירת זכות עלולה לחייב במס.' },
		{ question: 'מי מגיש?', answer: 'הדייר, לעיתים בליווי מקצועי.' },
		{ question: 'יש מס רכישה על דירה חדשה?', answer: 'לעיתים הטבות; בודקים לפי מקרה.' },
	],
	'guy-avni-capital-gains-tax-installment-payment': [
		{ question: 'מה ההבדל מפריסת תשלומים?', answer: '48א מפחית מס; פריסת תשלומים דוחה גבייה.' },
		{ question: 'איזה טופס?', answer: '7003 ודוחות 1301.' },
		{ question: 'האם אוטומטי?', answer: 'לא; צריך בקשה ותחשיב.' },
		{ question: 'משפיע על מס יסף?', answer: 'כן; משנה חלוק הכנסה בין שנים.' },
	],
	'guy-avni-capital-gains-tax-second-apartment': [
		{ question: 'האם מס רכישה מקוזז?', answer: 'כהוצאה מוכרת בשבח.' },
		{ question: 'מה ההבדל 25% ל-30%?', answer: '30% על חלק השבח מעל התקרה.' },
		{ question: 'לינארי רלוונטי?', answer: 'לנכסים שנרכשו לפני 1.1.2014.' },
		{ question: 'מתי למכור יחידה קודם?', answer: 'כשתכנון מס מצדיק סדר מכירות.' },
	],
};

export function buildBatch6Body(slug) {
	const spec = BATCH6_MDX_SPECS[slug];
	if (!spec) return null;
	const body = spec.buildBody() + buildFaqSection(FAQ_BY_SLUG[slug] ?? []);
	return `${buildTldrBlock(spec.mainKeyword, spec.uniqueOpener)}\n\n${body}`.trim() + '\n';
}
