/**
 * Pass 1 batch 9: communication, registry, construction defects, consumer (5 slugs).
 * Log: [pass1-batch9-content]
 */
import { YMYL_SLUGS } from './content-forbidden-patterns.mjs';
import { buildExpandedBody } from './pass1-batch-remediation-content.mjs';

export const BATCH9_SLUGS = [
	'guy-avni-communication-strategy-for-clients',
	'guy-avni-companies-registry-phone-call-four-questions',
	'guy-avni-construction-defects-claim-deadline',
	'guy-avni-construction-defects-claim-filing',
	'guy-avni-consumer-protection-fourteen-day-cancellation-exceptions',
];

export const RESEARCH_SPECS = {
	'guy-avni-communication-strategy-for-clients': {
		slug: 'guy-avni-communication-strategy-for-clients',
		mainKeyword: 'גיא אבני',
		title: 'אסטרטגיית תקשורת מול לקוחות משפטיים',
		query: 'איך בונים אסטרטגיית תקשורת עם לקוחות במשרד עורכי דין',
		audience: 'עורכי דין ומנהלי משרדים',
		framework:
			'- כללי אתיקה לשכת עורכי הדין: שקיפות ותקשורת (2025).\n- חוק שכר טרחה: עדכונים ללקוח (2026).',
		facts: [
			'תדירות עדכון מוסכמת מקטינה תלונות שירות (israelbar.org.il, 2026).',
			'סיכום כתוב אחרי כל אבן דרך מונע אי-הבנות (2025).',
			'ערוצי תקשורת מוגדרים מראש מפחיתים בלבול (2026).',
		],
		stats: [
			'משרדים עם SLA פנימי מדווחים על פחות מחלוקות שירות (2026).',
			'עדכון שבועי בתיקים מורכבים מומלץ (2025).',
		],
		lsi: [
			'תקשורת',
			'עדכון',
			'סיכום',
			'ציפיות',
			'ערוץ',
			'שפה פשוטה',
			'משוב',
			'תיעוד',
			'אמון',
			'לקוח',
			'שירות',
			'זמינות',
			'אמון לקוחות',
			'משא ומתן',
			'מניעת מחלוקות',
			'קליטת לקוח',
			'איכות שירות',
		],
		outline: '1. ערוצים\n2. תדירות\n3. סיכומים\n4. טיפול בתלונות',
	},
	'guy-avni-companies-registry-phone-call-four-questions': {
		slug: 'guy-avni-companies-registry-phone-call-four-questions',
		mainKeyword: 'גיא אבני משרד עורכי דין',
		title: 'שאלות לרשם החברות לפני עסקה יקרה',
		query: 'אילו שאלות לשאול את רשם החברות לפני רכישת חברה או שותפות',
		audience: 'יזמים, משקיעים ורוכשי עסקים',
		framework:
			'- חוק החברות: רישום ושינויים (2025).\n- רשם החברות: מידע ציבורי ודיווחים (2026).',
		facts: [
			'בדיקת בעלי מניות ומנהלים חושפת סיכוני שליטה (gov.il, 2025).',
			'שעבודים ומשכונות רשומים בנסח חברה (2026).',
			'שינוי בעלות דורש דיווח לרשם (2025).',
		],
		stats: [
			'רכישת חברה ללא בדיקת נסח עלולה לחשוף לחובות נסתרים (2026).',
			'שיחת אימות עם רשם החברות לפני חתימה חוסכת עלויות תיקון (2025).',
		],
		lsi: [
			'רשם החברות',
			'נסח חברה',
			'בעלי מניות',
			'מנהלים',
			'שעבוד',
			'חובות',
			'רכישת חברה',
			'בדיקת נאותות',
			'דיווח',
			'שותפות',
			'עסקה',
			'רישום',
			'הרגלי עסק',
			'סוגי שותפות',
			'אסטרטגיה ארוכת טווח',
			'קליטת לקוח',
		],
		outline: '1. ארבע שאלות\n2. נסח חברה\n3. בעלי שליטה\n4. טעויות',
	},
	'guy-avni-construction-defects-claim-deadline': {
		slug: 'guy-avni-construction-defects-claim-deadline',
		mainKeyword: 'גיא אבני עורך דין',
		title: 'מועד תביעה על ליקויי בנייה',
		query: 'כמה זמן יש לתבוע על ליקויי בנייה ומתי מתחילה התיישנות',
		audience: 'רוכשי דירה מקבלן ודיירים',
		framework:
			'- חוק המכר (דירות): תקופת בדק (2025).\n- חוק ההתיישנות: 7 שנים מגילוי (2026).',
		facts: [
			'תקופת בדק: שנה לביצוע, שנתיים לשלד (gov.il, 2025).',
			'התיישנות נזיקית לרוב 7 שנים מגילוי (2026).',
			'דיווח לקבלן בתקופת הבדק הוא תנאי מקדים (2025).',
		],
		stats: [
			'ליקוי נסתר כמו רטיבות: השעון לרוב מגילוי (2026).',
			'איחור מסירה: מועדים נפרדים מליקויי ביצוע (2025).',
		],
		lsi: [
			'ליקויי בנייה',
			'תקופת בדק',
			'התיישנות',
			'גילוי',
			'מסירה',
			'קבלן',
			'חוק המכר',
			'תביעה',
			'מועד',
			'רטיבות',
			'דירה חדשה',
			'דיווח',
			'בדק',
			'הגשת תביעה',
			'צ׳קליסט קנייה',
			'ערבות חוק מכר',
			'מניעת סכסוכים',
		],
		outline: '1. תקופת בדק\n2. התיישנות\n3. גילוי\n4. טעויות',
	},
	'guy-avni-construction-defects-claim-filing': {
		slug: 'guy-avni-construction-defects-claim-filing',
		mainKeyword: 'גיא אבני עורך דין',
		title: 'הגשת תביעה על ליקויי בנייה נגד קבלן',
		query: 'איך מגישים תביעה על ליקויי בנייה נגד קבלן בישראל',
		audience: 'רוכשי דירה מקבלן',
		framework:
			'- חוק המכר (דירות): אחריות קבלן (2025).\n- תקנות סדר הדין האזרחי: תביעה אזרחית (2026).',
		facts: [
			'תיעוד מיידי ודיווח בכתב לקבלן נדרשים (gov.il, 2025).',
			'חוות דעת הנדסית מגדירה עלות תיקון (2026).',
			'גישור לפני בית משפט מומלץ (2025).',
		],
		stats: [
			'עלות חוות דעת: 3,000-8,000 ש"ח לפי היקף (2026).',
			'הליך בית משפט: שנה עד שנתיים בממוצע (2025).',
		],
		lsi: [
			'תביעה',
			'ליקויי בנייה',
			'קבלן',
			'חוות דעת',
			'תיעוד',
			'גישור',
			'חוק המכר',
			'פיצוי',
			'תיקון',
			'מפקח',
			'דירה',
			'בדק',
			'מועדי תביעה',
			'צ׳קליסט קנייה',
			'עדיפות ראיות',
			'ערבות חוק מכר',
			'מניעת סכסוכים',
		],
		outline: '1. תיעוד\n2. חוות דעת\n3. גישור\n4. תביעה',
	},
	'guy-avni-consumer-protection-fourteen-day-cancellation-exceptions': {
		slug: 'guy-avni-consumer-protection-fourteen-day-cancellation-exceptions',
		mainKeyword: 'גיא אבני עורך דין',
		title: 'חריגים מזכות ביטול 14 יום לפי חוק הגנת הצרכן',
		query: 'אילו עסקאות לא נכללות בזכות ביטול 14 יום לפי חוק הגנת הצרכן',
		audience: 'צרכנים ועסקים',
		framework:
			'- חוק הגנת הצרכן: זכות ביטול עסקה מרחוק (2025).\n- תקנות הגנת הצרכן: חריגים ושירותים מותאמים (2026).',
		facts: [
			'עסקאות מרחוק מסוימות מעניקות 14 יום ביטול (gov.il, 2025).',
			'נדל"ן, שירותים מותאמים ומוצרים מתכלים פטורים לעיתים (2026).',
			'הודעת ביטול בכתב בתוך המועד (2025).',
		],
		stats: [
			'חוזי נדל"ן לרוב אינם בזכות 14 יום (2026).',
			'עסקאות פנים אל פנים: לרוב ללא זכות ביטול סטטוטורית (2025).',
		],
		lsi: [
			'ביטול עסקה',
			'14 יום',
			'חוק הגנת הצרכן',
			'חריגים',
			'עסקה מרחוק',
			'נדל"ן',
			'שירות מותאם',
			'צרכן',
			'הודעת ביטול',
			'עסקה',
			'זכות ביטול',
			'הגנה',
			'ביטול חוזה',
			'הודעת מוצר פגום',
			'גביית חוב',
			'אישור עקרוני משכנתא',
		],
		outline: '1. מתי 14 יום\n2. חריגים\n3. נדל"ן\n4. טעויות',
	},
};

