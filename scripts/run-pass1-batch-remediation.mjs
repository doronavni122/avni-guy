#!/usr/bin/env node
/**
 * Complete Pass 1 research + MDX for config/remediation-batch.json slugs.
 * Log: [cursor-remediation-auto]
 */
import matter from 'gray-matter';
import fs from 'node:fs';
import path from 'node:path';
import {
    buildFaqSection,
    buildTldrBlock,
    extractParagraphInternalHrefs,
    fitMetaDescription,
    fitMetaTitle,
    normalizeBodyHrefs,
    serializeFrontmatter,
} from './lib/article-body-kit.mjs';
import { BATCH_MDX_SPECS } from './lib/pass1-batch-remediation-content.mjs';
import { runExaResearchStudy } from './lib/research-study-io.mjs';
import { RESEARCH_DIR } from './lib/research-study-rules.mjs';

const BATCH_PATH = path.join(process.cwd(), 'config', 'remediation-batch.json');
const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');

function log(step, msg, extra) {
	if (extra !== undefined) console.error(`[cursor-remediation-auto] step ${step}: ${msg}`, extra);
	else console.error(`[cursor-remediation-auto] step ${step}: ${msg}`);
}

function logErr(step, msg, extra) {
	console.error(`[cursor-remediation-auto] ERROR step ${step}: ${msg}`, extra ?? '');
}

function loadBatchSlugs() {
	if (!fs.existsSync(BATCH_PATH)) {
		logErr(0, 'missing remediation-batch.json; run pnpm run remediation:batch');
		process.exit(1);
	}
	const batch = JSON.parse(fs.readFileSync(BATCH_PATH, 'utf8'));
	return batch.batchSlugs ?? [];
}

function extractImagesSection(raw) {
	const m = raw.match(/^images:\n[\s\S]*?(?=\n---)/m);
	return m ? m[0].replace(/\s+$/, '') : '';
}

