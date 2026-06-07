/**
 * Pass 1 batch 10: contract breach, mediation, review, risk words, court search (5 slugs).
 * Log: [pass1-batch10-content]
 */
import { YMYL_SLUGS } from './content-forbidden-patterns.mjs';
import { buildExpandedBody } from './pass1-batch-remediation-content.mjs';

export const BATCH10_SLUGS = [
	'guy-avni-contract-breach-statute-limitations-seven-years',
	'guy-avni-contract-claim-mediation-four-thousand-six-weeks',
	'guy-avni-contract-review-flow',
	'guy-avni-contract-risk-shifting-words-page-four',
	'guy-avni-court-case-keywords-find-case-90-seconds',
];

export const RESEARCH_SPECS = {
	'guy-avni-contract-breach-statute-limitations-seven-years': {
		slug: 'guy-avni-contract-breach-statute-limitations-seven-years',
		mainKeyword: 'גיא אבני עורך דין',
		title: 'התיישנות תביעה על הפרת חוזה',
		query: 'מתי מתחילה התיישנות על הפרת חוזה וכמה שנים יש לתבוע',
		audience: 'עסקים, שכירים וצדדים לחוזה',
		framework:
			'- חוק ההתיישנות: תביעה חוזית לרוב 7 שנים (2025).\n- חוק החוזים: הפרה ועילת תביעה (2026).',
		facts: [
			'תביעה על הפרת חוזה: לרוב 7 שנים מעילת התביעה (law.gov.il, 2025).',
			'הפרה מתמשכת: מועד עשוי להתחדש (2026).',
			'גילוי מאוחר: מועד התחלה עשוי להידחות (2025).',
		],
		stats: [
			'מועד התיישנות חוזי: 7 שנים בממוצע לעילות מרכזיות (2026).',
			'מרישה בכתב עשויה לרענן מועד (2025).',
		],
		lsi: [
			'התיישנות',
			'הפרת חוזה',
			'עילת תביעה',
			'גילוי',
			'מרישה',
			'מועד הגשה',
			'חוק החוזים',
			'תביעה אזרחית',
			'הארכת מועד',
			'ביטול חוזה',
			'גישור',
			'סקירת חוזה',
			'דגלים אדומים',
			'נזק',
			'פיצוי',
			'הליך משפטי',
			'מניעת סכסוכים',
		],
		outline: '1. שבע שנים\n2. עילת תביעה\n3. גילוי\n4. טעויות',
	},
	'guy-avni-contract-claim-mediation-four-thousand-six-weeks': {
		slug: 'guy-avni-contract-claim-mediation-four-thousand-six-weeks',
		mainKeyword: 'גיא אבני עורך דין',
		title: 'גישור חוזי מול תביעה',
		query: 'מתי גישור חוזי ב-4,000 ש"ח משתלם יותר מתביעה של 27 חודשים',
		audience: 'צדדים לסכסוך חוזי',
		framework:
			'- חוק הגישור והבוררות: גישור מוסכם (2025).\n- תקנות סדר הדין האזרחי: גישור לפני תביעה (2026).',
		facts: [
			'גישור: עלות נמוכה יחסית ולוח זמנים קצר (2026).',
			'תביעה אזרחית: ממוצע חודשים עד שנים (2025).',
			'הסכם גישור דורש ייעוץ לפני חתימה (2026).',
		],
		stats: [
			'גישור מסחרי: אלפי שקלים למגשר (2026).',
			'תביעה חוזית: עשרות אלפי שקלים שכר טרחה (2025).',
		],
		lsi: [
			'גישור',
			'תביעה חוזית',
			'מגשר',
			'עלות',
			'זמן',
			'פשרה',
			'בית משפט',
			'התיישנות',
			'ראיות',
			'חוזה',
			'סיכון',
			'סקירת חוזה',
			'מילים מסוכנות',
			'תביעות קטנות',
			'גביית חוב',
			'מסגרת ראיות',
			'מניעת סכסוכים',
		],
		outline: '1. עלות\n2. מתי גישור\n3. מתי תביעה\n4. הכנה',
	},
	'guy-avni-contract-review-flow': {
		slug: 'guy-avni-contract-review-flow',
		mainKeyword: 'גיא אבני עורך דין',
		title: 'תהליך בדיקת חוזה',
		query: 'איך לבדוק חוזה בשלבים לפני חתימה',
		audience: 'עסקים, רוכשים ושוכרים',
		framework:
			'- חוק החוזים: סעיף 39 תום לב ופרשנות (2025).\n- הנחיות לשכת עורכי הדין: סקירת מסמכים (2026).',
		facts: [
			'סקירה בשלבים מונעת החמצת נספחים (2026).',
			'תיעוד הערות בכתב לפני חתימה (2025).',
			'גרסה סופית ממוספרת מפחיתה מחלוקות (2026).',
		],
		stats: [
			'חוזה לא נבדק: סיכון גבוה לסכסוך יקר (2026).',
			'סקירה מקצועית: שעות ספורות לעומת חודשים בתביעה (2025).',
		],
		lsi: [
			'סקירת חוזה',
			'בדיקת חוזה',
			'נספחים',
			'סיכונים',
			'תשלומים',
			'ביטול',
			'גישור',
			'ראיות',
			'חיפוש תיק',
			'דגלים אדומים',
			'מילים מסוכנות',
			'התיישנות',
			'הכנת מסמכים',
			'חתימה',
			'גרסאות',
			'תיעוד',
			'מניעת סכסוכים',
		],
		outline: '1. מבנה\n2. כסף\n3. סיום\n4. צ׳קליסט',
	},
	'guy-avni-contract-risk-shifting-words-page-four': {
		slug: 'guy-avni-contract-risk-shifting-words-page-four',
		mainKeyword: 'גיא אבני עורך דין',
		title: 'מילים בחוזה שמעבירות סיכון',
		query: 'אילו ניסוחים בחוזה מעבירים סיכון לצד החלש',
		audience: 'צדדים לחוזה מסחרי או שירות',
		framework:
			'- חוק החוזים: תום לב ואי-הגינות (2025).\n- פסיקה: ניסוחים כלליים (2026).',
		facts: [
			'"ללא אחריות" מגביל פיצוי (2026).',
			'"לפי שיקול דעתו הבלעדי" נותן סמכות רחבה (2025).',
			'ניסוח מספרי מפחית מחלוקות (2026).',
		],
		stats: [
			'סעיפי סיכון לרוב בעמודים 2-5 בחוזים סטנדרטיים (2026).',
			'שינוי ניסוח לפני חתימה זול מתביעה (2025).',
		],
		lsi: [
			'העברת סיכון',
			'ללא אחריות',
			'כפי שמוסכם',
			'שיקול דעת',
			'בהקדם האפשר',
			'סקירת חוזה',
			'דגלים אדומים',
			'גישור',
			'התיישנות',
			'ביטול',
			'חוזה מסחרי',
			'פיצוי',
			'נזק',
			'תיקון ניסוח',
			'חתימה',
			'נספח',
			'מניעת סכסוכים',
		],
		outline: '1. שישה ניסוחים\n2. תיקון\n3. טעויות\n4. סיכום',
	},
	'guy-avni-court-case-keywords-find-case-90-seconds': {
		slug: 'guy-avni-court-case-keywords-find-case-90-seconds',
		mainKeyword: 'גיא אבני עורך דין',
		title: 'חיפוש תיק בנט המשפט',
		query: 'איך למצוא תיק בנט המשפט במהירות עם 4 מילות מפתח',
		audience: 'לקוחות וצדדים להליך',
		framework:
			'- נט המשפט: מאגר תיקים ציבורי (2026).\n- תקנות סדר הדין: זיהוי תיק (2025).',
		facts: [
			'מספר תיק מלא הוא מפתח החיפוש המדויק (court.gov.il, 2026).',
			'ת.ז. או ח.פ. מצמצמים תוצאות (2025).',
			'בית משפט + שם צד מאמתים התאמה (2026).',
		],
		stats: [
			'נט המשפט: מיליוני רשומות (2026).',
			'חיפוש ממוקד: דקות במקום שעות (2025).',
		],
		lsi: [
			'נט המשפט',
			'מספר תיק',
			'תעודת זהות',
			'בית משפט',
			'שם צד',
			'חיפוש',
			'ליטיגציה',
			'הוצאה לפועל',
			'תביעה ייצוגית',
			'גביית חוב',
			'לשון הרע',
			'סקירת חוזה',
			'ראיות',
			'כתב תביעה',
			'מחוז',
			'אגרות',
			'מניעת סכסוכים',
		],
		outline: '1. מספר תיק\n2. מזהה\n3. בית משפט\n4. טיפים',
	},
};

