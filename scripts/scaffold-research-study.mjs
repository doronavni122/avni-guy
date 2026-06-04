#!/usr/bin/env node
/**
 * Scaffold ephemeral research study file. Log prefix: [research-scaffold]
 */
import matter from 'gray-matter';
import fs from 'node:fs';
import path from 'node:path';
import { RESEARCH_DIR, RESEARCH_YMYL_FRAMEWORK_SECTION } from './lib/research-study-rules.mjs';

function log(msg, extra) {
	if (extra !== undefined) console.error(`[research-scaffold] ${msg}`, extra);
	else console.error(`[research-scaffold] ${msg}`);
}

function logErr(msg, extra) {
	console.error(`[research-scaffold] ERROR ${msg}`, extra ?? '');
}

function readMdxMeta(slug) {
	const fp = path.join(process.cwd(), 'src/content/blog', `${slug}.mdx`);
	if (!fs.existsSync(fp)) {
		logErr('MDX not found', fp);
		process.exit(1);
	}
	const parsed = matter(fs.readFileSync(fp, 'utf8'));
	const mainKeyword = parsed.data.mainKeyword ?? parsed.data.main_keyword ?? '';
	return { mainKeyword, title: parsed.data.title ?? slug };
}

function buildScaffold(slug, mainKeyword, title) {
	const started = new Date().toISOString();
	return `---
research_started_at: ${started}
research_completed_at:
research_method:
slug: ${slug}
main_keyword: ${mainKeyword}
---

# Research: ${slug}

## Query intent
- Primary question:
- Audience:

## Methodology
- Sources to fetch (gov.il, justice.gov.il, israelbar.org.il):

## Authority source matrix
| URL | host | date accessed | extracted claim |
| --- | --- | --- | --- |
| | | | |

## ${RESEARCH_YMYL_FRAMEWORK_SECTION}
- Statute sections (סעיף / sec.):

## Facts
- (Hebrew bullets with host citation and 2025/2026 dates)

## SERP and content gap
- Competitor notes:

## Contradictions and open questions
-

## Limitations
- Research only; not legal advice / אינו ייעוץ משפטי.

## Statistics 2025-2026
-

## LSI and related terms
-

## Section outline
1. (maps to MDX ## H2 for: ${title})

## Research log
- ${started} scaffold created; fetch authority sources next.
`;
}

function main() {
	const slug = process.argv[2]?.trim();
	if (!slug || slug.startsWith('--')) {
		logErr('usage: node scripts/scaffold-research-study.mjs <slug>');
		process.exit(1);
	}

	const dir = path.join(process.cwd(), RESEARCH_DIR);
	fs.mkdirSync(dir, { recursive: true });
	const fp = path.join(dir, `${slug}.md`);

	if (fs.existsSync(fp)) {
		logErr('research file already exists', fp);
		process.exit(1);
	}

	const { mainKeyword, title } = readMdxMeta(slug);
	fs.writeFileSync(fp, buildScaffold(slug, mainKeyword, title), 'utf8');
	log('created', { slug, path: fp });
	log('hint', 'Run: pnpm run research:exa -- ' + slug + ' (sets research_method: exa), then: pnpm run research:audit -- ' + slug);
}

main();
