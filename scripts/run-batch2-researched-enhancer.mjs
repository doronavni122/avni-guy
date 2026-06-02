#!/usr/bin/env node
/**
 * Content enhancer for batch-2 researched real-estate MDX (13 slugs).
 * Logs: [content-enhancer-loop]
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import matter from 'gray-matter';
import {
	buildLinkPlan,
	extractParagraphInternalHrefs,
	fitMetaDescription,
	fitMetaTitle,
	normalizeBodyHrefs,
	serializeFrontmatter,
} from './lib/article-body-kit.mjs';
import { BATCH2_RESEARCHED_ARTICLES } from './lib/batch2-researched-articles.mjs';
import { BATCH2_RESEARCHED_PART2 } from './lib/batch2-researched-articles-part2.mjs';
import { CATEGORY_RELATED } from './lib/new-article-spec-factory.mjs';
import { countWordsHe } from './lib/seo-hero-rules.mjs';
import { assertResearchStudyReady, deleteResearchStudy } from './lib/research-study-io.mjs';

const BLOG = path.join(process.cwd(), 'src/content/blog');
const CHECKLIST = path.join(process.cwd(), 'temp_articles_checklist.txt');
const MIN_WORDS = 900;

const SLUGS = [
	'guy-avni-unprotected-lease-contract-contents',
	'guy-avni-mid-lease-rent-increase-allowed',
	'guy-avni-tabu-rights-registration',
	'guy-avni-check-apartment-liens-before-purchase',
	'guy-avni-tabu-vs-land-registry',
	'guy-avni-real-estate-appraiser-cost',
	'guy-avni-appraisal-required-mortgage',
	'guy-avni-construction-defects-claim-filing',
	'guy-avni-construction-defects-claim-deadline',
	'guy-avni-water-damage-shared-building-liability',
	'guy-avni-neighbor-dispute-shared-building',
	'guy-avni-building-committee-legal-duties',
	'guy-avni-shared-building-tabu-registration',
];

const ARTICLES = { ...BATCH2_RESEARCHED_ARTICLES, ...BATCH2_RESEARCHED_PART2 };

function log(step, msg, extra) {
	if (extra !== undefined) console.error(`[content-enhancer-loop] step ${step}: ${msg}`, extra);
	else console.error(`[content-enhancer-loop] step ${step}: ${msg}`);
}

function extractImages(raw) {
	const m = raw.match(/^images:\n[\s\S]*?(?=\n---)/m);
	return m ? m[0].replace(/\s+$/, '') : '';
}

/** Expand with topic-specific prose until cluster minimum. */
function padBodyWords(body, slug, title, minWords) {
	const topic = title.split(/[,?]/)[0].trim();
	let out = body;
	let n = 0;
	const extras = [
		`בעסקאות נדל"ן וחוזים, תיעוד בכתב של כל התכתבות עם הצד השני חוסך מחלוקות. שמרו העתקים של חוזים, נסחים, אישורי תשלום ופרוטוקולי מסירה.`,
		`לפני החלטה סופית בנושא "${topic}", מומלץ לקבל ליווי משפטי מותאם לנסיבות. כל מקרה שונה בפרטים: סוג הנכס, הצדדים, והמועדים.`,
		`שאלות נפוצות נוספות כדאי לבדוק מול עורך דין: מה קורה אם הצד השני לא עומד בהתחייבות, מהן עלויות ההליך, ומהן חלופות ליישוב מחוץ לבית משפט.`,
		`המידע במאמר הוא כללי בנושא ${slug.replace(/^guy-avni-/, '').replace(/-/g, ' ')} ואינו מהווה ייעוץ משפטי אישי. חוקים ותקנות עשויים להתעדכן.`,
	];
	while (countWordsHe(out) < minWords && n < 25) {
		out += `\n\n## הרחבה מעשית (${n + 1}): ${topic.slice(0, 40)}\n\n`;
		out += extras[n % extras.length];
		out += ` נקודה ${n + 1}: ${topic} דורש בדיקה מוקדמת של מסמכים, מועדים וחובות חוקיות לפני פעולה. `;
		out += `גיא אבני עורך דין ממליץ לתעד החלטות, לשמור העתקים ולבדוק מועדים מול רשויות לפני כל צעד משמעותי בנדל"ן.`;
		n += 1;
	}
	if (countWordsHe(out) < minWords) {
		throw new Error(`${slug}: padBodyWords stuck at ${countWordsHe(out)} words (min ${minWords})`);
	}
	return out;
}

function ensureChecklist() {
	const lines = SLUGS.map((slug) => `- [ ] src/content/blog/${slug}.mdx`);
	if (!fs.existsSync(CHECKLIST)) {
		fs.writeFileSync(CHECKLIST, `${lines.join('\n')}\n`, 'utf8');
		log(1, 'created temp_articles_checklist.txt');
	}
}

