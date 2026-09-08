import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { challengeFromVerifier, createPkcePair, randomUrlSafe } from './pkce.mjs';

describe('pkce', () => {
	it('creates S256 verifier and matching challenge', () => {
		const pair = createPkcePair();
		assert.equal(pair.method, 'S256');
		assert.match(pair.verifier, /^[A-Za-z0-9_-]+$/);
		assert.equal(pair.challenge, challengeFromVerifier(pair.verifier));
		assert.notEqual(pair.verifier, pair.challenge);
	});

	it('returns unique url-safe strings', () => {
		assert.notEqual(randomUrlSafe(), randomUrlSafe());
	});
});
