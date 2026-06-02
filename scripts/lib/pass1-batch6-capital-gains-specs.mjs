/**
 * Pass 1 batch 6: capital-gains tax cluster (4 slugs).
 * Log: [pass1-batch6-content]
 */
import { YMYL_SLUGS } from './content-forbidden-patterns.mjs';
import { buildCompactBody } from './pass1-batch-remediation-content.mjs';

export const BATCH6_SLUGS = [
	'guy-avni-capital-gains-tax-assessment-appeal',
	'guy-avni-capital-gains-tax-evacuation-reconstruction',
	'guy-avni-capital-gains-tax-installment-payment',
	'guy-avni-capital-gains-tax-second-apartment',
];

export const RESEARCH_SPECS = {
	'guy-avni-capital-gains-tax-assessment-appeal': {
		slug: 'guy-avni-capital-gains-tax-assessment-appeal',
		mainKeyword: 'גיא אבני עורך דין',
		title: 'השגה על שומת מס שבח',
		query: 'איך מגישים השגה על שומת מס שבח בישראל',
		audience: 'מוכרי מקרקעין שקיבלו שומה למיטב השפיטה',
		framework:
			'- חוק מיסוי מקרקעין: סעיף 87 השגה על שומה (30 יום, 2025).\n- טופס 7013, סכום לא שנוי במחלוקת (2026).',
		facts: [
			'השגה על שומה תוך 30 יום ממסירת הודעה (gov.il, 2025).',
			'אין השגה על שומה עצמית שהתקבלה (2026).',
			'ערר לוועדת ערר תוך 30 יום מהחלטת מנהל (2025).',
		],
		stats: ['מועד השגה 30 יום; החלטה עד 8 חודשים (2026).'],
		lsi: [
			'השגה על שומה',
			'טופס 7013',
			'שומה למיטב השפיטה',
			'מס שבח',
			'מנהל מיסוי מקרקעין',
			'ועדת ערר',
			'תיקון שומה',
			'שמאות מקרקעין',
			'הוצאות מוכרות',
		],
		outline: '1. מתי נפתחת זכות\n2. טופס 7013\n3. מועדים\n4. ערר',
	},
	'guy-avni-capital-gains-tax-evacuation-reconstruction': {
		slug: 'guy-avni-capital-gains-tax-evacuation-reconstruction',
		mainKeyword: 'גיא אבני עורך דין',
		title: 'מס שבח בפינוי בינוי',
		query: 'מי משלם מס שבח בפרויקט פינוי בינוי',
		audience: 'דיירים ויזמים בפרויקטי התחדשות עירונית',
		framework:
			'- חוק מיסוי מקרקעין: מכירה במסגרת פינוי בינוי (2025).\n- sec. 49b: פטור דירה יחידה בכפוף לתנאים (2026).',
		facts: [
			'מימוש זכות בפינוי בינוי עשוי ליצור אירוע מס (gov.il, 2025).',
			'חלוקת תמורה בין דייר ליזם מוסדר בחוזה (2026).',
			'מכירה לפני הריסה לעיתים משנה את נקודת המס (2025).',
		],
		stats: ['פרויקטי פינוי בינוי: אלפי יחידות דיור בשנה (2026).'],
		lsi: [
			'פינוי בינוי',
			'התחדשות עירונית',
			'מס שבח',
			'פטור דירה יחידה',
			'תמורה בזכויות',
			'יזם נדל"ן',
			'דיירים',
			'שמאות',
			'חוזה התחדשות',
		],
		outline: '1. מי משלם\n2. פטורים\n3. תזמון מכירה\n4. טעויות',
	},
	'guy-avni-capital-gains-tax-installment-payment': {
		slug: 'guy-avni-capital-gains-tax-installment-payment',
		mainKeyword: 'גיא אבני עורך דין',
		title: 'פריסת מס שבח',
		query: 'איך מבקשים פריסת מס שבח לתשלומים',
		audience: 'מוכרי דירה עם שבח גבוה',
		framework:
			'- חוק מיסוי מקרקעין: סעיף 48א פריסת שבח (2025).\n- טופס 7003 ודוחות 1301 (2026).',
		facts: [
			'פריסת שבח עד 4 שנים אחורה (gov.il, 2025).',
			'פריסת תשלומים אינה מחליפה פריסת שבח (2026).',
			'דוחות שנתיים חובה לבקשת פריסה (2025).',
		],
		stats: ['פריסה עד 4 שנים או תקופת החזקה, לפי הקצר (2026).'],
		lsi: [
			'פריסת מס שבח',
			'טופס 7003',
			'סעיף 48א',
			'דוח שנתי',
			'הסדר תשלומים',
			'תזרים מזומנים',
			'מס יסף',
			'שבח ריאלי',
			'תכנון מס',
		],
		outline: '1. פריסת שבח\n2. טופס 7003\n3. הסדר תשלומים\n4. טעויות',
	},
	'guy-avni-capital-gains-tax-second-apartment': {
		slug: 'guy-avni-capital-gains-tax-second-apartment',
		mainKeyword: 'גיא אבני עורך דין',
		title: 'מס שבח דירה שנייה',
		query: 'כמה מס שבח על מכירת דירה שנייה',
		audience: 'משקיעים ובעלי שתי דירות',
		framework:
			'- חוק מיסוי מקרקעין: אין פטור 49ב לדירה שנייה (2025).\n- 25% ריאלי, 30% מעל תקרה (2026).',
		facts: [
			'דירה שנייה ממוסה ללא פטור יחידה (gov.il, 2025).',
			'הוצאות מוכרות: מס רכישה, שיפוץ, עמלות (2026).',
			'לינארי לנכס לפני 2014 מפחית מס (2025).',
		],
		stats: ['תקרת שבח 30% בערך 6.47M ש"ח (2026).'],
		lsi: [
			'מס שבח',
			'דירה שנייה',
			'שבח ריאלי',
			'הוצאות מוכרות',
			'חישוב לינארי',
			'מס רכישה',
			'משפר דיור',
			'טופס 4',
			'רשות המיסים',
		],
		outline: '1. חישוב שבח\n2. 25% ו-30%\n3. לינארי\n4. טעויות',
	},
};

