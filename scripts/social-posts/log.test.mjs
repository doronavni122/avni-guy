import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createLogger, redact } from './log.mjs';

describe('redact', () => {
	it('strips Bearer tokens', () => {
		const out = redact('Authorization: Bearer abc.def.ghi');
		assert.match(out, /\[REDACTED\]/);
		assert.equal(out.includes('abc.def.ghi'), false);
	});

	it('strips access_token query values', () => {
		const out = redact('https://graph.facebook.com/x?access_token=SECRET123');
		assert.match(out, /\[REDACTED\]/);
		assert.equal(out.includes('SECRET123'), false);
	});
});

describe('createLogger', () => {
	it('writes jsonl and redacts secrets', () => {
		const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'social-log-'));
		const logPath = path.join(dir, 'run.jsonl');
		const logger = createLogger(logPath);
		logger.logStep('info', 'publish', 'x', 'Bearer super-secret-token');
		const raw = fs.readFileSync(logPath, 'utf8').trim();
		const row = JSON.parse(raw);
		assert.equal(row.level, 'info');
		assert.equal(row.step, 'publish');
		assert.equal(row.network, 'x');
		assert.equal(row.msg.includes('super-secret-token'), false);
		assert.match(row.msg, /\[REDACTED\]/);
	});
});