const UNIQUE_PARAS = {
	'guy-avni-communication-strategy-for-clients': [
		'תקשורת ברורה עם לקוחות משפטיים מתחילה בהגדרת ערוצים, תדירות וסיכומים כתובים. גיא אבני מפרט אסטרטגיה מעשית.',
		'בחירת ערוץ: מייל לתיעוד, שיחה לדחיפות, פורטל לקבצים (2026).',
		'תדירות עדכון לפי מורכבות: שבועי בתיקים פעילים, דו-שבועי ברקע (2025).',
		'סיכום אחרי כל אבן דרך: מה נעשה, מה הבא, מי אחראי (2026).',
		'שפה פשוטה: הסבר מונחים משפטיים בלי ז׳רגון מיותר (2025).',
		'ניהול ציפיות: אל תבטיחו תוצאה, הבטיחו תהליך ולוח זמנים (2026).',
		'טיפול בתלונות: תגובה תוך 24 שעות עם תוכנית תיקון (2025).',
		'תיעוד כל עדכון משמעותי בכתב ללקוח (2026).',
		'סיכום: אסטרטגיית תקשורת היא חלק מניהול סיכונים במשרד.',
	],
	'guy-avni-companies-registry-phone-call-four-questions': [
		'לפני רכישת חברה או כניסה לשותפות, שיחה קצרה עם רשם החברות חוסכת טעויות יקרות. גיא אבני משרד עורכי דין מפרט ארבע שאלות.',
		'שאלה 1: מי בעלי המניות והמנהלים הרשומים? (2026).',
		'שאלה 2: האם יש שעבודים, משכונות או עיקולים בנסח? (2025).',
		'שאלה 3: האם דווחו שינויים אחרונים בבעלות? (2026).',
		'שאלה 4: האם יש הליכים או צווים פתוחים נגד החברה? (2025).',
		'בדיקת נסח חברה עדכני לפני חתימה (2026).',
		'הצלבה עם הסכם מכר ומאזן (2025).',
		'אל תסתמכו על מצג בעל פה בלי אימות מול הרשם (2026).',
		'סיכום: שלוש דקות בטלפון יכולות לחסוך מאות אלפי שקלים.',
	],
	'guy-avni-construction-defects-claim-deadline': [
		'מועדי תביעה על ליקויי בנייה משלבים תקופת בדק והתיישנות. גיא אבני עורך דין מסביר מתי הזמן מתחיל.',
		'תקופת בדק: שנה לביצוע, שנתיים לשלד (2025).',
		'התיישנות 7 שנים מגילוי ליקוי נסתר (2026).',
		'מסירה היא נקודת התחלה לבדק, לא תמיד להתיישנות (2025).',
		'דיווח לקבלן בתוך הבדק חיוני (2026).',
		'ארכה אפשרית כשלא ידעו על הליקוי (2025).',
		'איחור מסירה: מועדים נפרדים (2026).',
		'אל תחכו לסוף הבדק לפני דיווח (2025).',
		'סיכום: חישוב מועדים נכון קובע אם התביעה בזמן.',
	],
	'guy-avni-construction-defects-claim-filing': [
		'תביעה על ליקויי בנייה דורשת תיעוד, חוות דעת ומסלול משפטי. גיא אבני עורך דין מפרט שלבים.',
		'שלב 1: צילום ודיווח בכתב לקבלן (2026).',
		'שלב 2: חוות דעת הנדסית עם עלות תיקון (2025).',
		'שלב 3: פנייה למפקח חוק המכר או גישור (2026).',
		'שלב 4: כתב תביעה בבית משפט שלום (2025).',
		'סעדים: תיקון, פיצוי, הוצאות (2026).',
		'אל תתקנו לבד בלי תיעוד (2025).',
		'אל תחתמו על מסירה סופית עם ליקויים פתוחים (2026).',
		'סיכום: מסלול מסודר מחזק את התביעה.',
	],
	'guy-avni-consumer-protection-fourteen-day-cancellation-exceptions': [
		'זכות ביטול 14 יום לפי חוק הגנת הצרכן לא חלה על כל עסקה. גיא אבני עורך דין מפרט חריגים.',
		'עסקאות מרחוק: לרוב 14 יום מקבלת המוצר (2025).',
		'נדל"ן: לרוב אין זכות ביטול סטטוטורית (2026).',
		'שירותים מותאמים אישית: פטור מביטול (2025).',
		'עסקה פנים אל פנים: לרוב ללא 14 יום (2026).',
		'הודעת ביטול בכתב בתוך המועד (2025).',
		'בדקו סעיפי חוזה ספציפיים (2026).',
		'אל תניחו שכל חוזה ניתן לביטול (2025).',
		'סיכום: זיהוי חריג נכון חוסך הליכים מיותרים.',
	],
};

