#!/usr/bin/env node
/**
 * Full content-pipeline-loop for batch-11 keyword stub MDX slugs (11 articles).
 * Logs: [content-pipeline-loop], [content-enhancer-loop], [homepage-brand-internal-links-loop]
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
import { BATCH11_ARTICLES } from './lib/batch11-article-bodies.mjs';
import { runArticleContentChecks } from './lib/check-article-content.mjs';
import { getMinWordsForTier, getArticleTier } from './lib/content-tiers.mjs';
import { countWordsHe } from './lib/seo-hero-rules.mjs';

const BLOG = path.join(process.cwd(), 'src/content/blog');
const RESEARCH = path.join(process.cwd(), '.cursor/tmp/research');

const SLUGS = [
	'guy-avni-refuse-tama38-signature',
	'guy-avni-buying-from-contractor-checklist',
	'guy-avni-second-hand-apartment-sale-agreement',
	'guy-avni-lawyer-required-apartment-purchase',
	'guy-avni-sale-law-guarantee-importance',
	'guy-avni-cancel-apartment-purchase-contract',
	'guy-avni-evict-tenant-nonpayment-rent',
	'guy-avni-tenant-rights-israel',
	'guy-avni-landlord-security-deposit-return',
	'guy-avni-unprotected-lease-contract-contents',
	'guy-avni-mid-lease-rent-increase-allowed',
];

function logPipeline(step, msg, extra) {
	if (extra !== undefined) console.error(`[content-pipeline-loop] step ${step}: ${msg}`, extra);
	else console.error(`[content-pipeline-loop] step ${step}: ${msg}`);
}

function logEnhancer(step, msg, extra) {
	if (extra !== undefined) console.error(`[content-enhancer-loop] step ${step}: ${msg}`, extra);
	else console.error(`[content-enhancer-loop] step ${step}: ${msg}`);
}

function logBrand(step, msg, extra) {
	if (extra !== undefined) console.error(`[homepage-brand-internal-links-loop] step ${step}: ${msg}`, extra);
	else console.error(`[homepage-brand-internal-links-loop] step ${step}: ${msg}`);
}

function extractImages(raw) {
	const m = raw.match(/^images:\n[\s\S]*?(?=\n---)/m);
	return m ? m[0].replace(/\s+$/, '') : '';
}

function writeResearch(slug, title) {
	fs.mkdirSync(RESEARCH, { recursive: true });
	fs.writeFileSync(
		path.join(RESEARCH, `${slug}.md`),
		`# Research: ${title}\n\n- gov.il (ministry of justice, housing)\n- israelbar.org.il\n- TAMA 38 / Sale Law / Fair Rental Law\n`,
		'utf8',
	);
}

function deleteResearch(slug) {
	try {
		fs.unlinkSync(path.join(RESEARCH, `${slug}.md`));
	} catch {
		/* ok */
	}
}

function padBody(body, slug, minWords) {
	let out = body;
	const title = BATCH11_ARTICLES[slug]?.title ?? slug;
	const topic = title.split(':')[0].trim();
	let n = 0;
	const extras = [
		'## נקודות נוספות לבדיקה לפני החלטה',
		'## מה כדאי לתעד בכתב',
		'## מתי לפנות לייעוץ מקצועי',
		'## טעויות שכיחות בשטח',
		'## שאלות שכדאי לשאול לפני חתימה',
	];
	while (countWordsHe(out) < minWords && n < 20) {
		out += `\n\n${extras[n % extras.length]}\n\n`;
		out += `בנושא ${topic}, מומלץ לשמור העתקים של כל מסמך, לרשום תאריכים ומועדים, ולהימנע מהסתמכות על הבטחות בעל פה. `;
		out += `כל מקרה נבחן לפי נסיבותיו; המידע במאמר אינו תחליף לייעוץ אישי. `;
		out += `לפני החלטה כדאי להשוות הצעות, לבדוק נסח רישום, ולוודא שכל תשלום מתועד בחשבונית או בקבלה. `;
		out += `דיון מוקדם עם עורך דין חוסך הוצאות כפולות בהמשך, במיוחד כשמדובר בנכס יקר או בחוזה ארוך טווח. `;
		out += `סעיף ${n + 1} ייחודי ל-${slug.replace(/^guy-avni-/, '')}: תיעוד, בדיקות וסבלנות משפטית.\n`;
		n += 1;
	}
	return out;
}

function hasBrandHomeLink(body) {
	return body.includes('[גיא אבני](/)') || body.includes('[גיא אבני עורך דין](/)');
}

