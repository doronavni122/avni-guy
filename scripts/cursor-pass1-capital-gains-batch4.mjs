#!/usr/bin/env node
/**
 * Pass 1 batch 6: capital-gains tax cluster (4 slugs from remediation-batch.json).
 * Log: [cursor-remediation-auto]
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
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
	BATCH6_CAPITAL_GAINS_RESEARCH_SPECS,
	BATCH6_MDX_SPECS,
} from './lib/pass1-batch6-capital-gains-research-specs.mjs';
import { buildResearchStudy } from './lib/pass1-batch-remediation-content.mjs';
import { countWordsHe } from './lib/seo-hero-rules.mjs';

const BLOG = path.join(process.cwd(), 'src/content/blog');
const RESEARCH_DIR = path.join(process.cwd(), 'content-research');
const QUEUE_PATH = path.join(process.cwd(), 'config/remediation-batch.json');

const FAQ_BY_SLUG = {
	'guy-avni-capital-gains-tax-assessment-appeal': [
		{ question: 'האם אפשר להשיג על שומה עצמית?', answer: 'בדרך כלל לא; מסלול תיקון שומה או בדיקת סמכות שינוי.' },
		{ question: 'מה אם פספסתי 30 יום?', answer: 'לעיתים ארכה חריגה; אחרת ערר או תיקון שומה.' },
		{ question: 'האם חייבים עורך דין?', answer: 'לא חובה; בשומות גבוהות ליווי מומלץ.' },
		{ question: 'מהו טופס 7013?', answer: 'טופס השגה מפורט עם סכום לא שנוי במחלוקת.' },
	],
	'guy-avni-capital-gains-tax-installment-payment': [
		{ question: 'מה ההבדל מפריסת תשלומים?', answer: 'פריסת שבח מפחיתה מס; פריסת תשלומים רק תזרים.' },
		{ question: 'כמה שנים אחורה?', answer: 'עד ארבע שנים או תקופת ההחזקה, לפי הקצר.' },
		{ question: 'האם צריך דוחות שנתיים?', answer: 'כן, 1301 לשנים הרלוונטיות.' },
		{ question: 'מתי להגיש?', answer: 'לרוב עם דיווח מכירה או לאחר שומה, לפי הנסיבות.' },
	],
	'guy-avni-capital-gains-tax-second-apartment': [
		{ question: 'האם יש פטור יחידה?', answer: 'לא על דירה שנייה; פטור 49ב לדירה יחידה בלבד.' },
		{ question: 'מה שיעור המס?', answer: '25% ריאלי עד תקרה, 30% מעליה, בתוספת התאמות.' },
		{ question: 'האם מס רכישה מקוזז?', answer: 'כהוצאה מוכרת בחישוב השבח.' },
		{ question: 'מהו לינארי?', answer: 'הטבה לנכסים ותיקים לפני 2014.' },
	],
	'guy-avni-capital-gains-tax-evacuation-reconstruction': [
		{ question: 'האם יש פטור אוטומטי?', answer: 'לא; בקשה ועמידה בתנאים נדרשים.' },
		{ question: 'מכירה לפני דירה חדשה?', answer: 'עלולה ליצור מס שבח; תכנון מוקדם.' },
		{ question: 'מי מגיש לרשות?', answer: 'הדייר, לעיתים בליווי יזם או יועץ.' },
		{ question: 'מה אחרי הריסה?', answer: 'עשוי להיפסד פטור דירת מגורים.' },
	],
};

function log(step, msg, extra) {
	if (extra !== undefined) console.error(`[cursor-remediation-auto] step ${step}: ${msg}`, extra);
	else console.error(`[cursor-remediation-auto] step ${step}: ${msg}`);
}

function logErr(step, msg, extra) {
	console.error(`[cursor-remediation-auto] ERROR step ${step}: ${msg}`, extra ?? '');
}

function loadBatchSlugs() {
	if (!fs.existsSync(QUEUE_PATH)) {
		logErr(0, 'missing remediation-batch.json');
		process.exit(1);
	}
	const batch = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
	return batch.batchSlugs ?? [];
}

function extractImages(raw) {
	const m = raw.match(/^images:\n[\s\S]*?(?=\n---)/m);
	return m ? m[0].replace(/\s+$/, '') : '';
}

function enhanceBody(slug, spec) {
	let body = spec.buildBody();
	if (!body.includes('## שאלות נפוצות')) {
		body += buildFaqSection(FAQ_BY_SLUG[slug] ?? []);
	}
	if (!/^\*\*/.test(body.trim()) && !body.includes('## סיכום')) {
		body = buildTldrBlock(
			spec.mainKeyword,
			spec.uniqueOpener ?? `${spec.title}: נקודות מפתח לפני החלטה.`,
		) + body;
	}
	return normalizeBodyHrefs(body.trim() + '\n');
}

