import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCopy } from './copy.mjs';
import { publishAll } from './publish/index.mjs';
import { runSocialPosts } from './run.mjs';
import { loadSource } from './source.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

describe('cli dry-run e2e', () => {
	it('writes copy and per-network payloads for a real slug', async () => {
		const html = [
			'<a href="https://x.com/AvniGuy11492">x</a>',
			'<a href="https://www.instagram.com/guy_avni_lawyer/">ig</a>',
			'<a href="https://www.youtube.com/@guyavni">yt</a>',
			'<a href="https://www.linkedin.com/in/guy-avni-35b3292b1/">li</a>',
			'<a href="https://www.facebook.com/profile.php?id=61591485283276">fb</a>',
		].join('');
		const { runDir, ok, results } = await runSocialPosts({
			root,
			argv: ['--dry-run', '--slug', 'tenant-rights-israel'],
			env: { SOCIAL_POSTS_DRY_RUN: '1' },
			html,
			loadSource: (opts) => loadSource({ ...opts, html }),
			buildCopy: ({ source }) => buildCopy(source),
			publishAll,
		});
		assert.equal(ok, true);
		assert.equal(results.length, 5);
		assert.ok(results.every((r) => r.result === 'dry-run'));
		assert.ok(fs.existsSync(path.join(runDir, 'source.json')));
		assert.ok(fs.existsSync(path.join(runDir, 'copy.json')));
		assert.ok(fs.existsSync(path.join(runDir, 'x-payload.json')));
		const copy = JSON.parse(fs.readFileSync(path.join(runDir, 'copy.json'), 'utf8'));
		assert.match(copy.x.text, /avniguy\.co\.il/);
	});
});
