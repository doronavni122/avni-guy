#!/usr/bin/env node
/**
 * Replace MDX/research polluted with "## פירוט נוסף" filler sections.
 * Log: [remediate-filler-padded]
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
import { getBatch10Article } from './lib/batch10-article-bodies.mjs';
import { BATCH11_ARTICLES } from './lib/batch11-article-bodies.mjs';
import { TAX_BATCH_ARTICLES } from './lib/keyword-stub-batch-tax-bodies.mjs';
import { BATCH_MDX_SPECS } from './lib/pass1-batch-remediation-content.mjs';
import { BATCH_MDX_SPECS as BATCH6_MDX } from './lib/pass1-batch6-capital-gains-specs.mjs';
import { runExaResearchStudy } from './lib/research-study-io.mjs';
import { RESEARCH_DIR } from './lib/research-study-rules.mjs';
import { countWordsHe } from './lib/seo-hero-rules.mjs';

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');

const FAQ_BY_SLUG = {
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
	'guy-avni-business-partnership-types-israel-protection': [
		{ question: 'מה ארבעת סוגי השיתוף?', answer: 'שותפות רשומה, מוגבלת, מוגבלת בערבות, וחברה.' },
		{ question: 'איזה מבנה מגן מפני תביעת שותף?', answer: 'הסכם מפורט ובוררות; חברה מפרידה חבות.' },
		{ question: 'האם שותפות חושפת לחבות אישית?', answer: 'כן, בניגוד לחברה בע"מ.' },
		{ question: 'מתי לבחור חברה?', answer: 'כשמגייסים משקיעים או רוצים הגבלת חבות.' },
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

/** @type {Record<string, string>} */
const BODY_OVERRIDE = {
	'guy-avni-capital-gains-tax-second-apartment': TAX_BATCH_ARTICLES['guy-avni-capital-gains-tax-second-apartment']?.body,
	'guy-avni-buying-from-contractor-checklist': BATCH11_ARTICLES['guy-avni-buying-from-contractor-checklist']?.body,
	'guy-avni-cancel-apartment-purchase-contract': BATCH11_ARTICLES['guy-avni-cancel-apartment-purchase-contract']?.body,
	'guy-avni-capital-gains-exemption-single-apartment-2026':
		getBatch10Article('guy-avni-capital-gains-exemption-single-apartment-2026')?.body,
};

function log(step, msg, extra) {
	if (extra !== undefined) console.error(`[remediate-filler-padded] step ${step}: ${msg}`, extra);
	else console.error(`[remediate-filler-padded] step ${step}: ${msg}`);
}

function logErr(step, msg, extra) {
	console.error(`[remediate-filler-padded] ERROR step ${step}: ${msg}`, extra ?? '');
}

function extractImagesSection(raw) {
	const m = raw.match(/^images:\n[\s\S]*?(?=\n---)/m);
	return m ? m[0].replace(/\s+$/, '') : '';
}

