/** Unique Hebrew bodies for Pass 1 batch 7 (5 slugs). Anchors align with study LSI terms. */

const TRAFFIC_SOURCES =
	'\n\nמקורות: [משרד המשפטים](https://www.justice.gov.il/Units/LegalInfo/Pages/default.aspx) ו-[לשכת עורכי הדין](https://www.israelbar.org.il/). המידע במאמר אינו ייעוץ משפטי אישי.\n';

const REAL_ESTATE_SOURCES =
	'\n\nמקורות: [רשות המקרקעין](https://www.gov.il/he/service/land_registration_extract) ו-[לשכת עורכי הדין](https://www.israelbar.org.il/). המידע במאמר אינו ייעוץ משפטי אישי.\n';

const FAMILY_SOURCES =
	'\n\nמקורות: [משרד המשפטים](https://www.justice.gov.il/Units/LegalInfo/Pages/default.aspx) ו-[לשכת עורכי הדין](https://www.israelbar.org.il/). המידע במאמר אינו ייעוץ משפטי אישי.\n';

const SERVICE_SOURCES =
	'\n\nמקורות: [לשכת עורכי הדין](https://www.israelbar.org.il/) ו-[משרד המשפטים](https://www.justice.gov.il/Units/LegalInfo/Pages/default.aspx). המידע במאמר אינו ייעוץ משפטי אישי.\n';

