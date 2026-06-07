/**
 * Shared Exa research session (search + fetch + min duration). Log: [exa-research-session]
 */
import {
	exaWebFetch,
	exaWebSearch,
	isAllowlistedHost,
	sleep,
} from './exa-research-client.mjs';
import {
	EXA_SEED_AUTHORITY_URLS,
	getExaQueryIntervalMs,
} from './exa-research-config.mjs';
import { buildExaSearchQueries } from './exa-research-study-builder.mjs';
import {
	resolveResearchExaMinDurationSec,
	resolveResearchExaQueryCount,
} from './research-study-rules.mjs';

function log(step, msg, extra) {
	if (extra !== undefined) console.error(`[exa-research-session] step ${step}: ${msg}`, extra);
	else console.error(`[exa-research-session] step ${step}: ${msg}`);
}

function logErr(step, msg, extra) {
	console.error(`[exa-research-session] ERROR step ${step}: ${msg}`, extra ?? '');
}

/**
 * @param {Array<{ url: string, title: string, text: string, host: string | null, query?: string, accessedAt: string }>} sources
 * @param {{ url: string, title: string, text: string, host: string | null }} row
 * @param {string} query
 * @param {string} accessedAt
 */
export function mergeExaSource(sources, row, query, accessedAt) {
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

/**
 * @param {string} slug
 * @param {Record<string, unknown>} meta
 * @returns {Promise<import('./exa-research-study-builder.mjs').ExaResearchSession>}
 */
export async function runExaSession(slug, meta) {
	const startedAt = new Date().toISOString();
	const queries = buildExaSearchQueries(meta, slug).slice(0, resolveResearchExaQueryCount());
	const intervalMs = getExaQueryIntervalMs();
	/** @type {import('./exa-research-study-builder.mjs').ExaResearchSession['sources']} */
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
				mergeExaSource(sources, row, q, accessedAt);
			}
			log(2, 'query done', {
				i: i + 1,
				results: rows.length,
				allowlisted: sources.filter((s) => isAllowlistedHost(s.host)).length,
			});
		} catch (e) {
			logErr(2, 'query failed', { query: q, message: e.message });
			logs.push(`${new Date().toISOString()} ERROR search: ${e.message}`);
		}
		if (i < queries.length - 1) {
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
				mergeExaSource(sources, row, 'seed-authority-urls', accessedAt);
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
