import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createLogger } from '../log.mjs';
import { publishX } from './x.mjs';
import { publishFacebook } from './facebook.mjs';
import { publishWithPlaywright } from './playwright-fallback.mjs';
import { publishAyrshare } from './ayrshare.mjs';
import { publishAll } from './index.mjs';

function ctx(over = {}) {
	const runDir = fs.mkdtempSync(path.join(os.tmpdir(), 'social-pub-'));
	const logger = createLogger(path.join(runDir, 'run.jsonl'));
	return {
		runDir,
		logger,
		dry: false,
		env: {},
		copy: {
			x: { text: 'שלום https://avniguy.co.il/blog/x/', alt: 'alt' },
			instagram: { caption: 'ig', alt: 'alt' },
			linkedin: { text: 'li', alt: 'alt' },
			facebook: { caption: 'fb', alt: 'alt' },
			youtube: { title: 't #Shorts', description: 'd' },
		},
		source: {
			imageUrl: 'https://avniguy.co.il/images/blog/x.jpg',
			profiles: [
				'https://x.com/AvniGuy11492',
				'https://www.instagram.com/guy_avni_lawyer/',
				'https://www.youtube.com/@guyavni',
				'https://www.linkedin.com/in/guy-avni-35b3292b1/',
				'https://www.facebook.com/profile.php?id=1',
			],
		},
		missing: { x: [], instagram: [], youtube: [], linkedin: [], facebook: [] },
		sleep: async () => {},
		...over,
	};
}

describe('publishX', () => {
	it('posts tweet after media init and returns status url', async () => {
		const c = ctx({ env: { X_USER_ACCESS_TOKEN: 'tok' } });
		fs.writeFileSync(path.join(c.runDir, 'source.jpg'), Buffer.from([1, 2, 3]));
		let i = 0;
		c.fetchImpl = async (url) => {
			i += 1;
			if (String(url).includes('initialize')) {
				return new Response(JSON.stringify({ data: { id: '99' } }), { status: 200 });
			}
			if (String(url).includes('/tweets')) {
				return new Response(JSON.stringify({ data: { id: '123' } }), { status: 201 });
			}
			return new Response('{}', { status: 200 });
		};
		const r = await publishX(c);
		assert.equal(r.ok, true);
		assert.equal(r.url, 'https://x.com/AvniGuy11492/status/123');
		assert.ok(i >= 2);
	});
});

describe('publishFacebook', () => {
	it('skips personal profile without page token or playwright state', async () => {
		const r = await publishFacebook(ctx());
		assert.equal(r.ok, false);
		assert.match(r.msg, /profile skip/);
	});
});

describe('publishWithPlaywright', () => {
	it('skips when storageState missing', async () => {
		const c = ctx();
		const r = await publishWithPlaywright({
			...c,
			network: 'facebook',
			statePath: path.join(c.runDir, 'nope.json'),
			caption: 'x',
			startUrl: 'https://www.facebook.com/',
		});
		assert.equal(r.ok, false);
		assert.match(r.msg, /no storageState/);
	});
});

describe('publishAyrshare', () => {
	it('marks failed platforms so native can run', async () => {
		const c = ctx({
			env: { AYRSHARE_API_KEY: 'k' },
			fetchImpl: async () =>
				new Response(
					JSON.stringify({
						posts: [
							{ platform: 'twitter', status: 'success', id: '1' },
							{ platform: 'facebook', status: 'error' },
						],
					}),
					{ status: 200 },
				),
		});
		const ay = await publishAyrshare(c, ['x', 'facebook']);
		assert.equal(ay.attempted, true);
		assert.equal(ay.results.find((r) => r.network === 'x').ok, true);
		assert.equal(ay.results.find((r) => r.network === 'facebook').ok, false);
	});
});

describe('publishAll dry-run', () => {
	it('writes payloads without http', async () => {
		const c = ctx({ dry: true });
		const results = await publishAll(c);
		assert.equal(results.length, 5);
		assert.ok(results.every((r) => r.result === 'dry-run'));
		assert.ok(fs.existsSync(path.join(c.runDir, 'x-payload.json')));
	});
});
