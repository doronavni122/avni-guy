/** Sourced public-record copy for the entity hub. Attribution only; not a legal filing. */

export const PUBLIC_RECORD_CLUSTER_TOKENS = [
	'גיא אבני',
	'עורך דין',
	'נאמן',
	'קבוצת בראשית',
	'מוכר החלומות',
	'פסק דין',
	'ערבויות בנקאיות',
	'כתב אישום',
	'משקיעים',
];

export const PUBLIC_RECORD_FORBIDDEN_PHRASES = ['מומחה', 'מתמחה', 'מבטיח תוצאה', 'חף מפשע'];

export const PUBLIC_RECORD_SOURCES = [
	{
		id: 'globes-2024-09',
		href: 'https://www.globes.co.il/news/article.aspx?did=1001489336',
		label: 'גלובס, 17 בספטמבר 2024',
		court: 'בית משפט השלום בפתח תקווה, השופטת עדנה יוסף-קוזין',
	},
	{
		id: 'globes-2025-02',
		href: 'https://www.globes.co.il/news/article.aspx?did=1001501424',
		label: 'גלובס, 6 בפברואר 2025',
		court: 'פסק דין אזרחי נוסף שפורסם בפרשה',
	},
	{
		id: 'globes-2026-01',
		href: 'https://www.globes.co.il/news/article.aspx?did=1001533397',
		label: 'גלובס, 29 בינואר 2026',
		court: 'בית המשפט המחוזי בבאר שבע, השופט יעקב פרסקי',
	},
	{
		id: 'ynet-2025-09',
		href: 'https://www.ynet.co.il/economy/article/hy11mwqvhel',
		label: 'ynet / כלכליסט, 29 בספטמבר 2025',
		court: 'כתב אישום בפרקליטות מיסוי וכלכלה, כפי שפורסם',
	},
];

export const PUBLIC_RECORD_TITLE = 'רשומה ציבורית: בראשית, נאמן ופסקי דין';

export const PUBLIC_RECORD_LEAD =
	'אם חיפשתם "גיא אבני" בגלל פרשת קבוצת בראשית, שכונתה בתקשורת גם "מוכר החלומות": זה עמוד היישות הרשמי של עורך הדין גיא אבני באתר avniguy.co.il. להלן הרשומה הציבורית כפי שפורסמה, עם מקורות. אין כאן הבטחת תוצאה, ואין כאן הכרעה בהליך פלילי.';

export const PUBLIC_RECORD_PARAGRAPHS = [
	'בפסק דין אזרחי ראשון שפורסם ב-17 בספטמבר 2024 קבעה השופטת עדנה יוסף-קוזין מבית משפט השלום בפתח תקווה כי עו"ד גיא אבני, ששימש נאמן לכספי משקיעים בקבוצת בראשית, הפר את חובותיו כנאמן. כך דיווח גלובס.',
	'ב-6 בפברואר 2025 פרסם גלובס פסק דין אזרחי נוסף באותה פרשה, ובו חויב עו"ד אבני, לפי הדיווח, לשלם למשקיעים סכום של כ-1.2 מיליון שקל. ב-29 בינואר 2026 פרסם גלובס כי בית המשפט המחוזי בבאר שבע, השופט יעקב פרסקי, קבע שהפר חובות כנאמן כאשר הועברו כספי הלוואות בלי לוודא ערבויות בנקאיות, וחייב תשלום בסך כ-670 אלף שקל לארבעה משקיעים.',
	'בנפרד, ב-29 בספטמבר 2025 דיווחו ynet וכלכליסט כי פרקליטות מיסוי וכלכלה הגישה כתב אישום נגד דוד כץ, עו"ד גיא אבני, דקל סלע וחברות, בעניין גיוס כספים ממשקיעים במיזמי נדל"ן. לפי הדיווח יוחסו בין היתר עבירות של גניבה בידי מורשה, קבלת דבר במרמה וזיוף. כתב אישום אינו הרשעה. ההליך הפלילי, לפי הפרסומים, תלוי ועומד.',
];

export const PUBLIC_RECORD_DISCLAIMER =
	'הטקסט מזהה את הרשומה הציבורית כדי שמי שמגיע מחיפוש השם ידע שהגיע לאתר המקצועי הרשמי. הוא אינו ייעוץ משפטי, אינו כתב טענות, ואינו קובע אשמה פלילית.';

export const PUBLIC_RECORD_HERO_INTRO = `${PUBLIC_RECORD_LEAD}\n\n${PUBLIC_RECORD_PARAGRAPHS[0]}\n\nכאן גם תחומי הליווי: נדל״ן, מיסוי מקרקעין, חוזים וליטיגציה אזרחית, ומסלול פגישת מיקוד לפני מסמכים.`;