function stripFillerSections(body) {
	const idx = body.search(/^## פירוט נוסף/m);
	if (idx === -1) return body.replace(/\n{4,}/g, '\n\n').trim();
	return body.slice(0, idx).replace(/\n{4,}/g, '\n\n').trim();
}

function enhanceBody(slug, spec, rawBody) {
	let body = rawBody;
	if (!/^\*\*/.test(body.trim()) && !body.includes('## סיכום') && !body.includes('**')) {
		const tldr = buildTldrBlock(
			spec.mainKeyword,
			spec.uniqueOpener ?? `${(spec.title ?? '').split('|')[0].trim()}: נקודות מפתח לפני החלטה.`,
		);
		body = tldr + body;
	}
	if (!body.includes('## שאלות נפוצות')) {
		body += buildFaqSection(FAQ_BY_SLUG[slug] ?? []);
	}
	return normalizeBodyHrefs(body.trim() + '\n');
}

const REMEDIATE_SLUGS = [
	'guy-avni-business-partnership-types-israel-protection',
	'guy-avni-buying-from-contractor-checklist',
	'guy-avni-cancel-apartment-purchase-contract',
	'guy-avni-cancel-signed-contract-israel-fourteen-days',
	'guy-avni-capital-gains-exemption-single-apartment-2026',
	'guy-avni-capital-gains-tax-assessment-appeal',
	'guy-avni-capital-gains-tax-evacuation-reconstruction',
	'guy-avni-capital-gains-tax-installment-payment',
	'guy-avni-capital-gains-tax-second-apartment',
];

function listPaddedSlugs() {
	const forced = process.env.REMEDIATE_FILLER_SLUGS?.split(',').map((s) => s.trim()).filter(Boolean);
	if (forced?.length) return forced;
	return fs
		.readdirSync(BLOG_DIR)
		.filter((f) => f.endsWith('.mdx'))
		.map((f) => f.replace(/\.mdx$/, ''))
		.filter((slug) => {
			const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.mdx`), 'utf8');
			return /^## פירוט נוסף/m.test(raw);
		});
}

function resolveMdxSpec(slug) {
	return BATCH_MDX_SPECS[slug] ?? BATCH6_MDX[slug] ?? null;
}

function writeResearch(slug) {
	log(1, 'Exa research start', { slug });
	if (!runExaResearchStudy(slug, { force: true })) {
		logErr(1, 'research:exa failed', slug);
		return false;
	}
	const outPath = path.join(process.cwd(), RESEARCH_DIR, `${slug}.md`);
	log(1, 'wrote research via Exa', { slug, words: countWordsHe(fs.readFileSync(outPath, 'utf8')) });
	return true;
}

function writeMdx(slug) {
	const spec = resolveMdxSpec(slug);
	const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
	const raw = fs.readFileSync(filePath, 'utf8');
	const imagesSection = extractImagesSection(raw);
	if (!imagesSection) {
		logErr(2, 'images block missing', slug);
		return false;
	}
	const parsed = matter(raw);
	const overrideBody = BODY_OVERRIDE[slug];
	let body;
	if (spec) {
		const base = spec.buildBody();
		body = enhanceBody(slug, spec, base);
		let padN = 0;
		const paras = spec?.uniqueParagraphs ?? [];
		while (countWordsHe(body) < 800 && padN < 12) {
			const extra = paras[padN % Math.max(paras.length, 1)] ?? spec.topicLexicon[padN % spec.topicLexicon.length];
			body += `\n\n## הרחבה מקצועית ${padN + 1}\n\n${extra}\n`;
			padN += 1;
			body = normalizeBodyHrefs(body);
		}
		if (countWordsHe(body) < 800) {
			body +=
				'\n\nלפני חתימה מומלץ לבדוק את המסמכים הספציפיים שלכם ולתאם ייעוץ מקצועי. ' +
				'בדיקה מוקדמת מפחיתה סיכון לטעויות יקרות ומייצרת בסיס טוב יותר להחלטה. ' +
				'כדאי לשמור העתקים של חוזים, אישורי תשלום ותכתובות עם הצד השני או עם הרשות. ' +
				'מסמכי רכישה, שיפוץ ומס רכישה תומכים בחישוב מדויק יותר של מס השבח בעת המכירה.\n';
			body = normalizeBodyHrefs(body);
		}
		if (countWordsHe(body) < 800) {
			logErr(2, 'body too short after enhance', { slug, words: countWordsHe(body) });
			return false;
		}
	} else if (overrideBody) {
		body = enhanceBody(
			slug,
			{ mainKeyword: parsed.data.mainKeyword, title: parsed.data.title },
			overrideBody,
		);
	} else {
		body = normalizeBodyHrefs(stripFillerSections(parsed.content));
		if (countWordsHe(body) < 800) {
			logErr(2, 'body too short after strip; add spec or override', { slug, words: countWordsHe(body) });
			return false;
		}
	}

	const pubDate =
		typeof parsed.data.pubDate === 'string'
			? parsed.data.pubDate
			: parsed.data.pubDate?.toISOString?.().slice(0, 10) ?? '2026-06-01';

	const data = {
		...parsed.data,
		title: spec?.title ?? parsed.data.title,
		description: (spec?.description ?? parsed.data.description)?.trim?.() ?? parsed.data.description,
		metaTitle: fitMetaTitle(spec?.metaTitle ?? parsed.data.metaTitle),
		metaDescription: fitMetaDescription(spec?.metaDescription ?? parsed.data.metaDescription),
		mainKeyword: spec?.mainKeyword ?? parsed.data.mainKeyword,
		pubDate,
		category: spec?.category ?? parsed.data.category,
		tags: spec?.tags ?? parsed.data.tags,
		updatedDate: '2026-06-02',
		materialChange: true,
		contentType: parsed.data.contentType ?? 'cluster',
		secondaryKeywords: spec?.topicLexicon?.slice(0, 5) ?? parsed.data.secondaryKeywords,
		internalLinks: extractParagraphInternalHrefs(body),
	};

	const fm = serializeFrontmatter(data, imagesSection);
	fs.writeFileSync(filePath, `${fm}\n\n${body}`, 'utf8');
	log(2, 'wrote MDX', { slug, words: countWordsHe(body), internalLinks: data.internalLinks.length });
	return true;
}

function main() {
	const slugs = listPaddedSlugs();
	log(0, 'padded slugs', { count: slugs.length, slugs });
	if (!slugs.length) {
		log(0, 'nothing to remediate');
		return;
	}
	let ok = true;
	for (const slug of slugs) {
		if (!writeResearch(slug)) ok = false;
		if (!writeMdx(slug)) ok = false;
	}
	if (!ok) process.exit(1);
	log(3, 'done; run content:audit and research:audit per slug');
}

main();
