import { SITE_KEYWORDS_BATCH } from './site-keywords-batch.mjs';

/** Brand / site identity keywords (first priority). */
export const SITE_KEYWORDS_BRAND = [
	'גיא אבני',
	'גיא אבני עו״ד',
	'גיא אבני עורך דין',
	'גיא אבני משרד עורכי דין',
	'אבני גיא',
	'אבני גיא עו״ד',
];

const brandSet = new Set(SITE_KEYWORDS_BRAND);
const batchDeduped = SITE_KEYWORDS_BATCH.filter((kw) => !brandSet.has(kw));

/** Full list: brand first, then CSV batch (deduped). */
export const SITE_KEYWORDS = [...SITE_KEYWORDS_BRAND, ...batchDeduped];
