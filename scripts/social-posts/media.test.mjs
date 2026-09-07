import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { prepareMedia } from './media.mjs';

describe('prepareMedia', () => {
	it('writes source.jpg from mocked fetch', async () => {
		const runDir = fs.mkdtempSync(path.join(os.tmpdir(), 'social-media-'));
		const logs = [];
		const logger = { logStep: (...a) => logs.push(a) };
		const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xd9]);
		const { imagePath } = await prepareMedia({
			source: { imageUrl: 'https://avniguy.co.il/images/blog/x.jpg' },
			runDir,
			logger,
			fetchImpl: async () =>
				new Response(jpeg, { status: 200, headers: { 'content-type': 'image/jpeg' } }),
		});
		assert.equal(imagePath, path.join(runDir, 'source.jpg'));
		assert.ok(fs.existsSync(imagePath));
	});

	it('logs error when imageUrl missing', async () => {
		const runDir = fs.mkdtempSync(path.join(os.tmpdir(), 'social-media-'));
		const logs = [];
		const logger = { logStep: (...a) => logs.push(a) };
		const out = await prepareMedia({ source: {}, runDir, logger });
		assert.equal(out.imagePath, null);
		assert.equal(logs[0][1], 'download-image');
	});
});
