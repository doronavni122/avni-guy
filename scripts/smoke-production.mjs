const ROUTES = ['https://www.avniguy.co.il/', 'https://www.avniguy.co.il/blog/'];
const BRAND = 'גיא אבני';

function logStep(msg, extra) {
	if (extra !== undefined) console.log(`[smoke-production] ${msg}`, extra);
	else console.log(`[smoke-production] ${msg}`);
}

function logErr(msg, extra) {
	console.error(`[smoke-production] ERROR ${msg}`, extra ?? '');
}

async function main() {
	logStep('step 0: checking production routes');
	const failures = [];
	for (const url of ROUTES) {
		try {
			const res = await fetch(url, { redirect: 'follow' });
			const body = await res.text();
			if (res.status !== 200) {
				failures.push(`${url}: HTTP ${res.status}`);
				continue;
			}
			if (!body.includes(BRAND)) failures.push(`${url}: missing brand text`);
			if (/Application error|__next_error__/i.test(body)) failures.push(`${url}: application error marker`);
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			logErr('fetch failed', { url, message });
			failures.push(`${url}: ${message}`);
		}
	}
	if (failures.length) {
		for (const f of failures) logErr(f);
		process.exit(1);
	}
	logStep('done: production smoke passed', { routes: ROUTES.length });
}

main();
