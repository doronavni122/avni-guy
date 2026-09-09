import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { sleep, waitUntil } from './wait.mjs';

describe('waitUntil', () => {
	it('resolves when predicate becomes true', async () => {
		let n = 0;
		const ok = await waitUntil({
			timeoutMs: 2000,
			intervalMs: 20,
			fn: () => {
				n += 1;
				return n > 2;
			},
		});
		assert.equal(ok, true);
		assert.ok(n > 2);
	});

	it('returns false on timeout', async () => {
		const ok = await waitUntil({ timeoutMs: 40, intervalMs: 15, fn: () => false });
		assert.equal(ok, false);
	});
});

describe('sleep', () => {
	it('waits', async () => {
		const t = Date.now();
		await sleep(30);
		assert.ok(Date.now() - t >= 20);
	});
});
