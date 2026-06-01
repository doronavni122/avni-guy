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
import { KEYWORD_STUB_SLUGS } from './lib/keyword-stub-slugs.mjs';
import { buildSpecFromStub } from './lib/new-article-spec-factory.mjs';

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');
const RESEARCH_DIR = path.join(process.cwd(), '.cursor/tmp/research');
const SLUGS = KEYWORD_STUB_SLUGS;

function logPipeline(step, message, extra) {
	if (extra !== undefined) console.error(`[content-pipeline-loop] ${step}: ${message}`, extra);
	else console.error(`[content-pipeline-loop] ${step}: ${message}`);
}

function logBrand(step, message, extra) {
	if (extra !== undefined) console.error(`[homepage-brand-internal-links-loop] ${step}: ${message}`, extra);
	else console.error(`[homepage-brand-internal-links-loop] ${step}: ${message}`);
}

function extractImagesSection(raw) {
	const m = raw.match(/^images:\n[\s\S]*?(?=\n---)/m);
	return m ? m[0].replace(/\s+$/, '') : '';
}

function writeResearchFile(slug, spec) {
	fs.mkdirSync(RESEARCH_DIR, { recursive: true });
	const filePath = path.join(RESEARCH_DIR, `${slug}.md`);
	const lines = [
		`# Research: ${spec.title}`,
		'',
		'## Key points (Hebrew)',
		`- נושא: ${spec.title.split(',')[0].trim()}`,
		`- קטגוריה: ${spec.category}`,
		`- מילות מפתח: ${spec.topicLexicon.slice(0, 6).join(', ')}`,
		'',
		'## Sections',
		...spec.sectionBlueprints.map((s) => `- ${s.heading}: ${s.focus}`),
		'',
		'## YMYL sources',
		'- https://www.israelbar.org.il/',
		'- https://www.gov.il/he/departments/ministry_of_justice/govil-landing-page',
	];
	fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
}

function deleteResearchFile(slug) {
	const filePath = path.join(RESEARCH_DIR, `${slug}.md`);
	try {
		if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
	} catch (err) {
		logPipeline('ERROR', `research delete failed ${slug}`, err.message);
	}
}

function buildFrontmatterData(existing, spec) {
	return {
		title: stripForbiddenTitle(spec.title),
		description: spec.description.trim(),
		metaTitle: fitMetaTitle(spec.metaTitle),
		metaDescription: fitMetaDescription(spec.metaDescription),
		mainKeyword: spec.mainKeyword,
		pubDate: existing.pubDate
			? typeof existing.pubDate === 'string'
				? existing.pubDate
				: existing.pubDate.toISOString().slice(0, 10)
			: '2026-06-01',
		category: spec.category,
		tags: spec.tags,
		internalLinks: [],
	};
}

function writeMdx(slug, data, body, imagesSection) {
	const fm = serializeFrontmatter(data, imagesSection);
	fs.writeFileSync(path.join(BLOG_DIR, `${slug}.mdx`), `${fm}\n\n${body}`, 'utf8');
}

function hasBrandHomeLink(body) {
	return body.includes('[גיא אבני](/)') || body.includes('[גיא אבני עורך דין](/)');
}

function bodyHasHomeParagraphLink(body) {
	return /\[([^\]]+)\]\(\/\)/.test(body);
}

function applyHomepageBrand(slug) {
	logBrand('step 4', 'start', { slug });
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
		logBrand('ERROR', `images block missing ${slug}`);
		return false;
	}
	const parsed = matter(raw);
	let body = parsed.content.trimEnd();
	const mainKeyword = parsed.data.mainKeyword ?? 'גיא אבני עורך דין';
	if (hasBrandHomeLink(body)) {
		logBrand('step 4', 'skip brand link already present', { slug });
		return true;
	}
	if (bodyHasHomeParagraphLink(body)) {
		logBrand('step 4', 'skip home href already in body (non-brand anchor)', { slug });
		return true;
	}
	const anchor = brandAnchor(mainKeyword);
	const paragraph = `\n\nליווי משפטי בנושא: [${anchor}](/).\n`;
	body = `${body}${paragraph}`;
	body = normalizeBodyHrefs(body);
	const data = { ...parsed.data, internalLinks: extractParagraphInternalHrefs(body) };
	if (!data.internalLinks.includes('/')) {
		data.internalLinks.push('/');
	}
	try {
		writeMdx(slug, data, body, imagesSection);
		logBrand('step 4', 'done', { slug });
		return true;
	} catch (err) {
		logBrand('ERROR', `write failed ${slug}`, err.message);
		return false;
	}
}

