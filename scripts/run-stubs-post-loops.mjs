/**
 * Post-enhancer loops for keyword stub slugs: internal-links sync, homepage brand, audits, checklists.
 * Log: [content-pipeline-loop]
 */
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import {
	brandAnchor,
	extractParagraphInternalHrefs,
	normalizeBodyHrefs,
	serializeFrontmatter,
} from './lib/article-body-kit.mjs';
import { runArticleContentChecks } from './lib/check-article-content.mjs';
import { KEYWORD_STUB_SLUGS } from './lib/keyword-stub-slugs.mjs';

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');
const SLUGS = process.argv.includes('--all')
	? KEYWORD_STUB_SLUGS
	: process.argv.slice(2).length
		? process.argv.slice(2)
		: KEYWORD_STUB_SLUGS;

const CHECKLISTS = [
	'temp_articles_checklist.txt',
	'temp_internal_links_checklist.txt',
	'temp_homepage_brand_internal_links_checklist.txt',
];

function log(step, message, extra) {
	if (extra !== undefined) console.error(`[content-pipeline-loop] step ${step}: ${message}`, extra);
	else console.error(`[content-pipeline-loop] step ${step}: ${message}`);
}

function extractImagesSection(raw) {
	const m = raw.match(/^images:\n[\s\S]*?(?=\n---)/m);
	return m ? m[0].replace(/\s+$/, '') : '';
}

function markChecklist(relPath, done) {
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

function applyHomepageBrand(slug, parsed, imagesSection) {
	const mainKeyword = parsed.data.mainKeyword ?? 'גיא אבני עורך דין';
	let body = parsed.content.trimEnd();
	if (hasBrandHomeLink(body)) {
		log(4, 'homepage-brand skip (present)', { slug });
		return { body, data: parsed.data };
	}
	const anchor = brandAnchor(mainKeyword);
	body = `${body}\n\nליווי משפטי בנושא זה זמין דרך [${anchor}](/).\n`;
	body = normalizeBodyHrefs(body);
	const data = { ...parsed.data, internalLinks: extractParagraphInternalHrefs(body) };
	if (!data.internalLinks.includes('/')) data.internalLinks.push('/');
	const fm = serializeFrontmatter(data, imagesSection);
	fs.writeFileSync(path.join(BLOG_DIR, `${slug}.mdx`), `${fm}\n\n${body}`, 'utf8');
	log(4, 'homepage-brand done', { slug });
	return { body, data };
}

function syncInternalLinks(slug, parsed, imagesSection) {
	let body = normalizeBodyHrefs(parsed.content.trimEnd());
	const links = extractParagraphInternalHrefs(body);
	if (links.length < 10) {
		log('ERROR', `internal-links ${slug} count ${links.length} below 10`);
		return false;
	}
	const data = { ...parsed.data, internalLinks: links };
	const fm = serializeFrontmatter(data, imagesSection);
	fs.writeFileSync(path.join(BLOG_DIR, `${slug}.mdx`), `${fm}\n\n${body}`, 'utf8');
	log(3, 'internal-links synced', { slug, count: links.length });
	return true;
}

function processSlug(slug) {
	const rel = `src/content/blog/${slug}.mdx`;
	const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
	let raw;
	try {
		raw = fs.readFileSync(filePath, 'utf8');
	} catch (err) {
		log('ERROR', `read failed ${slug}`, err.message);
		return false;
	}
	if (raw.includes('-unique-')) {
		log('ERROR', `stub body remains ${slug} (run content-enhancer first)`);
		return false;
	}
	const imagesSection = extractImagesSection(raw);
	if (!imagesSection) {
		log('ERROR', `images missing ${slug}`);
		return false;
	}
	let parsed = matter(raw);
	if (!syncInternalLinks(slug, parsed, imagesSection)) return false;
	raw = fs.readFileSync(filePath, 'utf8');
	parsed = matter(raw);
	applyHomepageBrand(slug, parsed, imagesSection);
	const audit = runArticleContentChecks({ slugFilter: [slug] });
	if (!audit.ok) {
		log('ERROR', `content audit ${slug}`, audit.errors.slice(0, 5));
		return false;
	}
	markChecklist(rel, true);
	log(9, 'marked all checklists', { slug });
	return true;
}

function main() {
	log(0, 'post-loops start', { count: SLUGS.length });
	let ok = 0;
	let fail = 0;
	for (const slug of SLUGS) {
		if (processSlug(slug)) ok += 1;
		else fail += 1;
	}
	log(10, 'summary', { ok, fail });
	process.exit(fail ? 1 : 0);
}

main();
