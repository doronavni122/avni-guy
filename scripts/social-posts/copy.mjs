import {
	BRAND,
	CONTACT_URL,
	DISCLAIMER,
	FACEBOOK_SOFT_LIMIT,
	IG_CAPTION_LIMIT,
	LINKEDIN_LIMIT,
	X_CHAR_LIMIT,
	X_URL_WEIGHT,
	YT_DESC_LIMIT,
	YT_TITLE_LIMIT,
} from './constants.mjs';

/**
 * @param {string} s
 */
export function graphemeCount(s) {
	try {
		return [...new Intl.Segmenter('he', { granularity: 'grapheme' }).segment(s || '')].length;
	} catch (err) {
		console.error('[social-posts:graphemeCount]', { err: String(err) });
		return (s || '').length;
	}
}

/**
 * X counts each URL as t.co length.
 * @param {string} text
 */
export function xWeightedLength(text) {
	const replaced = String(text || '').replace(/https?:\/\/\S+/g, '_'.repeat(X_URL_WEIGHT));
	return graphemeCount(replaced);
}

/**
 * @param {string} kw
 */
export function hashtagFromKeyword(kw) {
	const compact = String(kw || '')
		.replace(/[״"']/g, '')
		.replace(/\s+/g, '');
	if (!compact) return '';
	return `#${compact}`;
}

/**
 * @param {{ mainKeyword?: string, secondaryKeywords?: string[], tags?: string[] }} source
 * @param {number} n
 */
export function pickHashtags(source, n) {
	const out = [];
	const seen = new Set();
	for (const kw of [source.mainKeyword, ...(source.secondaryKeywords || []), ...(source.tags || [])]) {
		const tag = hashtagFromKeyword(kw);
		if (!tag || seen.has(tag)) continue;
		seen.add(tag);
		out.push(tag);
		if (out.length >= n) break;
	}
	return out;
}

/**
 * @param {string} text
 * @param {number} limit
 * @param {(s: string) => number} [lenFn]
 */
export function trimToLimit(text, limit, lenFn = graphemeCount) {
	let s = text;
	while (s && lenFn(s) > limit) {
		s = s.slice(0, Math.max(0, s.length - 2)).trim();
	}
	return s;
}

/**
 * @param {object} source
 */
export function buildCopy(source) {
	const title = source.title || BRAND;
	const desc = source.description || '';
	const canonical = source.canonical || '';
	const alt = source.imageAlt || title;
	const tags = pickHashtags(source, 4);

	let xText = `${title} ${desc} ${canonical} ${tags.slice(0, 2).join(' ')}`.replace(/\s+/g, ' ').trim();
	if (xWeightedLength(xText) > X_CHAR_LIMIT) {
		xText = trimToLimit(`${title} ${canonical}`, X_CHAR_LIMIT, xWeightedLength);
	}

	let ig = [
		title,
		desc,
		`המאמר המלא: ${canonical}`,
		CONTACT_URL,
		DISCLAIMER,
		tags.slice(0, 5).join(' '),
	]
		.filter(Boolean)
		.join('\n');
	ig = trimToLimit(ig, IG_CAPTION_LIMIT);

	let li = [title, desc, canonical, CONTACT_URL, DISCLAIMER, tags.slice(0, 5).join(' ')]
		.filter(Boolean)
		.join('\n\n');
	li = trimToLimit(li, LINKEDIN_LIMIT);

	let fb = trimToLimit(`${title}\n${desc}\n${canonical}`, FACEBOOK_SOFT_LIMIT);

	let ytTitle = trimToLimit(`${title} ${BRAND} #Shorts`, YT_TITLE_LIMIT);
	let ytDesc = trimToLimit(
		[desc, canonical, CONTACT_URL, DISCLAIMER, tags.join(' ')].filter(Boolean).join('\n'),
		YT_DESC_LIMIT,
	);

	return {
		x: { text: xText, alt },
		instagram: { caption: ig, alt },
		linkedin: { text: li, alt },
		facebook: { caption: fb, alt },
		youtube: { title: ytTitle, description: ytDesc, alt },
	};
}
