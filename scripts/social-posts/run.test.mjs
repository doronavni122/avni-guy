import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runSocialPosts } from './run.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

describe('runSocialPosts envelope', () => {
	it('logs missing creds and continues in dry-run', async () => {
		const { runDir, dry, results, ok } = await runSocialPosts({
			root,
			argv: ['--dry-run'],
			env: { SOCIAL_POSTS_DRY_RUN: '1' },
			now: () => new Date('2026-09-07T12:00:00Z'),
		});
		assert.equal(ok, true);
		assert.equal(dry, true);
		assert.equal(results.length, 5);
		assert.ok(results.every((r) => r.result === 'error'));
		assert.ok(results.every((r) => String(r.msg).startsWith('missing ')));
		const log = fs.readFileSync(path.join(runDir, 'run.jsonl'), 'utf8');
		assert.match(log, /"step":"token"/);
		assert.match(log, /"network":"x"/);
	});
});
