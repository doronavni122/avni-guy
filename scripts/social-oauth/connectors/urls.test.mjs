import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { youtubeAuthorizeUrl } from './youtube.mjs';
import { xAuthorizeUrl } from './x.mjs';
import { linkedInAuthorUrn, linkedinAuthorizeUrl } from './linkedin.mjs';
import { metaAuthorizeUrl } from './meta.mjs';

describe('authorize urls', () => {
	it('youtube includes offline consent and pkce', () => {
		const u = youtubeAuthorizeUrl({
			clientId: 'cid',
			redirectUri: 'http://127.0.0.1:8788/callback',
			state: 'st',
			challenge: 'ch',
		});
		assert.match(u, /accounts\.google\.com/);
		assert.match(u, /access_type=offline/);
		assert.match(u, /code_challenge=ch/);
	});

	it('x uses oauth2 authorize', () => {
		const u = xAuthorizeUrl({
			clientId: 'cid',
			redirectUri: 'http://127.0.0.1:8788/callback',
			state: 'st',
			challenge: 'ch',
		});
		assert.match(u, /x\.com\/i\/oauth2\/authorize/);
		assert.match(u, /tweet\.write/);
	});

	it('linkedin maps sub to person urn', () => {
		assert.equal(linkedInAuthorUrn('abc'), 'urn:li:person:abc');
		assert.equal(linkedInAuthorUrn('urn:li:person:abc'), 'urn:li:person:abc');
		const u = linkedinAuthorizeUrl({
			clientId: 'cid',
			redirectUri: 'http://127.0.0.1:8788/callback',
			state: 'st',
		});
		assert.match(u, /linkedin\.com\/oauth\/v2\/authorization/);
		assert.match(u, /w_member_social/);
	});

	it('meta dialog includes pages and instagram scopes', () => {
		const u = metaAuthorizeUrl({
			clientId: '123',
			redirectUri: 'http://127.0.0.1:8788/callback',
			state: 'st',
		});
		assert.match(u, /facebook\.com\/v22\.0\/dialog\/oauth/);
		assert.match(u, /instagram_content_publish/);
		assert.match(u, /pages_manage_posts/);
	});
});
