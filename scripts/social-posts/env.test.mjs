import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { credsStatus, isDryRun, loadEnvFile, missingEnvKeys } from './env.mjs';

describe('isDryRun', () => {
	it('is true for --dry-run', () => {
		assert.equal(isDryRun(['node', 'cli', '--dry-run'], {}), true);
	});
	it('is true for SOCIAL_POSTS_DRY_RUN=1', () => {
		assert.equal(isDryRun([], { SOCIAL_POSTS_DRY_RUN: '1' }), true);
	});
	it('is false otherwise', () => {
		assert.equal(isDryRun([], {}), false);
	});
});

describe('missingEnvKeys', () => {
	it('lists missing X token', () => {
		assert.deepEqual(missingEnvKeys('x', {}), ['X_USER_ACCESS_TOKEN']);
	});
	it('is empty when token set', () => {
		assert.deepEqual(missingEnvKeys('x', { X_USER_ACCESS_TOKEN: 't' }), []);
	});
});

describe('credsStatus', () => {
	it('covers all networks', () => {
		const s = credsStatus({});
		assert.ok(s.x.length > 0);
		assert.ok(s.instagram.length > 0);
		assert.ok(s.youtube.length > 0);
		assert.ok(s.linkedin.length > 0);
		assert.ok(s.facebook.length > 0);
	});
});

describe('loadEnvFile', () => {
	it('does not override existing env', () => {
		const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'social-env-'));
		const p = path.join(dir, '.env');
		fs.writeFileSync(p, 'FOO=fromfile\nBAR=filebar\n');
		const env = { FOO: 'already' };
		loadEnvFile(p, env);
		assert.equal(env.FOO, 'already');
		assert.equal(env.BAR, 'filebar');
	});
});
