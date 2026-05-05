const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const DEFAULT_SITE_URL = 'https://avniguy.co.il';

function logStep(message, details) {
	if (details !== undefined) {
		console.log(`[indexnow] ${message}`, details);
		return;
	}
	console.log(`[indexnow] ${message}`);
}

async function loadUrlsFromSitemap(sitemapUrl) {
	logStep('step 1: fetching sitemap index', { sitemapUrl });
	const sitemapResponse = await fetch(sitemapUrl);
	if (!sitemapResponse.ok) {
		throw new Error(`failed to fetch sitemap: ${sitemapResponse.status} ${sitemapResponse.statusText}`);
	}
	const sitemapXml = await sitemapResponse.text();
	const matches = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]).filter(Boolean);
	logStep('step 2: extracted URLs from sitemap', { count: matches.length });
	return matches;
}

async function submitIndexNow(urlList, host, key, keyLocation) {
	logStep('step 3: preparing indexnow payload', { host, count: urlList.length });
	const payload = {
		host,
		key,
		urlList,
	};
	if (keyLocation) {
		payload.keyLocation = keyLocation;
	}
	logStep('step 4: submitting to indexnow endpoint', { endpoint: INDEXNOW_ENDPOINT });
	const response = await fetch(INDEXNOW_ENDPOINT, {
		method: 'POST',
		headers: { 'content-type': 'application/json; charset=utf-8' },
		body: JSON.stringify(payload),
	});
	const body = await response.text();
	logStep('step 5: indexnow response received', { status: response.status, body });
	if (!response.ok) {
		throw new Error(`indexnow submission failed: ${response.status} ${response.statusText}`);
	}
}

async function main() {
	try {
		logStep('step 0: starting indexnow submission');
		const key = process.env.INDEXNOW_KEY?.trim();
		if (!key) {
			throw new Error('missing required env var INDEXNOW_KEY');
		}
		const siteUrl = new URL(process.env.INDEXNOW_SITE_URL?.trim() || DEFAULT_SITE_URL);
		const host = siteUrl.host;
		const keyLocation = process.env.INDEXNOW_KEY_LOCATION?.trim();
		const explicitUrls = process.argv.slice(2).map((value) => value.trim()).filter(Boolean);
		logStep('step 0.1: input detected', { explicitUrlCount: explicitUrls.length, host, keyLocation });

		let urls = explicitUrls;
		if (urls.length === 0) {
			const sitemapUrl = process.env.INDEXNOW_SITEMAP_URL?.trim() || `${siteUrl.origin}/sitemap-0.xml`;
			urls = await loadUrlsFromSitemap(sitemapUrl);
		}

		if (urls.length === 0) {
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
