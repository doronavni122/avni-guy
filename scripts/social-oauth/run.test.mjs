import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseNetworks, printOauthSummary } from './run.mjs';

describe('parseNetworks', () => {
	it('defaults to all', () => {
		assert.deepEqual(parseNetworks([]), ['youtube', 'x', 'linkedin', 'meta']);
	});

	it('maps facebook/instagram to meta', () => {
		assert.deepEqual(parseNetworks(['--network', 'facebook,x']), ['meta', 'x']);
	});
});

describe('printOauthSummary', () => {
	it('prints json without throwing', () => {
		printOauthSummary([{ ok: true, network: 'x', keys: ['X_USER_ACCESS_TOKEN'], msg: 'ok' }], '/tmp/r', {
			x: [],
		});
	});
});