const UNIQUE_PARAS = {
	'guy-avni-capital-gains-tax-assessment-appeal': [
		'השגה על שומת מס שבח נפתחת כשמתקבלת שומה למיטב השפיטה מהמנהל, לא כשהשומה העצמית התקבלה. גיא אבני עורך דין ממליץ לסמן בלוח שנה 30 יום ממועד מסירת ההודעה ולפתוח תיק מסמכים: חוזים, שמאות, קבלות שיפוץ.',
		'טופס 7013 דורש פירוט: סכום שאינו שנוי במחלוקת, חישוב חלופי, ואסמכתאות. טענה כללית בלי מספרים מחלישה את הסיכוי להצלחה.',
		'שומה עצמית שהתקבלה מטופלת בדרך כלל בתיקון שומה (טופס 7085) בתוך ארבע שנים, לא בהשגה ראשונית.',
		'לאחר דחיית השגה, ערר לוועדת ערר תוך 30 יום. מעבר לבית משפט אפשרי רק לאחר מיצוי השלבים.',
		'תשלום סכום לא שנוי במחלוקת עשוי לאפשר המשך הליך על היתרה בלי ריבית מלאה על כל הסכום.',
		'ב-2025-2026 רשות המיסים ממשיכה לשלוח שומות דיגיטליות; חשוב לוודא כתובת מעודכנת למסירה.',
		'קשר לפטור דירה יחידה ולמס שבח דירה שנייה בתכנון מכירה לפני הגשת השגה.',
		'ייצוג מקצועי משתלם בשומות גבוהות או כשיש פטור מורכב.',
		'סיכום: 30 יום, טופס 7013, תיעוד מלא - שלושת עמודי השיג.',
	],
	'guy-avni-capital-gains-tax-evacuation-reconstruction': [
		'בפרויקט פינוי בינוי, מס שבח עשוי לחול על מימוש זכויות בנייה או על תמורה כספית/בזכויות. גיא אבני עורך דין בודק חוזה התחדשות לפני חתימה.',
		'דייר בדירה יחידה עשוי לזכות בפטור 49ב בכפוף לתנאים; דירה שנייה ברקע פוסלת לעיתים.',
		'חלוקת תמורה בין דייר ליזם: מי מדווח, באיזה שווי, ומתי - מוסדר בחוזה ובדין.',
		'מכירה ליזם לפני הריסה לעומת קבלת דירה חלופית: נקודות זמן שונות למס.',
		'שמאות לשווי זכויות לפני ואחרי התכנית משפיעה על חישוב שבח.',
		'ב-2026 פרויקטי התחדשות עירונית ממשיכים; בדיקת מס לפני מעבר לדירה זמנית חוסכת הפתעות.',
		'כדאי להשוות מול תמ"א 38 ולתכנן לוח זמנים לפרויקט פינוי בינוי לפני מעבר לדירה זמנית.',
		'תיאום עם עורך דין מקרקעין ויועץ מס לפני חתימה על הסכם דיירים.',
		'סיכום: מי משלם תלוי במבנה העסקה, בפטורים ובתזמון המימוש.',
	],
	'guy-avni-capital-gains-tax-installment-payment': [
		'פריסת מס שבח לפי סעיף 48א מחלקת את השבח לשנות מס קודמות עד 4 שנים, ועשויה להפחית מס כולל. גיא אבני עורך דין ממליץ על סימולציה לפני מכירה.',
		'פריסת תשלומים מול רשות המסים אינה מחליפה פריסת שבח: הראשונה משנה חבות, השנייה רק גבייה.',
		'טופס 7003 עם דוחות 1301 לשנים הרלוונטיות - בלעדיהם הבקשה נדחית.',
		'כשבשנות העבר היו הכנסות נמוכות, פריסת שבח משתלמת יותר.',
		'פריסה משפיעה גם על חישוב מס יסף בשנת המכירה.',
		'ב-2025-2026 אין אישור אוטומטי; האחריות על הנישום להגיש בקשה מנומקת.',
		'קשר למס שבח דירה שנייה ולהטבת לינארי בתכנון מס כולל לפני הגשת טופס 7003.',
		'תזרים: גם אחרי פריסה, מקדמת מס עשויה להידרש ביום המכירה.',
		'סיכום: הבחינה בין פריסת שבח להסדר תשלומים קריטית לתכנון.',
	],
	'guy-avni-capital-gains-tax-second-apartment': [
		'מכירת דירה שנייה מחויבת במס שבח ללא פטור 49ב: 25% על שבח ריאלי, 30% מעל תקרה. גיא אבני עורך דין ממליץ על חישוב נטו לפני פרסום הנכס.',
		'הוצאות מוכרות: מס רכישה, שיפוצים מתועדים, עמלות תיווך ועורך דין.',
		'נכס שנרכש לפני 2014 עשוי לזכות בחישוב לינארי שמפחית מס אפקטיבי.',
		'משפר דיור: רכישת חלופין לפני מכירת הישנה - מסלול מועדים מיוחד.',
		'דיווח טופס 4 תוך 30 יום; תשלום מקדמה תוך 60.',
		'ב-2026 תקרת 30% מעודכנת; בדקו נתון שנתי ברשות המיסים.',
		'קראו על פטור דירה יחידה 2026 ועל חישוב מס רכישה לדירה נוספת לפני קביעת סדר מכירות.',
		'תכנון סדר מכירות כשיש שתי דירות יכול לחסוך עשרות אלפי שקלים.',
		'סיכום: דירה שנייה = מס שבח מלא בכפוף להוצאות ולינארי.',
	],
};

