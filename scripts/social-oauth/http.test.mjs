import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { basicAuthHeader, getJson, postForm } from './http.mjs';

describe('basicAuthHeader', () => {
	it('encodes id:secret', () => {
		assert.equal(basicAuthHeader('id', 'sec'), `Basic ${Buffer.from('id:sec').toString('base64')}`);
	});
});

describe('postForm', () => {
	it('posts urlencoded and parses json', async () => {
		const r = await postForm({
			url: 'https://example.test/token',
			body: { grant_type: 'authorization_code', code: 'secret-code' },
			fetchImpl: async (url, init) => {
				assert.equal(String(url), 'https://example.test/token');
				assert.match(String(init.body), /grant_type=authorization_code/);
				return new Response(JSON.stringify({ access_token: 'tok' }), { status: 200 });
			},
		});
		assert.equal(r.ok, true);
		assert.equal(r.json.access_token, 'tok');
	});
});

describe('getJson', () => {
	it('parses json', async () => {
		const r = await getJson({
			url: 'https://example.test/me',
			fetchImpl: async () => new Response(JSON.stringify({ id: '1' }), { status: 200 }),
		});
		assert.equal(r.json.id, '1');
	});
});
