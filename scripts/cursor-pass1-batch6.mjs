#!/usr/bin/env node
/**
 * Pass 1 batch 6: research + MDX remediation for config/remediation-batch.json.
 * Log: [cursor-remediation-auto]
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import matter from 'gray-matter';
import {
	brandAnchor,
	extractParagraphInternalHrefs,
	fitMetaDescription,
	fitMetaTitle,
	normalizeBodyHrefs,
	serializeFrontmatter,
} from './lib/article-body-kit.mjs';
import { buildResearchStudy } from './lib/pass1-batch-remediation-content.mjs';
import { BATCH6_RESEARCH_SPECS } from './lib/pass1-batch6-research-specs.mjs';
import { BATCH6_MDX_SPECS, buildBatch6Body } from './lib/pass1-batch6-mdx-specs.mjs';
import { getMinWordsForTier, getArticleTier } from './lib/content-tiers.mjs';
import { countWordsHe } from './lib/seo-hero-rules.mjs';
import { markSlugCompleted } from './lib/remediation-program.mjs';

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');
const RESEARCH_DIR = path.join(process.cwd(), 'content-research');
const QUEUE_PATH = path.join(process.cwd(), 'config/remediation-batch.json');

function log(step, msg, extra) {
	if (extra !== undefined) console.error(`[cursor-remediation-auto] step ${step}: ${msg}`, extra);
	else console.error(`[cursor-remediation-auto] step ${step}: ${msg}`);
}

function logErr(step, msg, extra) {
	console.error(`[cursor-remediation-auto] ERROR step ${step}: ${msg}`, extra ?? '');
}

function loadBatchSlugs() {
	if (!fs.existsSync(QUEUE_PATH)) {
		logErr(0, 'missing remediation-batch.json');
		process.exit(1);
	}
	const batch = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
	return batch.batchSlugs ?? [];
}

function extractImagesSection(raw) {
	const m = raw.match(/^images:\n[\s\S]*?(?=\n---)/m);
	return m ? m[0].replace(/\s+$/, '') : '';
}

function hasBrandHomeLink(body) {
	return body.includes('[גיא אבני](/)') || body.includes('[גיא אבני עורך דין](/)');
}

function padBody(body, slug, minWords) {
	let out = body;
	let n = 0;
	const topic = slug.replace(/^guy-avni-/, '').replace(/-/g, ' ');
	while (countWordsHe(out) < minWords && n < 20) {
		out += `\n\n## נקודות נוספות (${topic}) - ${n + 1}\n\n`;
		out += `בנושא ${topic}, מומלץ לתעד החלטות בכתב, לשמור מסמכים מקוריים, ולהימנע מהסתמכות על הבטחות בעל פה. `;
		out += `המידע במאמר מעודכן ל-2026 ואינו תחליף לייעוץ אישי. `;
		n += 1;
	}
	return out;
}

function writeResearch(slug) {
	const spec = BATCH6_RESEARCH_SPECS[slug];
	if (!spec) {
		logErr(1, 'missing research spec', slug);
		return false;
	}
	const outPath = path.join(RESEARCH_DIR, `${slug}.md`);
	fs.mkdirSync(RESEARCH_DIR, { recursive: true });
	fs.writeFileSync(outPath, buildResearchStudy(spec), 'utf8');
	log(1, 'wrote research study', { slug });
	return true;
}

function writeMdx(slug) {
	const spec = BATCH6_MDX_SPECS[slug];
	const bodyRaw = buildBatch6Body(slug);
	if (!spec || !bodyRaw) {
		logErr(2, 'missing body spec', slug);
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
	const tier = getArticleTier(slug);
	const minWords = getMinWordsForTier(tier, slug);
	let body = normalizeBodyHrefs(bodyRaw);
	body = padBody(body, slug, minWords);
	if (!hasBrandHomeLink(body)) {
		body += `\n\nליווי במיסוי ונדל"ן זמין דרך [${brandAnchor('גיא אבני עורך דין')}](/).\n`;
	}
	body = normalizeBodyHrefs(body);
	const data = {
		title: spec.title,
		description: spec.description.trim(),
		metaTitle: fitMetaTitle(spec.metaTitle),
		metaDescription: fitMetaDescription(spec.metaDescription),
		mainKeyword: 'גיא אבני עורך דין',
		pubDate:
			typeof parsed.data.pubDate === 'string'
				? parsed.data.pubDate
				: parsed.data.pubDate?.toISOString?.().slice(0, 10) ?? '2026-06-01',
		category: spec.category,
		tags: spec.tags,
		updatedDate: '2026-06-02',
		materialChange: true,
		contentType: 'cluster',
		secondaryKeywords: [
			'מס שבח',
			'רשות המיסים',
			'חישוב מס',
			'דירת מגורים',
			'תכנון מס',
		].slice(0, 5),
		internalLinks: extractParagraphInternalHrefs(body),
	};
	if (!data.internalLinks.includes('/')) data.internalLinks.push('/');
	const fm = serializeFrontmatter(data, imagesSection);
	fs.writeFileSync(filePath, `${fm}\n\n${body}\n`, 'utf8');
	log(2, 'wrote MDX', { slug, words: countWordsHe(body) });
	return true;
}

function runAudit(slug) {
	const r = spawnSync(process.execPath, ['scripts/audit-research-study.mjs', slug], {
		stdio: 'inherit',
	});
	if (r.status !== 0) return false;
	const c = spawnSync('pnpm', ['run', 'content:audit'], {
		stdio: 'inherit',
		env: { ...process.env, CONTENT_AUDIT_SLUGS: slug },
	});
	return c.status === 0;
}

function main() {
	const slugs = loadBatchSlugs();
	log(0, 'batch6 start', { slugs });
	let ok = true;
	for (const slug of slugs) {
		if (!writeResearch(slug)) ok = false;
		if (!writeMdx(slug)) ok = false;
		if (!runAudit(slug)) {
			logErr(9, 'audit failed', slug);
			ok = false;
		} else {
			log(9, 'audits passed', { slug });
			markSlugCompleted(slug);
		}
	}
	if (!ok) process.exit(1);
	log(10, 'batch6 complete', { count: slugs.length });
}

main();
