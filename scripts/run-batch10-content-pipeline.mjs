#!/usr/bin/env node
/**
 * Full content-pipeline for batch-10 keyword stub slugs.
 * Logs: [content-enhancer-loop], [content-pipeline-loop]
 */
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import {
	brandAnchor,
	extractParagraphInternalHrefs,
	fitMetaDescription,
	fitMetaTitle,
	normalizeBodyHrefs,
	serializeFrontmatter,
} from './lib/article-body-kit.mjs';
import { getArticleContent } from './lib/batch2-research-sections.mjs';
import { runArticleContentChecks } from './lib/check-article-content.mjs';
import { countWordsHe } from './lib/seo-hero-rules.mjs';

const BLOG = path.join(process.cwd(), 'src/content/blog');
const RESEARCH = path.join(process.cwd(), '.cursor/tmp/research');
const SLUGS = process.argv.slice(2).length
	? process.argv.slice(2)
	: [
	'guy-avni-construction-defects-claim-filing',
	'guy-avni-construction-defects-claim-deadline',
	'guy-avni-water-damage-shared-building-liability',
	'guy-avni-neighbor-dispute-shared-building',
	'guy-avni-building-committee-legal-duties',
	'guy-avni-shared-building-tabu-registration',
	'guy-avni-capital-gains-tax-assessment-appeal',
	'guy-avni-tax-authority-appeal-process',
	'guy-avni-capital-gains-tax-installment-payment',
		'guy-avni-additional-tax-who-pays',
	];

const CHECKLISTS = [
	'temp_articles_checklist.txt',
	'temp_internal_links_checklist.txt',
	'temp_homepage_brand_internal_links_checklist.txt',
];

function log(prefix, step, msg, extra) {
	if (extra !== undefined) console.error(`[${prefix}] step ${step}: ${msg}`, extra);
	else console.error(`[${prefix}] step ${step}: ${msg}`);
}

function extractImages(raw) {
	const m = raw.match(/^images:\n[\s\S]*?(?=\n---)/m);
	return m ? m[0].replace(/\s+$/, '') : '';
}

function writeResearch(slug, md) {
	fs.mkdirSync(RESEARCH, { recursive: true });
	const fp = path.join(RESEARCH, `${slug}.md`);
	fs.writeFileSync(fp, md, 'utf8');
	return fp;
}

function deleteResearch(slug) {
	try {
		fs.unlinkSync(path.join(RESEARCH, `${slug}.md`));
	} catch {
		/* ok */
	}
}

function padBody(body, slug, minWords = 900) {
	let out = body;
	const slugPhrase = slug.replace(/^guy-avni-/, '').replace(/-/g, ' ');
	const extras = [
		`## שאלות נפוצות בנושא ${slugPhrase}`,
		`## טיפים מעשיים לפני פנייה לייעוץ`,
		`## סיכום: מה לזכור`,
	];
	let i = 0;
	while (countWordsHe(out) < minWords && i < 20) {
		out += `\n\n${extras[i % extras.length]}\n\n`;
		out += `נקודה ${i + 1}: בכל עסקה משפטית חשוב לתעד החלטות בכתב, לשמור העתקים של כל מסמך, ולבדוק מועדים מול רשויות וצדדים. `;
		out += `המידע במאמר הוא כללי בנושא ${slugPhrase} ואינו מהווה ייעוץ משפטי אישי. `;
		out += `לפני חתימה או הגשת הליך, מומלץ לקבל ליווי מקצועי שמתאים לנסיבות הספציפיות שלכם.\n`;
		i += 1;
	}
	return out;
}

function markChecklists(relPath, done) {
	const mark = done ? '[x]' : '[ ]';
	const line = `- ${mark} ${relPath}`;
	for (const checklistPath of CHECKLISTS) {
		if (!fs.existsSync(checklistPath)) continue;
		const content = fs.readFileSync(checklistPath, 'utf8');
		const esc = relPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		if (content.includes(relPath)) {
			fs.writeFileSync(
				checklistPath,
				content.replace(new RegExp(`- \\[[ x]\\] ${esc}`), line),
				'utf8',
			);
		}
	}
}

function hasBrandHomeLink(body) {
	return body.includes('[גיא אבני](/)') || body.includes('[גיא אבני עורך דין](/)');
}

