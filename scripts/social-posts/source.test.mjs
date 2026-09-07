import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { classifyNetwork, extractProfileUrls, listBlogSources, loadSource } from './source.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

describe('classifyNetwork', () => {
	it('maps live profile hosts', () => {
		assert.equal(classifyNetwork('https://x.com/AvniGuy11492'), 'x');
		assert.equal(classifyNetwork('https://www.instagram.com/guy_avni_lawyer/'), 'instagram');
		assert.equal(classifyNetwork('https://www.youtube.com/@guyavni'), 'youtube');
		assert.equal(classifyNetwork('https://www.linkedin.com/in/guy-avni-35b3292b1/'), 'linkedin');
		assert.equal(classifyNetwork('https://www.facebook.com/profile.php?id=1'), 'facebook');
		assert.equal(classifyNetwork('https://www.wikidata.org/wiki/Q1'), null);
	});
});

describe('extractProfileUrls', () => {
	it('pulls social hrefs and drops globes', () => {
		const html =
			'<a href="https://x.com/AvniGuy11492">x</a><a href="https://www.globes.co.il/x">g</a>';
		assert.deepEqual(extractProfileUrls(html), ['https://x.com/AvniGuy11492']);
	});
});

describe('listBlogSources', () => {
	it('returns newest-first posts from repo MDX', () => {
		const posts = listBlogSources(root);
		assert.ok(posts.length > 10);
		assert.ok(posts[0].canonical.startsWith('https://avniguy.co.il/blog/'));
		assert.ok(posts[0].title);
	});
});

describe('loadSource', () => {
	it('picks --slug and merges footer+html profiles', async () => {
		const logs = [];
		const logger = { logStep: (...a) => logs.push(a) };
		const runDir = fs.mkdtempSync(path.join(os.tmpdir(), 'social-src-'));
		const source = await loadSource({
			root,
			argv: ['--slug', 'tenant-rights-israel'],
			env: {},
			runDir,
			logger,
			html: '<a href="https://www.linkedin.com/in/guy-avni-35b3292b1/">li</a>',
		});
		assert.equal(source.slug, 'tenant-rights-israel');
		assert.ok(source.profiles.some((u) => u.includes('x.com')));
		assert.ok(source.profiles.some((u) => u.includes('linkedin.com')));
	});
});