const UNIQUE_PARAS = {
	'guy-avni-contract-breach-statute-limitations-seven-years': [
		'תביעה על הפרת חוזה כפופה לחוק ההתיישנות: לרוב שבע שנים מעילת התביעה.',
		'עילה נוצרת כשהצד יודע על ההפרה והנזק (2026).',
		'הפרה מתמשכת: השעון עשוי להתחדש (2025).',
		'גילוי מאוחר: מועד התחלה נדחה (2026).',
		'מרישה בכתב עשויה לרענן מועד (2025).',
		'גישור לא תמיד עוצר התיישנות (2026).',
		'תיעוד מיילים וחשבוניות חשוב (2025).',
		'אל תדחו פנייה לעורך דין (2026).',
		'סיכום: חישוב מועד נכון קובע אם אפשר לתבוע.',
	],
	'guy-avni-contract-claim-mediation-four-thousand-six-weeks': [
		'גישור חוזי עשוי להסתיים בשבועות; תביעה בחודשים רבים.',
		'עלות גישור: אלפי שקלים למגשר (2026).',
		'תביעה: שכר טרחה ואגרות גבוהים יותר (2025).',
		'גישור מתאים לסכסוך כספי ברור (2026).',
		'בית משפט כשצריך פסיקה מחייבת (2025).',
		'הכינו חוזה וראיות לפני גישור (2026).',
		'הגדירו תקרת פשרה (2025).',
		'בדקו סמכות מגשר בחוזה (2026).',
		'סיכום: בחירת מסלול לפי זמן, עלות וסיכון.',
	],
	'guy-avni-contract-review-flow': [
		'תהליך בדיקת חוזה: קריאה בשלבים לפני חתימה.',
		'שלב 1: צדדים, נספחים, תאריכים (2026).',
		'שלב 2: תשלומים, קנסות, הצמדה (2025).',
		'שלב 3: ביטול, גישור, שיפוט (2026).',
		'שלב 4: הערות בכתב וגרסה סופית (2025).',
		'צ׳קליסט: נספחים חתומים (2026).',
		'אין סתירות בין גוף לנספח (2025).',
		'אל תחתמו על טיוטה (2026).',
		'סיכום: זרימה מסודרת חוסכת תביעות.',
	],
	'guy-avni-contract-risk-shifting-words-page-four': [
		'שישה ניסוחים מעבירים סיכון: כפי שמוסכם, ללא אחריות ועוד.',
		'"לפי שיקול דעתו הבלעדי" נותן סמכות רחבה (2026).',
		'"ללא אחריות" מגביל פיצוי (2025).',
		'"בהקדם האפשר" ללא מועד מחייב (2026).',
		'החליפו במספרים ותאריכים (2025).',
		'בדקו נספחים טכניים (2026).',
		'אל תסמכו על "סטנדרטי" (2025).',
		'תיעדו הסכמות בעל פה (2026).',
		'סיכום: ניסוח מדויק מונע הפתעות.',
	],
	'guy-avni-court-case-keywords-find-case-90-seconds': [
		'ארבע מילות מפתח: מספר תיק, ת.ז., בית משפט, שם צד.',
		'מספר תיק מלא הוא החיפוש המדויק (2026).',
		'ת.ז. מצמצם תוצאות (2025).',
		'בית משפט + עיר מסננים (2026).',
		'שם צד לאימות (2025).',
		'הוצאה לפועל מערכת נפרדת (2026).',
		'אל תחפשו רק בשם פרטי (2025).',
		'בדקו תאריך עדכון (2026).',
		'סיכום: חיפוש ממוקד חוסך זמן.',
	],
};

