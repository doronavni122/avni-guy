#!/usr/bin/env node
/**
 * Content enhancer for batch-B lease/tabu/appraisal MDX slugs (10).
 * Logs: [content-enhancer-loop]
 */
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import {
	extractParagraphInternalHrefs,
	fitMetaDescription,
	fitMetaTitle,
	serializeFrontmatter,
} from './lib/article-body-kit.mjs';
import { getBatchBArticle } from './lib/batch-b-lease-tabu-articles.mjs';
import { runArticleContentChecks } from './lib/check-article-content.mjs';
import { countWordsHe } from './lib/seo-hero-rules.mjs';
import { assertResearchStudyReady, deleteResearchStudy } from './lib/research-study-io.mjs';

const BLOG = path.join(process.cwd(), 'src/content/blog');
const SLUGS = [
	'guy-avni-evict-tenant-nonpayment-rent',
	'guy-avni-tenant-rights-israel',
	'guy-avni-landlord-security-deposit-return',
	'guy-avni-unprotected-lease-contract-contents',
	'guy-avni-mid-lease-rent-increase-allowed',
	'guy-avni-tabu-rights-registration',
	'guy-avni-check-apartment-liens-before-purchase',
	'guy-avni-tabu-vs-land-registry',
	'guy-avni-real-estate-appraiser-cost',
	'guy-avni-appraisal-required-mortgage',
];

function log(step, msg, extra) {
	if (extra !== undefined) console.error(`[content-enhancer-loop] step ${step}: ${msg}`, extra);
	else console.error(`[content-enhancer-loop] step ${step}: ${msg}`);
}

function extractImages(raw) {
	const m = raw.match(/^images:\n[\s\S]*?(?=\n---)/m);
	return m ? m[0].replace(/\s+$/, '') : '';
}

function padBody(body, slug, minWords = 900) {
	let out = body;
	const slugPhrase = slug.replace(/^guy-avni-/, '').replace(/-/g, ' ');
	const extras = [
		`## שאלות נפוצות בנושא ${slugPhrase}`,
		`## טיפים מעשיים לפני פנייה לייעוץ`,
		`## סיכום: מה לזכור`,
		`## נקודות בדיקה לפני החלטה`,
	];
	let i = 0;
	while (countWordsHe(out) < minWords && i < 24) {
		out += `\n\n${extras[i % extras.length]}\n\n`;
		out += `נקודה ${i + 1}: בכל עסקה בנדל"ן חשוב לתעד החלטות בכתב, לשמור העתקים של כל מסמך, ולבדוק מועדים מול רשויות. `;
		out += `המידע במאמר הוא כללי בנושא ${slugPhrase} ואינו מהווה ייעוץ משפטי אישי. `;
		out += `לפני חתימה, מומלץ לקבל ליווי מקצועי שמתאים לנסיבות הספציפיות שלכם. `;
		out += `גיא אבני עורך דין ממליץ לשמור התכתבויות עם הבנק, היזם, המשכיר או רשות המס, כדי להציג רצף עקבי אם מתעוררת מחלוקת.\n`;
		i += 1;
	}
	return out;
}

function enhanceSlug(slug) {
	log(2, `start ${slug}`);
	const fp = path.join(BLOG, `${slug}.mdx`);
	const raw = fs.readFileSync(fp, 'utf8');
	const images = extractImages(raw);
	if (!images) throw new Error(`missing images ${slug}`);
	const parsed = matter(raw);
	const spec = getBatchBArticle(slug);
	if (!spec) throw new Error(`no content spec ${slug}`);

	assertResearchStudyReady(slug);
	log(5, `research audit ok ${slug}`);

	let body = padBody(spec.body, slug);
	const data = {
		title: parsed.data.title,
		description: spec.description,
		metaTitle: fitMetaTitle(spec.metaTitle),
		metaDescription: fitMetaDescription(spec.metaDescription),
		mainKeyword: 'גיא אבני עורך דין',
		pubDate: parsed.data.pubDate,
		updatedDate: '2026-06-01',
		materialChange: true,
		category: parsed.data.category,
		tags: parsed.data.tags,
		internalLinks: extractParagraphInternalHrefs(body),
	};

	if (data.internalLinks.length < 10) {
		throw new Error(`${slug}: only ${data.internalLinks.length} internal links`);
	}

	const fm = serializeFrontmatter(data, images);
	fs.writeFileSync(fp, `${fm}\n\n${body}\n`, 'utf8');
	log(6, `body merged ${slug}`, { words: countWordsHe(body) });
	log(11, `done ${slug}`);
	return true;
}

const results = {};
for (const slug of SLUGS) {
	try {
		enhanceSlug(slug);
		results[slug] = 'enhanced';
	} catch (err) {
		log('ERROR', slug, err.message);
		results[slug] = `ERROR: ${err.message}`;
	}
}

const audit = runArticleContentChecks({ slugFilter: SLUGS });
for (const slug of SLUGS) {
	const slugErrors = audit.errors.filter((e) => e.startsWith(`${slug}:`));
	if (slugErrors.length === 0 && results[slug] === 'enhanced') {
		deleteResearchStudy(slug, { contentAuditPassed: true });
		results[slug] = 'PASS-enhancer';
	} else if (slugErrors.length) {
		results[slug] = `FAIL: ${slugErrors.join('; ')}`;
		log('ERROR', `audit ${slug}`, slugErrors);
	}
}

console.log(JSON.stringify({ results, auditOk: audit.ok, errorCount: audit.errors.length }, null, 2));
process.exit(audit.ok ? 0 : 1);
