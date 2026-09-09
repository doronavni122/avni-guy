import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseClientBundle, parseEnvText, upsertEnvFile } from './env-file.mjs';

describe('parseEnvText', () => {
	it('skips comments and empty', () => {
		const o = parseEnvText('# x\nFOO=bar\n\nBAZ=1\n');
		assert.equal(o.FOO, 'bar');
		assert.equal(o.BAZ, '1');
	});
});

describe('parseClientBundle', () => {
	it('reads google installed json', () => {
		const b = parseClientBundle(
			JSON.stringify({ installed: { client_id: 'cid.apps.googleusercontent.com', client_secret: 'sec' } }),
		);
		assert.equal(b.client_id, 'cid.apps.googleusercontent.com');
		assert.equal(b.client_secret, 'sec');
	});

	it('reads flat json', () => {
		const b = parseClientBundle({ client_id: 'a', client_secret: 'b' });
		assert.equal(b.client_id, 'a');
		assert.equal(b.client_secret, 'b');
	});
});

describe('upsertEnvFile', () => {
	it('appends and replaces without printing secrets', () => {
		const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'oauth-env-'));
		const file = path.join(dir, '.env.local');
		fs.writeFileSync(file, 'KEEP=1\nFOO=old\n');
		const written = upsertEnvFile(file, { FOO: 'new', BAR: 'added' });
		assert.deepEqual(written.sort(), ['BAR', 'FOO']);
		const text = fs.readFileSync(file, 'utf8');
		assert.match(text, /^KEEP=1$/m);
		assert.match(text, /^FOO=new$/m);
		assert.match(text, /^BAR=added$/m);
	});
});
