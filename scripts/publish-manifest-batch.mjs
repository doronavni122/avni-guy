#!/usr/bin/env node
/**
 * Convert reserch-based-articles + subject-manifest → src/content/blog/*.mdx
 */
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const ROOT = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'subject-manifest.json'), 'utf8'));
const nnnns = process.argv.slice(2).length ? process.argv.slice(2) : ['0006', '0007', '0008', '0009', '0010'];

const META = {
	'0006': {
		title: 'בנק מסרב למשכנתא: מה לעשות ואיך לפעול | גיא אבני',
		description:
			'מה לעשות כשבנק מסרב להעמיד משכנתא? זכויות לווים, ערעור, אפשרויות מימון חלופיות וייעוץ משפטי. מדריך מקיף לרוכשי דירות בישראל.',
		subject: 'מה לעשות כשבנק מסרב להעמיד משכנתא',
		tags: ['real-estate', 'mortgage', 'bank-refuses'],
		images: ['mortgage', 'document', 'contract'],
	},
	'0007': {
		title: 'דיווח שכירות לרשות המסים: מסלולים, מועדים וטפסים | גיא אבני',
		description:
			'איך מדווחים על שכירות לרשות המסים? מדריך למסלולי פטור, 10% ורגיל, מערכת הדיווח המקוונת, מועדים, טפסים ועיצומים על אי-דיווח.',
		subject: 'איך מדווחים על שכירות לרשות המסים',
		tags: ['tax', 'rental-income', 'reporting'],
		images: ['rental', 'apartment', 'keys'],
	},
	'0008': {
		title: 'מע"מ על עסקת נדלן: מתי ואיך משלמים | גיא אבני',
		description:
			'מתי משלמים מע"מ על עסקת נדלן בישראל? עסקאות חייבות, פטורים, מוכרים עוסקים ופרטיים, והשלכות מעשיות לקונים ולמוכרים בנדל"ן.',
		subject: 'מתי משלמים מע"מ על עסקת נדלן',
		tags: ['tax', 'vat', 'real-estate'],
		images: ['tax', 'invoice', 'building'],
	},
	'0009': {
		title: 'הסכם קומבינציה: מה זה ומה הסיכונים | גיא אבני',
		description:
			'מה זה הסכם קומבינציה ומה הסיכונים? מבנה העסקה, השלכות מס שבח ומע"מ, הגנות משפטיות, ערבויות וייעוץ לבעלי קרקע ויזמים בישראל.',
		subject: 'מה זה הסכם קומבינציה ומה הסיכונים',
		tags: ['real-estate-law', 'combination-agreement', 'construction-contract'],
		images: ['construction', 'blueprint', 'land'],
	},
	'0010': {
		title: 'מס שבח על דירה בירושה: חישוב וזכויות | גיא אבני',
		description:
			'איך מחשבים מס שבח על דירה שנקבלה בירושה? בסיס חישוב, פטורים ליורשים, חוק מיסוי מקרקעין ועצות מעשיות. ייעוץ משפטי.',
		subject: 'איך מחשבים מס שבח על דירה שנקבלה בירושה',
		tags: ['tax', 'capital-gains', 'inheritance'],
		images: ['inheritance', 'house', 'keys'],
	},
};