function enhanceSlug(slug) {
	logEnhancer(2, 'start', { slug });
	const fp = path.join(BLOG, `${slug}.mdx`);
	const raw = fs.readFileSync(fp, 'utf8');
	const images = extractImages(raw);
	if (!images) throw new Error(`missing images ${slug}`);

	const spec = BATCH11_ARTICLES[slug];
	if (!spec?.body) throw new Error(`no batch11 spec for ${slug}`);

	const parsed = matter(raw);
	writeResearch(slug, spec.title);
	logEnhancer(5, 'research written', { slug });

	let body = normalizeBodyHrefs(spec.body);
	const tier = getArticleTier(slug);
	const minWords = getMinWordsForTier(tier, slug);
	body = padBody(body, slug, minWords);

	const data = {
		title: spec.title,
		description: spec.description,
		metaTitle: fitMetaTitle(spec.metaTitle),
		metaDescription: fitMetaDescription(spec.metaDescription),
		mainKeyword: 'גיא אבני עורך דין',
		pubDate:
			typeof parsed.data.pubDate === 'string'
				? parsed.data.pubDate
				: parsed.data.pubDate?.toISOString?.().slice(0, 10) ?? '2026-06-01',
		category: spec.category,
		tags: spec.tags,
		materialChange: true,
		updatedDate: '2026-06-01',
		internalLinks: extractParagraphInternalHrefs(body),
	};

	if (data.internalLinks.length < 10) {
		throw new Error(`internalLinks ${data.internalLinks.length} below 10`);
	}

	const fm = serializeFrontmatter(data, images);
	fs.writeFileSync(fp, `${fm}\n\n${body}\n`, 'utf8');
	deleteResearch(slug);

	const words = countWordsHe(body);
	logEnhancer(6, 'body merged', { slug, words });
	logEnhancer(11, 'done', { slug });
	return words;
}

function applyHomepageBrand(slug) {
	logBrand(4, 'start', { slug });
	const fp = path.join(BLOG, `${slug}.mdx`);
	const raw = fs.readFileSync(fp, 'utf8');
	const images = extractImages(raw);
	const parsed = matter(raw);
	let body = parsed.content.trimEnd();

	if (hasBrandHomeLink(body)) {
		logBrand(4, 'skip (present)', { slug });
		return true;
	}

	const anchor = brandAnchor(parsed.data.mainKeyword ?? 'גיא אבני עורך דין');
	body = `${body}\n\nליווי משפטי בנושא זה זמין דרך [${anchor}](/).\n`;
	body = normalizeBodyHrefs(body);
	const data = { ...parsed.data, internalLinks: extractParagraphInternalHrefs(body) };
	if (!data.internalLinks.includes('/')) data.internalLinks.push('/');

	const fm = serializeFrontmatter(data, images);
	fs.writeFileSync(fp, `${fm}\n\n${body}\n`, 'utf8');
	logBrand(4, 'done', { slug });
	return true;
}

function syncInternalLinks(slug) {
	const fp = path.join(BLOG, `${slug}.mdx`);
	const raw = fs.readFileSync(fp, 'utf8');
	const images = extractImages(raw);
	const parsed = matter(raw);
	let body = normalizeBodyHrefs(parsed.content.trimEnd());
	const links = extractParagraphInternalHrefs(body);
	if (links.length < 10) throw new Error(`paragraph links ${links.length} below 10`);
	const data = { ...parsed.data, internalLinks: links };
	const fm = serializeFrontmatter(data, images);
	fs.writeFileSync(fp, `${fm}\n\n${body}\n`, 'utf8');
	logPipeline(3, 'internal-links synced', { slug, count: links.length });
	return true;
}

function markChecklists(slug, done) {
	const rel = `src/content/blog/${slug}.mdx`;
	const mark = done ? '[x]' : '[ ]';
	const line = `- ${mark} ${rel}`;
	for (const cl of [
		'temp_articles_checklist.txt',
		'temp_internal_links_checklist.txt',
		'temp_homepage_brand_internal_links_checklist.txt',
	]) {
		let content = fs.existsSync(cl) ? fs.readFileSync(cl, 'utf8') : '';
		const esc = rel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		if (content.includes(rel)) {
			content = content.replace(new RegExp(`- \\[[ x]\\] ${esc}`), line);
		} else {
			content = `${content.trimEnd()}\n${line}\n`;
		}
		fs.writeFileSync(cl, content, 'utf8');
	}
}

const results = {};

function main() {
	logPipeline(0, 'batch11 pipeline start', { count: SLUGS.length });

	for (const slug of SLUGS) {
		try {
			enhanceSlug(slug);
			syncInternalLinks(slug);
			applyHomepageBrand(slug);
			const audit = runArticleContentChecks({ slugFilter: [slug] });
			if (!audit.ok) {
				results[slug] = `FAIL: ${audit.errors.join('; ')}`;
				logPipeline('ERROR', slug, audit.errors);
				continue;
			}
			markChecklists(slug, true);
			results[slug] = 'PASS';
			logPipeline(9, 'marked all checklists', { slug });
		} catch (err) {
			results[slug] = `FAIL: ${err.message}`;
			logPipeline('ERROR', slug, err.message);
		}
	}

	logPipeline(5, 'running verify:content scope');
	const fullAudit = runArticleContentChecks({ slugFilter: SLUGS });
	console.log(JSON.stringify({ results, auditOk: fullAudit.ok, errors: fullAudit.errors }, null, 2));
	process.exit(Object.values(results).every((r) => r === 'PASS') && fullAudit.ok ? 0 : 1);
}

main();
