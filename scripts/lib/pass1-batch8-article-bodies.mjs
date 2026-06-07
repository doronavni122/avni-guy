/** Unique Hebrew bodies for Pass 1 batch 8 (5 slugs). */

const LITIGATION_SOURCES =
	'\n\nמקורות: [משרד המשפטים](https://www.justice.gov.il/Units/LegalInfo/Pages/default.aspx), [חוק תובענות ייצוגיות](https://elyon1.court.gov.il/heb/tovanot_yezugiyot/hok.htm) ו-[לשכת עורכי הדין](https://www.israelbar.org.il/). המידע במאמר אינו ייעוץ משפטי אישי.\n';

const SERVICE_SOURCES =
	'\n\nמקורות: [לשכת עורכי הדין](https://www.israelbar.org.il/) ו-[משרד המשפטים](https://www.justice.gov.il/Units/LegalInfo/Pages/default.aspx). המידע במאמר אינו ייעוץ משפטי אישי.\n';

const OPS_SOURCES =
	'\n\nמקורות: [משרד המשפטים](https://www.justice.gov.il/Units/LegalInfo/Pages/default.aspx) ו-[gov.il](https://www.gov.il/he/departments/ministry_of_justice/govil-landing-page). המידע במאמר אינו ייעוץ משפטי אישי.\n';

