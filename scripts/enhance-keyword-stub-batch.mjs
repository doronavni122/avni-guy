#!/usr/bin/env node
/**
 * Content enhancer for 9 keyword-stub MDX slugs (tax + mortgage cluster).
 * Logs: [content-enhancer-loop]
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
import { getKeywordStubBatchArticle } from './lib/keyword-stub-batch-articles.mjs';
import { TOPUP_PARAGRAPHS_BY_SLUG } from './lib/keyword-stub-batch-topup.mjs';
import { countWordsHe } from './lib/seo-hero-rules.mjs';
import { assertResearchStudyReady, deleteResearchStudy } from './lib/research-study-io.mjs';

const BLOG = path.join(process.cwd(), 'src/content/blog');

const SLUGS = [
	'guy-avni-capital-gains-tax-second-apartment',
	'guy-avni-purchase-tax-exemption-first-apartment',
	'guy-avni-split-sale-transaction-tax-savings',
	'guy-avni-linear-capital-gains-tax-benefit',
	'guy-avni-mortgage-portability-between-properties',
	'guy-avni-mizrahi-mortgage-refinance-cost',
	'guy-avni-mortgage-refinance-rising-rates',
	'guy-avni-bank-financing-private-home-construction',
	'guy-avni-mortgage-pre-approval-process',
];

function log(step, msg, extra) {
	if (extra !== undefined) console.error(`[content-enhancer-loop] step ${step}: ${msg}`, extra);
	else console.error(`[content-enhancer-loop] step ${step}: ${msg}`);
}

function extractImages(raw) {
	const m = raw.match(/^images:\n[\s\S]*?(?=\n---)/m);
	return m ? m[0].replace(/\s+$/, '') : '';
}

function stripStubPadding(body) {
	return body.replace(/\n## [^\n]*השלכות מעשיות \(\d+\)[\s\S]*?(?=\n## |\nמקורות|$)/g, '\n');
}

function enhanceSlug(slug) {
	log(2, `start ${slug}`);
	const fp = path.join(BLOG, `${slug}.mdx`);
	const raw = fs.readFileSync(fp, 'utf8');
	const images = extractImages(raw);
	if (!images) throw new Error(`missing images ${slug}`);
	const parsed = matter(raw);
	const spec = getKeywordStubBatchArticle(slug);
	if (!spec) throw new Error(`no content spec ${slug}`);

	assertResearchStudyReady(slug);
	log(5, `research audit ok ${slug}`);

	let body = stripStubPadding(normalizeBodyHrefs(spec.body));
	const topups = TOPUP_PARAGRAPHS_BY_SLUG[slug] ?? [];
	for (const para of topups) {
		body += `\n\n${para.trim()}`;
	}
	const words = countWordsHe(body);
	if (words < 900) {
		throw new Error(`${slug}: body ${words} words below 900 after topup`);
	}

	const data = {
		title: spec.title,
		description: spec.description,
		metaTitle: fitMetaTitle(spec.metaTitle),
		metaDescription: fitMetaDescription(spec.metaDescription),
		mainKeyword: 'גיא אבני עורך דין',
		pubDate: parsed.data.pubDate ?? '2026-06-01',
		updatedDate: '2026-06-01',
		materialChange: true,
		category: parsed.data.category,
		tags: parsed.data.tags,
		internalLinks: extractParagraphInternalHrefs(body),
	};

	if (data.internalLinks.length < 10) {
		throw new Error(`${slug}: only ${data.internalLinks.length} internal links in paragraphs`);
	}

	const fm = serializeFrontmatter(data, images);
	fs.writeFileSync(fp, `${fm}\n\n${body}\n`, 'utf8');
	log(6, `body merged ${slug}`, { words });
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
		results[slug] = 'PASS-checks';
	} else if (slugErrors.length) {
		results[slug] = `FAIL-checks: ${slugErrors.join('; ')}`;
		log('ERROR', `audit ${slug}`, slugErrors);
	}
}

console.log(JSON.stringify({ results, auditOk: audit.ok, errorCount: audit.errors.length }, null, 2));
process.exit(audit.ok && !Object.values(results).some((v) => v.startsWith('ERROR')) ? 0 : 1);
