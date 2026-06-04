/**
 * Exa REST client (same backend as Exa MCP web_search_exa / web_fetch_exa).
 * Log: [exa-research-client]
 */
import { YMYL_EXTERNAL_ALLOWLIST_HOSTS } from './content-forbidden-patterns.mjs';
import { EXA_API_BASE, EXA_CONTENTS_PATH, EXA_SEARCH_PATH } from './exa-research-config.mjs';
import { loadEnvLocal } from './load-env-local.mjs';

function log(step, msg, extra) {
	if (extra !== undefined) console.error(`[exa-research-client] step ${step}: ${msg}`, extra);
	else console.error(`[exa-research-client] step ${step}: ${msg}`);
}

function logErr(step, msg, extra) {
	console.error(`[exa-research-client] ERROR step ${step}: ${msg}`, extra ?? '');
}

export function getExaApiKey() {
	loadEnvLocal();
	const key = process.env.EXA_API_KEY?.trim();
	if (!key) {
		const err = new Error(
			'[exa-research-client] ERROR EXA_API_KEY missing. Set in env or Cursor MCP Exa plugin (dashboard.exa.ai/api-keys).',
		);
		logErr(0, err.message);
		throw err;
	}
	return key;
}

/**
 * @param {string} url
 */
export function hostnameFromUrl(url) {
	try {
		return new URL(url).hostname.replace(/^www\./, '');
	} catch {
		return null;
	}
}

/**
 * @param {string | null | undefined} hostname
 */
export function isAllowlistedHost(hostname) {
	if (!hostname) return false;
	return YMYL_EXTERNAL_ALLOWLIST_HOSTS.some(
		(h) => hostname === h || hostname.endsWith(`.${h}`) || hostname.includes(h),
	);
}

/**
 * @param {string} path
 * @param {Record<string, unknown>} body
 */
async function exaPost(path, body) {
	const apiKey = getExaApiKey();
	const res = await fetch(`${EXA_API_BASE}${path}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-api-key': apiKey,
		},
		body: JSON.stringify(body),
	});
	const text = await res.text();
	if (!res.ok) {
		logErr(1, 'Exa API HTTP error', { status: res.status, path, body: text.slice(0, 500) });
		throw new Error(`Exa API ${res.status} on ${path}: ${text.slice(0, 200)}`);
	}
	try {
		return JSON.parse(text);
	} catch (e) {
		logErr(1, 'Exa API invalid JSON', { path, message: e.message });
		throw new Error(`Exa API invalid JSON on ${path}`);
	}
}

/**
 * @param {string} query
 * @param {{ numResults?: number }} [options]
 * @returns {Promise<Array<{ url: string, title: string, text: string, host: string | null }>>}
 */
export async function exaWebSearch(query, options = {}) {
	const numResults = options.numResults ?? 8;
	log(2, 'search', { query: query.slice(0, 120), numResults });
	const data = await exaPost(EXA_SEARCH_PATH, {
		query,
		numResults,
		type: 'auto',
		contents: { text: { maxCharacters: 5000 } },
	});
	const results = Array.isArray(data?.results) ? data.results : [];
	/** @type {Array<{ url: string, title: string, text: string, host: string | null }>} */
	const mapped = [];
	for (const row of results) {
		const url = String(row?.url ?? '').trim();
		if (!url.startsWith('https://')) continue;
		mapped.push({
			url,
			title: String(row?.title ?? url).trim(),
			text: String(row?.text ?? row?.summary ?? '').trim(),
			host: hostnameFromUrl(url),
		});
	}
	log(2, 'search results', { query: query.slice(0, 80), count: mapped.length });
	return mapped;
}

/**
 * @param {string[]} urls
 * @returns {Promise<Array<{ url: string, title: string, text: string, host: string | null }>>}
 */
export async function exaWebFetch(urls) {
	const unique = [...new Set(urls.filter((u) => u.startsWith('https://')))];
	if (!unique.length) return [];
	log(3, 'fetch', { count: unique.length });
	const data = await exaPost(EXA_CONTENTS_PATH, {
		urls: unique,
		text: { maxCharacters: 6000 },
	});
	const results = Array.isArray(data?.results) ? data.results : [];
	/** @type {Array<{ url: string, title: string, text: string, host: string | null }>} */
	const mapped = [];
	for (const row of results) {
		const url = String(row?.url ?? '').trim();
		if (!url.startsWith('https://')) continue;
		mapped.push({
			url,
			title: String(row?.title ?? url).trim(),
			text: String(row?.text ?? '').trim(),
			host: hostnameFromUrl(url),
		});
	}
	log(3, 'fetch results', { count: mapped.length });
	return mapped;
}

export function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
