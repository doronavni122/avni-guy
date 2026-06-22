/** Category hub intro copy (130-200 Hebrew words) with pillar internal links. */

export type CategoryHubIntro = {
	paragraph: string;
	pillarLinks: { href: string; label: string }[];
};

const CATEGORY_HUBS: Record<string, CategoryHubIntro> = {
	'real-estate': {
		paragraph:
			'קטגוריית נדל"ן במאמרי גיא אבני מרכזת ליווי בקנייה, מכירה, שכירות והתחדשות עירונית. כאן תמצאו הסברים על בדיקות לפני חתימה, חוק מכר מול יזם, מס רכישה ושבח, וזכויות דיירים בפרויקטים. המטרה היא לתת מפת דרכים ברורה לפני שמעבירים כסף או חותמים על זיכרון דברים, עם קישורים למדריכי ליבה בנושאי עסקה, מסמכים וסיכונים נפוצים.',
		pillarLinks: [
			{ href: '/blog/lawyer-required-apartment-purchase/', label: 'האם צריך עורך דין לקניית דירה' },
			{ href: '/blog/buying-from-contractor-checklist/', label: 'צ\'קליסט קנייה מקבלן' },
			{ href: '/blog/sale-law-guarantee-importance/', label: 'ערבות חוק מכר' },
			{ href: '/blog/tenant-rights-israel/', label: 'זכויות שוכר בישראל' },
			{ href: '/blog/tama38-vs-evacuation-reconstruction/', label: 'תמ"א 38 מול פינוי בינוי' },
		],
	},
	tax: {
		paragraph:
			'מיסוי מקרקעין ומס הכנסה על נכסים דורשים תכנון לפני מכירה, רכישה או חלוקת עסקה. בקטגוריית מיסוי תמצאו מדריכים על פטור מס רכישה לדירה ראשונה, חישוב מס לדירה שנייה, מס שבח, קיזוז הפסדים וערעורים מול רשות המיסים. גיא אבני עורך דין מסביר מתי כדאי לפעול מוקדם, אילו מסמכים לרכז ואיך להימנע מתשלום מיותר או מקנס על איחור בדיווח.',
		pillarLinks: [
			{ href: '/blog/purchase-tax-exemption-first-apartment/', label: 'פטור מס רכישה לדירה ראשונה' },
			{ href: '/blog/second-apartment-purchase-tax-calculation/', label: 'חישוב מס רכישה לדירה שנייה' },
			{ href: '/blog/capital-gains-exemption-single-apartment-2026/', label: 'פטור מס שבח לדירה יחידה' },
			{ href: '/blog/additional-tax-who-pays/', label: 'מס רכישה נוסף - מי משלם' },
			{ href: '/blog/tax-authority-appeal-process/', label: 'ערעור מול רשות המיסים' },
		],
	},
	litigation: {
		paragraph:
			'קטגוריית ליטיגציה מכסה תביעות אזרחיות, גבייה, הוצל"פ, ליקויי צרכנות וסכסוכים מול גופים. המאמרים מסבירים מתי כדאי לשקול גישור, מה סף תביעה קטנה, איך להגיב לצו מניעה או הקפאת חשבון, ומה התיעוד שמחזק עמדה בבית משפט. גיא אבני עורך דין מדגיש הכנה מוקדמת, חישוב עלויות-תועלת וייצוג שמבוסס על ראיות ולא על סיסמה.',
		pillarLinks: [
			{ href: '/blog/small-claims-without-lawyer-why-lose/', label: 'תביעה קטנה בלי עורך דין' },
			{ href: '/blog/debt-collection-claim-minimum-amount/', label: 'תביעת גבייה - סכום מינימלי' },
			{ href: '/blog/enforcement-freeze-bank-account-release-48-hours/', label: 'שחרור הקפאת חשבון בהוצל"פ' },
			{ href: '/blog/mediation-cheaper-than-lawsuit-why-not-offered/', label: 'גישור מול תביעה' },
			{ href: '/blog/defamation-claim-without-damage-proof/', label: 'תביעת לשון הרע' },
		],
	},
	contracts: {
		paragraph:
			'חוזים עסקיים ופרטיים קובעים זכויות, חובות וסיכונים לשנים קדימה. בקטגוריית חוזים תמצאו מדריכים על סקירת טיוטה, סעיפי סיכון, הגבלות עסק, ביטול עסקה ותקופות התיישנות. גיא אבני עורך דין ממליץ לזהות מראש מי מייצג את מי, מה קורה בחריגה מלוח זמנים, ואילו ניסוחים עלולים להעביר סיכון לצד השני בלי ששמים לב.',
		pillarLinks: [
			{ href: '/blog/contract-review-flow/', label: 'סקירת חוזה לפני חתימה' },
			{ href: '/blog/israeli-contract-red-flags-spot-three/', label: 'דגלים אדומים בחוזה' },
			{ href: '/blog/cancel-signed-contract-israel-fourteen-days/', label: 'ביטול חוזה תוך 14 יום' },
			{ href: '/blog/non-compete-clause-israel-enforceability/', label: 'סעיף אי-תחרות' },
			{ href: '/blog/contract-breach-statute-limitations-seven-years/', label: 'התיישנות על הפרת חוזה' },
		],
	},
	service: {
		paragraph:
			'קטגוריית שירות משפטי עוסקת בבחירת ייצוג, תפקיד עורך הדין בעסקאות נדל"ן, עלויות, אתיקה וציפיות מהליווי. המאמרים מסבירים מתי חייבים בפועל עורך דין, איך להשוות הצעות, מה לשאול בפגישה ראשונה, ומה ההבדל בין ייעוץ חד-פעמי לייצוג מלא. גיא אבני עורך דין שם דגש על שקיפות, תיעוד החלטות ומניעת טעויות יקרות לפני חתימה.',
		pillarLinks: [
			{ href: '/blog/choosing-lawyer-israel-comprehensive-guide/', label: 'מדריך בחירת עורך דין' },
			{ href: '/blog/lawyer-types-israel-specialties-full-guide/', label: 'סוגי עורכי דין והתמחויות' },
			{ href: '/blog/jurist-vs-lawyer-israel-licensing-guide/', label: 'יוריסט מול עורך דין' },
			{ href: '/blog/lawyer-required-apartment-purchase/', label: 'עורך דין לקניית דירה' },
			{ href: '/blog/find-winning-lawyer-israel-bar-members/', label: 'איתור עורך דין בלשכה' },
		],
	},
};

const DEFAULT_INTRO: CategoryHubIntro = {
	paragraph:
		'מאגר המאמרים של גיא אבני עורך דין מסודר לפי קטגוריות כדי לאפשר התמקדות בנושא אחד בכל פעם. כל מאמר מציע הסבר בעברית ברורה, קישורים פנימיים למדריכים קשורים, ונקודות פעולה לפני פנייה לייעוץ. עברו בין הקטגוריות, סמנו מאמר רלוונטי, והשתמשו בקישורי ההמשך בתוך כל עמוד כדי לבנות תמונת מצב מלאה.',
	pillarLinks: [
		{ href: '/blog/choosing-lawyer-israel-comprehensive-guide/', label: 'בחירת עורך דין בישראל' },
		{ href: '/blog/contract-review-flow/', label: 'סקירת חוזה' },
		{ href: '/blog/', label: 'כל המאמרים' },
	],
};

export function getCategoryHubIntro(category: string): CategoryHubIntro {
	return CATEGORY_HUBS[category] ?? DEFAULT_INTRO;
}