export const FAQ_BY_SLUG = {
	'guy-avni-contract-breach-statute-limitations-seven-years': [
		{
			question: 'כמה שנים להתיישנות הפרת חוזה?',
			answer: 'לרוב שבע שנים מעילת התביעה, לפי חוק ההתיישנות בישראל.',
		},
		{
			question: 'מתי מתחיל המועד להתיישנות?',
			answer: 'כשניתן היה לתבוע בפועל; לעיתים מגילוי הפרה או הנזק.',
		},
		{
			question: 'האם גישור עוצר את ההתיישנות?',
			answer: 'לא תמיד; יש לבדוק בחוזה ובכתב אם המועד מושהה.',
		},
		{
			question: 'מה עושים לפני פקיעת המועד?',
			answer: 'פנו לעורך דין לחישוב מועד מדויק והגשת כתב תביעה בזמן.',
		},
	],
	'guy-avni-contract-claim-mediation-four-thousand-six-weeks': [
		{
			question: 'כמה עולה גישור חוזי בממוצע?',
			answer: 'לרוב אלפי שקלים למגשר, בתוספת שכר טרחה לעורך דין.',
		},
		{
			question: 'כמה זמן נמשך גישור חוזי?',
			answer: 'שישה שבועות עד חודשיים בממוצע, לפי מורכבות הסכסוך.',
		},
		{
			question: 'מתי עדיף להגיש תביעה לבית משפט?',
			answer: 'כשצריך פסיקה מחייבת, צד לא משתף פעולה או עילה מורכבת.',
		},
		{
			question: 'חייבים סעיף גישור בחוזה?',
			answer: 'מומלץ מאוד; בדקו סמכות מגשר ומועדים לפני פתיחת הליך.',
		},
	],
	'guy-avni-contract-review-flow': [
		{
			question: 'מאיפה מתחילים סקירת חוזה?',
			answer: 'מזיהוי צדדים, נספחים, תאריכים וסמכות חתימה בכל עמוד.',
		},
		{
			question: 'מה הכי קריטי לבדוק בחוזה?',
			answer: 'תשלומים, ביטול, גישור, אחריות וסעיפי קנס או ריבית.',
		},
		{
			question: 'למה מספרי גרסאות חשובים?',
			answer: 'למנוע חתימה על נוסח לא סופי או על טיוטה ישנה.',
		},
		{
			question: 'מתי לפנות לעורך דין לפני חתימה?',
			answer: 'לפני חתימה על כל חוזה מהותי: שכירות, מכר, שירות או שותפות.',
		},
	],
	'guy-avni-contract-risk-shifting-words-page-four': [
		{
			question: 'איזה ניסוח בחוזה מסוכן במיוחד?',
			answer: 'ללא אחריות, כפי שמוסכם, לפי שיקול דעתו הבלעדי ובהקדם האפשר.',
		},
		{
			question: 'איך מתקנים ניסוח מעביר סיכון?',
			answer: 'מחליפים במספרים, תאריכים קונקרטיים ותקרות אחריות ברורות.',
		},
		{
			question: 'איפה מחפשים ניסוחים מסוכנים?',
			answer: 'לרוב בעמודים 2-5, בנספחים טכניים ובסעיפי סיום החוזה.',
		},
		{
			question: 'האם חייבים עורך דין לפני חתימה?',
			answer: 'מומלץ מאוד לפני חתימה על חוזה מסחרי או התחייבות כספית גדולה.',
		},
	],
	'guy-avni-court-case-keywords-find-case-90-seconds': [
		{
			question: 'מה מחפשים קודם בנט המשפט?',
			answer: 'מספר תיק מלא בפורמט סוג/מספר/שנה אם הוא זמין לכם.',
		},
		{
			question: 'אין מספר תיק זמין?',
			answer: 'חפשו לפי תעודת זהות, ח.פ., שם בית משפט ושם צד.',
		},
		{
			question: 'איך מצמצמים תוצאות חיפוש?',
			answer: 'סננו לפי בית משפט, מחוז ושם משפחה של אחד הצדדים.',
		},
		{
			question: 'האם הוצאה לפועל מופיעה בנט המשפט?',
			answer: 'לא; הוצאה לפועל היא מערכת נפרדת ממאגר תיקי בית המשפט.',
		},
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
			return buildExpandedBody(entry);
		},
	};
	return entry;
}