export const FAQ_BY_SLUG = {
	'guy-avni-capital-gains-tax-assessment-appeal': [
		{ question: 'תוך כמה יום מגישים השגה?', answer: '30 יום ממועד מסירת הודעת השומה.' },
		{ question: 'אפשר על שומה עצמית?', answer: 'בדרך כלל לא; מסלול תיקון שומה.' },
		{ question: 'מה אם פספסתי מועד?', answer: 'ערר לוועדת ערר או בקשה לתיקון, בכפוף לעילה.' },
		{ question: 'חייבים עורך דין?', answer: 'לא חובה; מומלץ בשומות גבוהות.' },
	],
	'guy-avni-capital-gains-tax-evacuation-reconstruction': [
		{ question: 'מי משלם מס בפינוי בינוי?', answer: 'לפי חוזה ומבנה התמורה; לעיתים הדייר.' },
		{ question: 'יש פטור לדייר יחיד?', answer: 'ייתכן פטור 49ב בכפוף לתנאים.' },
		{ question: 'מתי נוצר אירוע מס?', answer: 'במימוש זכויות או בתמורה לפי העסקה.' },
		{ question: 'צריך שמאות?', answer: 'לרוב כן, לשווי זכויות לפני ואחרי.' },
	],
	'guy-avni-capital-gains-tax-installment-payment': [
		{ question: 'מה ההבדל מפריסת תשלומים?', answer: 'פריסת שבח משנה חבות; הסדר תשלומים רק גבייה.' },
		{ question: 'איזה טופס?', answer: 'טופס 7003 עם דוחות שנתיים.' },
		{ question: 'כמה שנים אחורה?', answer: 'עד 4 שנים או תקופת החזקה.' },
		{ question: 'האם אוטומטי?', answer: 'לא; יש להגיש בקשה מנומקת.' },
	],
	'guy-avni-capital-gains-tax-second-apartment': [
		{ question: 'מה שיעור המס?', answer: '25% ריאלי, 30% מעל תקרה.' },
		{ question: 'מס רכישה מקוזז?', answer: 'כהוצאה מוכרת בחישוב השבח.' },
		{ question: 'לינארי חל?', answer: 'לנכס שנרכש לפני 1.1.2014.' },
		{ question: 'מתי לדווח?', answer: 'טופס 4 תוך 30 יום ממכירה.' },
	],
};

