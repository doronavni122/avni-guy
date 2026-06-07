/** Unique Hebrew bodies for Pass 1 batch 9 (5 slugs). */

const REAL_ESTATE_SOURCES =
	'\n\nמקורות: [חוק המכר (דירות)](https://www.gov.il/he/pages/new_apartment_buyer), [משרד המשפטים](https://www.justice.gov.il/Units/LegalInfo/Pages/default.aspx) ו-[לשכת עורכי הדין](https://www.israelbar.org.il/). המידע במאמר אינו ייעוץ משפטי אישי.\n';

const BUSINESS_SOURCES =
	'\n\nמקורות: [רשם החברות](https://www.gov.il/he/departments/israel_corporations_authority/govil-landing-page), [משרד המשפטים](https://www.justice.gov.il/Units/LegalInfo/Pages/default.aspx) ו-[לשכת עורכי הדין](https://www.israelbar.org.il/). המידע במאמר אינו ייעוץ משפטי אישי.\n';

const CONSUMER_SOURCES =
	'\n\nמקורות: [חוק הגנת הצרכן](https://www.gov.il/he/departments/ministry_of_economy/govil-landing-page), [משרד המשפטים](https://www.justice.gov.il/Units/LegalInfo/Pages/default.aspx) ו-[gov.il](https://www.gov.il/he/departments/ministry_of_justice/govil-landing-page). המידע במאמר אינו ייעוץ משפטי אישי.\n';

const SERVICE_SOURCES =
	'\n\nמקורות: [לשכת עורכי הדין](https://www.israelbar.org.il/), [משרד המשפטים](https://www.justice.gov.il/Units/LegalInfo/Pages/default.aspx) ו-[gov.il](https://www.gov.il/he/departments/ministry_of_justice/govil-landing-page). המידע במאמר אינו ייעוץ משפטי אישי.\n';

