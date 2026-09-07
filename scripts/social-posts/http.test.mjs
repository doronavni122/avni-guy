import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { httpRequest, truncateBody } from './http.mjs';

describe('truncateBody', () => {
	it('redacts tokens', () => {
		assert.equal(truncateBody('Bearer secret-token-value').includes('secret-token-value'), false);
	});
});

describe('httpRequest', () => {
	it('retries once on 429 then returns', async () => {
		let n = 0;
		const sleeps = [];
		const logger = { logStep: () => {} };
		const out = await httpRequest({
			fetchImpl: async () => {
				n += 1;
				if (n === 1) return new Response('rate', { status: 429 });
				return new Response(JSON.stringify({ id: 'ok' }), { status: 201 });
			},
			method: 'POST',
			url: 'https://example.com',
			logger,
			step: 'publish',
			network: 'x',
			sleep: async (ms) => {
				sleeps.push(ms);
			},
		});
		assert.equal(n, 2);
		assert.deepEqual(sleeps, [30000]);
		assert.equal(out.status, 201);
		assert.equal(out.json.id, 'ok');
	});
});
