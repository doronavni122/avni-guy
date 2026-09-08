import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { listenLoopback, parseCallbackSearch } from './loopback.mjs';

describe('parseCallbackSearch', () => {
	it('reads code and state', () => {
		const p = parseCallbackSearch('/callback?code=abc&state=xyz');
		assert.equal(p.pathname, '/callback');
		assert.equal(p.code, 'abc');
		assert.equal(p.state, 'xyz');
		assert.equal(p.error, '');
	});

	it('reads oauth error', () => {
		const p = parseCallbackSearch('/callback?error=access_denied&error_description=nope');
		assert.equal(p.error, 'access_denied');
		assert.equal(p.errorDescription, 'nope');
	});
});

describe('listenLoopback', () => {
	it('captures code from GET callback', async () => {
		const prev = process.env.SOCIAL_OAUTH_LOOPBACK_PORT;
		process.env.SOCIAL_OAUTH_LOOPBACK_PORT = '18788';
		const loop = await listenLoopback({ port: 18788 });
		try {
			const pending = loop.waitForCode();
			const res = await fetch(`${loop.redirectUri}?code=testcode&state=st`);
			assert.equal(res.status, 200);
			const got = await pending;
			assert.equal(got.code, 'testcode');
			assert.equal(got.state, 'st');
		} finally {
			await loop.close();
			if (prev === undefined) delete process.env.SOCIAL_OAUTH_LOOPBACK_PORT;
			else process.env.SOCIAL_OAUTH_LOOPBACK_PORT = prev;
		}
	});
});
