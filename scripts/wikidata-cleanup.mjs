#!/usr/bin/env node
/**
 * Wikidata P2 cleanup — canonical Guy Avni item Q140457357.
 * - Remove erroneous P31 (Q21503252) if present
 * - Ensure P31 human (Q5) exists
 * - Merge duplicate empty Q140457342 → Q140457357
 *
 * Requires bot password: WIKIDATA_USERNAME + WIKIDATA_PASSWORD (Special:BotPasswords).
 * Skips safely when unset.
 */
const API = 'https://www.wikidata.org/w/api.php';
const CANONICAL_ID = 'Q140457357';
const DUPLICATE_ID = 'Q140457342';
const WRONG_P31_VALUE = 'Q21503252';
const HUMAN_QID = 'Q5';
const WRONG_P31_CLAIM_ID = 'Q140457357$6ae4b0be-4748-4dde-32f6-f2c623daf633';

function logStep(step, detail) {
	console.error(`[wikidata-cleanup:${step}]`, detail);
}

function readCredentials() {
	const username = process.env.WIKIDATA_USERNAME?.trim();
	const password = process.env.WIKIDATA_PASSWORD?.trim();
	return username && password ? { username, password } : null;
}

class CookieJar {
	constructor() {
		this.map = new Map();
	}

 ingest(setCookieHeader) {
		if (!setCookieHeader) return;
		const parts = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
		for (const line of parts) {
			const [pair] = line.split(';');
			const idx = pair.indexOf('=');
			if (idx === -1) continue;
			this.map.set(pair.slice(0, idx), pair.slice(idx + 1));
		}
	}

 header() {
		return [...this.map.entries()].map(([k, v]) => `${k}=${v}`).join('; ');
	}
}

async function apiRequest(jar, params, method = 'GET') {
	const url = new URL(API);
	url.searchParams.set('format', 'json');
	for (const [k, v] of Object.entries(params)) {
		if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
	}

	const init = {
		method,
		headers: {
			'User-Agent': 'avniguy-wikidata-cleanup/1.0 (https://avniguy.co.il; doronavni122)',
		},
	};
	if (jar.header()) init.headers.Cookie = jar.header();

	if (method === 'POST') {
		const body = url.searchParams;
		url.search = '';
		init.body = body;
		init.headers['Content-Type'] = 'application/x-www-form-urlencoded';
	}

	const res = await fetch(url, init);
	jar.ingest(res.headers.getSetCookie?.() ?? res.headers.raw?.()['set-cookie']);
	const json = await res.json();
	if (json.error) {
		throw new Error(`${json.error.code}: ${json.error.info}`);
	}
	return json;
}

async function login(jar, creds) {
	logStep('login', { user: creds.username });
	const tokenRes = await apiRequest(jar, {
		action: 'query',
		meta: 'tokens',
		type: 'login',
	});
	const loginToken = tokenRes.query.tokens.logintoken;
	const loginRes = await apiRequest(
		jar,
		{
			action: 'login',
			lgname: creds.username,
			lgpassword: creds.password,
			lgtoken: loginToken,
		},
		'POST',
	);
	if (loginRes.login?.result !== 'Success') {
		throw new Error(`Login failed: ${loginRes.login?.result ?? 'unknown'}`);
	}
	logStep('login-ok', loginRes.login?.lguserid);
}

async function getCsrfToken(jar) {
	const res = await apiRequest(jar, {
		action: 'query',
		meta: 'tokens',
		type: 'csrf',
	});
	return res.query.tokens.csrftoken;
}

async function getEntityClaims(jar, id) {
	const res = await apiRequest(jar, {
		action: 'wbgetentities',
		ids: id,
		props: 'claims',
	});
	return res.entities?.[id]?.claims ?? {};
}

async function removeWrongP31(jar, token) {
	const claims = await getEntityClaims(jar, CANONICAL_ID);
	const p31Claims = claims.P31 ?? [];
	const wrong = p31Claims.filter((c) => c.mainsnak?.datavalue?.value?.id === WRONG_P31_VALUE);
	if (!wrong.length) {
		logStep('p31-skip', 'erroneous P31 already absent');
		return;
	}

	for (const claim of wrong) {
		const claimId = claim.id ?? WRONG_P31_CLAIM_ID;
		logStep('p31-remove', { claimId, value: WRONG_P31_VALUE });
		await apiRequest(
			jar,
			{
				action: 'wbremoveclaims',
				claim: claimId,
				token,
				summary: 'Remove erroneous instance of (was Q21503252 property meta, not a class)',
			},
			'POST',
		);
	}
	logStep('p31-ok', 'removed wrong instance of');
}

async function ensureHumanP31(jar, token) {
	const claims = await getEntityClaims(jar, CANONICAL_ID);
	const hasHuman = (claims.P31 ?? []).some((c) => c.mainsnak?.datavalue?.value?.id === HUMAN_QID);
	if (hasHuman) {
		logStep('p31-human-skip', 'human Q5 already present');
		return;
	}
	logStep('p31-human-add', HUMAN_QID);
	await apiRequest(
		jar,
		{
			action: 'wbcreateclaim',
			entity: CANONICAL_ID,
			snaktype: 'value',
			property: 'P31',
			value: JSON.stringify({ 'entity-type': 'item', 'numeric-id': 5, id: HUMAN_QID }),
			token,
			summary: 'Add instance of human (Q5)',
		},
		'POST',
	);
	logStep('p31-human-ok', HUMAN_QID);
}

async function mergeDuplicate(jar, token) {
	logStep('merge', { from: DUPLICATE_ID, to: CANONICAL_ID });
	await apiRequest(
		jar,
		{
			action: 'wbmergeitems',
			fromid: DUPLICATE_ID,
			toid: CANONICAL_ID,
			ignoreconflicts: 'description',
			token,
			summary: 'Merge duplicate empty Guy Avni item into canonical Q140457357 (avniguy.co.il entity)',
		},
		'POST',
	);
	logStep('merge-ok', { redirect: DUPLICATE_ID, canonical: CANONICAL_ID });
}

async function verifyPublic() {
	const res = await fetch(`https://www.wikidata.org/wiki/Special:EntityData/${CANONICAL_ID}.json`);
	const entity = (await res.json()).entities?.[CANONICAL_ID];
	const p31 = (entity?.claims?.P31 ?? []).map((c) => c.mainsnak?.datavalue?.value?.id);
	logStep('verify-canonical', { p31, p856: entity?.claims?.P856?.[0]?.mainsnak?.datavalue?.value });

	const dupRes = await fetch(`https://www.wikidata.org/wiki/Special:EntityData/${DUPLICATE_ID}.json`);
	const dup = (await dupRes.json()).entities?.[DUPLICATE_ID];
	logStep('verify-duplicate', {
		redirect: dup?.redirects ?? null,
		claimCount: Object.keys(dup?.claims ?? {}).length,
	});
}

async function main() {
	const creds = readCredentials();
	if (!creds) {
		logStep('skip', 'WIKIDATA_USERNAME / WIKIDATA_PASSWORD unset — export bot password and re-run');
		process.exit(0);
	}

	const jar = new CookieJar();
	try {
		await login(jar, creds);
		const token = await getCsrfToken(jar);
		await removeWrongP31(jar, token);
		await ensureHumanP31(jar, token);
		await mergeDuplicate(jar, token);
		await verifyPublic();
		logStep('ok', 'wikidata cleanup complete');
	} catch (err) {
		logStep('fail', { err: err instanceof Error ? err.message : err });
		process.exit(1);
	}
}

main();
