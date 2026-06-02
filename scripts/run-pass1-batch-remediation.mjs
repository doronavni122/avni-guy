#!/usr/bin/env node
/**
 * Complete Pass 1 research + MDX for config/remediation-batch.json slugs.
 * Log: [cursor-remediation-auto]
 */
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import {
	buildFaqSection,
	buildTldrBlock,
	extractParagraphInternalHrefs,
	fitMetaDescription,
	fitMetaTitle,
	normalizeBodyHrefs,
	serializeFrontmatter,
} from './lib/article-body-kit.mjs';
import {
	BATCH_MDX_SPECS,
	RESEARCH_SPECS,
	buildResearchStudy,
} from './lib/pass1-batch-remediation-content.mjs';
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
	const spec = RESEARCH_SPECS[slug];
	if (!spec) {
		logErr(1, 'missing research spec', slug);
		return false;
	}
	const outPath = path.join(process.cwd(), RESEARCH_DIR, `${slug}.md`);
	fs.mkdirSync(path.dirname(outPath), { recursive: true });
	fs.writeFileSync(outPath, buildResearchStudy(spec), 'utf8');
	log(1, 'wrote research study', { slug, path: outPath });
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