function batchSpec(slug, partial) {
	const slugTopic = slug.replace(/^guy-avni-/, '').replace(/-/g, ' ');
	const lexicon = [slugTopic, ...(partial.topicLexicon ?? [])];
	const entry = {
		slug,
		...partial,
		topicLexicon: lexicon,
		uniqueParagraphs: UNIQUE_PARAS[slug] ?? [],
		ymyl: YMYL_SLUGS.has(slug) || partial.ymyl === true,
		buildBody() {
			return buildCompactBody(entry);
		},
	};
	return entry;
}

export const BATCH_MDX_SPECS = {
	'guy-avni-capital-gains-tax-assessment-appeal': batchSpec(
		'guy-avni-capital-gains-tax-assessment-appeal',
		{
			pillarAnchor: 'פטור מס רכישה ראשונה',
			blogAnchor: 'ערעור מול רשות המיסים',
			blogAnchor2: 'מס שבח דירה שנייה',
			blogAnchor3: 'פריסת מס שבח',
			title: 'גיא אבני עורך דין | השגה על שומת מס שבח: מדריך',
			description:
				'השגה על שומת מס שבח: טופס 7013, 30 יום, שומה עצמית מול למיטב השפיטה, ומה אחרי החלטת המנהל.',
			metaTitle: 'גיא אבני עורך דין | השגה על שומת מס שבח',
			metaDescription:
				'איך מגישים השגה על שומת מס שבח? 30 יום, טופס 7013 ונימוקים. גיא אבני עורך דין מסביר מועדים וערר.',
			mainKeyword: 'גיא אבני עורך דין',
			category: 'tax',
			tags: ['tax', 'capital-gains', 'appeal'],
			relatedBlogSlugs: [
				'guy-avni-purchase-tax-exemption-first-apartment',
				'guy-avni-tax-authority-appeal-process',
				'guy-avni-capital-gains-tax-second-apartment',
				'guy-avni-capital-gains-tax-installment-payment',
			],
			firstH2: 'מתי נפתחת זכות להשגה על שומת מס שבח',
			topicLexicon: ['השגה על שומה', 'טופס 7013', 'שומה למיטב השפיטה', 'מס שבח', 'ועדת ערר'],
			sectionBlueprints: [
				{ heading: 'שומה עצמית מול למיטב השפיטה', focus: 'מתי אפשר להשיג' },
				{ heading: 'מילוי טופס 7013', focus: 'נימוקים ואסמכתאות' },
				{ heading: 'מועדים קשיחים', focus: '30 יום וארכות' },
				{ heading: 'טעויות נפוצות', focus: 'בלבול בין השגה לערר' },
			],
			uniqueOpener:
				'השגה על שומת מס שבח נפתחת תוך 30 יום ממסירת שומה למיטב השפיטה; טופס 7013 ותיעוד מלא הם המפתח.',
			ymyl: true,
		},
	),
	'guy-avni-capital-gains-tax-evacuation-reconstruction': batchSpec(
		'guy-avni-capital-gains-tax-evacuation-reconstruction',
		{
			pillarAnchor: 'פטור מס רכישה ראשונה',
			blogAnchor: 'תמ"א 38 מול פינוי בינוי',
			blogAnchor2: 'משך פרויקט פינוי בינוי',
			blogAnchor3: 'פטור מס שבח דירה יחידה 2026',
			title: 'גיא אבני עורך דין | מס שבח בפרויקט פינוי בינוי',
			description:
				'מי משלם מס שבח בפינוי בינוי: פטורים, תנאים, מכירה לפני הריסה וחלוקת תמורה בין דייר ליזם.',
			metaTitle: 'גיא אבני עורך דין | מס שבח בפינוי בינוי',
			metaDescription:
				'מי משלם מס שבח בפינוי בינוי? פטור, תזמון ושווי זכויות. גיא אבני עורך דין מסביר לפני חתימה.',
			mainKeyword: 'גיא אבני עורך דין',
			category: 'tax',
			tags: ['tax', 'capital-gains', 'urban-renewal'],
			relatedBlogSlugs: [
				'guy-avni-purchase-tax-exemption-first-apartment',
				'guy-avni-tama38-vs-evacuation-reconstruction',
				'guy-avni-evacuation-reconstruction-project-duration',
				'guy-avni-capital-gains-exemption-single-apartment-2026',
			],
			firstH2: 'מי משלם מס שבח בפרויקט פינוי בינוי',
			topicLexicon: ['פינוי בינוי', 'מס שבח', 'דיירים', 'יזם', 'פטור דירה יחידה'],
			sectionBlueprints: [
				{ heading: 'מתי נוצרת חבות מס', focus: 'מימוש זכויות ותמורה' },
				{ heading: 'פטור דירה יחידה', focus: 'תנאי 49ב' },
				{ heading: 'חוזה והסכם דיירים', focus: 'חלוקת נטל' },
				{ heading: 'טעויות לפני חתימה', focus: 'תזמון ושמאות' },
			],
			uniqueOpener:
				'בפינוי בינוי מס שבח תלוי במבנה התמורה, בפטור דירה יחידה ובתזמון מימוש הזכויות.',
			ymyl: true,
		},
	),
	'guy-avni-capital-gains-tax-installment-payment': batchSpec(
		'guy-avni-capital-gains-tax-installment-payment',
		{
			pillarAnchor: 'פטור מס רכישה ראשונה',
			blogAnchor: 'מס שבח דירה שנייה',
			blogAnchor2: 'החישוב הלינארי המוטב',
			blogAnchor3: 'ערעור מול רשות המיסים',
			title: 'גיא אבני עורך דין | פריסת מס שבח: מדריך מעשי',
			description:
				'פריסת מס שבח (סעיף 48א) מול הסדר תשלומים: טופס 7003, דוחות שנתיים ומתי זה משתלם.',
			metaTitle: 'גיא אבני עורך דין | פריסת מס שבח',
			metaDescription:
				'איך מבקשים פריסת מס שבח? טופס 7003, עד 4 שנים אחורה. גיא אבני עורך דין מסביר הבדל מפריסת תשלומים.',
			mainKeyword: 'גיא אבני עורך דין',
			category: 'tax',
			tags: ['tax', 'capital-gains', 'installments'],
			relatedBlogSlugs: [
				'guy-avni-purchase-tax-exemption-first-apartment',
				'guy-avni-capital-gains-tax-second-apartment',
				'guy-avni-linear-capital-gains-tax-benefit',
				'guy-avni-tax-authority-appeal-process',
			],
			firstH2: 'פריסת מס שבח: לא אותו דבר כמו פריסת תשלומים',
			topicLexicon: ['פריסת מס שבח', 'טופס 7003', 'סעיף 48א', 'הסדר תשלומים', 'דוח שנתי'],
			sectionBlueprints: [
				{ heading: 'מתי פריסת שבח משתלמת', focus: 'חלוקה לשנים קודמות' },
				{ heading: 'הגשת טופס 7003', focus: 'דוחות 1301' },
				{ heading: 'הסדר תשלומים', focus: 'תזרים בלי שינוי חבות' },
				{ heading: 'טעויות נפוצות', focus: 'בלבול בין מנגנונים' },
			],
			uniqueOpener:
				'פריסת מס שבח לפי סעיף 48א מחלקת שבח לשנים קודמות; פריסת תשלומים היא רק הסדר גבייה.',
			ymyl: true,
		},
	),
	'guy-avni-capital-gains-tax-second-apartment': batchSpec(
		'guy-avni-capital-gains-tax-second-apartment',
		{
			pillarAnchor: 'פטור מס רכישה ראשונה',
			blogAnchor: 'החישוב הלינארי המוטב',
			blogAnchor2: 'חישוב מס רכישה דירה שנייה',
			blogAnchor3: 'פטור מס שבח דירה יחידה 2026',
			title: 'גיא אבני עורך דין | מס שבח על דירה שנייה',
			description:
				'חישוב מס שבח על דירה שנייה: 25% ריאלי, 30% מעל תקרה, הוצאות מוכרות ולינארי.',
			metaTitle: 'גיא אבני עורך דין | מס שבח דירה שנייה',
			metaDescription:
				'כמה מס שבח על דירה שנייה? חישוב, לינארי והוצאות. גיא אבני עורך דין מסביר לפני מכירה.',
			mainKeyword: 'גיא אבני עורך דין',
			category: 'tax',
			tags: ['tax', 'capital-gains', 'second-apartment'],
			relatedBlogSlugs: [
				'guy-avni-purchase-tax-exemption-first-apartment',
				'guy-avni-linear-capital-gains-tax-benefit',
				'guy-avni-second-apartment-purchase-tax-calculation',
				'guy-avni-capital-gains-exemption-single-apartment-2026',
			],
			firstH2: 'למה מכירת דירה שנייה ממוסה אחרת',
			topicLexicon: ['מס שבח', 'דירה שנייה', 'שבח ריאלי', 'לינארי', 'הוצאות מוכרות'],
			sectionBlueprints: [
				{ heading: 'נוסחת השבח והוצאות', focus: 'חישוב ריאלי' },
				{ heading: '25% מול 30%', focus: 'תקרת שבח' },
				{ heading: 'לינארי ומשפר דיור', focus: 'הטבות אפשריות' },
				{ heading: 'טעויות יקרות', focus: 'פטור יחידה שלא חל' },
			],
			uniqueOpener:
				'דירה שנייה אינה זכאית לפטור 49ב; מס שבח מחושב על שבח ריאלי עם 25% ו-30% מעל תקרה.',
			ymyl: true,
		},
	),
};