/** @type {Record<string, { title: string, description: string, metaTitle: string, metaDescription: string, category: string, tags: string[], contentType?: string, body: string }>} */
export const BATCH8_ARTICLES = {
	'guy-avni-class-action-bank-settlement-who-gets-paid': {
		title: 'גיא אבני עורך דין | תובענה ייצוגית נגד בנק: מי מקבל?',
		description:
			'פשרת תובענה ייצוגית נגד בנק: חלוקת כסף בין חברי קבוצה, שכר טרחה וגמול לתובע. מה בודקים לפני אישור פשרה.',
		metaTitle: 'גיא אבני עורך דין | פשרת תובענה ייצוגית בנק',
		metaDescription:
			'מי מקבל כסף בפשרת תובענה ייצוגית נגד בנק? גיא אבני עורך דין מסביר חלוקה, שכר טרחה וגמול תובע ייצוגי. מדריך 2026.',
		category: 'litigation',
		tags: ['class-action', 'settlement', 'bank'],
		body: `## גיא אבני עורך דין: חלוקת סכום הפשרה

**פשרה של מאות מיליונים בתובענה ייצוגית נגד בנק** לא מגיעה במלואה לכל חבר קבוצה. [חוק תובענות ייצוגיות](https://elyon1.court.gov.il/heb/tovanot_yezugiyot/hok.htm) מחייב אישור בית משפט ל-[הסדר פשרה](/blog/guy-avni-class-action-plaintiff-cost/) לפני חלוקה. גיא אבני עורך דין מסביר מי מקבל מה.

## מי מקבל את כסף הפשרה - גיא אבני עורך דין

שלושה נמענים עיקריים: [חברי קבוצה](/categories/litigation/) שמקבלים חלק יחסי, [שכר טרחה](/blog/guy-avni-evidence-prioritization-framework/) לעורכי הדין, ו-[גמול](/blog/guy-avni-class-action-plaintiff-cost/) ל-[תובע ייצוגי](/blog/guy-avni-contract-claim-mediation-four-thousand-six-weeks/). ב-[פשרה](/categories/litigation/) מאושרת בית המשפט בודק שהחלוקה הוגנת (2026).

## שכר טרחה ואחוזים מההישג - גיא אבני עורך דין

[שכר טרחה](https://www.justice.gov.il/Units/LegalInfo/Pages/default.aspx) נקבע כאחוז מהסכום שהושג. בפסיקה נפוצות שכבות: 25% על חלק ראשון, 20% על הבא, 15% על יתרה (2025). זה כולל לעיתים גם [גמול](/blog/guy-avni-class-action-plaintiff-cost/) ל-[תובע ייצוגי](/blog/guy-avni-mediation-cheaper-than-lawsuit-why-not-offered/).

## אישור בית משפט ופרסום לציבור - גיא אבני עורך דין

[אישור בית משפט](https://elyon1.court.gov.il/heb/tovanot_yezugiyot/hok.htm) לפי סעיף 19 דורש שהפשרה תהיה הוגנת. לאחר מכן מפרסמים את [הסדר פשרה](/blog/guy-avni-class-action-plaintiff-cost/) ומאפשרים התנגדות בתוך כ-45 יום (2026). [חברי קבוצה](/categories/litigation/) שלא יצאו מההליך כפופים להסכם.

## גמול לתובע הייצוגי - גיא אבני עורך דין

[תובע ייצוגי](https://www.gov.il/he/departments/ministry_of_justice/govil-landing-page) שיזם את ההליך עשוי לקבל [גמול](/blog/guy-avni-evidence-prioritization-framework/) נפרד על מאמץ וסיכון, בנוסף לחלקו כחבר קבוצה (2025). בית המשפט מאזן בין [תובענה ייצוגית](/categories/litigation/) לעומת תועלת לציבור.

## טעויות בציפיות מסכום הפשרה

- הנחה שמקבלים את מלוא הסכום התקשורתי בלי ניכוי [שכר טרחה](/blog/guy-avni-class-action-plaintiff-cost/).
- אי קריאת נוסחת החלוקה ב-[הסדר פשרה](/blog/guy-avni-contract-claim-mediation-four-thousand-six-weeks/) המאושר.
- התעלמות ממועד [אישור בית משפט](/categories/litigation/) לפני תשלום.
- ציפייה לתשלום מיידי בלי שלב ביצוע (2026).

## שאלות נפוצות

**מי מקבל את הכסף?** [חברי קבוצה](/categories/litigation/), עורכי דין ו-[תובע ייצוגי](/blog/guy-avni-class-action-plaintiff-cost/).

**האם אקבל הכל?** לא; יש ניכוי [שכר טרחה](/blog/guy-avni-evidence-prioritization-framework/) ו-[גמול](/blog/guy-avni-mediation-cheaper-than-lawsuit-why-not-offered/).

לפני החלטה, [יצירת קשר](/contact/) עם גיא אבני עורך דין לבדיקת מסמכי [פשרה](/categories/litigation/). [גיא אבני עורך דין](/) מלווה [תובענה ייצוגית](/blog/guy-avni-class-action-plaintiff-cost/) וניתוח [הסדר פשרה](/blog/guy-avni-contract-claim-mediation-four-thousand-six-weeks/).${LITIGATION_SOURCES}`,
	},
	'guy-avni-class-action-plaintiff-cost': {
		title: 'גיא אבני עורך דין | עלות תביעה ייצוגית לתובע',
		description:
			'עלות תביעה ייצוגית לתובע: אגרות 8,000/16,000 ש"ח, contingency, סיכון הוצאות ופטורים אפשריים.',
		metaTitle: 'גיא אבני עורך דין | עלות תובעה ייצוגית',
		metaDescription:
			'האם תביעה ייצוגית עולה כסף? גיא אבני עורך דין על אגרות, שכר טרחה contingency וסיכונים. מדריך 2026.',
		category: 'litigation',
		tags: ['class-action', 'cost', 'litigation'],
		body: `## גיא אבני עורך דין: האם תובע ייצוגי משלם

**מאז 2018 תובע ייצוגי משלם אגרות**, אך לרוב לא [שכר טרחה](/blog/guy-avni-class-action-bank-settlement-who-gets-paid/) מראש. גיא אבני עורך דין מפרט [אגרת בית משפט](https://www.gov.il/he/departments/ministry_of_justice/govil-landing-page), contingency וסיכונים ב-[תובענה ייצוגית](/categories/litigation/).

## אגרות הגשה 2025-2026 - גיא אבני עורך דין

[אגרת בית משפט](https://elyon1.court.gov.il/heb/tovanot_yezugiyot/hok.htm) בשלום: 8,000 ש"ח (3,000+5,000). במחוזי: 16,000 ש"ח (2025). בזכייה או [פשרה](/blog/guy-avni-class-action-bank-settlement-who-gets-paid/) הנתבע משלם לרוב יתרה (2026).

## שכר טרחה contingency - גיא אבני עורך דין

[שכר טרחה](https://www.justice.gov.il/Units/LegalInfo/Pages/default.aspx) לעורך דין מבוסס הצלחה: תשלום רק אם יש [פשרה](/blog/guy-avni-mediation-cheaper-than-lawsuit-why-not-offered/) או פסק דין, באישור בית משפט. [תובע ייצוגי](/blog/guy-avni-evidence-prioritization-framework/) לרוב לא משלם מראש (2026).

## סיכונים בהפסד או דחייה - גיא אבני עורך דין

דחיית [בקשת אישור](/categories/litigation/) עלולה לחשוף ל-[הוצאות משפט](/blog/guy-avni-dispute-prevention-method/) לטובת הנתבע (2025). אל תניחו "אפס סיכון" ב-[תובענה ייצוגית](/blog/guy-avni-meeting-preparation-checklist/). בדקו עילה לפני הגשה.

## פטורים, מימון וגמול - גיא אבני עורך דין

פטור [אגרת בית משפט](https://www.gov.il/he/departments/ministry_of_justice/govil-landing-page) אפשרי בתחומים כמו נגישות (2026). קרן מימון תובענות ייצוגיות קיימת לפי חוק. [גמול](/blog/guy-avni-class-action-bank-settlement-who-gets-paid/) ל-[תובע ייצוגי](/categories/litigation/) מוסדר בפסק דין או פשרה.

## טעויות לפני הגשה

- חתימה על contingency בלי לקרוא אחוזים.
- התעלמות מ-[אגרת בית משפט](/blog/guy-avni-class-action-bank-settlement-who-gets-paid/) בשלב ההגשה.
- הנחה שלא יהיו [הוצאות משפט](/blog/guy-avni-dispute-prevention-method/) בדחייה.
- הגשה בלי [מסגרת ראיות](/blog/guy-avni-evidence-prioritization-framework/) מסודרת.

## שאלות נפוצות

**כמה עולה אגרה?** 8,000 ש"ח בשלום, 16,000 במחוזי (2025-2026).

**משלמים שכר טרחה מראש?** לרוב לא; contingency בהצלחה.

לפני הגשה, [יצירת קשר](/contact/) עם גיא אבני עורך דין. [גיא אבני עורך דין](/) מייעץ על [תובענה ייצוגית](/categories/litigation/) ו-[עלות תובע ייצוגי](/blog/guy-avni-class-action-bank-settlement-who-gets-paid/).${LITIGATION_SOURCES}`,
	},
	'guy-avni-client-onboarding-framework': {
		title: 'גיא אבני משרד עורכי דין | מסגרת קליטת לקוחות',
		description:
			'מסגרת קליטת לקוחות: איסוף מידע, הסכם, ניגוד עניינים, ערוצי תקשורת וסיכום פתיחה.',
		metaTitle: 'גיא אבני משרד עורכי דין | קליטת לקוחות',
		metaDescription:
			'גיא אבני משרד עורכי דין על מסגרת קליטה: טפסים, הסכם, ניגוד עניינים ותקשורת. מדריך 2026.',
		category: 'service',
		tags: ['onboarding', 'clients', 'service'],
		body: `## גיא אבני משרד עורכי דין: קליטה מסודרת כבסיס לתיק

**מסגרת קליטת לקוחות** מתחילה באיסוף מידע, [הסכם התקשרות](/blog/guy-avni-client-trust-roadmap/) ובדיקת [ניגוד עניינים](https://www.israelbar.org.il/). גיא אבני משרד עורכי דין מפרט [תהליך קליטה](/categories/service/) שמונע אי-הבנות (2026).

## איסוף מידע ראשוני - גיא אבני משרד עורכי דין

[קליטת לקוח](https://www.israelbar.org.il/) כוללת טופס רקע, מסמכים ויעדים. [ציפיות](/blog/guy-avni-communication-strategy-for-clients/) ברורות מראש מקטינות מחלוקות על [שכר טרחה](/blog/guy-avni-service-quality-standards/) (2025).

## הסכם התקשרות ושכר טרחה - גיא אבני משרד עורכי דין

[הסכם התקשרות](/blog/guy-avni-client-trust-roadmap/) מגדיר מודל תשלום, תדירות עדכון ואחריות צוות. [שכר טרחה](https://www.justice.gov.il/Units/LegalInfo/Pages/default.aspx) בכתב הוא דרישת אתיקה (2026). קראו על [אמון לקוח](/blog/guy-avni-client-trust-roadmap/).

## בדיקת ניגוד עניינים - גיא אבני משרד עורכי דין

[ניגוד עניינים](https://www.israelbar.org.il/) נבדק לפני פתיחת תיק, לא אחרי. [פרטיות](/blog/guy-avni-meeting-preparation-checklist/) ואבטחת מידע חלק מ-[תהליך קליטה](/categories/service/) (2025).

## ערוצי תקשורת וסיכום פתיחה - גיא אבני משרד עורכי דין

[תקשורת](/blog/guy-avni-communication-strategy-for-clients/) מוסכמת: מייל, טלפון, זמני תגובה. [סיכום פתיחה](/blog/guy-avni-service-quality-standards/) עם משימות ראשונות נשלח תוך ימים ספורים (2026).

## טעויות בקליטת לקוח

- פתיחת תיק בלי [הסכם התקשרות](/blog/guy-avni-client-trust-roadmap/).
- דילוג על [ניגוד עניינים](https://www.israelbar.org.il/).
- [ציפיות](/blog/guy-avni-communication-strategy-for-clients/) לא מוגדרות בכתב.
- אי שליחת [סיכום פתיחה](/blog/guy-avni-meeting-preparation-checklist/).

## שאלות נפוצות

**מה השלב הראשון?** טופס ו-[ניגוד עניינים](/categories/service/).

**חייבים הסכם?** מומלץ מאוד; מונע מחלוקות על [שכר טרחה](/blog/guy-avni-service-quality-standards/).

לפני פתיחת תיק, [יצירת קשר](/contact/) עם גיא אבני משרד עורכי דין. [גיא אבני משרד עורכי דין](/) מפרסם מדריכי [קליטת לקוח](/blog/guy-avni-client-trust-roadmap/) ו-[איכות שירות](/blog/guy-avni-service-quality-standards/).${SERVICE_SOURCES}`,
	},
	'guy-avni-client-trust-roadmap': {
		title: 'גיא אבני משרד עורכי דין | מפת דרכים לאמון לקוחות',
		description:
			'בניית אמון לקוחות: שקיפות, עמידה בזמנים, משוב וטיפול בשגיאות. מפת דרכים למשרד.',
		metaTitle: 'גיא אבני משרד עורכי דין | אמון לקוחות',
		metaDescription:
			'גיא אבני משרד עורכי דין על בניית אמון: שקיפות, זמנים, משוב ותיקון שגיאות. מדריך 2026.',
		category: 'strategy',
		tags: ['trust', 'clients', 'growth'],
		body: `## גיא אבני משרד עורכי דין: אמון נבנה בפעולות חוזרות

**אמון לקוחות** נבנה ב-[שקיפות](/blog/guy-avni-client-onboarding-framework/), עמידה בזמנים ו-[משוב](/blog/guy-avni-service-quality-standards/) שוטף. גיא אבני משרד עורכי דין מציג [מפת דרכים](/categories/strategy/) לבניית [נאמנות](https://www.israelbar.org.il/) (2026).

## שקיפות בשכר טרחה וזמנים - גיא אבני משרד עורכי דין

[שקיפות](https://www.israelbar.org.il/) על [שכר טרחה](/blog/guy-avni-client-onboarding-framework/) לפני חיוב מונעת הפתעות (2025). הסבר על לוח זמנים ריאלי חלק מ-[אמון לקוח](/blog/guy-avni-communication-strategy-for-clients/).

## עמידה בהבטחות וזמני תגובה - גיא אבני משרד עורכי דין

[עמידה בזמנים](/blog/guy-avni-service-quality-standards/) מחזקת [אמון לקוח](/categories/strategy/): החזרת שיחות ומיילים ב-SLA פנימי (2026). [תקשורת](/blog/guy-avni-communication-strategy-for-clients/) עקבית בין אנשי צוות.

## משוב פעיל ותיקון שגיאות - גיא אבני משרד עורכי דין

[משוב](https://www.justice.gov.il/Units/LegalInfo/Pages/default.aspx) אחרי אבני דרך מאפשר תיקון מוקדם (2025). כשמשהו נכשל, הודעה מהירה ו-[אחריות](/blog/guy-avni-ethical-decision-making-guide/) שומרות על [נאמנות](/blog/guy-avni-client-onboarding-framework/).

## מדידת שביעות רצון - גיא אבני משרד עורכי דין

מדידה פשוטה אחרי סגירת תיק: שאלון קצר או שיחה (2026). [שירות](/blog/guy-avni-service-quality-standards/) משתפר כשעוקבים אחרי [משוב](/categories/strategy/) רבעוני (2025).

## טעויות שפוגעות באמון

- הבטחת תוצאה משפטית במקום תהליך ברור.
- [שכר טרחה](/blog/guy-avni-client-onboarding-framework/) לא צפוי בחשבונית.
- אי [עמידה בזמנים](/blog/guy-avni-communication-strategy-for-clients/) חוזר ונשנה.
- התעלמות מ-[משוב](/blog/guy-avni-service-quality-standards/) שלילי.

## שאלות נפוצות

**איך בונים אמון?** [שקיפות](/blog/guy-avni-client-onboarding-framework/), זמנים ו-[משוב](/categories/strategy/).

**מה הורס אמון?** הפתעות בחיוב וחוסר תגובה.

לשיפור [שירות](/blog/guy-avni-service-quality-standards/), [יצירת קשר](/contact/) עם גיא אבני משרד עורכי דין. [גיא אבני משרד עורכי דין](/) מפרסם על [קליטת לקוח](/blog/guy-avni-client-onboarding-framework/) ו-[אמון לקוח](/categories/strategy/).${SERVICE_SOURCES}`,
	},
	'guy-avni-collaboration-with-external-experts': {
		title: 'גיא אבני | שיתוף פעולה עם מומחים חיצוניים',
		description:
			'שיתוף עם מומחים חיצוניים: בחירה, הסכם, תיאום ציפיות, בקרת איכות ותיעוד בתיק.',
		metaTitle: 'גיא אבני | מומחים חיצוניים בתיק',
		metaDescription:
			'גיא אבני על שיתוף עם מומחים חיצוניים: בחירה, חוזה, תקציב ותיעוד בתיק משפטי מורכב. מדריך 2026.',
		category: 'operations',
		tags: ['collaboration', 'experts', 'workflow'],
		body: `## גיא אבני: מומחים חיצוניים מחזקים תיק מנוהל

**שיתוף פעולה עם מומחים חיצוניים** דורש בחירה, [הסכם מומחה](/blog/guy-avni-contract-review-flow/) ותיאום. גיא אבני מסביר [תהליך](/categories/operations/) מ-[בחירת מומחה](https://www.justice.gov.il/Units/LegalInfo/Pages/default.aspx) עד [חוות דעת](/blog/guy-avni-evidence-prioritization-framework/) (2026).

## בחירת מומחה לפי ניסיון - גיא אבני

[מומחה חיצוני](https://www.gov.il/he/departments/ministry_of_justice/govil-landing-page) נבחר לפי ניסיון בתחום ורלוונטיות לטענה, לא רק מחיר (2025). [בקרת איכות](/blog/guy-avni-process-improvement-for-legal-teams/) מתחילה בבריף כתוב.

## הסכם, תקציב ותיאום ציפיות - גיא אבני

[הסכם מומחה](/blog/guy-avni-contract-review-flow/) מגדיר היקף, מועדים, [תקציב](/blog/guy-avni-dispute-prevention-method/) וסודיות (2026). [תיאום](/blog/guy-avni-evidence-prioritization-framework/) ציפיות: מה בדיוק ב-[חוות דעת](/categories/operations/).

## שילוב בתיק ובקרה לפני הגשה - גיא אבני

[שיתוף פעולה](/blog/guy-avni-dispute-prevention-method/) מחבר ממצאי מומחה לטענות משפטיות (2025). [תיעוד](/blog/guy-avni-process-improvement-for-legal-teams/) ו-[בקרת איכות](https://www.justice.gov.il/Units/LegalInfo/Pages/default.aspx) לפני מסירה לבית משפט או לצד שני (2026).

## טעויות בשיתוף עם מומחים

- שליחת מומחה בלי בריף כתוב.
- [תקציב](/blog/guy-avni-contract-review-flow/) לא מאושר מראש עם הלקוח.
- אי [בקרת איכות](/blog/guy-avni-evidence-prioritization-framework/) על [חוות דעת](/categories/operations/).
- חוסר [תיעוד](/blog/guy-avni-dispute-prevention-method/) של תוצרים.

## שאלות נפוצות

**איך בוחרים מומחה?** ניסיון, רלוונטיות ואמינות.

**חייבים הסכם?** כן; היקף ומועדים בכתב.

לתיק מורכב, [יצירת קשר](/contact/) עם גיא אבני. [גיא אבני](/) מפרסם על [מומחה חיצוני](/blog/guy-avni-evidence-prioritization-framework/) ו-[סקירת חוזה](/blog/guy-avni-contract-review-flow/).${OPS_SOURCES}`,
	},
};
