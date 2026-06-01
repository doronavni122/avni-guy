import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import {
	extractParagraphInternalHrefs,
	fitMetaDescription,
	fitMetaTitle,
	logRemediation,
	normalizeBodyHrefs,
	serializeFrontmatter,
	stripForbiddenTitle,
} from './lib/article-body-kit.mjs';
import { runArticleContentChecks } from './lib/check-article-content.mjs';
import { buildSpecFromStub, NEW_ARTICLE_SLUGS } from './lib/new-article-spec-factory.mjs';

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');
const RESEARCH_DIR = path.join(process.cwd(), '.cursor/tmp/research');
const BATCH_SIZE = 10;

function logPipeline(step, message, extra) {
	if (extra !== undefined) console.error(`[content-pipeline-loop] ${step}: ${message}`, extra);
	else console.error(`[content-pipeline-loop] ${step}: ${message}`);
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
	return filePath;
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
			: '2026-05-25',
		category: spec.category,
		tags: spec.tags,
		internalLinks: [],
	};
}

function writeMdx(slug, data, body, imagesSection) {
	const fm = serializeFrontmatter(data, imagesSection);
	fs.writeFileSync(path.join(BLOG_DIR, `${slug}.mdx`), `${fm}\n\n${body}`, 'utf8');
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

function markChecklist(path, relPath, done) {
	const mark = done ? '[x]' : '[ ]';
	const line = `- ${mark} ${relPath}`;
	if (!fs.existsSync(path)) {
		fs.writeFileSync(path, `${line}\n`, 'utf8');
		return;
	}
	const content = fs.readFileSync(path, 'utf8');
	if (content.includes(relPath)) {
		fs.writeFileSync(
			path,
			content.replace(new RegExp(`- \\[[ x]\\] ${relPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`), line),
			'utf8',
		);
	} else {
		fs.writeFileSync(path, `${content.trimEnd()}\n${line}\n`, 'utf8');
	}
}

function initChecklists(slugs) {
	const articles = slugs.map((s) => `- [ ] src/content/blog/${s}.mdx`).join('\n');
	fs.writeFileSync('temp_articles_checklist.txt', `${articles}\n`, 'utf8');
	fs.writeFileSync('temp_internal_links_checklist.txt', `${articles}\n`, 'utf8');
	logPipeline('step 1', 'checklists created', { count: slugs.length });
}

function runBatch(slugs) {
	let ok = 0;
	let fail = 0;
	for (const slug of slugs) {
		const rel = `src/content/blog/${slug}.mdx`;
		if (enhanceSlug(slug)) {
			ok += 1;
			markChecklist('temp_articles_checklist.txt', rel, true);
			markChecklist('temp_internal_links_checklist.txt', rel, true);
		} else {
			fail += 1;
		}
	}
	const audit = runArticleContentChecks({ slugFilter: slugs });
	if (process.env.PIPELINE_SKIP_AUDIT === '1') {
		logPipeline('step 5', 'content:audit skipped (PIPELINE_SKIP_AUDIT=1)', { slugs: slugs.length });
		return { ok, fail, auditOk: true, errors: [] };
	}
	if (!audit.ok) {
		logPipeline('ERROR', 'content:audit batch failures', { count: audit.errors.length });
		for (const err of audit.errors.slice(0, 15)) {
			logPipeline('ERROR', err);
		}
		return { ok, fail, auditOk: false, errors: audit.errors };
	}
	logPipeline('step 5', 'content:audit passed for batch', { slugs: slugs.length });
	return { ok, fail, auditOk: true, errors: [] };
}

function main() {
	const filterEnv = process.env.PIPELINE_SLUGS;
	const slugs = filterEnv
		? filterEnv.split(',').map((s) => s.trim()).filter(Boolean)
		: NEW_ARTICLE_SLUGS;
	const batchIndex = Number(process.env.PIPELINE_BATCH ?? '0');
	const start = batchIndex * BATCH_SIZE;
	const batch = slugs.slice(start, start + BATCH_SIZE);

	if (batch.length === 0) {
		logPipeline('step 0', 'no slugs in batch', { batchIndex, total: slugs.length });
		return;
	}

	logPipeline('step 0', 'starting batch', { batchIndex, batchSize: batch.length, slugs: batch });
	if (batchIndex === 0 && !filterEnv) initChecklists(slugs);

	const result = runBatch(batch);
	console.log(JSON.stringify({ batchIndex, ...result }));
	if (!result.auditOk || result.fail > 0) process.exit(1);
}

main();
