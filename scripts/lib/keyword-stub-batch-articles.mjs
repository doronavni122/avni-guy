import { TAX_BATCH_ARTICLES } from './keyword-stub-batch-tax-bodies.mjs';
import { MORTGAGE_BATCH_ARTICLES } from './keyword-stub-batch-mortgage-bodies.mjs';
import { FAQ_EXPAND_BY_SLUG } from './keyword-stub-batch-faq-expand.mjs';
import { PROSE_EXPAND_BY_SLUG } from './keyword-stub-batch-prose-expand.mjs';

const ALL = { ...TAX_BATCH_ARTICLES, ...MORTGAGE_BATCH_ARTICLES };

/** @param {string} slug */
export function getKeywordStubBatchArticle(slug) {
	const base = ALL[slug];
	if (!base) return null;
	const expand = `${FAQ_EXPAND_BY_SLUG[slug] ?? ''}${PROSE_EXPAND_BY_SLUG[slug] ?? ''}`;
	return { ...base, body: `${base.body.trim()}${expand}` };
}
