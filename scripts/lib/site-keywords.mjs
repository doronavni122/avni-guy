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

/**
 * Prefer topical mainKeyword from meta; never return brand-only when title/description imply a batch keyword.
 * @param {{ mainKeyword?: string, main_keyword?: string, title?: string, description?: string }} meta
 */
export function resolveTopicalMainKeyword(meta) {
	const kw = String(meta?.mainKeyword ?? meta?.main_keyword ?? '').trim();
	if (kw && !brandSet.has(kw)) return kw;
	const hay = `${meta?.title ?? ''} ${meta?.description ?? ''}`;
	let best = '';
	for (const candidate of batchDeduped) {
		if (hay.includes(candidate) && candidate.length > best.length) best = candidate;
	}
	if (best) return best;
	if (kw) return kw;
	return '';
}
