const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const DEFAULT_SITE_URL = 'https://avniguy.co.il';
const MAX_SITEMAP_FETCH_DEPTH = 8;

function logStep(message, details) {
	if (details !== undefined) {
		console.log(`[indexnow] ${message}`, details);
		return;
	}
	console.log(`[indexnow] ${message}`);
}

function extractLocs(xml) {
	try {
		return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]).filter(Boolean);
	} catch (err) {
		console.error('[indexnow] extractLocs failed', err);
		return [];
	}
}

function isSitemapIndexDocument(xml) {
	return /<sitemapindex[\s>]/i.test(xml);
}

async function fetchSitemapXml(sitemapUrl) {
	logStep('step: fetching sitemap XML', { sitemapUrl });
	const sitemapResponse = await fetch(sitemapUrl);
	if (!sitemapResponse.ok) {
		console.error('[indexnow] sitemap fetch failed', {
			sitemapUrl,
			status: sitemapResponse.status,
			statusText: sitemapResponse.statusText,
		});
		throw new Error(`failed to fetch sitemap: ${sitemapResponse.status} ${sitemapResponse.statusText}`);
	}
	const text = await sitemapResponse.text();
	logStep('step: sitemap XML received', { sitemapUrl, byteLength: text.length });
	return text;
}

/**
 * Resolves a sitemap index or urlset into full page URLs (follows nested sitemap index entries).
 */
async function loadPageUrlsFromSitemapEntry(sitemapUrl, depth = 0) {
	if (depth > MAX_SITEMAP_FETCH_DEPTH) {
		console.error('[indexnow] max sitemap recursion depth exceeded', { sitemapUrl, depth });
		throw new Error('sitemap nesting too deep');
	}
	const xml = await fetchSitemapXml(sitemapUrl);
	const locs = extractLocs(xml);
	if (locs.length === 0) {
		console.error('[indexnow] no loc elements in sitemap', { sitemapUrl });
		throw new Error(`no URLs found in sitemap: ${sitemapUrl}`);
	}
	if (isSitemapIndexDocument(xml)) {
		logStep('step: sitemap index detected, fetching child sitemaps', { sitemapUrl, childCount: locs.length });
		const nested = [];
		for (const childUrl of locs) {
			const part = await loadPageUrlsFromSitemapEntry(childUrl, depth + 1);
			nested.push(...part);
		}
		const unique = [...new Set(nested)];
		logStep('step: merged child sitemap URLs', { parent: sitemapUrl, total: unique.length });
		return unique;
	}
	logStep('step: urlset sitemap parsed', { sitemapUrl, count: locs.length });
	return locs;
}

async function submitIndexNow(urlList, host, key, keyLocation) {
	logStep('step: preparing indexnow payload', { host, count: urlList.length });
	const payload = {
		host,
		key,
		urlList,
	};
	if (keyLocation) {
		payload.keyLocation = keyLocation;
	}
	logStep('step: submitting to indexnow endpoint', { endpoint: INDEXNOW_ENDPOINT });
	const response = await fetch(INDEXNOW_ENDPOINT, {
		method: 'POST',
		headers: { 'content-type': 'application/json; charset=utf-8' },
		body: JSON.stringify(payload),
	});
	const body = await response.text();
	logStep('step: indexnow response received', { status: response.status, body });
	if (!response.ok) {
		console.error('[indexnow] submission rejected', { status: response.status, body });
		throw new Error(`indexnow submission failed: ${response.status} ${response.statusText}`);
	}
}

async function main() {
	try {
		logStep('step 0: starting indexnow submission');
		const key = process.env.INDEXNOW_KEY?.trim();
		if (!key) {
			console.error('[indexnow] missing INDEXNOW_KEY');
			throw new Error('missing required env var INDEXNOW_KEY');
		}
		const siteUrl = new URL(process.env.INDEXNOW_SITE_URL?.trim() || DEFAULT_SITE_URL);
		const host = siteUrl.host;
		const keyLocation = process.env.INDEXNOW_KEY_LOCATION?.trim();
		const explicitUrls = process.argv.slice(2).map((value) => value.trim()).filter(Boolean);
		logStep('step 0.1: input detected', { explicitUrlCount: explicitUrls.length, host, keyLocation });

		let urls = explicitUrls;
		if (urls.length === 0) {
			const sitemapUrl =
				process.env.INDEXNOW_SITEMAP_URL?.trim() || `${siteUrl.origin.replace(/\/$/, '')}/sitemap-index.xml`;
			urls = await loadPageUrlsFromSitemapEntry(sitemapUrl, 0);
		}

		if (urls.length === 0) {
			console.error('[indexnow] resolved URL list is empty');
			throw new Error('no URLs to submit');
		}

		await submitIndexNow(urls, host, key, keyLocation);
		logStep('done: indexnow submission completed successfully');
	} catch (error) {
		console.error('[indexnow] failed', error);
		process.exitCode = 1;
	}
}

await main();
