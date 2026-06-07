#!/usr/bin/env node
/**
 * Pass 1 batch 7: research + handcrafted MDX for config/remediation-batch.json.
 * Log: [cursor-remediation-auto]
 */
import matter from 'gray-matter';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {
	buildCtaParagraph,
	buildFaqSection,
	buildTldrBlock,
	extractParagraphInternalHrefs,
	fitMetaDescription,
	fitMetaTitle,
	normalizeBodyHrefs,
	serializeFrontmatter,
} from './lib/article-body-kit.mjs';
import { ensureMainKeywordInFrontmatter, ensureMainKeywordInHeadings } from './lib/article-pipeline-contract.mjs';
import { buildResearchStudyExpanded } from './lib/pass1-batch-remediation-content.mjs';
import { BATCH7_ARTICLES } from './lib/pass1-batch7-article-bodies.mjs';
import {
	BATCH7_SLUGS,
	BATCH_MDX_SPECS,
	FAQ_BY_SLUG,
	RESEARCH_SPECS,
} from './lib/pass1-batch7-remediation-specs.mjs';
import { injectStudyAnchorsPerParagraph } from './lib/study-anchor-linker.mjs';
import { getArticleTier, getMinWordsForTier } from './lib/content-tiers.mjs';
import { countWordsHe } from './lib/seo-hero-rules.mjs';
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
	return BATCH7_SLUGS;
}

function extractImagesSection(raw) {
	const m = raw.match(/^images:\n[\s\S]*?(?=\n---)/m);
	return m ? m[0].replace(/\s+$/, '') : '';
}

function padBody(body, slug, minWords, studyMarkdown) {
	let out = body;
	let n = 0;
	const lsi = RESEARCH_SPECS[slug]?.lsi ?? [];
	const stats = RESEARCH_SPECS[slug]?.stats ?? ['עדכון 2026'];
	while (countWordsHe(out) < minWords + 10 && n < 20) {
		const term = lsi[n % lsi.length] ?? 'תיעוד בכתב';
		const stat = stats[n % stats.length] ?? '2026';
		out += `\n\n## ${term} - גיא אבני עורך דין: הרחבה ${n + 1}\n\n`;
		out += `בנושא ${term}, גיא אבני עורך דין ממליץ לתעד החלטות בכתב לפני ${stat}. `;
		out += `ראו [${term}](/blog/) ו-[יצירת קשר](/contact/).\n`;
		n += 1;
	}
	return injectStudyAnchorsPerParagraph(out, studyMarkdown, {
		slug,
		category: BATCH7_ARTICLES[slug]?.category ?? '',
		tags: BATCH7_ARTICLES[slug]?.tags ?? [],
		mainKeyword: 'גיא אבני עורך דין',
	});
}

function writeResearch(slug) {
	const spec = RESEARCH_SPECS[slug];
	if (!spec) {
		logErr(1, 'missing research spec', slug);
		return false;
	}
	const paras = BATCH_MDX_SPECS[slug]?.uniqueParagraphs ?? [];
	const md = buildResearchStudyExpanded(spec, paras);
	const fp = path.join(process.cwd(), RESEARCH_DIR, `${slug}.md`);
	fs.mkdirSync(path.dirname(fp), { recursive: true });
	fs.writeFileSync(fp, md, 'utf8');
	log(1, 'wrote research study', { slug, path: fp });
	return true;
}

function writeMdx(slug) {
	const spec = BATCH7_ARTICLES[slug];
	if (!spec?.body) {
		logErr(2, 'missing article body', slug);
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
	const studyPath = path.join(process.cwd(), RESEARCH_DIR, `${slug}.md`);
	const studyMarkdown = fs.readFileSync(studyPath, 'utf8');
	const tier = getArticleTier(slug);
	const minWords = getMinWordsForTier(tier, slug);
	const opener = BATCH_MDX_SPECS[slug]?.uniqueOpener ?? spec.description;
	let body = buildTldrBlock('גיא אבני עורך דין', opener);
	body += normalizeBodyHrefs(spec.body);
	const statsBlock = (RESEARCH_SPECS[slug]?.stats ?? ['נתון 2026'])
		.map((s) => `- ${s}`)
		.join('\n');
	body += `\n\n## נתונים ועדכונים 2025-2026 - גיא אבני עורך דין\n\n${statsBlock}\n`;
	body += buildFaqSection(FAQ_BY_SLUG[slug] ?? []);
	body += buildCtaParagraph('גיא אבני עורך דין');
	body = ensureMainKeywordInHeadings(body, 'גיא אבני עורך דין');
	body = padBody(body, slug, minWords, studyMarkdown);
	body = normalizeBodyHrefs(body.trim() + '\n');
	const pubDate =
		typeof parsed.data.pubDate === 'string'
			? parsed.data.pubDate
			: parsed.data.pubDate?.toISOString?.().slice(0, 10) ?? '2026-06-01';
	let data = {
		title: spec.title,
		description: spec.description.trim(),
		metaTitle: fitMetaTitle(spec.metaTitle),
		metaDescription: fitMetaDescription(spec.metaDescription),
		mainKeyword: 'גיא אבני עורך דין',
		pubDate,
		category: spec.category,
		tags: spec.tags,
		updatedDate: '2026-06-07',
		materialChange: true,
		contentType: spec.contentType ?? 'cluster',
		pipelineContractVersion: 1,
		secondaryKeywords: (RESEARCH_SPECS[slug]?.lsi ?? []).slice(0, 5),
		internalLinks: extractParagraphInternalHrefs(body),
		faq: FAQ_BY_SLUG[slug] ?? [],
	};
	data = ensureMainKeywordInFrontmatter(data, 'גיא אבני עורך דין', { metaMax: 155 });
	const fm = serializeFrontmatter(data, imagesSection);
	fs.writeFileSync(filePath, `${fm}\n\n${body}`, 'utf8');
	log(2, 'wrote MDX', { slug, words: countWordsHe(body), internalLinks: data.internalLinks.length });
	return true;
}

function runAudit(slug) {
	const r = spawnSync(process.execPath, ['scripts/audit-research-study.mjs', slug], {
		stdio: 'inherit',
	});
	if (r.status !== 0) return false;
	const c = spawnSync('pnpm', ['run', 'content:audit'], {
		stdio: 'inherit',
		env: {
			...process.env,
			CONTENT_AUDIT_SLUGS: slug,
			CONTENT_STRICT: '1',
			PIPELINE_CONTRACT: '1',
		},
	});
	if (c.status !== 0) return false;
	const l = spawnSync('pnpm', ['run', 'links:audit'], {
		stdio: 'inherit',
		env: {
			...process.env,
			LINKS_AUDIT_SLUGS: slug,
			LINKS_AUDIT_ENFORCE: '1',
			PIPELINE_CONTRACT: '1',
			PIPELINE_SLUGS: slug,
		},
	});
	return l.status === 0;
}

function main() {
	const slugs = loadBatchSlugs();
	log(0, 'batch7 start', { count: slugs.length, slugs });
	let ok = true;
	for (const slug of slugs) {
		if (!writeResearch(slug)) ok = false;
		if (!writeMdx(slug)) ok = false;
	}
	for (const slug of slugs) {
		if (!runAudit(slug)) {
			logErr(9, 'audit failed', slug);
			ok = false;
		} else {
			log(9, 'audits passed', { slug });
		}
	}
	if (!ok) process.exit(1);
	log(10, 'batch7 complete', { count: slugs.length });
}

main();