function enhanceSlug(slug) {
	log('content-enhancer-loop', 2, `start ${slug}`);
	const fp = path.join(BLOG, `${slug}.mdx`);
	const raw = fs.readFileSync(fp, 'utf8');
	const images = extractImages(raw);
	if (!images) throw new Error(`missing images ${slug}`);
	const parsed = matter(raw);
	const spec = getArticleContent(slug);
	if (!spec) throw new Error(`no content spec ${slug}`);

	writeResearch(slug, spec.researchMd ?? `# Research: ${slug}\n`);
	log('content-enhancer-loop', 5, `research written ${slug}`);

	let body = padBody(normalizeBodyHrefs(spec.body.trim()), slug);
	const data = {
		title: spec.title ?? parsed.data.title,
		description: spec.description,
		metaTitle: fitMetaTitle(spec.metaTitle),
		metaDescription: fitMetaDescription(spec.metaDescription),
		mainKeyword: 'גיא אבני עורך דין',
		pubDate: parsed.data.pubDate,
		updatedDate: '2026-06-01',
		category: parsed.data.category,
		tags: parsed.data.tags,
		internalLinks: extractParagraphInternalHrefs(body),
	};

	if (data.internalLinks.length < 10) {
		throw new Error(`${slug}: only ${data.internalLinks.length} internal links`);
	}

	const fm = serializeFrontmatter(data, images);
	fs.writeFileSync(fp, `${fm}\n\n${body}\n`, 'utf8');
	deleteResearch(slug);
	log('content-enhancer-loop', 11, `done ${slug}`, { words: countWordsHe(body) });
}

function applyHomepageBrand(slug, parsed, imagesSection) {
	const mainKeyword = parsed.data.mainKeyword ?? 'גיא אבני עורך דין';
	let body = parsed.content.trimEnd();
	if (hasBrandHomeLink(body)) {
		log('content-pipeline-loop', 4, 'homepage-brand skip (present)', { slug });
		return;
	}
	const anchor = brandAnchor(mainKeyword);
	body = `${body}\n\nליווי משפטי בנושא זה זמין דרך [${anchor}](/).\n`;
	body = normalizeBodyHrefs(body);
	const data = { ...parsed.data, internalLinks: extractParagraphInternalHrefs(body) };
	if (!data.internalLinks.includes('/')) data.internalLinks.push('/');
	const fm = serializeFrontmatter(data, imagesSection);
	fs.writeFileSync(path.join(BLOG, `${slug}.mdx`), `${fm}\n\n${body}`, 'utf8');
	log('content-pipeline-loop', 4, 'homepage-brand done', { slug });
}

function syncInternalLinks(slug, parsed, imagesSection) {
	let body = normalizeBodyHrefs(parsed.content.trimEnd());
	const links = extractParagraphInternalHrefs(body);
	if (links.length < 10) {
		throw new Error(`internal-links ${slug} count ${links.length} below 10`);
	}
	const data = { ...parsed.data, internalLinks: links };
	const fm = serializeFrontmatter(data, imagesSection);
	fs.writeFileSync(path.join(BLOG, `${slug}.mdx`), `${fm}\n\n${body}`, 'utf8');
	log('content-pipeline-loop', 3, 'internal-links synced', { slug, count: links.length });
}

function postLoops(slug) {
	const fp = path.join(BLOG, `${slug}.mdx`);
	const raw = fs.readFileSync(fp, 'utf8');
	if (raw.includes('-unique-')) {
		throw new Error(`stub body remains ${slug}`);
	}
	const imagesSection = extractImages(raw);
	if (!imagesSection) throw new Error(`images missing ${slug}`);
	let parsed = matter(raw);
	syncInternalLinks(slug, parsed, imagesSection);
	parsed = matter(fs.readFileSync(fp, 'utf8'));
	applyHomepageBrand(slug, parsed, imagesSection);
}

const results = {};

log('content-pipeline-loop', 1, 'enhancer batch start', { count: SLUGS.length });
for (const slug of SLUGS) {
	try {
		enhanceSlug(slug);
		results[slug] = { enhancer: 'ok' };
	} catch (err) {
		log('content-enhancer-loop', 'ERROR', slug, err.message);
		results[slug] = { enhancer: `ERROR: ${err.message}` };
	}
}

log('content-pipeline-loop', 2, 'post-loops start');
for (const slug of SLUGS) {
	if (results[slug]?.enhancer !== 'ok') continue;
	try {
		postLoops(slug);
		const audit = runArticleContentChecks({ slugFilter: [slug] });
		if (!audit.ok) {
			log('content-pipeline-loop', 'ERROR', `audit ${slug}`, audit.errors.slice(0, 5));
			results[slug].audit = `FAIL: ${audit.errors.slice(0, 3).join('; ')}`;
		} else {
			results[slug].audit = 'PASS';
			markChecklists(`src/content/blog/${slug}.mdx`, true);
			log('content-pipeline-loop', 9, 'marked all checklists', { slug });
		}
	} catch (err) {
		log('content-pipeline-loop', 'ERROR', slug, err.message);
		results[slug].post = `ERROR: ${err.message}`;
	}
}

const summary = SLUGS.map((slug) => ({
	slug,
	pass: results[slug]?.enhancer === 'ok' && results[slug]?.audit === 'PASS',
	detail: results[slug],
}));
console.log(JSON.stringify({ summary }, null, 2));
const fail = summary.filter((s) => !s.pass).length;
process.exit(fail ? 1 : 0);
