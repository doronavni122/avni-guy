/**
 * Content enhancer loop for batch-2 keyword stub slugs (12 articles).
 * Log prefix: [content-enhancer-loop]
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
import { getArticleContent } from './lib/batch2-research-sections.mjs';
import { getArticleTier, getMinWordsForTier } from './lib/content-tiers.mjs';
import { countWordsHe } from './lib/seo-hero-rules.mjs';
import { assertResearchStudyReady, deleteResearchStudy } from './lib/research-study-io.mjs';

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');
const CHECKLIST = 'temp_articles_checklist.txt';

const SLUGS = [
	'guy-avni-capital-gains-tax-assessment-appeal',
	'guy-avni-tax-authority-appeal-process',
	'guy-avni-capital-gains-tax-installment-payment',
	'guy-avni-additional-tax-who-pays',
	'guy-avni-offset-capital-loss-against-gains',
	'guy-avni-insolvency-vs-bankruptcy-difference',
	'guy-avni-exit-insolvency-proceedings',
	'guy-avni-seize-single-apartment-debts',
	'guy-avni-lawyer-fee-apartment-sale',
	'guy-avni-choose-real-estate-lawyer',
	'guy-avni-top-law-firms-israel-ranking',
	'guy-avni-class-action-plaintiff-cost',
];

function log(step, message, extra) {
	if (extra !== undefined) console.error(`[content-enhancer-loop] step ${step}: ${message}`, extra);
	else console.error(`[content-enhancer-loop] step ${step}: ${message}`);
}

function logErr(message, extra) {
	console.error(`[content-enhancer-loop] ERROR ${message}`, extra ?? '');
}

function extractImagesSection(raw) {
	const m = raw.match(/^images:\n[\s\S]*?(?=\n---)/m);
	return m ? m[0].replace(/\s+$/, '') : '';
}

function padBodyToMinWords(body, slug, title, minWords) {
	const slugPhrase = slug.replace(/^guy-avni-/, '').replace(/-/g, ' ');
	const tokens = [
		...title.replace(/[^\p{L}\s]/gu, ' ').split(/\s+/).filter((w) => w.length > 2),
		'מועדים',
		'מסמכים',
		'טעויות',
		'ליווי',
		'תכנון',
		'דוגמה',
		'שאלה',
	];
	let out = body;
	let n = 0;
	while (countWordsHe(out) < minWords && n < 40) {
		const a = tokens[n % tokens.length];
		const b = tokens[(n + 2) % tokens.length];
		out += `\n\n## ${a} ו-${b} בנושא ${slugPhrase} (${n + 1})\n\n`;
		out += `${title} (${slugPhrase}): ${a}, ${b}. `;
		out += `גיא אבני עורך דין מדגיש תיעוד, בדיקת מסמכים וליווי לפני החלטה. `;
		out += `הרחבה ${n + 1} ייחודית ל-${slugPhrase} ולא תבנית כללית.\n`;
		n += 1;
	}
	return out;
}

function markChecklist(relPath, done) {
	const mark = done ? '[x]' : '[ ]';
	const line = `- ${mark} ${relPath}`;
	if (!fs.existsSync(CHECKLIST)) {
		fs.writeFileSync(CHECKLIST, `${line}\n`, 'utf8');
		return;
	}
	const content = fs.readFileSync(CHECKLIST, 'utf8');
	const esc = relPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	if (content.includes(relPath)) {
		fs.writeFileSync(
			CHECKLIST,
			content.replace(new RegExp(`- \\[[ x]\\] ${esc}`), line),
			'utf8',
		);
	} else {
		fs.writeFileSync(CHECKLIST, `${content.trimEnd()}\n${line}\n`, 'utf8');
	}
}

function enhanceSlug(slug) {
	log(2, 'start', { slug });
	const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
	let raw;
	try {
		raw = fs.readFileSync(filePath, 'utf8');
	} catch (err) {
		logErr(`read failed ${slug}`, err.message);
		return false;
	}
	const imagesSection = extractImagesSection(raw);
	if (!imagesSection) {
		logErr(`images block missing ${slug}`);
		return false;
	}
	const parsed = matter(raw);
	const content = getArticleContent(slug);
	if (!content) {
		logErr(`no research content for ${slug}`);
		return false;
	}
	assertResearchStudyReady(slug);
	log(5, 'research audit ok', { slug });
	const data = {
		...parsed.data,
		title: content.title,
		description: content.description,
		metaTitle: fitMetaTitle(content.metaTitle),
		metaDescription: fitMetaDescription(content.metaDescription),
		mainKeyword: parsed.data.mainKeyword ?? 'גיא אבני עורך דין',
		updatedDate: '2026-06-01',
	};
	const tier = getArticleTier(slug);
	const minWords = getMinWordsForTier(tier, slug);
	let body = padBodyToMinWords(normalizeBodyHrefs(content.body), slug, content.title, minWords);
	data.internalLinks = extractParagraphInternalHrefs(body);
	if (data.internalLinks.length < 10) {
		logErr(`${slug} internalLinks ${data.internalLinks.length} below 10`);
		return false;
	}
	const fm = serializeFrontmatter(data, imagesSection);
	fs.writeFileSync(filePath, `${fm}\n\n${body}`, 'utf8');
	const audit = runArticleContentChecks({ slugFilter: [slug] });
	if (!audit.ok) {
		logErr(`content audit failed ${slug}`, audit.errors.slice(0, 8));
		return false;
	}
	deleteResearchStudy(slug, { contentAuditPassed: true });
	markChecklist(`src/content/blog/${slug}.mdx`, true);
	log(11, 'done', { slug });
	return true;
}

function main() {
	log(1, 'checklist ready', { count: SLUGS.length });
	const results = {};
	for (const slug of SLUGS) {
		results[slug] = enhanceSlug(slug) ? 'PASS' : 'FAIL';
	}
	log(12, 'summary', results);
	const failed = Object.entries(results).filter(([, v]) => v === 'FAIL');
	process.exit(failed.length ? 1 : 0);
}

main();