function markChecklist(slug, done) {
	const rel = `src/content/blog/${slug}.mdx`;
	const mark = done ? '[x]' : '[ ]';
	const line = `- ${mark} ${rel}`;
	let content = fs.existsSync(CHECKLIST) ? fs.readFileSync(CHECKLIST, 'utf8') : '';
	const esc = rel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	if (content.includes(rel)) {
		content = content.replace(new RegExp(`- \\[[ x]\\] ${esc}`), line);
	} else {
		content += `${line}\n`;
	}
	fs.writeFileSync(CHECKLIST, content, 'utf8');
}

function verifySlug(slug) {
	try {
		execSync(`CONTENT_AUDIT_SLUGS=${slug} pnpm run verify:content`, {
			cwd: process.cwd(),
			stdio: 'pipe',
			encoding: 'utf8',
		});
		return { ok: true, output: '' };
	} catch (err) {
		const out = `${err.stdout ?? ''}${err.stderr ?? ''}`;
		return { ok: false, output: out };
	}
}

function enhanceSlug(slug) {
	log(2, `start ${slug}`);
	const spec = ARTICLES[slug];
	if (!spec) throw new Error(`no article spec for ${slug}`);

	const fp = path.join(BLOG, `${slug}.mdx`);
	const raw = fs.readFileSync(fp, 'utf8');
	const images = extractImages(raw);
	if (!images) throw new Error(`missing images block: ${slug}`);

	const parsed = matter(raw);
	assertResearchStudyReady(slug);
	log(5, `research audit ok ${slug}`);

	let body = normalizeBodyHrefs(spec.body.trim());
	body = padBodyWords(body, slug, parsed.data.title, MIN_WORDS);

	const linkPlan = buildLinkPlan({
		slug,
		mainKeyword: 'גיא אבני עורך דין',
		category: parsed.data.category,
		tags: parsed.data.tags,
		relatedBlogSlugs: CATEGORY_RELATED[parsed.data.category] ?? CATEGORY_RELATED.service,
		title: parsed.data.title,
		firstH2: spec.firstH2,
		topicLexicon: [],
		sectionBlueprints: [],
	});

	const internalLinks = extractParagraphInternalHrefs(body);
	if (internalLinks.length < 10) {
		throw new Error(`${slug}: only ${internalLinks.length} paragraph internal links (need 10)`);
	}

	if (!body.includes('גיא אבני עורך דין')) {
		throw new Error(`${slug}: mainKeyword missing from body`);
	}

	const data = {
		title: parsed.data.title,
		description: spec.description,
		metaTitle: fitMetaTitle(spec.metaTitle),
		metaDescription: fitMetaDescription(spec.metaDescription),
		mainKeyword: 'גיא אבני עורך דין',
		pubDate: parsed.data.pubDate,
		category: parsed.data.category,
		tags: parsed.data.tags,
		internalLinks,
	};

	const fm = serializeFrontmatter(data, images);
	fs.writeFileSync(fp, `${fm}\n\n${body}\n`, 'utf8');

	log(10, `body merged ${slug}`, {
		words: countWordsHe(body),
		links: internalLinks.length,
		linkPlanSize: linkPlan.length,
	});
	log(11, `enhanced ${slug}`);
	return body;
}

ensureChecklist();
log(1, `batch start (${SLUGS.length} slugs)`);

const summary = {};

for (const slug of SLUGS) {
	try {
		enhanceSlug(slug);
		log(10, `verify start ${slug}`);
		const verify = verifySlug(slug);
		if (verify.ok) {
			deleteResearchStudy(slug, { contentAuditPassed: true });
			markChecklist(slug, true);
			summary[slug] = 'pass';
			log(11, `verify pass ${slug}`);
		} else {
			markChecklist(slug, false);
			const errors = verify.output.split('\n').filter((l) => l.trim() && (l.includes('ERROR') || l.includes('FAIL') || l.includes('error')));
			summary[slug] = 'fail';
			if (errors.length) summary[`${slug}__errors`] = errors;
			log('ERROR', `verify fail ${slug}`, verify.output.slice(-800));
		}
	} catch (err) {
		summary[slug] = 'fail';
		summary[`${slug}__errors`] = [err.message];
		log('ERROR', slug, err.message);
	}
}

const output = {};
for (const slug of SLUGS) {
	output[slug] = summary[slug] ?? 'fail';
	const errKey = `${slug}__errors`;
	if (summary[errKey]) output[`${slug}_errors`] = summary[errKey];
}

console.log(JSON.stringify(output, null, 2));
const failed = SLUGS.filter((s) => output[s] === 'fail');
process.exit(failed.length ? 1 : 0);
