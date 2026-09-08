import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { newestGoogleClientSecretJson, resolveClient } from './clients.mjs';

describe('resolveClient', () => {
	it('prefers env', () => {
		const r = resolveClient({ YOUTUBE_CLIENT_ID: 'e', YOUTUBE_CLIENT_SECRET: 's' }, '/tmp', 'youtube', 'YOUTUBE_CLIENT_ID', 'YOUTUBE_CLIENT_SECRET');
		assert.equal(r.client_id, 'e');
		assert.equal(r.source, 'env');
	});
});

describe('newestGoogleClientSecretJson', () => {
	it('picks newest matching file', () => {
		const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gclient-'));
		const older = path.join(dir, 'client_secret_old.json');
		const newer = path.join(dir, 'client_secret_new.json');
		fs.writeFileSync(older, '{}');
		fs.writeFileSync(newer, '{}');
		const t = Date.now();
		fs.utimesSync(older, t / 1000 - 10, t / 1000 - 10);
		fs.utimesSync(newer, t / 1000, t / 1000);
		assert.equal(newestGoogleClientSecretJson(dir), newer);
	});
});
