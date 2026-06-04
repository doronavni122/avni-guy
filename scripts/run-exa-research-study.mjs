#!/usr/bin/env node
/**
 * Run live Exa research (~10 min) and write content-research/<slug>.md (≥2000 words).
 * Same Exa backend as MCP web_search_exa / web_fetch_exa. Requires EXA_API_KEY.
 * Log: [exa-research]
 */
import matter from 'gray-matter';
import fs from 'node:fs';
import path from 'node:path';
import {
    checkResearchStudyFile,
    formatResearchErrors,
} from './lib/check-research-study.mjs';
import {
    exaWebFetch,
    exaWebSearch,
    isAllowlistedHost,
    sleep,
} from './lib/exa-research-client.mjs';
import {
    EXA_SEED_AUTHORITY_URLS,
    getExaQueryIntervalMs,
} from './lib/exa-research-config.mjs';
import {
    buildExaResearchStudyMarkdown,
    buildExaSearchQueries,
} from './lib/exa-research-study-builder.mjs';
import {
	RESEARCH_DIR,
	resolveResearchExaMinDurationSec,
	resolveResearchExaQueryCount,
} from './lib/research-study-rules.mjs';
import { countWordsHe } from './lib/seo-hero-rules.mjs';

function log(step, msg, extra) {
	if (extra !== undefined) console.error(`[exa-research] step ${step}: ${msg}`, extra);
	else console.error(`[exa-research] step ${step}: ${msg}`);
}

function logErr(step, msg, extra) {
	console.error(`[exa-research] ERROR step ${step}: ${msg}`, extra ?? '');
}

function readMdxMeta(slug) {
	const fp = path.join(process.cwd(), 'src/content/blog', `${slug}.mdx`);
	if (!fs.existsSync(fp)) {
		logErr(0, 'MDX not found', fp);
		process.exit(1);
	}
	const parsed = matter(fs.readFileSync(fp, 'utf8'));
	return {
		mainKeyword: parsed.data.mainKeyword ?? parsed.data.main_keyword ?? '',
		title: parsed.data.title ?? slug,
		description: parsed.data.description ?? '',
		category: parsed.data.category ?? '',
		tags: parsed.data.tags ?? [],
		secondaryKeywords: parsed.data.secondaryKeywords ?? [],
	};
}

/**
 * @param {Array<{ url: string, title: string, text: string, host: string | null, query?: string, accessedAt: string }>} sources
 * @param {{ url: string, title: string, text: string, host: string | null }} row
 * @param {string} query
 * @param {string} accessedAt
 */
function mergeSource(sources, row, query, accessedAt) {
	if (!row.url.startsWith('https://')) return;
	const existing = sources.find((s) => s.url === row.url);
	if (existing) {
		if (row.text.length > existing.text.length) existing.text = row.text;
		return;
	}
	sources.push({
		url: row.url,
		title: row.title,
		text: row.text,
		host: row.host,
		query,
		accessedAt,
	});
}

async function runExaSession(slug, meta) {
	const startedAt = new Date().toISOString();
	const queries = buildExaSearchQueries(meta, slug).slice(0, resolveResearchExaQueryCount());
	const intervalMs = getExaQueryIntervalMs();
	/** @type {import('./lib/exa-research-study-builder.mjs').ExaResearchSession['sources']} */
	const sources = [];
	const logs = [`${startedAt} Exa session started (${queries.length} queries, interval ${intervalMs}ms).`];

	log(1, 'session start', { slug, queries: queries.length, intervalMs });

	for (let i = 0; i < queries.length; i++) {
		const q = queries[i];
		const t0 = new Date().toISOString();
		logs.push(`${t0} web_search_exa query ${i + 1}/${queries.length}: ${q}`);
		try {
			const rows = await exaWebSearch(q, { numResults: 8 });
			const accessedAt = new Date().toISOString().slice(0, 10);
			for (const row of rows) {
				mergeSource(sources, row, q, accessedAt);
			}
			log(2, 'query done', { i: i + 1, results: rows.length, allowlisted: sources.filter((s) => isAllowlistedHost(s.host)).length });
		} catch (e) {
			logErr(2, 'query failed', { query: q, message: e.message });
			logs.push(`${new Date().toISOString()} ERROR search: ${e.message}`);
		}
		if (i < queries.length - 1) {
			log(2, 'sleep before next query', { ms: intervalMs });
			await sleep(intervalMs);
		}
	}

	const allowlistedCount = sources.filter((s) => isAllowlistedHost(s.host)).length;
	if (allowlistedCount < 5) {
		log(3, 'seed fetch (allowlisted URLs below minimum)', { allowlistedCount });
		const accessedAt = new Date().toISOString().slice(0, 10);
		logs.push(`${new Date().toISOString()} web_fetch_exa seeds (${EXA_SEED_AUTHORITY_URLS.length} URLs).`);
		try {
			const fetched = await exaWebFetch(EXA_SEED_AUTHORITY_URLS);
			for (const row of fetched) {
				mergeSource(sources, row, 'seed-authority-urls', accessedAt);
			}
		} catch (e) {
			logErr(3, 'seed fetch failed', e.message);
			logs.push(`${new Date().toISOString()} ERROR fetch seeds: ${e.message}`);
		}
	}

	const minDurationMs = resolveResearchExaMinDurationSec() * 1000;
	const elapsedMs = Date.now() - new Date(startedAt).getTime();
	if (elapsedMs < minDurationMs) {
		const waitMs = minDurationMs - elapsedMs;
		log(3, 'sleep to meet Exa min duration', { waitMs, minSec: resolveResearchExaMinDurationSec() });
		logs.push(`${new Date().toISOString()} waiting ${waitMs}ms to meet research_method exa min duration.`);
		await sleep(waitMs);
	}
	const completedAt = new Date().toISOString();
	logs.push(`${completedAt} Exa session completed; sources=${sources.length}.`);

	return {
		slug,
		meta,
		startedAt,
		completedAt,
		queries,
		sources,
		logs,
	};
}

async function main() {
	const argv = process.argv.slice(2);
	const force = argv.includes('--force');
	const skipAudit = argv.includes('--skip-audit');
	const slug = argv.find((a) => !a.startsWith('--'))?.trim();

	if (!slug) {
		logErr(0, 'usage: pnpm run research:exa -- <slug> [--force] [--skip-audit]');
		process.exit(1);
	}

	const outPath = path.join(process.cwd(), RESEARCH_DIR, `${slug}.md`);
	if (fs.existsSync(outPath) && !force) {
		logErr(0, 'research file exists (use --force to overwrite)', outPath);
		process.exit(1);
	}

	const meta = readMdxMeta(slug);
	fs.mkdirSync(path.dirname(outPath), { recursive: true });

	const session = await runExaSession(slug, meta);
	const markdown = buildExaResearchStudyMarkdown(session);
	fs.writeFileSync(outPath, markdown, 'utf8');

	const words = countWordsHe(matter(markdown).content);
	log(4, 'wrote study', { slug, path: outPath, words, sources: session.sources.length });

	if (!skipAudit) {
		const audit = checkResearchStudyFile(slug);
		if (!audit.ok) {
			logErr(4, 'research:audit failed after Exa write', formatResearchErrors(audit.errors));
			process.exit(1);
		}
		log(5, 'research:audit passed', { wordCount: audit.wordCount });
	}

	log(6, 'done', { slug, hint: 'pnpm run research:audit -- ' + slug });
}

main().catch((e) => {
	logErr(99, 'fatal', e.message);
	process.exit(1);
});
