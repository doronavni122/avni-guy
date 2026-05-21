import { MAIN_PAGE_HEROES } from '../../src/lib/seo/main-page-heroes.mjs';

const META_MIN = 120;
const META_MAX = 165;

/** Reference descriptions aligned with page.tsx metadata (length guard). */
const PAGE_META_DESCRIPTIONS = {
	'/': 'גיא אבני מרכז כאן מאמרים משפטיים בעברית, שירותים לפרטיים ולעסקים, ומסלול ברור לפגישת ייעוץ ראשונה. האתר מחבר בין קריאה לבין תיאום שיחה ממוקדת.',
	'/about/':
		'גיא אבני עו״ד מציג ערכים, ניסיון ודרך עבודה: שקיפות, סיכומים אחרי שיחות, מיפוי סיכונים וציפיות ברורות מהיום הראשון. קראו לפני פגישת מיקוד.',
	'/services/':
		'גיא אבני משרד עורכי דין: פגישת מיקוד, תכנון, ניסוח וליווי מסמכים, תקשורת מול גורמים חיצוניים ומעקב שמונע הפתעות. צעדים ברורים בכל שלב.',
	'/blog/':
		'גיא אבני עו״ד: מאגר מאמרים משפטיים בעברית על חוזים, נדל״ן, לקוחות ותהליכים. קראו לפני שיחה, סמנו מאמרים והגיעו מוכנים לייעוץ.',
	'/categories/':
		'גיא אבני עורך דין: קטגוריות מאמרים לפי תחום - אסטרטגיה, שירות, מסמכים ונדל״ן. בחרו נושא, קראו שני מאמרים והחליטו על הצעד הבא.',
	'/tags/':
		'גיא אבני משרד עורכי דין: תגיות לנושאים צרים - זכויות רוכש, ציות, לקוחות ודין ישראלי. מצאו מאמר רלוונטי בלי לדפדף את כל הארכיון.',
	'/contact/':
		'גיא אבני: תיאום שיחה בדוא״ל, מה להכין לפני פנייה, ומה צפוי בשיחה הראשונה - סיכום קצר, צעדים ברורים וללא הבטחות בלתי אפשריות. התוכן באתר אינו תחליף לייעוץ.',
};

function logErr(msg) {
	console.error('[check-main-page-meta] ERROR', msg);
}

export function runMainPageMetaChecks() {
	const errors = [];

	for (const [pagePath, expectedDesc] of Object.entries(PAGE_META_DESCRIPTIONS)) {
		const len = expectedDesc.length;
		if (len < META_MIN || len > META_MAX) {
			errors.push(`${pagePath}: reference description length ${len} outside ${META_MIN}-${META_MAX}`);
		}
	}

	const blogHero = MAIN_PAGE_HEROES['/blog/'];
	if (blogHero?.keyword !== 'גיא אבני עו״ד') {
		errors.push('/blog/: hero keyword should be גיא אבני עו״ד');
	}

	const contactHero = MAIN_PAGE_HEROES['/contact/'];
	if (contactHero?.keyword !== 'גיא אבני') {
		errors.push('/contact/: hero keyword should be גיא אבני');
	}

	if (errors.length > 0) {
		for (const e of errors) logErr(e);
		return { ok: false, errors };
	}
	return { ok: true, errors: [] };
}