/** @type {Record<string, { title: string, description: string, metaTitle: string, metaDescription: string, category: string, tags: string[], contentType?: string, body: string }>} */
export const BATCH7_ARTICLES = {
	'guy-avni-car-accident-under-five-thousand-settlement': {
		title: 'גיא אבני עורך דין | תאונת דרכים: נזק מתחת ל-5,000 ש"ח',
		description:
			'תאונת דרכים עם נזק מתחת ל-5,000 ש"ח: מתי סולחה מול חברת ביטוח עדיפה על תביעה, מה לתעד ומתי לפנות לבית משפט.',
		metaTitle: 'גיא אבני עורך דין | תאונת דרכים נזק קטן',
		metaDescription:
			'גיא אבני עורך דין על תאונת דרכים עם נזק קטן: סולחה, תיעוד תאונה ומו"מ מול חברת ביטוח. מתי כדאי תביעה קטנה במקום הליך ארוך.',
		category: 'traffic',
		tags: ['accident', 'insurance', 'settlement'],
		body: `## גיא אבני עורך דין: למה נזק קטן מטופל בסולחה

**תאונת דרכים** עם נזק מתחת ל-5,000 ש"ח לרוב לא שווה תביעה ארוכה: אגרות, זמן ועורך דין עלולים לעלות על הפיצוי. גיא אבני עורך דין ממליץ לפתוח בדיווח ל-[חברת ביטוח](/categories/traffic/) ולנסות [סולחה](/blog/guy-avni-small-claims-without-lawyer-why-lose/) מוסדרת לפני שמגישים כתב תביעה.

## תיעוד תאונה במקום האירוע

[תיעוד תאונה](https://www.gov.il/he/departments/police/govil-landing-page) מיידי חוסך ויכוחים: תמונות, פרטי נהגים, מספרי רכב, עדים ומיקום. בלי [נזק רכוש](/blog/guy-avni-driving-license-suspension-cancel-seven-days/) מתועד קשה להוכיח גם סכום נמוך. שמרו העתקים של כל הודעה ל-[חברת ביטוח](/categories/traffic/).

## שמאי רכב והשתתפות עצמית

[שמאי רכב](https://www.gov.il/he/departments/israel_tax_authority/govil-landing-page) או הצעת תיקון מוסמכת מחזקים את הבקשה ל-[פיצוי נזיקי](/blog/guy-avni-debt-collection-claim-minimum-amount/). בדקו [השתתפות עצמית](/blog/guy-avni-small-claims-without-lawyer-why-lose/) בפוליסה לפני שמסרבים להצעה ראשונית מ-[חברת ביטוח](/categories/traffic/).

## מו"מ מול חברת הביטוח

מו"מ מבוסס הצעות תיקון לגיטימיות עדיף על סכום מזומן נמוך. אם [חברת ביטוח](/categories/traffic/) מציעה פחות מ-[שמאי רכב](/blog/guy-avni-driving-license-suspension-cancel-seven-days/), הציגו חוות דעת בכתב. [סולחה](/blog/guy-avni-small-claims-without-lawyer-why-lose/) טובה כוללת תיקון במוסך הסדר ולא רק מזומן.

## מתי כן להגיש תביעה

[תביעה קטנה](/blog/guy-avni-small-claims-without-lawyer-why-lose/) או הליך בבית משפט מתאימים כשיש סירוב מוחלט, פציעה, או [נזק רכוש](/blog/guy-avni-debt-collection-claim-minimum-amount/) מורכב שלא נסגר ב-[סולחה](/categories/traffic/). גיא אבני עורך דין ממליץ לבדוק מועד התיישנות לפני ויתור.

## טעויות נפוצות אחרי תאונת דרכים

- חתימה על ויתור מלא בלי בדיקת נזק נסתר.
- אי [תיעוד תאונה](https://www.gov.il/he/departments/police/govil-landing-page) בזמן אמת.
- התעלמות מ-[השתתפות עצמית](/blog/guy-avni-small-claims-without-lawyer-why-lose/) בפוליסה.
- ויתור על [פיצוי נזיקי](/blog/guy-avni-debt-collection-claim-minimum-amount/) בלי השוואת הצעות.

## שאלות נפוצות

**האם כדאי לתבוע על נזק קטן?** לרוב [סולחה](/blog/guy-avni-small-claims-without-lawyer-why-lose/) מול [חברת ביטוח](/categories/traffic/) מהירה יותר.

**מה לתעד?** [תיעוד תאונה](https://www.gov.il/he/departments/police/govil-landing-page) מלא: תמונות, עדים, פרטי רכב.

לפני החלטה סופית, [יצירת קשר](/contact/) עם גיא אבני עורך דין לבדיקת המסמכים שלכם. [גיא אבני עורך דין](/) מפרסם מדריכים נוספים ב[תאונת דרכים](/categories/traffic/).${TRAFFIC_SOURCES}`,
	},
	'guy-avni-check-apartment-liens-before-purchase': {
		title: 'גיא אבני עורך דין | בדיקת שעבוד על דירה לפני קנייה',
		description:
			'בדיקת שעבוד על דירה: נסח טאבו, משכנתא, עיקולים והערות אזהרה. צעדים לפני חתימה על חוזה מכר.',
		metaTitle: 'גיא אבני עורך דין | בדיקת שעבוד לפני קנייה',
		metaDescription:
			'גיא אבני עורך דין מסביר איך בודקים שעבוד על דירה: נסח טאבו, משכנתא, עיקול והערת אזהרה. צעדים לקונה דירה לפני חתימה.',
		category: 'real-estate',
		tags: ['real-estate', 'buyer', 'liens'],
		body: `## גיא אבני עורך דין: נסח טאבו ככלי הבדיקה

לפני קניית דירה, [נסח טאבו](https://www.gov.il/he/service/land_registration_extract) עדכני הוא כלי הבדיקה המרכזי: [משכנתא](/blog/guy-avni-mortgage-pre-approval-process/) רשומה, [עיקול](/blog/guy-avni-apartment-buyer-required-documents/) או [הערת אזהרה](/blog/guy-avni-lawyer-required-apartment-purchase/). גיא אבני עורך דין ממליץ להזמין נסח שלא ישן מעל חודשים ספורים.

## מה מופיע בנסח הרישום

[נסח טאבו](https://www.gov.il/he/service/land_registration_extract) מציג [שעבוד](/blog/guy-avni-buying-from-contractor-checklist/), זכויות צד ג' וחובות רשומים. [קונה דירה](/blog/guy-avni-apartment-buyer-required-documents/) שלא בודק [בדיקת זכויות](/blog/guy-avni-lawyer-required-apartment-purchase/) עלול לרכוש חוב של המוכר.

## משכנתא ושחרור שעבוד

[משכנתא](/blog/guy-avni-mortgage-pre-approval-process/) של המוכר חייבת להיפרע או להיות מוסדרת במועד העברה. דרשו אישור בנק בכתב על שחרור [שעבוד](/blog/guy-avni-buying-from-contractor-checklist/) לפני תשלום מקדמה גבוהה. [רישום בטאבו](/blog/guy-avni-apartment-buyer-required-documents/) מותנה לעיתים בכך.

## עיקולים וחובות מוכר

[עיקול](/blog/guy-avni-debt-collection-claim-minimum-amount/) מס הכנסה, הוצל"פ או נושים חושפים סיכון ל-[קונה דירה](/blog/guy-avni-lawyer-required-apartment-purchase/). [בדיקת זכויות](/blog/guy-avni-buying-from-contractor-checklist/) כוללת גם בירור חובות עירייה לפני [רישום בטאבו](https://www.gov.il/he/service/land_registration_extract).

## הערת אזהרה לטובת הקונה

[הערת אזהרה](/blog/guy-avni-apartment-buyer-required-documents/) מגנה על רוכש אך דורשת רישום בזמן. בלי [נסח טאבו](https://www.gov.il/he/service/land_registration_extract) עדכני לא רואים אם [הערת אזהרה](/blog/guy-avni-lawyer-required-apartment-purchase/) קיימת.

## טעויות לפני העברת כסף

- תשלום גבוה בלי [נסח טאבו](https://www.gov.il/he/service/land_registration_extract).
- הסתמכות על הבטחה שה-[משכנתא](/blog/guy-avni-mortgage-pre-approval-process/) "תיפתר".
- אי בדיקת [עיקול](/blog/guy-avni-debt-collection-claim-minimum-amount/) פעיל.
- חתימה בלי [בדיקת זכויות](/blog/guy-avni-buying-from-contractor-checklist/) מקצועית.

## שאלות נפוצות

**איזה מסמך הכי חשוב?** [נסח טאבו](https://www.gov.il/he/service/land_registration_extract) עדכני.

**מי משחרר משכנתא?** המוכר והבנק שלו; אישור בכתב ל-[קונה דירה](/blog/guy-avni-apartment-buyer-required-documents/).

לפני חתימה, [יצירת קשר](/contact/) עם גיא אבני עורך דין לסקירת [נסח טאבו](https://www.gov.il/he/service/land_registration_extract). [גיא אבני עורך דין](/) מלווה [קונה דירה](/blog/guy-avni-lawyer-required-apartment-purchase/) בבדיקות לפני עסקה.${REAL_ESTATE_SOURCES}`,
	},
	'guy-avni-child-support-four-parameters-lower-payment': {
		title: 'גיא אבני עורך דין | מזונות ילדים: ארבעה פרמטרים',
		description:
			'חישוב מזונות ילדים לפי ארבעה פרמטרים: הכנסות, צרכים, זמני שהות ושינוי הסדר. מה מוריד את התשלום החודשי.',
		metaTitle: 'גיא אבני עורך דין | מזונות ילדים 4 פרמטרים',
		metaDescription:
			'גיא אבני עורך דין על מזונות ילדים: הכנסת הורים, זמני שהות, צרכי קטין ובקשה לשינוי הסדר. מה מוריד תשלום חודשי ב-2026.',
		category: 'family',
		tags: ['child-support', 'family', 'payments'],
		body: `## גיא אבני עורך דין: ארבעה פרמטרים במזונות ילדים

[מזונות ילדים](https://www.gov.il/he/departments/ministry_of_justice/govil-landing-page) נגזרים מארבעה פרמטרים: [הכנסת הורים](/blog/guy-avni-divorce-mediation-cost-vs-litigation/), [צרכי קטין](/blog/guy-avni-prenuptial-agreement-cost-divorce-savings/), [זמני שהות](/blog/guy-avni-choosing-lawyer-israel-comprehensive-guide/) ונסיבות משפחתיות. גיא אבני עורך דין מסביר איזה פרמטר משפיע הכי הרבה על [תשלום חודשי](/categories/family/).

## הכנסת הורים ושינוי תעסוקה

[הכנסת הורים](https://www.gov.il/he/departments/ministry_of_justice/govil-landing-page) היא בסיס החישוב. אבטלה, קידום או ירידה בהכנסה יכולים להצדיק [שינוי הסדר](/blog/guy-avni-divorce-mediation-cost-vs-litigation/) ב-[בית משפט למשפחה](/blog/guy-avni-prenuptial-agreement-cost-divorce-savings/).

## זמני שהות והשפעה על סכום

[זמני שהות](/blog/guy-avni-divorce-mediation-cost-vs-litigation/) מורחבים אצל ההורה המשלם לעיתים מורידים [מזונות ילדים](/categories/family/). תיעוד בפועל חשוב יותר מהצהרה ב-[הסכם מזונות](/blog/guy-avni-prenuptial-agreement-cost-divorce-savings/).

## צרכי קטין מיוחדים

[צרכי קטין](https://www.gov.il/he/departments/ministry_of_justice/govil-landing-page) כמו חינוך מיוחד או טיפולים דורשים אסמכתאות ל-[בית משפט למשפחה](/blog/guy-avni-divorce-mediation-cost-vs-litigation/). בלי תיעוד קשה לשנות [תשלום חודשי](/categories/family/).

## בקשה לשינוי הסדר

[שינוי הסדר](/blog/guy-avni-prenuptial-agreement-cost-divorce-savings/) דורש "שינוי נסיבות מהותי", לא כל שינוי קטן. [גירושין](/blog/guy-avni-divorce-mediation-cost-vs-litigation/) מאושרים עם [הסכם מזונות](/categories/family/) שניתן לעדכן.

## טעויות בהליך מזונות

- הפסקת [תשלום חודשי](/categories/family/) בלי צו חדש.
- אי הצגת [הכנסת הורים](/blog/guy-avni-divorce-mediation-cost-vs-litigation/) מעודכנת.
- התעלמות מ-[זמני שהות](/blog/guy-avni-prenuptial-agreement-cost-divorce-savings/) בפועל.
- בקשת [שינוי הסדר](/blog/guy-avni-divorce-mediation-cost-vs-litigation/) בלי תיעוד.

## שאלות נפוצות

**מה ארבעת הפרמטרים?** [הכנסת הורים](/blog/guy-avni-divorce-mediation-cost-vs-litigation/), [צרכי קטין](/blog/guy-avni-prenuptial-agreement-cost-divorce-savings/), [זמני שהות](/categories/family/), נסיבות.

**אפשר להפחית?** [שינוי הסדר](/blog/guy-avni-divorce-mediation-cost-vs-litigation/) בנסיבות מהותיות.

לפני הגשה, [יצירת קשר](/contact/) עם גיא אבני עורך דין לבדיקת [מזונות ילדים](/categories/family/). [גיא אבני עורך דין](/) מלווה הליכי [גירושין](/blog/guy-avni-divorce-mediation-cost-vs-litigation/) ו-[הסכם מזונות](/blog/guy-avni-prenuptial-agreement-cost-divorce-savings/).${FAMILY_SOURCES}`,
	},
	'guy-avni-choose-real-estate-lawyer': {
		title: 'גיא אבני עורך דין | בחירת עורך דין מקרקעין',
		description:
			'בחירת עורך דין מקרקעין: התמחות, שאלות בפגישה, דגלים אדומים ושקיפות בשכר טרחה לפני עסקת דירה.',
		metaTitle: 'גיא אבני עורך דין | בחירת עו"ד מקרקעין',
		metaDescription:
			'גיא אבני עורך דין על בחירת עורך דין מקרקעין: התמחות, שכר טרחה, דגלים אדומים ושאלות בפגישת ייעוץ ראשונית.',
		category: 'service',
		tags: ['service', 'real-estate', 'choosing-lawyer'],
		body: `## גיא אבני עורך דין: עורך דין מקרקעין אינו כל עורך דין

[עורך דין מקרקעין](https://www.israelbar.org.il/) מתמחה ב-[חוזה מכר](/blog/guy-avni-lawyer-required-apartment-purchase/), [בדיקת נסח](/blog/guy-avni-check-apartment-liens-before-purchase/) ו-[רישום בטאבו](/blog/guy-avni-apartment-buyer-required-documents/). גיא אבני עורך דין ממליץ לבדוק [התמחות](/blog/guy-avni-lawyer-types-israel-specialties-full-guide/) לפני [ליווי עסקה](/blog/guy-avni-choosing-lawyer-israel-comprehensive-guide/).

## קריטריונים לבחירה

[התמחות](/blog/guy-avni-lawyer-types-israel-specialties-full-guide/) בנדל"ן, ניסיון בעסקאות דומות ו-[שכר טרחה](/blog/guy-avni-find-winning-lawyer-israel-bar-members/) שקוף. [עורך דין מקרקעין](/blog/guy-avni-lawyer-required-apartment-purchase/) טוב מסביר סיכונים ב-[חוזה מכר](/blog/guy-avni-check-apartment-liens-before-purchase/) לפני חתימה.

## שאלות בפגישת ייעוץ ראשונית

ב-[פגישת ייעוץ](/blog/guy-avni-choosing-lawyer-israel-comprehensive-guide/) שאלו: מי מטפל בפועל, לוח זמנים, [שכר טרחה](/blog/guy-avni-find-winning-lawyer-israel-bar-members/) קבוע או שעתי, והאם [בדיקת נסח](/blog/guy-avni-check-apartment-liens-before-purchase/) כלולה. [ליווי עסקה](/blog/guy-avni-lawyer-required-apartment-purchase/) מלא כולל משא ומתן ו-[רישום בטאבו](/blog/guy-avni-apartment-buyer-required-documents/).

## דגלים אדומים

[דגלים אדומים](/blog/guy-avni-lawyer-dual-representation-ethics-complaint/): לחץ לחתום מהר, [שכר טרחה](/blog/guy-avni-find-winning-lawyer-israel-bar-members/) לא ברור, או ייצוג צדדים מתנגשים. בדקו [רישום בלשכה](https://www.israelbar.org.il/) לפני [התמחות](/blog/guy-avni-lawyer-types-israel-specialties-full-guide/) מוצהרת.

## טעויות בבחירת עורך דין

- בחירה לפי מחיר בלבד בלי [התמחות](/blog/guy-avni-lawyer-types-israel-specialties-full-guide/).
- ויתור על [פגישת ייעוץ](/blog/guy-avni-choosing-lawyer-israel-comprehensive-guide/) עצמאית.
- אי בדיקת [בדיקת נסח](/blog/guy-avni-check-apartment-liens-before-purchase/) לפני [חוזה מכר](/blog/guy-avni-lawyer-required-apartment-purchase/).

## שאלות נפוצות

**חייבים עורך דין מקרקעין?** לא תמיד בחוק; מומלץ מאוד ב-[ליווי עסקה](/blog/guy-avni-lawyer-required-apartment-purchase/).

**איך בודקים רישוי?** [לשכת עורכי הדין](https://www.israelbar.org.il/) באינטרנט.

לפני עסקה, [יצירת קשר](/contact/) עם גיא אבני עורך דין. [גיא אבני עורך דין](/) מפרסם מדריך [בחירת עורך דין](/blog/guy-avni-choosing-lawyer-israel-comprehensive-guide/) ו-[התמחות](/blog/guy-avni-lawyer-types-israel-specialties-full-guide/).${SERVICE_SOURCES}`,
	},
	'guy-avni-choosing-lawyer-israel-comprehensive-guide': {
		title: 'גיא אבני עורך דין | בחירת עורך דין בישראל: מדריך',
		description:
			'מדריך לבחירת עורך דין בישראל: התמחות, בדיקת רישוי, שכר טרחה, דגלים אדומים וחלופות הליך.',
		metaTitle: 'גיא אבני עורך דין | בחירת עורך דין בישראל',
		metaDescription:
			'גיא אבני עורך דין במדריך לבחירת עורך דין: התמחות משפטית, בדיקת רישוי, שכר טרחה, דגלים אדומים וחלופות לתביעה.',
		category: 'service',
		tags: ['clients', 'strategy', 'israel-law'],
		contentType: 'pillar',
		body: `## גיא אבני עורך דין: איך בוחרים עורך דין מתאים

[בחירת עורך דין](https://www.israelbar.org.il/) בישראל מתחילה ב-[התמחות משפטית](/blog/guy-avni-lawyer-types-israel-specialties-full-guide/) שמתאימה לבעיה: נדל"ן, משפחה, מס או [ייצוג משפטי](/blog/guy-avni-choose-real-estate-lawyer/) אזרחי. גיא אבני עורך דין מציג מסלול בדיקה לפני חתימה על [שכר טרחה](/blog/guy-avni-find-winning-lawyer-israel-bar-members/).

## התאמת התמחות לנושא

[התמחות משפטית](/blog/guy-avni-lawyer-types-israel-specialties-full-guide/) חשובה יותר ממוניטין כללי. [בחירת עורך דין](/blog/guy-avni-choose-real-estate-lawyer/) למקרקעין שונה מבחירה לדיני עבודה. קראו [יוריסט מול עורך דין](/blog/guy-avni-jurist-vs-lawyer-israel-licensing-guide/) לפני שמאייצים.

## בדיקת רישוי והמלצות

[בדיקת רישוי](https://www.israelbar.org.il/) בלשכת עורכי הדין היא צעד ראשון. [המלצות](/blog/guy-avni-find-winning-lawyer-israel-bar-members/) מלקוחות קודמים בעסקאות דומות משלימות את [בחירת עורך דין](/blog/guy-avni-choose-real-estate-lawyer/).

## שקיפות בשכר טרחה

[שכר טרחה](/blog/guy-avni-find-winning-lawyer-israel-bar-members/) בכתב מונע הפתעות: קבוע, שעתי או לפי אבן דרך. [פגישת ייעוץ](/blog/guy-avni-choose-real-estate-lawyer/) ראשונה אינה מחייבת המשך [ייצוג משפטי](/blog/guy-avni-lawyer-dual-representation-ethics-complaint/).

## חלופות לתביעה מלאה

גישור, בוררות או [פגישת ייעוץ](/blog/guy-avni-jurist-vs-lawyer-israel-licensing-guide/) חד-פעמי עשויים לחסוך זמן לפני [ייצוג משפטי](/blog/guy-avni-lawyer-dual-representation-ethics-complaint/) מלא. [בחירת עורך דין](/blog/guy-avni-choose-real-estate-lawyer/) כוללת בחירת מסלול הליך.

## צעדים מומלצים לפני חתימה על הסכם

1. [בדיקת רישוי](https://www.israelbar.org.il/) ב-[לשכת עורכי הדין](/blog/guy-avni-find-winning-lawyer-israel-bar-members/) ובדיקה שהעורך פעיל.
2. השוואת [התמחות משפטית](/blog/guy-avni-lawyer-types-israel-specialties-full-guide/) לבעיה שלכם: נדל"ן, משפחה, מס או ליטיגציה.
3. קבלת [שכר טרחה](/blog/guy-avni-find-winning-lawyer-israel-bar-members/) בכתב: מה כלול, מי מטפל בפועל ומה קורה אם העסקה נמשכת.
4. [פגישת ייעוץ](/blog/guy-avni-choose-real-estate-lawyer/) עם לפחות שני מועמדים לפני [ייצוג משפטי](/blog/guy-avni-lawyer-dual-representation-ethics-complaint/) מלא.
5. בדיקת [המלצות](/blog/guy-avni-find-winning-lawyer-israel-bar-members/) מלקוחות בעסקאות דומות, לא רק חוות דעת כלליות.

## מתי לבחור עורך דין מקרקעין או משפחה

[בחירת עורך דין](/blog/guy-avni-choose-real-estate-lawyer/) לעסקת דירה דורשת [התמחות משפטית](/blog/guy-avni-lawyer-types-israel-specialties-full-guide/) בטאבו, מיסוי ו-[ייצוג משפטי](/blog/guy-avni-lawyer-required-apartment-purchase/). בגירושין או סכסוך משפחתי עדיף [ייצוג משפטי](/blog/guy-avni-child-support-four-parameters-lower-payment/) עם ניסיון ב-[התמחות משפטית](/categories/family/). גיא אבני עורך דין ממליץ לא לחסוך על [בדיקת רישוי](/blog/guy-avni-find-winning-lawyer-israel-bar-members/) ו-[המלצות](/blog/guy-avni-find-winning-lawyer-israel-bar-members/) רק בגלל [שכר טרחה](/blog/guy-avni-find-winning-lawyer-israel-bar-members/) נמוך.

## דגלים אדומים

[דגלים אדומים](/blog/guy-avni-lawyer-dual-representation-ethics-complaint/): ערבויות ניצחון, לחץ, סירוב ל-[המלצות](/blog/guy-avni-find-winning-lawyer-israel-bar-members/). [בדיקת רישוי](https://www.israelbar.org.il/) חובה.

## שאלות נפוצות

**איך בוחרים התמחות?** לפי סוג הבעיה ו-[התמחות משפטית](/blog/guy-avni-lawyer-types-israel-specialties-full-guide/).

**פגישה ראשונה מחייבת?** לא; השוו [בחירת עורך דין](/blog/guy-avni-choose-real-estate-lawyer/) בין מועמדים.

גיא אבני עורך דין ממליץ לתעד כל [המלצות](/blog/guy-avni-find-winning-lawyer-israel-bar-members/) ו-[שכר טרחה](/blog/guy-avni-find-winning-lawyer-israel-bar-members/) שהוצגו ב-[פגישת ייעוץ](/blog/guy-avni-choose-real-estate-lawyer/) לפני החתימה.

לפני החלטה, [יצירת קשר](/contact/) עם גיא אבני עורך דין. [גיא אבני עורך דין](/) מפרסם מדריכי [בחירת עורך דין](/blog/guy-avni-lawyer-types-israel-specialties-full-guide/) ו-[ייצוג משפטי](/blog/guy-avni-lawyer-types-israel-specialties-full-guide/).${SERVICE_SOURCES}`,
	},
};