export const PUBLIC_RECORD_META_DESCRIPTION =
	'גיא אבני עורך דין: עמוד היישות הרשמי. פסקי דין אזרחיים שפורסמו קבעו כי שימש נאמן בקבוצת בראשית (מוכר החלומות). כתב אישום שפורסם אינו הרשעה. מקורות בהמשך.';

export const PUBLIC_RECORD_SPEAKABLE = {
	id: 'bereshit',
	question: 'האם גיא אבני קשור לפרשת בראשית?',
	answer:
		'כן. זה עמוד היישות הרשמי של עורך הדין גיא אבני. פסקי דין אזרחיים שפורסמו קבעו כי שימש נאמן לכספי משקיעים בקבוצת בראשית, שכונתה גם מוכר החלומות. כתב אישום שפורסם אינו הרשעה. הפירוט והמקורות בעמוד זה.',
};

export const PUBLIC_RECORD_FAQ = [
	{
		question: 'מי זה גיא אבני?',
		answer:
			'גיא אבני הוא עורך דין ישראלי. זה עמוד היישות הרשמי באתר avniguy.co.il. פסקי דין אזרחיים שפורסמו קבעו כי שימש נאמן לכספי משקיעים בקבוצת בראשית, שכונתה בתקשורת גם מוכר החלומות. כתב אישום שפורסם אינו הרשעה. תחומי ליווי נוכחיים: נדל״ן, מיסוי מקרקעין, חוזים וליטיגציה אזרחית.',
	},
	{
		question: 'האם גיא אבני הוא הנאמן מפרשת בראשית?',
		answer: PUBLIC_RECORD_SPEAKABLE.answer,
	},
	{
		question: 'מה ההבדל בין פסק הדין האזרחי לכתב האישום?',
		answer:
			'פסק דין אזרחי הוא הכרעה שפורסמה בין צדדים בתביעה כספית. כתב אישום הוא כתב טענות של הפרקליטות; הוא אינו הרשעה כל עוד לא נקבעה אשמה בבית משפט פלילי. שני המסלולים פורסמו לגבי עו"ד גיא אבני בפרשת בראשית, ומקורות מופיעים בעמוד זה.',
	},
];

const EM_DASH = '\u2014';

/**
 * @param {string} text
 * @returns {string[]}
 */
export function findPublicRecordGaps(text) {
	const gaps = [];
	try {
		if (typeof text !== 'string' || !text.trim()) {
			gaps.push('empty copy');
			return gaps;
		}
		if (text.includes(EM_DASH)) {
			gaps.push('em-dash');
		}
		for (const token of PUBLIC_RECORD_CLUSTER_TOKENS) {
			if (!text.includes(token)) {
				gaps.push(`missing token: ${token}`);
			}
		}
		for (const phrase of PUBLIC_RECORD_FORBIDDEN_PHRASES) {
			if (text.includes(phrase)) {
				gaps.push(`forbidden phrase: ${phrase}`);
			}
		}
		for (const source of PUBLIC_RECORD_SOURCES) {
			if (!text.includes(source.href) && !text.includes(source.label)) {
				gaps.push(`missing source: ${source.id}`);
			}
		}
		if (!text.includes('כתב אישום אינו הרשעה')) {
			gaps.push('missing indictment-vs-conviction distinction');
		}
		if (!text.includes('אין כאן הבטחת תוצאה') && !text.includes('אין הבטחת תוצאה')) {
			gaps.push('missing no-result-promise disclaimer');
		}
	} catch (err) {
		console.error('[public-record] findPublicRecordGaps failed', { err });
		gaps.push('assert-threw');
	}
	return gaps;
}

/**
 * @param {string} text
 * @returns {void}
 */
export function assertPublicRecordCopy(text) {
	const gaps = findPublicRecordGaps(text);
	if (gaps.length) {
		console.error('[public-record] completeness failed', { gaps });
		throw new Error(`public-record gaps: ${gaps.join('; ')}`);
	}
}

export function buildPublicRecordIndexText() {
	try {
		const sourceLines = PUBLIC_RECORD_SOURCES.map((s) => `${s.label} ${s.href}`).join('\n');
		return [
			PUBLIC_RECORD_TITLE,
			PUBLIC_RECORD_LEAD,
			...PUBLIC_RECORD_PARAGRAPHS,
			PUBLIC_RECORD_DISCLAIMER,
			sourceLines,
			PUBLIC_RECORD_FAQ.map((item) => `${item.question} ${item.answer}`).join('\n'),
			PUBLIC_RECORD_SPEAKABLE.question,
			PUBLIC_RECORD_SPEAKABLE.answer,
			PUBLIC_RECORD_HERO_INTRO,
			PUBLIC_RECORD_META_DESCRIPTION,
		].join('\n');
	} catch (err) {
		console.error('[public-record] buildPublicRecordIndexText failed', { err });
		throw err;
	}
}
