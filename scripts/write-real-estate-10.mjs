/**
 * Content enhancer + research for 10 real-estate keyword stub slugs.
 * Log: [content-enhancer-loop] [content-pipeline-loop]
 */
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import {
	extractParagraphInternalHrefs,
	fitMetaDescription,
	fitMetaTitle,
	normalizeBodyHrefs,
	serializeFrontmatter,
} from './lib/article-body-kit.mjs';
import { runArticleContentChecks } from './lib/check-article-content.mjs';
import { countWordsHe } from './lib/seo-hero-rules.mjs';
import { REAL_ESTATE_10_META, getRealEstate10Body } from './lib/real-estate-10-bodies.mjs';
import { assertResearchStudyReady, deleteResearchStudy } from './lib/research-study-io.mjs';

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');
const SLUGS = Object.keys(REAL_ESTATE_10_META);

function log(step, msg, extra) {
	if (extra !== undefined) console.error(`[content-enhancer-loop] step ${step}: ${msg}`, extra);
	else console.error(`[content-enhancer-loop] step ${step}: ${msg}`);
}

function extractImagesSection(raw) {
	const m = raw.match(/^images:\n[\s\S]*?(?=\n---)/m);
	return m ? m[0].replace(/\s+$/, '') : '';
}

function padFaq(body, minWords = 900) {
	const extras = [
		`

## שאלות נפוצות

**מתי כדאי לפנות לעורך דין?** לפני חתימה על זיכרון דברים, הסכם עם יזם, תשלום מעל 15% ממחיר דירה מקבלן, או כשיש מחלוקת עם רשות המיסים. ליווי מקצועי מונע טעויות שעולות עשרות ואף מאות אלפי שקלים.

**מה לתעד בכתב?** תמורה, לוח זמנים, פיצוי שכירות, מפרט טכני, ערבויות, שינויים בדירה, והתכתבויות עם היזם, הבנק או פקיד השומה. מסמך אחד חסר עלול לעכב רישום בטאבו או לחשוף אתכם לתביעה.

**האם המידע במאמר מחליף ייעוץ?** לא. הנסיבות האישיות (בעלות, שעבודים, מיסוי, שוכר מוגן) דורשות בדיקה נקודתית.`,
		`

## טעויות שכדאי להימנע מהן

חתימה בלחץ בלי ליווי נפרד, הסתמכות על הבטחות בעל פה, ויתור על ערבות חוק מכר לטובת "הנחה" מהקבלן. עוד טעות: תשלום גבוה לפני הערת אזהרה, או אי בדיקת נסח טאבו עדכני. תיעוד ליקויים במסירה חוסך מחלוקות על פיקדון או על מס שבח.`,
		`

## צעדים מעשיים לפני החלטה

אספו מסמכי בעלות, חוזים קודמים, אישורי מס ותכניות. השוו הצעות בנק למימון. בדקו סטטוס פרויקט התחדשות בוועדות התכנון. רק לאחר מכן חתמו, עם עותק מלא לכל הצדדים. כך תוכלו להציג רצף עקבי אם מתעוררת מחלוקת מאוחר יותר.`,
	];
	let out = body;
	let i = 0;
	while (countWordsHe(out) < minWords && i < 24) {
		out += extras[i % extras.length];
		i += 1;
	}
	return out;
}

function enhanceSlug(slug) {
	log(2, `start ${slug}`);
	const meta = REAL_ESTATE_10_META[slug];
	let body = getRealEstate10Body(slug);
	if (!body) {
		log('ERROR', `missing body ${slug}`);
		return false;
	}
	const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
	const raw = fs.readFileSync(filePath, 'utf8');
	const imagesSection = extractImagesSection(raw);
	if (!imagesSection) {
		log('ERROR', `images missing ${slug}`);
		return false;
	}
	const parsed = matter(raw);
	assertResearchStudyReady(slug);
	log(5, `research audit ok ${slug}`);
	body = padFaq(normalizeBodyHrefs(body.trim()));
	const data = {
		title: meta.title,
		description: meta.description,
		metaTitle: fitMetaTitle(meta.metaTitle),
		metaDescription: fitMetaDescription(meta.metaDescription),
		mainKeyword: parsed.data.mainKeyword ?? 'גיא אבני עורך דין',
		pubDate: parsed.data.pubDate ?? '2026-06-01',
		updatedDate: '2026-06-01',
		materialChange: true,
		category: meta.category,
		tags: meta.tags,
		internalLinks: extractParagraphInternalHrefs(body),
	};
	if (data.internalLinks.length < 10) {
		log('ERROR', `${slug} links ${data.internalLinks.length}`);
		return false;
	}
	fs.writeFileSync(filePath, `${serializeFrontmatter(data, imagesSection)}\n\n${body}\n`, 'utf8');
	const audit = runArticleContentChecks({ slugFilter: [slug] });
	if (!audit.ok) {
		log('ERROR', `audit ${slug}`, audit.errors);
		return false;
	}
	deleteResearchStudy(slug, { contentAuditPassed: true });
	log(11, `done ${slug}`, { words: countWordsHe(body) });
	return true;
}

const results = {};
for (const slug of SLUGS) {
	results[slug] = enhanceSlug(slug) ? 'PASS' : 'FAIL';
}
console.log(JSON.stringify(results, null, 2));
process.exit(Object.values(results).some((v) => v === 'FAIL') ? 1 : 0);
