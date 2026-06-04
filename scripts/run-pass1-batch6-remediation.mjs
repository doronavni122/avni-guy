#!/usr/bin/env node
/**
 * Pass 1 batch 6: capital-gains tax slugs from remediation-batch.json.
 * Log: [cursor-remediation-auto]
 */
import matter from 'gray-matter';
import fs from 'node:fs';
import path from 'node:path';
import {
    buildFaqSection,
    buildTldrBlock,
    extractParagraphInternalHrefs,
    fitMetaDescription,
    fitMetaTitle,
    normalizeBodyHrefs,
    serializeFrontmatter,
} from './lib/article-body-kit.mjs';
import { BATCH6_SLUGS, BATCH_MDX_SPECS, FAQ_BY_SLUG } from './lib/pass1-batch6-capital-gains-specs.mjs';
import { runExaResearchStudy } from './lib/research-study-io.mjs';
import { RESEARCH_DIR } from './lib/research-study-rules.mjs';

const BATCH_PATH = path.join(process.cwd(), 'config', 'remediation-batch.json');
const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');

function log(step, msg, extra) {
	if (extra !== undefined) console.error(`[cursor-remediation-auto] step ${step}: ${msg}`, extra);
	else console.error(`[cursor-remediation-auto] step ${step}: ${msg}`);
}

function logErr(step, msg, extra) {
	console.error(`[cursor-remediation-auto] ERROR step ${step}: ${msg}`, extra ?? '');
}

function loadBatchSlugs() {
	if (fs.existsSync(BATCH_PATH)) {
		const batch = JSON.parse(fs.readFileSync(BATCH_PATH, 'utf8'));
		if (Array.isArray(batch.batchSlugs) && batch.batchSlugs.length) {
			return batch.batchSlugs;
		}
	}
	return BATCH6_SLUGS;
}

function extractImagesSection(raw) {
	const m = raw.match(/^images:\n[\s\S]*?(?=\n---)/m);
	return m ? m[0].replace(/\s+$/, '') : '';
}

function enhanceBody(slug, spec, rawBody) {
	let body = rawBody;
	if (!/^\*\*/.test(body.trim()) && !body.includes('## סיכום') && !body.includes('**')) {
		const tldr = buildTldrBlock(
			spec.mainKeyword,
			spec.uniqueOpener ?? `${spec.title.split('|')[0].trim()}: נקודות מפתח לפני החלטה.`,
		);
		body = tldr + body;
	}
	if (!body.includes('## שאלות נפוצות')) {
		body += buildFaqSection(FAQ_BY_SLUG[slug] ?? []);
	}
	return normalizeBodyHrefs(body.trim() + '\n');
}

function writeResearch(slug) {
	if (!runExaResearchStudy(slug, { force: true })) {
		logErr(1, 'research:exa failed', slug);
		return false;
	}
	log(1, 'wrote research study via Exa', { slug, path: path.join(process.cwd(), RESEARCH_DIR, `${slug}.md`) });
	return true;
}

function writeMdx(slug) {
	const spec = BATCH_MDX_SPECS[slug];
	if (!spec) {
		logErr(2, 'missing MDX spec', slug);
		return false;
	}
	const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
	const raw = fs.readFileSync(filePath, 'utf8');
	const imagesSection = extractImagesSection(raw);
	if (!imagesSection) {
		logErr(2, 'images block missing', slug);
		return false;
	}
	const parsed = matter(raw);
	const pubDate =
		typeof parsed.data.pubDate === 'string'
			? parsed.data.pubDate
			: parsed.data.pubDate?.toISOString?.().slice(0, 10) ?? '2026-06-01';
	const data = {
		title: spec.title,
		description: spec.description.trim(),
		metaTitle: fitMetaTitle(spec.metaTitle),
		metaDescription: fitMetaDescription(spec.metaDescription),
		mainKeyword: spec.mainKeyword,
		pubDate,
		category: spec.category,
		tags: spec.tags,
		updatedDate: '2026-06-02',
		materialChange: true,
		contentType: 'cluster',
		secondaryKeywords: spec.topicLexicon.slice(0, 5),
		internalLinks: [],
	};
	let body = enhanceBody(slug, spec, spec.buildBody());
	data.internalLinks = extractParagraphInternalHrefs(body);
	const fm = serializeFrontmatter(data, imagesSection);
	fs.writeFileSync(filePath, `${fm}\n\n${body}`, 'utf8');
	log(2, 'wrote MDX', { slug, internalLinks: data.internalLinks.length });
	return true;
}

function main() {
	const slugs = loadBatchSlugs();
	log(0, 'batch slugs', { count: slugs.length, slugs });
	let ok = true;
	for (const slug of slugs) {
		if (!writeResearch(slug)) ok = false;
		if (!writeMdx(slug)) ok = false;
	}
	if (!ok) process.exit(1);
	log(3, 'batch 6 files written; run research:audit and content:audit per slug');
}

main();
