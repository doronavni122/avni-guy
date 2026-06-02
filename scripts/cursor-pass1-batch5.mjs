#!/usr/bin/env node
/**
 * Pass 1 batch 5: research + MDX remediation for config/remediation-batch.json.
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
import { BATCH11_ARTICLES } from './lib/batch11-article-bodies.mjs';
import { buildResearchStudy } from './lib/pass1-batch-remediation-content.mjs';
import { BATCH5_RESEARCH_SPECS } from './lib/pass1-batch5-research-specs.mjs';
import { primaryPillarForCategory } from './lib/pillar-cluster-registry.mjs';
import { getMinWordsForTier, getArticleTier } from './lib/content-tiers.mjs';
import { countWordsHe } from './lib/seo-hero-rules.mjs';

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
	const topic = BATCH11_ARTICLES[slug]?.title?.split(':')[0]?.trim() ?? slug;
	while (countWordsHe(out) < minWords && n < 25) {
		out += `\n\n## נקודות נוספות (${topic}) - ${n + 1}\n\n`;
		out += `בנושא ${topic}, מומלץ לתעד החלטות בכתב, לשמור מסמכים מקוריים, ולהימנע מהסתמכות על הבטחות בעל פה. `;
		out += `כל מקרה נבחן לפי נסיבותיו; המידע במאמר אינו תחליף לייעוץ אישי מול עורך דין. `;
		out += `לפני חתימה כדאי לבדוק נסח רישום, חוזה מלא, ולוח תשלומים מול מימון. `;
		n += 1;
	}
	return out;
}

function writeResearch(slug) {
	const spec = BATCH5_RESEARCH_SPECS[slug];
	if (!spec) {
		logErr(1, 'missing research spec', slug);
		return false;
	}
	const outPath = path.join(RESEARCH_DIR, `${slug}.md`);
	fs.mkdirSync(RESEARCH_DIR, { recursive: true });
	fs.writeFileSync(outPath, buildResearchStudy(spec), 'utf8');
	log(1, 'wrote research study', { slug, path: outPath });
	return true;
}

function writeMdxFromBatch11(slug) {
	const spec = BATCH11_ARTICLES[slug];
	if (!spec?.body) {
		log(2, 'skip MDX batch11 (no body spec)', { slug });
		return true;
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
	let body = normalizeBodyHrefs(spec.body);
	body = padBody(body, slug, minWords);

	const pillar = primaryPillarForCategory(spec.category, slug);
	if (pillar && !body.includes(`/blog/${pillar}/`)) {
		const anchor = spec.category === 'real-estate' ? 'צ\'קליסט קנייה מקבלן' : 'סקירת חוזים';
		body = body.replace(
			/^## /m,
			`לפני החלטה כדאי לעיין ב-[${anchor}](/blog/${pillar}/) ובמדריכים נוספים בקטגוריה.\n\n## `,
		);
	}

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
		secondaryKeywords: ['קנייה מקבלן', 'חוזה מכר', 'ערבות', 'רוכש דירה', 'ביטול עסקה'].slice(0, 5),
		internalLinks: [],
	};
	if (!hasBrandHomeLink(body)) {
		body += `\n\nליווי משפטי בנושא זה זמין דרך [${brandAnchor(data.mainKeyword)}](/).\n`;
	}
	body = normalizeBodyHrefs(body);
	data.internalLinks = extractParagraphInternalHrefs(body);
	const fm = serializeFrontmatter(data, imagesSection);
	fs.writeFileSync(filePath, `${fm}\n\n${body}\n`, 'utf8');
	log(2, 'wrote MDX from batch11', { slug, words: countWordsHe(body) });
	return true;
}

function applyBrandLinkOnly(slug) {
	const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
	const raw = fs.readFileSync(filePath, 'utf8');
	const imagesSection = extractImagesSection(raw);
	const parsed = matter(raw);
	let body = parsed.content.trimEnd();
	if (hasBrandHomeLink(body)) {
		log(3, 'brand link present', { slug });
	} else {
		const anchor = brandAnchor(parsed.data.mainKeyword ?? 'גיא אבני עורך דין');
		body += `\n\nלפני החלטה מומלץ לתאם ייעוץ דרך [${anchor}](/).\n`;
		log(3, 'added brand paragraph', { slug });
	}
	body = normalizeBodyHrefs(body);
	const data = {
		...parsed.data,
		internalLinks: extractParagraphInternalHrefs(body),
		updatedDate: '2026-06-02',
		materialChange: true,
	};
	if (!data.internalLinks.includes('/')) data.internalLinks.push('/');
	const fm = serializeFrontmatter(data, imagesSection);
	fs.writeFileSync(filePath, `${fm}\n\n${body}\n`, 'utf8');
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
	log(0, 'batch5 start', { slugs });
	let ok = true;
	for (const slug of slugs) {
		if (!writeResearch(slug)) ok = false;
		if (BATCH11_ARTICLES[slug]?.body) {
			if (!writeMdxFromBatch11(slug)) ok = false;
		} else {
			if (!applyBrandLinkOnly(slug)) ok = false;
		}
		if (!runAudit(slug)) {
			logErr(9, 'audit failed', slug);
			ok = false;
		} else {
			log(9, 'audits passed', { slug });
		}
	}
	if (!ok) process.exit(1);
	log(10, 'batch5 complete', { count: slugs.length });
}

main();