function parseFaq(body) {
	const faq = [];
	const m = body.match(/## שאלות נפוצות\n([\s\S]*?)(?=\n## |\Z)/);
	if (!m) return faq;
	for (const block of m[1].split(/\n### /).filter(Boolean)) {
		const lines = block.trim().split('\n');
		const question = lines[0].replace(/^#+\s*/, '').trim();
		const answer = lines.slice(1).join('\n').trim();
		if (question.length >= 8 && answer.length >= 20) faq.push({ question, answer });
	}
	return faq.slice(0, 6);
}

function extractBody(raw) {
	const parsed = matter(raw);
	let body = parsed.content.trimStart();
	body = body.replace(/^#\s[^\n]+\n+/m, '');
	return body.trimStart();
}

function buildImages(slug, terms) {
	return terms.map((term, i) => ({
		src: `https://avniguy.co.il/images/blog/${slug}-img-${i + 1}-${term}.jpg`,
		alt: `תצלום ${i + 1} - ${slug}`,
		title: `${slug} img-${i + 1}`,
		description: `Legal stock photo for ${slug}.`,
		source: 'https://unsplash.com/license',
	}));
}

const FALLBACK_FAQ = {
	'0006': [
		{ question: 'האם בנק חייב להעמיד משכנתא?', answer: 'לא. בנק אינו מחויב חוקית להעמיד אשראי. עם זאת, הוא חייב לנמק את הדחייה בכתב, לעמוד בחובות שקיפות, ולהודיע תוך 5-7 ימי עסקים.' },
		{ question: 'מה עושים מיד אחרי סירוב?', answer: 'אל תפנו מיד לבנק אחר. דרשו נימוק רשמי, הפיקו דוח נתוני אשראי, הבינו את עילת הסירוב, ורק אז תקנו את המסמכים והגישו מחדש.' },
		{ question: 'האם ניתן לערער על סירוב?', answer: 'כן. ערעור פנים-בנקאי, תלונה ליחידת פניות הציבור בפיקוח על הבנקים, ובמקרים קיצוניים פנייה לבית משפט.' },
		{ question: 'מהן עילות הסירוב הנפוצות?', answer: 'דירוג אשראי נמוך, יחס החזר-הכנסה גבוה (מעל 40%), מגבלות LTV (75%/70%/50%), בעיות ברישום הנכס, תיק מורכב (עצמאים, ערבים).' },
		{ question: 'מהן אפשרויות המימון החלופיות?', answer: 'בנק אחר (אחרי תיקון), גופים חוץ בנקאיים, ערבות ממשלתית, הגדלת הון עצמי (הלוואה ממשפחה).' },
		{ question: 'מה קורה אם נדחיתי אחרי אישור עקרוני?', answer: 'האישור תקף 24 ימים. דחייה בשלב זה נובעת לרוב מפער בין הצהרה ראשונית לבדיקה מעמיקה. פעלו בתוך התוקף והגישו מסמכים מלאים.' },
	],
	'0009': [
		{ question: 'מה זה הסכם קומבינציה?', answer: 'עסקת חליפין שבה בעל קרקע מעביר חלק מזכויותיו ליזם בתמורה לשירותי בנייה ודירות. מוגדרת בדין כ"עסקת חליפין" עם השלכות מיסוייות כפולות.' },
		{ question: 'מה הסיכונים העיקריים לבעל הקרקע?', answer: 'קריסת יזם, חבות מע"מ בלתי צפויה, מס שבח לפני קבלת תמורה, היטל השבחה, עיכובי בנייה, ומחלוקות על שיעור הקומבינציה.' },
		{ question: 'מתי נובע מס שבח בעסקת קומבינציה?', answer: 'ביום חתימת ההסכם, גם אם ייקח שנים עד קבלת הדירות. יש לתכנן תזרים מזומנים מראש.' },
		{ question: 'מה ההגנות החשובות בהסכם?', answer: 'ערבות בנקאית אוטונומית (חוק המכר), לוחות זמנים מחייבים, הגדרת הפרה יסודית, מנגנון יציאה, והסדרת מיסוי ברורה.' },
		{ question: 'האם קומבינציה שונה מתמ"א 38?', answer: 'תמ"א 38 היא מסגרת תכנונית שיוצרת עסקאות קומבינציה מיוחדות: פינוי-בינוי עם שיפוץ דירות, ממ"ד ומרפסות.' },
		{ question: 'האם צריך עורך דין לפני חתימה?', answer: 'כן. עסקת קומבינציה מורכבת משפטית ומיסויית. ליווי מקדים מונע חבות מס בלתי צפויה, אובדן נכס, וסכסוכים ממושכים.' },
	],
	'0007': [
		{ question: 'איך מדווחים על שכירות לרשות המסים?', answer: 'דרך המערכת המקוונת: פתיחת תיק 95, הזנת פרטי הנכס, העלאת חוזה שכירות, ובחירת מסלול. במסלול 10%: טופס 3302 עד 30 בינואר.' },
		{ question: 'מה תקרת הפטור לשנת 2026?', answer: '5,654 ש"ח לחודש (מוקפא). הכנסה מעל 11,308 ש"ח לחודש שוללת את הפטור לחלוטין.' },
		{ question: 'מה קורה אם לא מדווחים על שכירות?', answer: 'עיצום 220, ריבית, שומה לפי מיטב השפיטה, ובמקרים חמורים חקירה פלילית. רשות המסים מצליבה נתונים ממרשם המקרקעין.' },
		{ question: 'מתי לשלם מס במסלול 10%?', answer: 'עד 30 בינואר של השנה שלאחר שנת המס (למשל, הכנסות 2025 עד 30.01.2026).' },
		{ question: 'האם צריך לצרף חוזה שכירות?', answer: 'כן, מ-2024 חובה לצרף חוזי שכירות לדיווח. ללא חוזה, נדרש תצהיר חתום בפני עורך דין.' },
		{ question: 'האם מסלול 10% משפיע על מס שבח עתידי?', answer: 'כן. בחירה במסלול 10% מונעת ניכוי פחת, והפחת שניתן היה לנכות מצטרף לשווי המכירה בחישוב מס שבח.' },
	],
	'0008': [
		{ question: 'מתי משלמים מע"מ על עסקת נדלן?', answer: 'כשהמוכר הוא עוסק מורשה (קבלן, יזם, סוחר), או כשהעסקה כוללת שירותים חייבים במע"מ. מכירה פרטית של דירת מגורים יד שנייה: בדרך כלל ללא מע"מ.' },
		{ question: 'האם קנייה מקבלן כוללת מע"מ?', answer: 'כן, בדרך כלל. הקבלן הוא עוסק, והמחיר כולל מע"מ (18% או 0% בדירה ראשונה בפרויקטים מסוימים).' },
		{ question: 'מה ההבדל בין מע"מ למס שבח?', answer: 'מע"מ: מס על עסקה (18%), על עוסק. מס שבח: מס על רווח ממכירה, על מוכר פרטי. בדרך כלל לא משלמים שניהם על אותה עסקה.' },
		{ question: 'האם מכירה יד שנייה חייבת במע"מ?', answer: 'לא, אם המוכר הוא יחיד שאינו עוסק. הוא חייב במס שבח (אם יש רווח) והקונה במס רכישה.' },
		{ question: 'מה זה "עסקה בודדת"?', answer: 'מכירה אחת או שתיים של מקרקעין בפרק זמן ארוך, ללא מטרת מסחר. פטורה ממע"מ, אך עדיין חייבת במס שבח.' },
		{ question: 'איך בודקים אם המוכר עוסק?', answer: 'בדיקה ברשות המסים (עוסק מורשה), תדירות מכירות, מטרת הרכישה. מומלץ ליווי משפטי לפני חתימה.' },
	],
	'0010': [
		{ question: 'איך מחשבים מס שבח על דירה בירושה?', answer: 'הפרש בין מחיר המכירה לבין שווי הרכישה המקורי של המוריש (או שווי ביום הפטירה), בניכוי הוצאות. יורשים נבחנים כנישום עצמאי.' },
		{ question: 'האם יורש זכאי לפטור ממס שבח?', answer: 'כן, לפי סעיף 49ב(5) אם הדירה הייתה דירת המגורים היחידה של המוריש, היורש מוכר בתוך 24 חודשים, ולא ניצל פטור דומה. תקרה 2026: 5,008,000 ש"ח.' },
		{ question: 'מהו החישוב הלינארי המוטב?', answer: 'לדירות שנרכשו לפני 2014: השבח מיום הרכישה עד 31.12.2013 פטור; מ-2014 עד המכירה חייב ב-25%. מקטין משמעותית את המס.' },
		{ question: 'מתי נובע מס שבח בירושה?', answer: 'ביום המכירה, לא ביום קבלת הירושה. יש לדווח תוך 30 יום ולשלם תוך 60 יום.' },
		{ question: 'מה קורה כשיש מספר יורשים?', answer: 'כל יורש הוא נישום עצמאי, יכול לבחור מסלול שונה, וזכאי לפטור נפרד על חלקו (בכפוף לתנאים).' },
		{ question: 'האם צריך צו ירושה לפני מכירה?', answer: 'כן. יש להוציא צו ירושה או צו קיום צוואה ולרשום את הזכויות בטאבו לפני מכירה.' },
	],
};

for (const nnnn of nnnns) {
	const subject = manifest.subjects.find((s) => s.nnnn === nnnn);
	const meta = META[nnnn];
	if (!subject || !meta) continue;

	const draftPath = path.join(ROOT, 'reserch-based-articles', `${nnnn}_${subject.label}.md`);
	const raw = fs.readFileSync(draftPath, 'utf8');
	const body = extractBody(raw);
	let faq = parseFaq(body);
	if (faq.length < 5 && FALLBACK_FAQ[nnnn]) faq = FALLBACK_FAQ[nnnn];

	const frontmatter = {
		title: meta.title,
		description: meta.description,
		metaTitle: `גיא אבני עורך דין | ${meta.subject} | ישראל`,
		metaDescription: meta.description,
		mainKeyword: 'גיא אבני עורך דין',
		secondaryKeywords: [meta.subject, subject.category, subject.slug.split('-').slice(0, 2).join('-')],
		pubDate: subject.date || '2026-06-29',
		category: subject.category,
		updatedDate: subject.date || '2026-06-29',
		materialChange: true,
		tags: meta.tags,
		faq,
		internalLinks: subject.internalLinkManifest,
		images: buildImages(subject.slug, meta.images),
	};

	const outPath = path.join(ROOT, 'src/content/blog', subject.contentFile);
	fs.writeFileSync(outPath, matter.stringify('\n' + body + '\n', frontmatter), 'utf8');
	console.error(`[publish] ${outPath} (${faq.length} FAQ, ${body.length} chars)`);
}
