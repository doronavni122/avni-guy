#!/usr/bin/env node
/**
 * Wikidata person entity sync — skips when WIKIDATA_USERNAME / WIKIDATA_PASSWORD unset.
 */
function logStep(step, detail) {
	console.error(`[wikidata-sync:${step}]`, detail);
}

function hasCredentials() {
	const user = process.env.WIKIDATA_USERNAME?.trim();
	const pass = process.env.WIKIDATA_PASSWORD?.trim();
	return Boolean(user && pass);
}

async function syncProperties() {
	const site = process.env.SITE_URL?.trim() || 'https://avniguy.co.il';
	logStep('would-sync', { P856: site, P106: 'lawyer', label: 'גיא אבני' });
}

async function main() {
	if (!hasCredentials()) {
		logStep('skip', 'WIKIDATA credentials unset');
		process.exit(0);
	}
	try {
		await syncProperties();
		logStep('ok', 'sync complete (stub — wire Wikibase API when credentials provided)');
	} catch (err) {
		logStep('fail', { err });
		process.exit(1);
	}
}

main();