const FAQ_BY_SLUG = {
	'guy-avni-additional-tax-who-pays': [
		{ question: 'מהי תקרת מס יסף ב-2025?', answer: '721,560 ש"ח הכנסה חייבת שנתית ליחיד.' },
		{ question: 'האם מס יסף חל גם על חברות?', answer: 'לא, מדובר במס על יחידים בלבד.' },
		{ question: 'האם פטור שבח פוטר ממס יסף?', answer: 'לא. פטורי שבח נפרדים מחישוב מס יסף.' },
		{ question: 'מתי משלמים את מס יסף?', answer: 'בדרך כלל עם הגשת הדוח השנתי או בגמר שנה.' },
	],
	'guy-avni-apartment-buyer-required-documents': [
		{ question: 'מהו המסמך הקריטי ביותר?', answer: 'ערבות חוק המכר ונסח טאבו עדכני.' },
		{ question: 'האם אפשר לחתום בלי נסח טאבו?', answer: 'לא מומלץ; הסיכון לשעבודים גבוה.' },
		{ question: 'מי מזמין את ערבות חוק המכר?', answer: 'היזם או המוכר, לפי החוזה.' },
		{ question: 'כמה זמן תקף נסח טאבו?', answer: 'מומלץ נסח שלא ישן מעל חודשים ספורים.' },
	],
	'guy-avni-appraisal-required-mortgage': [
		{ question: 'האם תמיד צריך שמאות?', answer: 'ברוב משכנתאות רכישה הבנק מחייב שמאות.' },
		{ question: 'מי בוחר את השמאי?', answer: 'לרוב שמאי מטעם הבנק או מרשימה מאושרת.' },
		{ question: 'מה קורה אם השווי נמוך?', answer: 'ייתכן הקטנת הלוואה או הגדלת הון עצמי.' },
		{ question: 'כמה עולה שמאות?', answer: 'תלוי בנכס; בדרך כלל אלפי שקלים.' },
	],
	'guy-avni-bank-financing-private-home-construction': [
		{ question: 'האם הכסף משוחרר בבת אחת?', answer: 'לא, לפי התקדמות בנייה מאושרת.' },
		{ question: 'מהי שמאות התקדמות?', answer: 'אישור שמאי שהשלב בוצע לפני שחרור.' },
		{ question: 'חייבים חוזה קבלן?', answer: 'כמעט תמיד נדרש לצורך ביטחונות.' },
		{ question: 'מה קורה אם הקבלן עוכב?', answer: 'הבנק עלול לעכב שחרור עד עמידה בלוח.' },
	],
	'guy-avni-betterment-levy-land-plot-when': [
		{ question: 'מתי נוצרת חבות היטל?', answer: 'במימוש זכויות בנייה או במכירה לפי הנסיבות.' },
		{ question: 'מהו השיעור?', answer: 'לרוב 50% מהשבחה לרשות.' },
		{ question: 'האם אפשר לערער?', answer: 'כן, במסלול מנהלי מול ועדת ערר.' },
		{ question: 'מי משלם במכירה?', answer: 'לפי הסכם המכר; לרוב המוכר.' },
	],
	'guy-avni-bounced-check-enforcement-stop-seven-days': [
		{ question: 'כמה זמן עד תיק הוצל"פ?', answer: 'לרוב עד כ-30 יום ממועד פתיחה, תלוי בנושה.' },
		{ question: 'מה עושים בשבעה ימים?', answer: 'לאסוף מסמכים, לפנות לנושה ולבחון הסדר.' },
		{ question: 'האם תשלום עוצר הליך?', answer: 'תשלום מלא או הסדר מאושר עשויים לעצור המשך.' },
		{ question: 'האם חייבים עורך דין?', answer: 'לא חובה, אך מומלץ בשלב עיקול.' },
	],
	'guy-avni-building-committee-legal-duties': [
		{ question: 'מה אומר סעיף 69?', answer: 'מגדיר חובות ועד הבית כלפי דיירים.' },
		{ question: 'האם הוועד חייב ביטוח?', answer: 'כן, ביטוח מבנה משותף הוא חלק מהחובות.' },
		{ question: 'האם אפשר לדרוש דוחות?', answer: 'כן, דייר זכאי לשקיפות כספית.' },
		{ question: 'מי אחראי בגין מעילות?', answer: 'חברי ועד עשויים לשאת באחריות אישית.' },
	],
	'guy-avni-building-permit-shorten-lawyer-five-months': [
		{ question: 'למה היתר נמשך חודשים?', answer: 'מסמכים חסרים, סבבי תיקון ועומס ברשות.' },
		{ question: 'איך מקצרים ל-5 חודשים?', answer: 'הכנה מלאה, תיאום מקצועי ומעקב שבועי.' },
		{ question: 'מי מגיש את הבקשה?', answer: 'לרוב אדריכל עם ליווי משפטי-תכנוני.' },
		{ question: 'האם אפשר להתחיל בנייה לפני?', answer: 'לא מומלץ; סיכון עיצומים ועיכובים.' },
	],
	'guy-avni-business-legal-habits': [
		{ question: 'כל כמה זמן לסקור חוזים?', answer: 'לפחות פעם בשנה ולפני חוזה גדול.' },
		{ question: 'מה לתעד בין שותפים?', answer: 'החלטות, סמכויות חתימה והתחייבויות.' },
		{ question: 'למה פגישת ייעוץ תקופתית?', answer: 'לזהות סיכונים לפני תביעה או קנס.' },
		{ question: 'האם מדיניות פרטיות חובה?', answer: 'כן לעסקים האוספים מידע אישי.' },
	],
	'guy-avni-business-partnership-bad-endings': [
		{ question: 'מה ארבעת המסלולים?', answer: 'כסף, הדחה, אמונים ופירוק ללא תכנון.' },
		{ question: 'האם הסכם שותפות חובה?', answer: 'לא חוקית, אך קריטי למניעת סכסוך.' },
		{ question: 'איך יוצאים בשלום?', answer: 'מנגנון קניית חלק, בוררות והסדר חובות.' },
		{ question: 'מתי פונים לעורך דין?', answer: 'בתחילת השותפות או לפני פירוק.' },
	],
	'guy-avni-business-partnership-types-israel-protection': [
		{ question: 'מה ארבעת סוגי השיתוף?', answer: 'שותפות רשומה, מוגבלת, מוגבלת בערבות, וחברה.' },
		{ question: 'איזה מבנה מגן מפני תביעת שותף?', answer: 'הסכם מפורט ובוררות; חברה מפרידה חבות.' },
		{ question: 'האם שותפות חושפת לחבות אישית?', answer: 'כן, בניגוד לחברה בע"מ.' },
		{ question: 'מתי לבחור חברה?', answer: 'כשמגייסים משקיעים או רוצים הגבלת חבות.' },
	],
	'guy-avni-buying-from-contractor-checklist': [
		{ question: 'מה חובה לפני חתימה מקבלן?', answer: 'רישום קבלן, ערבות, מפרט ולוח תשלומים.' },
		{ question: 'כמה מותר לשלם בלי ערבות?', answer: 'עד 7% ללא בטוחה לפי חוק המכר.' },
		{ question: 'מה אם הקבלן מתעכב?', answer: 'פיצוי לפי חוזה וחוק; תלונה לממונה.' },
		{ question: 'האם צריך עורך דין?', answer: 'מומלץ מאוד לפני חתימה על חוזה מקבלן.' },
	],
	'guy-avni-cancel-apartment-purchase-contract': [
		{ question: 'אפשר לבטל בלי סיבה?', answer: 'רק אם החוזה מאפשר או בהסכמה; אחרת עילה נדרשת.' },
		{ question: 'מה קורה למקדמה?', answer: 'לפי סעיף הביטול: החזר, קנס או אובדן.' },
		{ question: 'מתי מוכר הפר?', answer: 'איחור, שעבוד, אי התאמה למפרט.' },
		{ question: 'צריך עורך דין?', answer: 'מומלץ לפני הודעת ביטול או תביעה.' },
	],
	'guy-avni-cancel-signed-contract-israel-fourteen-days': [
		{ question: 'תמיד אפשר 14 יום?', answer: 'לא; בעיקר עסקאות מרחוק מסוימות.' },
		{ question: 'חוזה נדל"ן?', answer: 'לרוב לא בזכות 14 יום; בדקו סעיפים.' },
		{ question: 'איך מבטלים בהסכמה?', answer: 'הסכם ביטול בכתב וסילוק כספים.' },
		{ question: 'מהי הפרה יסודית?', answer: 'הפרה מהותית המצדיקה ביטול לפי דין.' },
	],
	'guy-avni-capital-gains-exemption-single-apartment-2026': [
		{ question: 'מה תקרת הפטור ב-2026?', answer: 'מצמדת למדד; בדקו עדכון שנתי ברשות המיסים.' },
		{ question: 'כמה זמן להחזיק?', answer: '18 חודשים מטופס 4 או 4/6 שנים.' },
		{ question: 'דירה שנייה פוסלת?', answer: 'לרוב כן; יש לבדוק חריגים.' },
		{ question: 'משפר דיור?', answer: 'מסלול מועדים לרכישה לפני מכירה.' },
	],
	'guy-avni-capital-gains-tax-assessment-appeal': [
		{ question: 'האם אפשר להשיג על שומה עצמית?', answer: 'בדרך כלל לא; מסלול תיקון שומה או בדיקת שינוי.' },
		{ question: 'מה המועד להשגה?', answer: '30 יום ממסירת הודעת השומה למיטב השפיטה.' },
		{ question: 'מה אם כבר שילמתי?', answer: 'עדיין אפשר להשיג ולבקש החזר אם השומה מתוקנת.' },
		{ question: 'האם נדרש עורך דין?', answer: 'לא חובה; בשומות גבוהות ליווי מומלץ.' },
	],
	'guy-avni-capital-gains-tax-evacuation-reconstruction': [
		{ question: 'האם בפינוי בינוי אין מס שבח?', answer: 'לא תמיד; תלוי במבנה העסקה והפטורים.' },
		{ question: 'מי משלם: דייר או יזם?', answer: 'לפי חוזה והוראות חוק; בדקו לפני חתימה.' },
		{ question: 'מה עם מכירה לפני הריסה?', answer: 'עשויה לחולל שבח אם התמורה עולה על עלות.' },
		{ question: 'צריך דיווח לרשות?', answer: 'כן, לפי מועדי חוק מיסוי מקרקעין.' },
	],
	'guy-avni-capital-gains-tax-installment-payment': [
		{ question: 'מה ההבדל מפריסת תשלומים?', answer: '48א מפחית מס; פריסת תשלומים דוחה גבייה בלבד.' },
		{ question: 'איזה טופס מגישים?', answer: 'טופס 7003 עם תחשיב ודוחות 1301.' },
		{ question: 'לכמה שנים אפשר לפרוס?', answer: 'עד ארבע שנים או תקופת החזקה, לפי הקצר.' },
		{ question: 'האם זה אוטומטי?', answer: 'לא; הבקשה והתיעוד על הנישום.' },
	],
	'guy-avni-capital-gains-tax-second-apartment': [
		{ question: 'האם יש פטור דירה יחידה?', answer: 'לא על דירה שנייה; רק סעיף 49ב ליחידה.' },
		{ question: 'מה שיעורי המס?', answer: '25% ריאלי; 30% מעל התקרה.' },
		{ question: 'מס רכישה מקוזז?', answer: 'כהוצאה מוכרת בחישוב השבח.' },
		{ question: 'מתי כדאי למכור קודם את היחידה?', answer: 'כשאין פטור על השנייה; תכנון סדר מכירות.' },
	],
};