function writeResearch(slug) {
	const spec = BATCH6_CAPITAL_GAINS_RESEARCH_SPECS[slug];
	if (!spec) {
		logErr(1, 'missing research spec', slug);
		return false;
	}
	const outPath = path.join(RESEARCH_DIR, `${slug}.md`);
	fs.mkdirSync(RESEARCH_DIR, { recursive: true });
	fs.writeFileSync(outPath, buildResearchStudy(spec), 'utf8');
	log(1, 'wrote research study', { slug });
	return true;
}

function writeMdx(slug) {
	const spec = BATCH6_MDX_SPECS[slug];
	if (!spec) {
		logErr(2, 'missing MDX spec', slug);
		return false;
	}
	const filePath = path.join(BLOG, `${slug}.mdx`);
	const raw = fs.readFileSync(filePath, 'utf8');
	const imagesSection = extractImages(raw);
	if (!imagesSection) {
		logErr(2, 'images block missing', slug);
		return false;
	}
	const parsed = matter(raw);
	const body = enhanceBody(slug, spec);
	const data = {
		title: spec.title,
		description: spec.description.trim(),
		metaTitle: fitMetaTitle(spec.metaTitle),
		metaDescription: fitMetaDescription(spec.metaDescription),
		mainKeyword: spec.mainKeyword,
		pubDate:
			typeof parsed.data.pubDate === 'string'
				? parsed.data.pubDate
				: parsed.data.pubDate?.toISOString?.().slice(0, 10) ?? '2026-06-01',
		category: spec.category,
		tags: spec.tags,
		updatedDate: '2026-06-02',
		materialChange: true,
		contentType: 'cluster',
		secondaryKeywords: spec.topicLexicon.slice(0, 5),
		internalLinks: extractParagraphInternalHrefs(body),
	};
	const fm = serializeFrontmatter(data, imagesSection);
	fs.writeFileSync(filePath, `${fm}\n\n${body}`, 'utf8');
	log(2, 'wrote MDX', { slug, words: countWordsHe(body), links: data.internalLinks.length });
	return true;
}

function runAudit(cmd, args, env = {}) {
	const r = spawnSync(cmd, args, { stdio: 'inherit', env: { ...process.env, ...env } });
	return r.status ?? 1;
}

function main() {
	const slugs = loadBatchSlugs();
	log(0, 'batch slugs', { slugs });
	let failed = 0;
	for (const slug of slugs) {
		if (!writeResearch(slug)) {
			failed += 1;
			continue;
		}
		if (runAudit('pnpm', ['run', 'research:audit', '--', slug]) !== 0) {
			logErr(3, 'research:audit failed', slug);
			failed += 1;
			continue;
		}
		if (!writeMdx(slug)) {
			failed += 1;
			continue;
		}
		if (runAudit('pnpm', ['run', 'content:audit'], { CONTENT_AUDIT_SLUGS: slug }) !== 0) {
			logErr(4, 'content:audit failed', slug);
			failed += 1;
		}
	}
	if (failed) process.exit(1);
	log(5, 'batch complete', { count: slugs.length });
}

main();