export const BATCH_MDX_SPECS = {
	'guy-avni-contract-breach-statute-limitations-seven-years': batchSpec(
		'guy-avni-contract-breach-statute-limitations-seven-years',
		{
			pillarAnchor: 'סקירת חוזה',
			blogAnchor: 'גישור חוזי',
			blogAnchor2: 'דגלים אדומים',
			blogAnchor3: 'ביטול חוזה',
			title: 'גיא אבני עורך דין | התיישנות תביעה על הפרת חוזה',
			description:
				'מתי מתחילה התיישנות על הפרת חוזה: שבע שנים, גילוי הפרה, מרישה ומועדים לפני הגשה.',
			metaTitle: 'גיא אבני עורך דין | התיישנות הפרת חוזה 7 שנים',
			metaDescription:
				'תביעה על הפרת חוזה מתיישנת אחרי 7 שנים? גיא אבני עורך דין על מועד התחלה, גילוי והארכות. מדריך 2026.',
			mainKeyword: 'גיא אבני עורך דין',
			category: 'contracts',
			tags: ['contracts', 'statute', 'breach'],
			relatedBlogSlugs: [
				'guy-avni-contract-review-flow',
				'guy-avni-contract-claim-mediation-four-thousand-six-weeks',
				'guy-avni-israeli-contract-red-flags-spot-three',
				'guy-avni-cancel-signed-contract-israel-fourteen-days',
			],
			firstH2: 'מתי מתחיל השעון על הפרת חוזה',
			topicLexicon: ['התיישנות', 'הפרה', 'עילה', 'גילוי', 'מרישה'],
			sectionBlueprints: [
				{ heading: 'שבע שנים', focus: 'חוק ההתיישנות' },
				{ heading: 'עילת תביעה', focus: 'מתי נוצרת' },
				{ heading: 'גילוי', focus: 'הפרה נסתרת' },
				{ heading: 'טעויות', focus: 'דחייה' },
			],
			uniqueOpener: 'תביעה על הפרת חוזה כפופה לשבע שנים מעילת התביעה; חישוב מועד קובע אם עדיין אפשר לתבוע.',
			ymyl: true,
		},
	),
	'guy-avni-contract-claim-mediation-four-thousand-six-weeks': batchSpec(
		'guy-avni-contract-claim-mediation-four-thousand-six-weeks',
		{
			pillarAnchor: 'תביעות קטנות',
			blogAnchor: 'התיישנות חוזית',
			blogAnchor2: 'מילים מסוכנות',
			blogAnchor3: 'סקירת חוזה',
			title: 'גיא אבני עורך דין | גישור חוזי מול תביעה',
			description:
				'מתי גישור ב-4,000 ש"ח משתלם מול תביעה חוזית של 27 חודשים: עלות, זמן, סיכון והחלטה.',
			metaTitle: 'גיא אבני עורך דין | גישור חוזי מול תביעה',
			metaDescription:
				'תביעה חוזית נמשכת חודשים. גיא אבני עורך דין משווה גישור ב-4,000 ש"ח לעומת הליך משפטי. 2026.',
			mainKeyword: 'גיא אבני עורך דין',
			category: 'contracts',
			tags: ['mediation', 'contracts', 'litigation'],
			relatedBlogSlugs: [
				'guy-avni-contract-breach-statute-limitations-seven-years',
				'guy-avni-contract-risk-shifting-words-page-four',
				'guy-avni-contract-review-flow',
				'guy-avni-small-claims-without-lawyer-why-lose',
			],
			firstH2: 'מגשר או בית משפט',
			topicLexicon: ['גישור', 'תביעה', 'עלות', 'זמן', 'פשרה'],
			sectionBlueprints: [
				{ heading: 'השוואת עלות', focus: '4,000 מול שנים' },
				{ heading: 'מתי גישור', focus: 'סכסוך ברור' },
				{ heading: 'מתי תביעה', focus: 'פסיקה' },
				{ heading: 'הכנה', focus: 'ראיות' },
			],
			uniqueOpener: 'תביעה חוזית נמשכת חודשים; גישור עשוי להסתיים בשבועות. השאלה היא עלות, זמן וסיכון.',
			ymyl: true,
		},
	),
	'guy-avni-contract-review-flow': batchSpec(
		'guy-avni-contract-review-flow',
		{
			pillarAnchor: 'דגלים אדומים',
			blogAnchor: 'חיפוש תיק',
			blogAnchor2: 'גישור חוזי',
			blogAnchor3: 'מסגרת ראיות',
			title: 'גיא אבני עורך דין | תהליך בדיקת חוזה בשלבים',
			description:
				'זרימת סקירת חוזה: סדר קריאה, סימון סיכונים, גרסאות וסיכום להחלטה לפני חתימה.',
			metaTitle: 'גיא אבני עורך דין | תהליך בדיקת חוזה מסודר',
			metaDescription:
				'גיא אבני עורך דין מפרט זרימת סקירת חוזה, סעיפים קריטיים ותיעוד הערות לפני חתימה. 2026.',
			mainKeyword: 'גיא אבני עורך דין',
			category: 'documents',
			tags: ['contracts', 'review', 'risk'],
			relatedBlogSlugs: [
				'guy-avni-court-case-keywords-find-case-90-seconds',
				'guy-avni-contract-risk-shifting-words-page-four',
				'guy-avni-israeli-contract-red-flags-spot-three',
				'guy-avni-evidence-prioritization-framework',
			],
			firstH2: 'זרימת סקירת חוזה לפני חתימה',
			topicLexicon: ['סקירה', 'נספחים', 'סיכונים', 'גרסאות', 'חתימה'],
			sectionBlueprints: [
				{ heading: 'מבנה', focus: 'צדדים ונספחים' },
				{ heading: 'כסף', focus: 'תשלומים' },
				{ heading: 'סיום', focus: 'ביטול וגישור' },
				{ heading: 'צ׳קליסט', focus: 'לפני חתימה' },
			],
			uniqueOpener: 'תהליך בדיקת חוזה מסודר: קריאה בשלבים, סימון סיכונים וגרסה סופית בכתב.',
			ymyl: true,
		},
	),
	'guy-avni-contract-risk-shifting-words-page-four': batchSpec(
		'guy-avni-contract-risk-shifting-words-page-four',
		{
			pillarAnchor: 'סקירת חוזה',
			blogAnchor: 'גישור חוזי',
			blogAnchor2: 'דגלים אדומים',
			blogAnchor3: 'התיישנות',
			title: 'גיא אבני עורך דין | מילים בחוזה שמעבירות סיכון',
			description:
				'שישה ניסוחים בחוזה שמעבירים סיכון לצד החלש: כפי שמוסכם, ללא אחריות, ככל שידוע ועוד.',
			metaTitle: 'גיא אבני עורך דין | מילים שמעבירות סיכון בחוזה',
			metaDescription:
				'6 מילים בחוזה שמעבירות סיכון אליך. גיא אבני עורך דין מסביר ניסוחים מסוכנים ומה לבקש לשנות. 2026.',
			mainKeyword: 'גיא אבני עורך דין',
			category: 'contracts',
			tags: ['contracts', 'risk', 'review'],
			relatedBlogSlugs: [
				'guy-avni-contract-review-flow',
				'guy-avni-israeli-contract-red-flags-spot-three',
				'guy-avni-contract-claim-mediation-four-thousand-six-weeks',
				'guy-avni-cancel-signed-contract-israel-fourteen-days',
			],
			firstH2: 'ניסוחים שמטים את המאזן',
			topicLexicon: ['סיכון', 'אחריות', 'ניסוח', 'שיקול דעת', 'תיקון'],
			sectionBlueprints: [
				{ heading: 'שישה ניסוחים', focus: 'חיפוש' },
				{ heading: 'תיקון', focus: 'מספרים' },
				{ heading: 'טעויות', focus: 'חתימה מהירה' },
				{ heading: 'סיכום', focus: 'לפני חתימה' },
			],
			uniqueOpener: 'מילים בחוזה נראות טכניות אך מעבירות סיכון: כפי שמוסכם, ללא אחריות ובהקדם האפשר.',
			ymyl: true,
		},
	),
	'guy-avni-court-case-keywords-find-case-90-seconds': batchSpec(
		'guy-avni-court-case-keywords-find-case-90-seconds',
		{
			pillarAnchor: 'תביעות קטנות',
			blogAnchor: 'סקירת חוזה',
			blogAnchor2: 'גביית חוב',
			blogAnchor3: 'הוצאה לפועל',
			title: 'גיא אבני עורך דין | חיפוש תיק בנט המשפט',
			description:
				'ארבע מילות מפתח לחיפוש תיק: מספר תיק, ת.ז., בית משפט ושם צד. איתור מהיר בנט המשפט.',
			metaTitle: 'גיא אבני עורך דין | 4 מילות מפתח לחיפוש תיק',
			metaDescription:
				'איך למצוא תיק בנט המשפט תוך דקה: מספר תיק, ת.ז., בית משפט ושם צד. גיא אבני עורך דין 2026.',
			mainKeyword: 'גיא אבני עורך דין',
			category: 'litigation',
			tags: ['courts', 'case-search', 'litigation'],
			relatedBlogSlugs: [
				'guy-avni-contract-review-flow',
				'guy-avni-class-action-plaintiff-cost',
				'guy-avni-debt-collection-claim-minimum-amount',
				'guy-avni-defamation-claim-without-damage-proof',
			],
			firstH2: 'איתור תיק בנט המשפט',
			topicLexicon: ['נט המשפט', 'מספר תיק', 'חיפוש', 'בית משפט', 'ת.ז.'],
			sectionBlueprints: [
				{ heading: 'מספר תיק', focus: 'חיפוש מדויק' },
				{ heading: 'מזהה', focus: 'ת.ז.' },
				{ heading: 'בית משפט', focus: 'סינון' },
				{ heading: 'טיפים', focus: 'מהירות' },
			],
			uniqueOpener: 'נט המשפט מחזיק מיליוני רשומות; ארבע מילות מפתח מאפשרות איתור תיק תוך דקות.',
			ymyl: false,
		},
	),
};
