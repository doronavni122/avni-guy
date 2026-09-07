import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildCopy, graphemeCount, hashtagFromKeyword, xWeightedLength } from './copy.mjs';
import { X_CHAR_LIMIT } from './constants.mjs';

const source = {
	title: 'זכויות שוכר בישראל',
	description: 'מדריך מלא לזכויות שוכר דירה בישראל לפי חוק השכירות ההוגנת.',
	canonical: 'https://avniguy.co.il/blog/tenant-rights-israel/',
	mainKeyword: 'גיא אבני עורך דין',
	secondaryKeywords: ['זכויות שוכר', 'פיקדון שכירות'],
	tags: ['real-estate', 'lease'],
	imageAlt: 'תצלום משפטי',
};

describe('graphemeCount', () => {
	it('counts Hebrew letters as one', () => {
		assert.equal(graphemeCount('אב'), 2);
	});
});

describe('hashtagFromKeyword', () => {
	it('strips spaces', () => {
		assert.equal(hashtagFromKeyword('גיא אבני'), '#גיאאבני');
	});
});

describe('buildCopy', () => {
	it('stays within X weighted limit and keeps canonical URL', () => {
		const copy = buildCopy(source);
		assert.ok(xWeightedLength(copy.x.text) <= X_CHAR_LIMIT);
		assert.match(copy.x.text, /avniguy\.co\.il/);
		assert.ok(copy.instagram.caption.includes('המאמר המלא'));
		assert.ok(copy.youtube.title.includes('#Shorts'));
		assert.ok(graphemeCount(copy.facebook.caption) <= 500);
	});
});