function enhanceSlug(slug) {
	logPipeline('step 2', 'content-enhancer-loop start', { slug });
	const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
	let raw;
	try {
		raw = fs.readFileSync(filePath, 'utf8');
	} catch (err) {
		logPipeline('ERROR', `read failed ${slug}`, err.message);
		return false;
	}
	const imagesSection = extractImagesSection(raw);
	if (!imagesSection) {
		logPipeline('ERROR', `images block missing ${slug}`);
		return false;
	}
	const parsed = matter(raw);
	const spec = buildSpecFromStub(slug, {
		title: parsed.data.title,
		category: parsed.data.category,
		tags: parsed.data.tags,
		mainKeyword: parsed.data.mainKeyword,
		description: parsed.data.description,
	});
	writeResearchFile(slug, spec);
	const data = buildFrontmatterData(parsed.data, spec);
	let body;
	try {
		body = spec.buildBody();
		body = normalizeBodyHrefs(body);
		data.internalLinks = extractParagraphInternalHrefs(body);
		if (data.internalLinks.length < 10) {
			logPipeline('ERROR', `${slug} internalLinks ${data.internalLinks.length} below 10`);
			return false;
		}
		writeMdx(slug, data, body, imagesSection);
		deleteResearchFile(slug);
		logPipeline('step 2', 'content-enhancer-loop done', { slug });
		logPipeline('step 3', 'internal-links-loop done (embedded in body)', { slug });
		return true;
	} catch (err) {
		logPipeline('ERROR', `enhance failed ${slug}`, err.message);
		return false;
	}
}

function markChecklist(checklistPath, relPath, done) {
	const mark = done ? '[x]' : '[ ]';
	const line = `- ${mark} ${relPath}`;
	if (!fs.existsSync(checklistPath)) {
		fs.writeFileSync(checklistPath, `${line}\n`, 'utf8');
		return;
	}
	const content = fs.readFileSync(checklistPath, 'utf8');
	if (content.includes(relPath)) {
		fs.writeFileSync(
			checklistPath,
			content.replace(new RegExp(`- \\[[ x]\\] ${relPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`), line),
			'utf8',
		);
	} else {
		fs.writeFileSync(checklistPath, `${content.trimEnd()}\n${line}\n`, 'utf8');
	}
}

function initChecklists(slugs) {
	const articles = slugs.map((s) => `- [ ] src/content/blog/${s}.mdx`).join('\n');
	fs.writeFileSync('temp_articles_checklist.txt', `${articles}\n`, 'utf8');
	fs.writeFileSync('temp_internal_links_checklist.txt', `${articles}\n`, 'utf8');
	fs.writeFileSync('temp_homepage_brand_internal_links_checklist.txt', `${articles}\n`, 'utf8');
	logPipeline('step 1', 'checklists created', { count: slugs.length });
}

function processSlug(slug) {
	const rel = `src/content/blog/${slug}.mdx`;
	if (!enhanceSlug(slug)) return false;
	if (!applyHomepageBrand(slug)) return false;
	markChecklist('temp_articles_checklist.txt', rel, true);
	markChecklist('temp_internal_links_checklist.txt', rel, true);
	markChecklist('temp_homepage_brand_internal_links_checklist.txt', rel, true);
	return true;
}

function main() {
	const slugs = SLUGS;
	logPipeline('step 0', 'starting keyword stubs pipeline', { count: slugs.length });
	initChecklists(slugs);

	let ok = 0;
	let fail = 0;
	for (const slug of slugs) {
		if (processSlug(slug)) ok += 1;
		else fail += 1;
	}

	logPipeline('step 5', 'running content audit', { slugs: slugs.length });
	const audit = runArticleContentChecks({ slugFilter: slugs });
	if (!audit.ok) {
		logPipeline('ERROR', 'content:audit failures', { count: audit.errors.length });
		for (const err of audit.errors.slice(0, 30)) {
			logPipeline('ERROR', err);
		}
		console.log(JSON.stringify({ ok, fail, auditOk: false, errorCount: audit.errors.length }));
		process.exit(1);
	}
	logPipeline('step 5', 'content:audit passed', { slugs: slugs.length });
	console.log(JSON.stringify({ ok, fail, auditOk: true }));
}

main();
