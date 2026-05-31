const TAVILY_BASE = 'https://api.tavily.com';

function logStep(message, details) {
	if (details !== undefined) {
		console.log(`[tavily-client] ${message}`, details);
		return;
	}
	console.log(`[tavily-client] ${message}`);
}

/**
 * @param {string} apiKey
 * @param {Record<string, unknown>} body
 * @param {string} endpoint
 * @returns {Promise<unknown>}
 */
async function tavilyPost(apiKey, endpoint, body) {
	let response;
	try {
		response = await fetch(`${TAVILY_BASE}/${endpoint}`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		});
	} catch (err) {
		console.error(`[tavily-client] ${endpoint} fetch failed`, err);
		throw err;
	}

	if (!response.ok) {
		const text = await response.text();
		console.error(`[tavily-client] ${endpoint} error`, { status: response.status, text });
		throw new Error(`Tavily ${endpoint} failed: ${response.status}`);
	}

	try {
		return await response.json();
	} catch (err) {
		console.error(`[tavily-client] ${endpoint} JSON parse failed`, err);
		throw err;
	}
}

/**
 * @param {string} apiKey
 * @param {string} siteUrl
 * @returns {Promise<string[]>}
 */
export async function mapSite(apiKey, siteUrl) {
	logStep('mapping site', { siteUrl });
	const response = await tavilyPost(apiKey, 'map', {
		url: siteUrl,
		max_depth: 2,
		limit: 120,
		select_paths: ['/', '/about/', '/services/', '/blog/.*', '/categories/.*', '/tags/.*', '/contact/'],
		allow_external: false,
	});

	const results = response?.results ?? [];
	const urls = results.map((item) => (typeof item === 'string' ? item : item?.url)).filter(Boolean);
	logStep('map complete', { count: urls.length });
	return urls;
}

/**
 * @param {string} apiKey
 * @param {string[]} urls
 * @returns {Promise<Array<{ url: string; rawContent: string }>>}
 */
export async function extractUrls(apiKey, urls) {
	if (urls.length === 0) return [];

	const extracted = [];
	const batchSize = 20;

	for (let i = 0; i < urls.length; i += batchSize) {
		const batch = urls.slice(i, i + batchSize);
		logStep('extracting batch', { start: i, count: batch.length });
		let response;
		try {
			response = await tavilyPost(apiKey, 'extract', {
				urls: batch,
				extract_depth: 'basic',
			});
		} catch (err) {
			console.error('[tavily-client] extract batch failed', { batch, err });
			continue;
		}

		const results = response?.results ?? [];
		for (const item of results) {
			const raw = item?.raw_content ?? item?.rawContent ?? '';
			if (item?.url && raw) {
				extracted.push({ url: item.url, rawContent: raw });
			}
		}

		const failed = response?.failed_results ?? [];
		if (failed.length > 0) {
			console.error('[tavily-client] extract failures', { failed });
		}
	}

	logStep('extract complete', { count: extracted.length });
	return extracted;
}
