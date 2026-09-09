import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isGmailInboxUrl } from './gmail.mjs';

describe('isGmailInboxUrl', () => {
	it('accepts inbox', () => {
		assert.equal(isGmailInboxUrl('https://mail.google.com/mail/u/0/#inbox'), true);
	});

	it('rejects sign-in interstitial', () => {
		assert.equal(
			isGmailInboxUrl('https://accounts.google.com/v3/signin/identifier?continue=https://mail.google.com/mail/'),
			false,
		);
	});
});