/** @type {Record<string, { title: string, description: string, metaTitle: string, metaDescription: string, category: string, tags: string[], contentType?: string, body: string }>} */
export const BATCH9_ARTICLES = {
	'guy-avni-communication-strategy-for-clients': {
		title: 'גיא אבני | אסטרטגיית תקשורת מול לקוחות משפטיים',
		description:
			'תקשורת ברורה: תדירות, ערוצים, סיכומים ומניעת אי-הבנות בתיקים משפטיים.',
		metaTitle: 'גיא אבני | אסטרטגיית תקשורת מול לקוחות',
		metaDescription:
			'גיא אבני מפרט אסטרטגיית תקשורת: תדירות, ערוצים, סיכומים כתובים ומניעת אי-הבנות. מדריך 2026.',
		category: 'communication',
		tags: ['clients', 'communication', 'service'],
		body: `## גיא אבני: תקשורת שקופה ככלי למניעת מחלוקות

**תקשורת ברורה עם לקוחות משפטיים** מתחילה בהגדרת ערוצים, תדירות וסיכומים. [אמון לקוחות](/blog/guy-avni-client-trust-roadmap/) נבנה בפעולות חוזרות, לא בקמפיין חד-פעמי. גיא אבני מפרט אסטרטגיה מעשית.

## בחירת ערוצים - גיא אבני

[תקשורת](https://www.israelbar.org.il/) מוסכמת: מייל לתיעוד, שיחה לדחיפות, פורטל לקבצים (2026). [משא ומתן](/blog/guy-avni-negotiation-clarity-principles/) חל גם על עדכונים שוטפים ללקוח (2025).

## תדירות עדכונים - גיא אבני

תיק פעיל: עדכון שבועי לפי [איכות שירות](/blog/guy-avni-service-quality-standards/). תיק ברקע: דו-שבועי. [מניעת מחלוקות](/blog/guy-avni-dispute-prevention-method/) מתחילה בציפיות ריאליות על קצב (2026).

## סיכומים כתובים - גיא אבני

אחרי כל אבן דרך: מה נעשה, מה הבא, מי אחראי. [קליטת לקוח](/blog/guy-avni-client-onboarding-framework/) טובה כוללת סיכום פתיחה תוך ימים ספורים (2025). תיעוד בכתב מונע "לא ידעתי" (2026).

## שפה נגישה וניהול ציפיות - גיא אבני

הסבירו מונחים בלי ז׳רגון. אל תבטיחו תוצאה משפטית; הבטיחו [ציפיות](/blog/guy-avni-ethical-decision-making-guide/) ריאליות ולוח זמנים (2025). [איכות שירות](/categories/communication/) נמדדת גם בשפה (2026).

## טיפול בתלונות - גיא אבני

תגובה תוך 24 שעות עם תוכנית תיקון. [משוב](/blog/guy-avni-client-trust-roadmap/) אחרי אבני דרך מאפשר תיקון לפני הסלמה (2025). תיעוד כל עדכון משמעותי (2026).

## טעויות נפוצות

- עדכון לא סדיר בלי הסבר.
- הבטחות שלא ניתן לעמוד בהן.
- חוסר סיכום כתוב אחרי פגישות.
- ערבוב ערוצים בלי כללים.

לפני החלטה על נוהל תקשורת, [יצירת קשר](/contact/) עם גיא אבני. [גיא אבני](/) מלווה משרדים ב[אסטרטגיית תקשורת](/blog/guy-avni-client-trust-roadmap/) ו[סטנדרטי שירות](/blog/guy-avni-service-quality-standards/).${SERVICE_SOURCES}`,
	},
	'guy-avni-companies-registry-phone-call-four-questions': {
		title: 'גיא אבני משרד עורכי דין | שאלות לרשם החברות',
		description:
			'ארבע שאלות לרשם החברות לפני עסקה יקרה: בעלות, שעבודים, דיווחים והליכים.',
		metaTitle: 'גיא אבני משרד עורכי דין | שאלות לרשם החברות',
		metaDescription:
			'שיחה קצרה לרשם החברות חוסכת כסף: ארבע שאלות לפני רכישת חברה. גיא אבני משרד עורכי דין 2026.',
		category: 'business',
		tags: ['companies', 'registry', 'business'],
		body: `## גיא אבני משרד עורכי דין: שאלות לפני עסקה יקרה

**שלוש דקות בטלפון לרשם החברות** יכולות לחסוך מאות אלפי שקלים. [הרגלי עסק משפטיים](/blog/guy-avni-business-legal-habits/) כוללים בדיקה לפני חתימה. גיא אבני משרד עורכי דין מפרט ארבע שאלות.

## שאלה 1: מי בעלי המניות והמנהלים - גיא אבני משרד עורכי דין

[רשם החברות](https://www.gov.il/he/departments/israel_corporations_authority/govil-landing-page) מחזיק מידע ציבורי על שליטה. [סוגי שותפות](/blog/guy-avni-business-partnership-types-israel-protection/) שונים מחברה בע"מ (2026).

## שאלה 2: שעבודים ומשכונות - גיא אבני משרד עורכי דין

נסח חברה חושף [שעבודים](/categories/business/) וחובות. רכישה בלי בדיקה עלולה לרשת התחייבויות (2025). [אסטרטגיה ארוכת טווח](/blog/guy-avni-long-term-legal-strategy/) מתחילה בנאותות (2026).

## שאלה 3: דיווחי שינוי בעלות - גיא אבני משרד עורכי דין

שינוי בעלות דורש [דיווח](https://www.gov.il/he/departments/israel_corporations_authority/govil-landing-page) לרשם. אי-דיווח מעלה סיכון בעת מכירה (2025). [קליטת לקוח](/blog/guy-avni-client-onboarding-framework/) בעסק כוללת איסוף מסמכים (2026).

## שאלה 4: הליכים פתוחים - גיא אבני משרד עורכי דין

בדקו צווים, עיקולים והליכים נגד החברה. [משרד המשפטים](https://www.justice.gov.il/Units/LegalInfo/Pages/default.aspx) מפרסם מידע על הליכים (2025). [שותפות עסקית](/blog/guy-avni-business-partnership-types-israel-protection/) דורשת שקיפות (2026).

## טעויות לפני רכישת חברה

- הסתמכות על מצג בעל פה בלי נסח.
- אי הצלבה עם מאזן וחוזה מכר.
- התעלמות ממנהלים קודמים.
- דילוג על ייעוץ לפני חתימה.

לפני עסקה, [יצירת קשר](/contact/) עם גיא אבני משרד עורכי דין. [גיא אבני משרד עורכי דין](/) מלווה [רכישת חברה](/categories/business/) ו[בדיקת נאותות](/blog/guy-avni-business-legal-habits/).${BUSINESS_SOURCES}`,
	},
	'guy-avni-construction-defects-claim-deadline': {
		title: 'גיא אבני עורך דין | מועד תביעה על ליקויי בנייה',
		description:
			'מועדים לתביעה על ליקויי בנייה: תקופת בדק, התיישנות 7 שנים וגילוי ליקוי.',
		metaTitle: 'גיא אבני עורך דין | מועד תביעת ליקויים',
		metaDescription:
			'כמה זמן לתבוע על ליקויי בנייה? גיא אבני עורך דין על בדק, התיישנות וגילוי. מדריך 2026.',
		category: 'real-estate',
		tags: ['construction', 'deadline', 'defects'],
		body: `## גיא אבני עורך דין: התיישנות ומועדי הגשה

**שני מנגנוני זמן שונים:** תקופת [בדק](/blog/guy-avni-construction-defects-claim-filing/) לפי [חוק המכר](https://www.gov.il/he/pages/new_apartment_buyer) והתיישנות לפי חוק ההתיישנות. גיא אבני עורך דין מסביר מתי הזמן מתחיל.

## תקופת הבדק - גיא אבני עורך דין

שנה לליקויי ביצוע, שנתיים לשלד ואיטום (2025). [הגשת תביעה](/blog/guy-avni-construction-defects-claim-filing/) אחרי הבדק עדיין אפשרית בתוך התיישנות (2026). [צ׳קליסט קנייה](/blog/guy-avni-buying-from-contractor-checklist/) מזכיר לתעד ליקויים במסירה.

## התיישנות שבע שנים - גיא אבני עורך דין

תביעת נזיקין: לרוב 7 שנים מ[גילוי](/categories/litigation/) הליקוי (2026). רטיבות נסתרת: השעון מגילוי, לא ממסירה (2025). [משרד המשפטים](https://www.justice.gov.il/Units/LegalInfo/Pages/default.aspx) מפרסם מידע על מועדים.

## דיווח לקבלן בתוך הבדק - גיא אבני עורך דין

חובה לדווח בכתב לפני תביעה. [ערבות חוק מכר](/blog/guy-avni-sale-law-guarantee-importance/) קשורה למועדי מסירה (2026). [מניעת סכסוכים](/blog/guy-avni-dispute-prevention-method/) מתחילה בדיווח מוקדם (2025).

## מתי השעון מתחיל - גיא אבני עורך דין

| מצב | נקודת התחלה |
| --- | --- |
| ליקוי גלוי במסירה | מסירה |
| רטיבות נסתרת | גילוי + מומחה |
| איחור מסירה | מסירה בפועל |

## טעויות במועדים

- "עוד יש זמן" בלי חישוב.
- אי דיווח לקבלן בתקופת הבדק.
- הסתמכות על הבטחות בעל פה.

לפני תביעה, [יצירת קשר](/contact/) עם גיא אבני עורך דין. [גיא אבני עורך דין](/) מלווה [ליקויי בנייה](/categories/litigation/) ו[תביעות נגד קבלן](/blog/guy-avni-construction-defects-claim-filing/).${REAL_ESTATE_SOURCES}`,
	},
	'guy-avni-construction-defects-claim-filing': {
		title: 'גיא אבני עורך דין | תביעה על ליקויי בנייה',
		description:
			'איך מגישים תביעה על ליקויי בנייה: תיעוד, חוות דעת, גישור ותביעה אזרחית.',
		metaTitle: 'גיא אבני עורך דין | תביעת ליקויי בנייה',
		metaDescription:
			'איך לתבוע קבלן על ליקויים? גיא אבני עורך דין על תיעוד, חוות דעת ומסלול משפטי. 2026.',
		category: 'litigation',
		tags: ['construction', 'defects', 'litigation'],
		body: `## גיא אבני עורך דין: מסלול תביעה נגד קבלן

**ליקויי בנייה** דורשים תיעוד מיידי ודיווח בכתב. [מועדי תביעה](/blog/guy-avni-construction-defects-claim-deadline/) קובעים אם ההליך בזמן. גיא אבני עורך דין מפרט שלבים.

## שלב 1: תיעוד ודיווח - גיא אבני עורך דין

צלמו, שלחו הודעה לקבלן, שמרו אישורים. [חוק המכר](https://www.gov.il/he/pages/new_apartment_buyer) מחייב תקופת בדק (2025). [צ׳קליסט קנייה](/blog/guy-avni-buying-from-contractor-checklist/) לפני רכישה (2026).

## שלב 2: חוות דעת מומחה - גיא אבני עורך דין

הנדסית: תיאור, סיבה, [עלות תיקון](/blog/guy-avni-evidence-prioritization-framework/). 3,000-8,000 ש"ח לפי היקף (2026). [עדיפות ראיות](/categories/litigation/) קובעת סדר איסוף (2025).

## שלב 3: גישור וגורמים נוספים - גיא אבני עורך דין

מפקח חוק המכר, ועד בדק, [גישור](/blog/guy-avni-dispute-prevention-method/) לפני בית משפט (2026). [ערבות חוק מכר](/blog/guy-avni-sale-law-guarantee-importance/) מגנה על מקדמות (2025).

## שלב 4: תביעה משפטית - גיא אבני עורך דין

כתב תביעה, חוות דעת, סעדים: תיקון, פיצוי, הוצאות. [משרד המשפטים](https://www.justice.gov.il/Units/LegalInfo/Pages/default.aspx) על סדר דין (2026). סדר דין מקוצר אם הסכום מתאים (2025).

## מה אפשר לתבוע - גיא אבני עורך דין

| סוג | דוגמה |
| --- | --- |
| ליקוי ביצוע | ריצוף, צבע |
| ליקוי שלד | רטיבות |
| איחור מסירה | פיצוי חוזי |

## טעויות

- המתנה עד סוף הבדק.
- תיקון עצמי בלי תיעוד.
- חתימה על מסירה סופית עם ליקויים.

לפני תביעה, [יצירת קשר](/contact/) עם גיא אבני עורך דין. [גיא אבני עורך דין](/) מלווה [תביעות ליקויי בנייה](/blog/guy-avni-construction-defects-claim-deadline/) ו[קנייה מקבלן](/blog/guy-avni-buying-from-contractor-checklist/).${REAL_ESTATE_SOURCES}`,
	},
	'guy-avni-consumer-protection-fourteen-day-cancellation-exceptions': {
		title: 'גיא אבני עורך דין | חריגים מביטול 14 יום',
		description:
			'חריגים מזכות ביטול 14 יום: נדל"ן, שירותים מותאמים ועסקאות פנים אל פנים.',
		metaTitle: 'גיא אבני עורך דין | חריגי ביטול 14 יום',
		metaDescription:
			'אילו עסקאות לא בזכות 14 יום? גיא אבני עורך דין על חריגים בחוק הגנת הצרכן. 2026.',
		category: 'consumer',
		tags: ['consumer', 'cancellation', 'law'],
		body: `## גיא אבני עורך דין: חריגים מזכות ביטול 14 יום

**חוק הגנת הצרכן** נותן 14 יום ביטול בעסקאות מרחוק מסוימות, אך לא בכולן. [ביטול חוזה 14 יום](/blog/guy-avni-cancel-signed-contract-israel-fourteen-days/) הוא נושא נפרד. גיא אבני עורך דין מפרט חריגים.

## מתי חל 14 יום - גיא אבני עורך דין

[עסקה מרחוק](https://www.gov.il/he/departments/ministry_of_economy/govil-landing-page): לרוב 14 יום מקבלת המוצר (2025). [הודעת מוצר פגום](/blog/guy-avni-defective-product-claim-thirty-day-notice/) בנתיב אחר (2026).

## חריגים עיקריים - גיא אבני עורך דין

שירותים מותאמים אישית, מוצרים מתכלים, עסקה פנים אל פנים. [גביית חוב](/blog/guy-avni-debt-collection-claim-minimum-amount/) אינה זכות ביטול (2025). [משרד המשפטים](https://www.justice.gov.il/Units/LegalInfo/Pages/default.aspx) מפרסם הנחיות (2026).

## נדל"ן ומשכנתא - גיא אבני עורך דין

חוזי [נדל"ן](/categories/consumer/) לרוב אינם בזכות 14 יום. [אישור עקרוני משכנתא](/blog/guy-avni-mortgage-pre-approval-process/) הוא שלב נפרד (2025). בדקו סעיפי חוזה ספציפיים (2026).

## איך מבטלים כשזכאים - גיא אבני עורך דין

הודעת ביטול בכתב בתוך המועד. שמרו אישור מסירה. [ביטול חוזה](/blog/guy-avni-cancel-signed-contract-israel-fourteen-days/) בהסכמה אפשרי תמיד (2025).

## טעויות

- הנחה שכל חוזה ניתן לביטול.
- אי קריאת חריגים בחוזה.
- ביטול בעל פה בלי תיעוד.

לפני החלטה, [יצירת קשר](/contact/) עם גיא אבני עורך דין. [גיא אבני עורך דין](/) מלווה [צרכן](/categories/consumer/) ב[ביטול עסקה](/blog/guy-avni-cancel-signed-contract-israel-fourteen-days/).${CONSUMER_SOURCES}`,
	},
};
