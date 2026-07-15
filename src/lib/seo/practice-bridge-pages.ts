import type { SiteKeyword } from '@/consts';

/** Practice-bridge landings: non-brand H1; brand in subtitle/schema only. Bar-safe, no outcome claims. */
export type PracticeBridgeDef = {
	path: string;
	h1: string;
	subtitle: string;
	title: string;
	description: string;
	keyword: SiteKeyword;
	intro: string[];
	nextLinks: { href: string; label: string }[];
};

export const PRACTICE_BRIDGE_PAGES: PracticeBridgeDef[] = [
	{
		path: '/nedlan-lawyer-guy-avni/',
		h1: 'עורך דין נדל״ן ומיסוי מקרקעין - איך מתחילים',
		subtitle: 'גיא אבני עורך דין · ליווי עסקאות, מס שבח ומס רכישה',
		title: 'עורך דין נדל״ן ומיסוי | גיא אבני',
		description:
			'מדריך כניסה לליווי נדל״ן ומיסוי מקרקעין: מה לבדוק לפני חתימה, איך נראית פגישת מיקוד, ואיך ממשיכים לעמוד היישות ולשירותים.',
		keyword: 'גיא אבני עורך דין',
		intro: [
			'לפני עסקת מכר או רכישה כדאי לדעת איזה מסמכים רלוונטיים, מה בודקים מול רישום, ואיך נראית שיחת מיקוד בלי הבטחת תוצאה.',
			'העמוד הזה הוא גשר נושאי: מיקוד פרקטי בנושא, עם קישור ליישות המקצועית ולשירותים. אין כאן ייעוץ אישי לתיק שלכם.',
		],
		nextLinks: [
			{ href: '/about/', label: 'גיא אבני עורך דין - אודות' },
			{ href: '/services/', label: 'שירותים' },
			{ href: '/categories/tax/', label: 'קטגוריית מיסוי' },
		],
	},
	{
		path: '/contracts-lawyer-guy-avni/',
		h1: 'עורך דין חוזים וסכסוכים אזרחיים - לפני חתימה',
		subtitle: 'גיא אבני עורך דין · בדיקת חוזים וליווי מו״מ',
		title: 'עורך דין חוזים | גיא אבני',
		description:
			'מה לבדוק בחוזה לפני חתימה, איך מארגנים שאלות לפגישת מיקוד, ואיך ממשיכים לעמוד היישות של המשרד.',
		keyword: 'גיא אבני עורך דין',
		intro: [
			'חוזה טוב מתחיל בשאלות ברורות: מה מסוכן, מה חסר, ומה אפשר לדחות. העמוד מסביר סדר עבודה - לא מבטיח תוצאה בהליך.',
			'אחרי קריאה קצרה אפשר לעבור לאודות לשירותים או למאמרי חוזים. התוכן כללי ואינו תחליף לייעוץ אישי.',
		],
		nextLinks: [
			{ href: '/about/', label: 'גיא אבני עורך דין - אודות' },
			{ href: '/services/', label: 'שירותים' },
			{ href: '/categories/contracts/', label: 'קטגוריית חוזים' },
		],
	},
];

export function getPracticeBridge(path: string): PracticeBridgeDef | undefined {
	return PRACTICE_BRIDGE_PAGES.find((p) => p.path === path);
}

/** Fail-fast accessor for static practice-bridge routes (narrows for metadata + page). */
export function requirePracticeBridge(path: string): PracticeBridgeDef {
	const def = getPracticeBridge(path);
	if (!def) {
		console.error('[practice-bridge-pages] missing bridge definition', { path });
		throw new Error(`practice bridge missing ${path}`);
	}
	return def;
}