function enhanceBody(slug, spec, rawBody) {
	let body = rawBody;
	if (!/^\*\*/.test(body.trim()) && !body.includes('## סיכום') && !body.includes('**')) {
		const tldr = buildTldrBlock(
			spec.mainKeyword,
			spec.uniqueOpener ?? `${spec.title.split('|')[0].trim()}: נקודות מפתח לפני החלטה.`,
		);
		body = tldr + body;
	}
	if (!body.includes('## שאלות נפוצות')) {
		body += buildFaqSection(FAQ_BY_SLUG[slug] ?? []);
	}
	return normalizeBodyHrefs(body.trim() + '\n');
}

function writeResearch(slug) {
	if (!runExaResearchStudy(slug, { force: true })) {
		logErr(1, 'research:exa failed', slug);
		return false;
	}
	log(1, 'wrote research study via Exa', { slug, path: path.join(process.cwd(), RESEARCH_DIR, `${slug}.md`) });
	return true;
}

function writeMdx(slug) {
	const spec = BATCH_MDX_SPECS[slug];
	if (!spec) {
		logErr(2, 'missing MDX spec', slug);
		return false;
	}
	const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
	const raw = fs.readFileSync(filePath, 'utf8');
	const imagesSection = extractImagesSection(raw);
	if (!imagesSection) {
		logErr(2, 'images block missing', slug);
		return false;
	}
	const parsed = matter(raw);
	const pubDate =
		typeof parsed.data.pubDate === 'string'
			? parsed.data.pubDate
			: parsed.data.pubDate?.toISOString?.().slice(0, 10) ?? '2026-06-01';
	const data = {
		title: spec.title,
		description: spec.description.trim(),
		metaTitle: fitMetaTitle(spec.metaTitle),
		metaDescription: fitMetaDescription(spec.metaDescription),
		mainKeyword: spec.mainKeyword,
		pubDate,
		category: spec.category,
		tags: spec.tags,
		updatedDate: '2026-06-02',
		materialChange: true,
		contentType: 'cluster',
		secondaryKeywords: spec.topicLexicon.slice(0, 5),
		internalLinks: [],
	};
	let body = enhanceBody(slug, spec, spec.buildBody());
	data.internalLinks = extractParagraphInternalHrefs(body);
	const fm = serializeFrontmatter(data, imagesSection);
	fs.writeFileSync(filePath, `${fm}\n\n${body}`, 'utf8');
	log(2, 'wrote MDX', { slug, internalLinks: data.internalLinks.length });
	return true;
}

function main() {
	const slugs = loadBatchSlugs();
	log(0, 'batch slugs', { count: slugs.length, slugs });
	let ok = true;
	for (const slug of slugs) {
		if (!writeResearch(slug)) ok = false;
		if (!writeMdx(slug)) ok = false;
	}
	if (!ok) process.exit(1);
	log(3, 'batch remediation files written; run research:audit and content:audit per slug');
}

main();
