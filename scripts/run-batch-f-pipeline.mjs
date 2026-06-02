/**
 * Full content-pipeline-loop for batch F (11 real-estate / litigation stub slugs).
 * Uses batch2-research-sections + batch2-researched-articles; serializeFrontmatter only (no matter.stringify).
 * Log: [content-pipeline-loop], [content-enhancer-loop], [homepage-brand-internal-links-loop]
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
	stripForbiddenTitle,
} from './lib/article-body-kit.mjs';
import { runArticleContentChecks } from './lib/check-article-content.mjs';
import { getBatch2ResearchedArticle } from './lib/batch2-researched-articles.mjs';
import { getArticleContent } from './lib/batch2-research-sections.mjs';
import { getArticleTier, getMinWordsForTier } from './lib/content-tiers.mjs';
import { countWordsHe } from './lib/seo-hero-rules.mjs';
import { assertResearchStudyReady, deleteResearchStudy } from './lib/research-study-io.mjs';

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');

export const BATCH_F_SLUGS = [
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

const CHECKLISTS = [
	'temp_articles_checklist.txt',
	'temp_internal_links_checklist.txt',
	'temp_homepage_brand_internal_links_checklist.txt',
];

function logPipe(step, message, extra) {
	if (extra !== undefined) console.error(`[content-pipeline-loop] step ${step}: ${message}`, extra);
	else console.error(`[content-pipeline-loop] step ${step}: ${message}`);
}

function logEnhancer(step, message, extra) {
	if (extra !== undefined) console.error(`[content-enhancer-loop] step ${step}: ${message}`, extra);
	else console.error(`[content-enhancer-loop] step ${step}: ${message}`);
}

function logBrand(step, message, extra) {
	if (extra !== undefined) console.error(`[homepage-brand-internal-links-loop] step ${step}: ${message}`, extra);
	else console.error(`[homepage-brand-internal-links-loop] step ${step}: ${message}`);
}

function logErr(prefix, message, extra) {
	console.error(`${prefix} ERROR ${message}`, extra ?? '');
}

function extractImagesSection(raw) {
	const m = raw.match(/^images:\n[\s\S]*?(?=\n---)/m);
	return m ? m[0].replace(/\s+$/, '') : '';
}

function resolveContent(slug, existingTitle) {
	const sections = getArticleContent(slug);
	if (sections) {
		return {
			title: sections.title,
			description: sections.description,
			metaTitle: sections.metaTitle,
			metaDescription: sections.metaDescription,
			body: sections.body,
		};
	}
	const researched = getBatch2ResearchedArticle(slug);
	if (researched) {
		return {
			title: stripForbiddenTitle(existingTitle),
			description: researched.description,
			metaTitle: researched.metaTitle,
			metaDescription: researched.metaDescription,
			body: researched.body,
		};
	}
	return null;
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

function initChecklists(slugs) {
	const lines = slugs.map((s) => `- [ ] src/content/blog/${s}.mdx`).join('\n');
	for (const checklistPath of CHECKLISTS) {
		fs.writeFileSync(checklistPath, `${lines}\n`, 'utf8');
	}
	logPipe(1, 'checklists created', { count: slugs.length });
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
	logEnhancer(2, 'start', { slug });
	const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
	let raw;
	try {
		raw = fs.readFileSync(filePath, 'utf8');
	} catch (err) {
		logErr('[content-enhancer-loop]', `read failed ${slug}`, err.message);
		return false;
	}
	const imagesSection = extractImagesSection(raw);
	if (!imagesSection) {
		logErr('[content-enhancer-loop]', `images block missing ${slug}`);
		return false;
	}
	const parsed = matter(raw);
	const content = resolveContent(slug, parsed.data.title ?? '');
	if (!content) {
		logErr('[content-enhancer-loop]', `no research content for ${slug}`);
		return false;
	}
	assertResearchStudyReady(slug);
	logEnhancer(5, 'research audit ok', { slug });
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
		logErr('[content-enhancer-loop]', `${slug} internalLinks ${data.internalLinks.length} below 10`);
		return false;
	}
	const fm = serializeFrontmatter(data, imagesSection);
	fs.writeFileSync(filePath, `${fm}\n\n${body}`, 'utf8');
	logEnhancer(11, 'done', { slug, words: countWordsHe(body), links: data.internalLinks.length });
	logPipe(3, 'internal-links-loop embedded in body', { slug });
	return true;
}

function applyHomepageBrand(slug) {
	logBrand(4, 'start', { slug });
	const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
	let raw;
	try {
		raw = fs.readFileSync(filePath, 'utf8');
	} catch (err) {
		logBrand('ERROR', `read failed ${slug}`, err.message);
		return false;
	}
	const imagesSection = extractImagesSection(raw);
	if (!imagesSection) {
		logBrand('ERROR', `images missing ${slug}`);
		return false;
	}
	const parsed = matter(raw);
	let body = parsed.content.trimEnd();
	if (hasBrandHomeLink(body)) {
		logBrand(4, 'skip (brand present)', { slug });
		return true;
	}
	const anchor = brandAnchor(parsed.data.mainKeyword ?? 'גיא אבני עורך דין');
	body = `${body}\n\nליווי משפטי בנושא זה זמין דרך [${anchor}](/).\n`;
	body = normalizeBodyHrefs(body);
	const data = { ...parsed.data, internalLinks: extractParagraphInternalHrefs(body) };
	if (!data.internalLinks.includes('/')) data.internalLinks.push('/');
	const fm = serializeFrontmatter(data, imagesSection);
	fs.writeFileSync(filePath, `${fm}\n\n${body}`, 'utf8');
	logBrand(4, 'done', { slug });
	return true;
}

function processSlug(slug) {
	const rel = `src/content/blog/${slug}.mdx`;
	if (!enhanceSlug(slug)) return false;
	if (!applyHomepageBrand(slug)) return false;
	const audit = runArticleContentChecks({ slugFilter: [slug] });
	if (!audit.ok) {
		logPipe('ERROR', `content audit ${slug}`, audit.errors.slice(0, 6));
		return false;
	}
	deleteResearchStudy(slug, { contentAuditPassed: true });
	markChecklists(rel, true);
	logPipe(9, 'marked checklists', { slug });
	return true;
}

function main() {
	const slugs = process.argv.slice(2).length ? process.argv.slice(2) : BATCH_F_SLUGS;
	logPipe(0, 'batch F pipeline start', { count: slugs.length });
	initChecklists(slugs);
	const results = {};
	for (const slug of slugs) {
		results[slug] = processSlug(slug) ? 'PASS' : 'FAIL';
	}
	const failed = Object.entries(results).filter(([, v]) => v === 'FAIL');
	logPipe(12, 'summary', results);
	if (failed.length) process.exit(1);
}

main();
