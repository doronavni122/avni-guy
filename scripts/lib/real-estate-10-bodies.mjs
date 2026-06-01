import fs from 'node:fs';
import path from 'node:path';

const BODIES_DIR = path.join(process.cwd(), '.cursor/tmp/bodies');

/** @type {Record<string, { title: string, description: string, metaTitle: string, metaDescription: string, category: string, tags: string[] }>} */
export const REAL_ESTATE_10_META = {
	'guy-avni-tama38-vs-evacuation-reconstruction': {
		title: 'תמ״א 38 מול פינוי בינוי: מה ההבדל וכמה זה שווה',
		description:
			'השוואת תמ״א 38/1, 38/2 ופינוי בינוי: היקף, אחוזי הסכמה, פינוי, מיסוי, היטל השבחה ולוחות זמנים.',
		metaTitle: 'גיא אבני עורך דין | תמא 38 מול פינוי בינוי | ישראל',
		metaDescription:
			'תמא 38 או פינוי בינוי? הבדלי היקף, אחוזי הסכמה, פינוי, מיסוי והיטל. גיא אבני עורך דין מסביר מה לבדוק בחוזה עם היזם לפני חתימה.',
		category: 'real-estate',
		tags: ['real-estate', 'tama38', 'urban-renewal'],
	},
	'guy-avni-evacuation-reconstruction-project-duration': {
		title: 'כמה זמן באמת לוקח פרויקט פינוי בינוי',
		description:
			'כמה זמן באמת לוקח פרויקט פינוי בינוי: שלבי תכנון, הסכמות, היתרים ובנייה, טווחים מעשיים וטעויות שמאריכות את הדרך.',
		metaTitle: 'גיא אבני עורך דין | משך פרויקט פינוי בינוי בישראל',
		metaDescription:
			'כמה זמן לוקח פרויקט פינוי בינוי? שלבי יזום, 66% חתימות, תכנון 24-30 חודש, בנייה 18-24 חודש. גיא אבני עורך דין מסביר טווחים ומוקדי עיכוב.',
		category: 'real-estate',
		tags: ['real-estate', 'urban-renewal', 'timeline'],
	},
	'guy-avni-urban-renewal-tenant-rights': {
		title: 'מה הזכויות שלכם לפני שחותמים על התחדשות עירונית',
		description:
			'זכויות דיירים בהתחדשות עירונית לפני חתימה: שקיפות, ביטול הסכם, פיצוי ליזם, ועד בית, עורך דין ותקנות 2024.',
		metaTitle: 'גיא אבני עורך דין | זכויות בהתחדשות עירונית לפני חתימה',
		metaDescription:
			'מה הזכויות שלכם בהתחדשות עירונית לפני שחותמים? שקיפות, ביטול עסקה, ועד בית ועורך דין. גיא אבני עורך דין מסביר צעדים מעשיים.',
		category: 'real-estate',
		tags: ['real-estate', 'urban-renewal', 'rights'],
	},
	'guy-avni-refuse-tama38-signature': {
		title: 'אפשר לסרב לחתום על תמא 38? הנה מה שקורה',
		description:
			'האם אפשר לסרב לחתום על תמ"א 38? מתי הרוב יכול לכפות, תפקיד מפקח המקרקעין, ומה קורה בפינוי בינוי.',
		metaTitle: 'גיא אבני עורך דין | סירוב לחתום על תמ"א 38 בישראל',
		metaDescription:
			'אפשר לסרב לחתום תמ"א 38? מתי 66% כופים חתימה, תפקיד מפקח המקרקעין וזכויות מיעוט. גיא אבני עורך דין מסביר את המסלול המשפטי.',
		category: 'real-estate',
		tags: ['real-estate', 'tama38', 'rights'],
	},
	'guy-avni-capital-gains-tax-evacuation-reconstruction': {
		title: 'מי משלם מס שבח בפרויקט פינוי בינוי',
		description:
			'מי משלם מס שבח בפינוי בינוי: פטורים, תנאים, מכירה לפני הריסה, ומי מממש את ההטבה בפועל.',
		metaTitle: 'גיא אבני עורך דין | מס שבח בפרויקט פינוי בינוי',
		metaDescription:
			'מי משלם מס שבח בפינוי בינוי? פטור, תנאים, מכירה לפני הריסה ושווי עסקה. גיא אבני עורך דין מסביר את חלוקת הנטל והטעויות.',
		category: 'tax',
		tags: ['tax', 'capital-gains', 'urban-renewal'],
	},
	'guy-avni-buying-from-contractor-checklist': {
		title: 'מה לבדוק לפני קנייה מקבלן - אל תדלגו על זה',
		description:
			"צ'קליסט לפני קנייה מקבלן: יזם, היתר, ערבות חוק מכר, מפרט טכני, לוח תשלומים וטעויות נפוצות.",
		metaTitle: "גיא אבני עורך דין | צ'קליסט קנייה מקבלן בישראל",
		metaDescription:
			"מה לבדוק לפני קנייה מקבלן? יזם, היתר, ערבות חוק מכר, מפרט ומשכנתא. גיא אבני עורך דין מפרט צ'קליסט מעשי לפני חתימה.",
		category: 'real-estate',
		tags: ['real-estate', 'buyer', 'contractor'],
	},
	'guy-avni-second-hand-apartment-sale-agreement': {
		title: 'מה חייב להיות בהסכם מכר דירה יד שנייה',
		description:
			'מה חייב להיות בהסכם מכר דירה יד שנייה: צדדים, מחיר, שעבודים, מסירה, פיצויים ורישום בטאבו.',
		metaTitle: 'גיא אבני עורך דין | הסכם מכר דירה יד שנייה',
		metaDescription:
			'מה חייב להיות בהסכם מכר דירה יד שנייה? תיאור נכס, תשלומים, שעבודים, מסירה ופיצוי. גיא אבני עורך דין מפרט סעיפים חובה.',
		category: 'contracts',
		tags: ['contracts', 'sale-agreement', 'real-estate'],
	},
	'guy-avni-lawyer-required-apartment-purchase': {
		title: 'באמת צריך עורך דין כדי לקנות דירה?',
		description:
			'האם חייבים עורך דין לקניית דירה? מה התפקיד שלו, מה הסיכון בלי ליווי, ומתי זה קריטי במיוחד.',
		metaTitle: 'גיא אבני עורך דין | האם צריך עו"ד לקניית דירה?',
		metaDescription:
			'באמת צריך עורך דין לקניית דירה? תפקיד, סיכונים בלי ליווי, מקבלן מול יד שנייה. גיא אבני עורך דין מסביר מתי זה חובה מעשית.',
		category: 'service',
		tags: ['service', 'buyer', 'real-estate'],
	},
	'guy-avni-sale-law-guarantee-importance': {
		title: 'מה זו ערבות חוק מכר ולמה היא שומרת על הכסף שלכם',
		description:
			'מהי ערבות חוק מכר, למה היא שומרת על כספכם, סוגי ערבויות, ומה קורה כשקבלן קורס.',
		metaTitle: 'גיא אבני עורך דין | ערבות חוק מכר לרוכשי דירות',
		metaDescription:
			'מה זו ערבות חוק מכר ולמה היא חשובה? סוגי ערבויות, 15% ללא בטוחה, ומה קורה בקריסת קבלן. גיא אבני עורך דין מסביר.',
		category: 'real-estate',
		tags: ['real-estate', 'guarantee', 'buyer'],
	},
	'guy-avni-cancel-apartment-purchase-contract': {
		title: 'איך מבטלים חוזה קניית דירה בלי להיפגע',
		description:
			'איך מבטלים חוזה קניית דירה: זכות ביטול, פיצוי מוסכם, הפרה יסודית, ומקבלן מול יד שנייה.',
		metaTitle: 'גיא אבני עורך דין | ביטול חוזה קניית דירה בישראל',
		metaDescription:
			'איך מבטלים חוזה קניית דירה בלי להיפגע? פיצוי 10%, הפרה יסודית, זיכרון דברים. גיא אבני עורך דין מסביר את המסלול.',
		category: 'contracts',
		tags: ['contracts', 'cancellation', 'real-estate'],
	},
};

export function getRealEstate10Body(slug) {
	const fp = path.join(BODIES_DIR, `${slug}.md`);
	if (!fs.existsSync(fp)) return null;
	return fs.readFileSync(fp, 'utf8');
}