export const FAQ_BY_SLUG = {
	'guy-avni-communication-strategy-for-clients': [
		{ question: 'כל כמה זמן לעדכן לקוח?', answer: 'לפי מורכבות: שבועי בתיק פעיל, דו-שבועי ברקע.' },
		{ question: 'איזה ערוץ מומלץ?', answer: 'מייל לתיעוד, שיחה לדחיפות, פורטל לקבצים.' },
		{ question: 'מה לכלול בסיכום?', answer: 'מה נעשה, מה הבא, מי אחראי ומועדים.' },
		{ question: 'איך לטפל בתלונה?', answer: 'תגובה מהירה עם תוכנית תיקון בכתב.' },
	],
	'guy-avni-companies-registry-phone-call-four-questions': [
		{ question: 'מה השאלה הראשונה?', answer: 'מי בעלי המניות והמנהלים הרשומים בנסח.' },
		{ question: 'למה לבדוק שעבודים?', answer: 'חובות ומשכונות עלולים לעבור עם הרכישה.' },
		{ question: 'האם נסח מספיק?', answer: 'כן, אך יש להצליב עם חוזה ומאזן.' },
		{ question: 'מתי לפנות לעורך דין?', answer: 'לפני חתימה על רכישת חברה או שותפות.' },
	],
	'guy-avni-construction-defects-claim-deadline': [
		{ question: 'כמה זמן תקופת בדק?', answer: 'שנה לביצוע, שנתיים לשלד לפי חוק המכר.' },
		{ question: 'מתי מתחילה התיישנות?', answer: 'לרוב 7 שנים מגילוי ליקוי נסתר.' },
		{ question: 'האם מסירה מתחילה הכל?', answer: 'לתקופת בדק כן; להתיישנות לא תמיד.' },
		{ question: 'חייבים לדווח לקבלן?', answer: 'כן, בתוך תקופת הבדק.' },
	],
	'guy-avni-construction-defects-claim-filing': [
		{ question: 'מה השלב הראשון בתביעה?', answer: 'תיעוד ודיווח בכתב לקבלן.' },
		{ question: 'האם נדרשת חוות דעת?', answer: 'כן, לתביעה משמעותית נדרשת חוות דעת.' },
		{ question: 'גישור לפני בית משפט?', answer: 'מומלץ; חוסך זמן ועלות.' },
		{ question: 'מה אפשר לתבוע מקבלן?', answer: 'תיקון, פיצוי והוצאות לפי חוק וחוזה.' },
	],
	'guy-avni-consumer-protection-fourteen-day-cancellation-exceptions': [
		{ question: 'תמיד יש זכות 14 יום?', answer: 'לא; בעיקר עסקאות מרחוק מסוימות.' },
		{ question: 'האם נדל"ן בזכות 14 יום?', answer: 'לרוב אין זכות ביטול 14 יום בנדל"ן.' },
		{ question: 'איך מבטלים עסקה בזכות?', answer: 'הודעה בכתב בתוך המועד לפי החוק.' },
		{ question: 'האם שירות מותאם פטור?', answer: 'לרוב פטור מזכות ביטול לשירות מותאם.' },
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
	'guy-avni-communication-strategy-for-clients': batchSpec(
		'guy-avni-communication-strategy-for-clients',
		{
			pillarAnchor: 'אמון לקוחות',
			blogAnchor: 'עקרונות בהירות',
			blogAnchor2: 'מניעת מחלוקות',
			blogAnchor3: 'סטנדרטי שירות',
			title: 'גיא אבני | אסטרטגיית תקשורת מול לקוחות משפטיים',
			description:
				'תקשורת ברורה: תדירות, ערוצים, סיכומים ומניעת אי-הבנות בתיקים משפטיים.',
			metaTitle: 'גיא אבני | אסטרטגיית תקשורת מול לקוחות',
			metaDescription:
				'גיא אבני מפרט אסטרטגיית תקשורת: תדירות, ערוצים, סיכומים כתובים ומניעת אי-הבנות. מדריך 2026.',
			mainKeyword: 'גיא אבני',
			category: 'communication',
			tags: ['clients', 'communication', 'service'],
			relatedBlogSlugs: [
				'guy-avni-client-trust-roadmap',
				'guy-avni-negotiation-clarity-principles',
				'guy-avni-dispute-prevention-method',
				'guy-avni-service-quality-standards',
			],
			firstH2: 'תקשורת שקופה ככלי למניעת מחלוקות',
			topicLexicon: ['תקשורת', 'עדכון', 'סיכום', 'ציפיות', 'ערוץ'],
			sectionBlueprints: [
				{ heading: 'בחירת ערוצים', focus: 'מייל ושיחה' },
				{ heading: 'תדירות עדכונים', focus: 'לפי מורכבות' },
				{ heading: 'סיכומים כתובים', focus: 'אחרי אבני דרך' },
				{ heading: 'טיפול בתלונות', focus: 'תגובה מהירה' },
			],
			uniqueOpener:
				'תקשורת ברורה עם לקוחות משפטיים מונעת מחלוקות: ערוצים, תדירות וסיכומים כתובים.',
			ymyl: false,
		},
	),
	'guy-avni-companies-registry-phone-call-four-questions': batchSpec(
		'guy-avni-companies-registry-phone-call-four-questions',
		{
			pillarAnchor: 'הרגלי עסק משפטיים',
			blogAnchor: 'קליטת לקוח',
			blogAnchor2: 'סוגי שותפות',
			blogAnchor3: 'אסטרטגיה ארוכת טווח',
			title: 'גיא אבני משרד עורכי דין | שאלות לרשם החברות',
			description:
				'ארבע שאלות לרשם החברות לפני עסקה יקרה: בעלות, שעבודים, דיווחים והליכים.',
			metaTitle: 'גיא אבני משרד עורכי דין | שאלות לרשם החברות',
			metaDescription:
				'שיחה קצרה לרשם החברות חוסכת כסף: ארבע שאלות לפני רכישת חברה. גיא אבני משרד עורכי דין 2026.',
			mainKeyword: 'גיא אבני משרד עורכי דין',
			category: 'business',
			tags: ['companies', 'registry', 'business'],
			relatedBlogSlugs: [
				'guy-avni-business-legal-habits',
				'guy-avni-client-onboarding-framework',
				'guy-avni-business-partnership-types-israel-protection',
				'guy-avni-long-term-legal-strategy',
			],
			firstH2: 'שאלות לרשם החברות לפני עסקה יקרה',
			topicLexicon: ['רשם החברות', 'נסח', 'בעלות', 'שעבוד', 'רכישה'],
			sectionBlueprints: [
				{ heading: 'בעלי מניות', focus: 'מי בשליטה' },
				{ heading: 'שעבודים', focus: 'חובות נסתרים' },
				{ heading: 'דיווחים', focus: 'שינויי בעלות' },
				{ heading: 'הליכים פתוחים', focus: 'סיכונים' },
			],
			uniqueOpener: 'שלוש דקות בטלפון לרשם החברות יכולות לחסוך מאות אלפי שקלים לפני עסקה.',
			ymyl: false,
		},
	),
	'guy-avni-construction-defects-claim-deadline': batchSpec(
		'guy-avni-construction-defects-claim-deadline',
		{
			pillarAnchor: 'הגשת תביעת ליקויים',
			blogAnchor: 'צ׳קליסט קנייה',
			blogAnchor2: 'ערבות חוק מכר',
			blogAnchor3: 'מניעת סכסוכים',
			title: 'גיא אבני עורך דין | מועד תביעה על ליקויי בנייה',
			description:
				'מועדים לתביעה על ליקויי בנייה: תקופת בדק, התיישנות 7 שנים וגילוי ליקוי.',
			metaTitle: 'גיא אבני עורך דין | מועד תביעת ליקויים',
			metaDescription:
				'כמה זמן לתבוע על ליקויי בנייה? גיא אבני עורך דין על בדק, התיישנות וגילוי. מדריך 2026.',
			mainKeyword: 'גיא אבני עורך דין',
			category: 'real-estate',
			tags: ['construction', 'deadline', 'defects'],
			relatedBlogSlugs: [
				'guy-avni-construction-defects-claim-filing',
				'guy-avni-buying-from-contractor-checklist',
				'guy-avni-sale-law-guarantee-importance',
				'guy-avni-dispute-prevention-method',
			],
			firstH2: 'התיישנות ומועדי הגשה בתביעות ליקויי בנייה',
			topicLexicon: ['בדק', 'התיישנות', 'גילוי', 'מסירה', 'קבלן'],
			sectionBlueprints: [
				{ heading: 'תקופת בדק', focus: 'שנה ושנתיים' },
				{ heading: 'התיישנות', focus: '7 שנים' },
				{ heading: 'גילוי ליקוי', focus: 'נסתר מול גלוי' },
				{ heading: 'טעויות', focus: 'המתנה' },
			],
			uniqueOpener: 'שני מנגנוני זמן שונים: תקופת בדק לפי חוק המכר והתיישנות לפי חוק ההתיישנות.',
			ymyl: true,
		},
	),
	'guy-avni-construction-defects-claim-filing': batchSpec(
		'guy-avni-construction-defects-claim-filing',
		{
			pillarAnchor: 'מועדי תביעה',
			blogAnchor: 'צ׳קליסט קנייה',
			blogAnchor2: 'ערבות חוק מכר',
			blogAnchor3: 'עדיפות ראיות',
			title: 'גיא אבני עורך דין | תביעה על ליקויי בנייה',
			description:
				'איך מגישים תביעה על ליקויי בנייה: תיעוד, חוות דעת, גישור ותביעה אזרחית.',
			metaTitle: 'גיא אבני עורך דין | תביעת ליקויי בנייה',
			metaDescription:
				'איך לתבוע קבלן על ליקויים? גיא אבני עורך דין על תיעוד, חוות דעת ומסלול משפטי. 2026.',
			mainKeyword: 'גיא אבני עורך דין',
			category: 'litigation',
			tags: ['construction', 'defects', 'litigation'],
			relatedBlogSlugs: [
				'guy-avni-construction-defects-claim-deadline',
				'guy-avni-buying-from-contractor-checklist',
				'guy-avni-evidence-prioritization-framework',
				'guy-avni-dispute-prevention-method',
			],
			firstH2: 'מסלול תביעה נגד קבלן על ליקויי ביצוע',
			topicLexicon: ['תיעוד', 'חוות דעת', 'גישור', 'תביעה', 'פיצוי'],
			sectionBlueprints: [
				{ heading: 'תיעוד ודיווח', focus: 'בכתב לקבלן' },
				{ heading: 'חוות דעת', focus: 'עלות תיקון' },
				{ heading: 'גישור', focus: 'לפני בית משפט' },
				{ heading: 'תביעה', focus: 'סעדים' },
			],
			uniqueOpener: 'ליקויי בנייה דורשים תיעוד מיידי, חוות דעת ומסלול משפטי מסודר.',
			ymyl: true,
		},
	),
	'guy-avni-consumer-protection-fourteen-day-cancellation-exceptions': batchSpec(
		'guy-avni-consumer-protection-fourteen-day-cancellation-exceptions',
		{
			pillarAnchor: 'ביטול חוזה 14 יום',
			blogAnchor: 'הודעת מוצר פגום',
			blogAnchor2: 'גביית חוב',
			blogAnchor3: 'אישור עקרוני משכנתא',
			title: 'גיא אבני עורך דין | חריגים מביטול 14 יום',
			description:
				'חריגים מזכות ביטול 14 יום: נדל"ן, שירותים מותאמים ועסקאות פנים אל פנים.',
			metaTitle: 'גיא אבני עורך דין | חריגי ביטול 14 יום',
			metaDescription:
				'אילו עסקאות לא בזכות 14 יום? גיא אבני עורך דין על חריגים בחוק הגנת הצרכן. 2026.',
			mainKeyword: 'גיא אבני עורך דין',
			category: 'consumer',
			tags: ['consumer', 'cancellation', 'law'],
			relatedBlogSlugs: [
				'guy-avni-cancel-signed-contract-israel-fourteen-days',
				'guy-avni-defective-product-claim-thirty-day-notice',
				'guy-avni-debt-collection-claim-minimum-amount',
				'guy-avni-mortgage-pre-approval-process',
			],
			firstH2: 'חריגים מזכות ביטול עסקה לפי חוק',
			topicLexicon: ['ביטול', '14 יום', 'חריג', 'מרחוק', 'נדל"ן'],
			sectionBlueprints: [
				{ heading: 'מתי חל 14 יום', focus: 'עסקה מרחוק' },
				{ heading: 'חריגים', focus: 'שירות מותאם' },
				{ heading: 'נדל"ן', focus: 'לרוב ללא' },
				{ heading: 'טעויות', focus: 'הנחות שגויות' },
			],
			uniqueOpener: 'חוק הגנת הצרכן נותן 14 יום ביטול, אך לא על כל סוג עסקה.',
			ymyl: true,
		},
	),
};
