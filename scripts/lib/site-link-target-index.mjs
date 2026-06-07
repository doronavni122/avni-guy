/**
 * Site-wide link target index for study-term resolution. Log: [site-link-target-index]
 */
import { loadAllPosts } from './internal-link-graph.mjs';

const HUB_TARGETS = [
	{ href: '/', tokens: ['גיא אבני', 'עורך דין', 'משרד'] },
	{ href: '/about/', tokens: ['רקע', 'משרד', 'צוות', 'אודות'] },
	{ href: '/services/', tokens: ['שירותים', 'ליווי', 'ייצוג', 'משפטי'] },
	{ href: '/blog/', tokens: ['מאמרים', 'מדריכים', 'תוכן', 'בלוג'] },
	{ href: '/categories/', tokens: ['קטגוריות', 'נושאים', 'חלוקה'] },
	{ href: '/tags/', tokens: ['תגיות', 'תגית', 'אינדקס'] },
	{ href: '/contact/', tokens: ['יצירת קשר', 'פגישה', 'פנייה', 'תיאום'] },
];

function logErr(msg, extra) {
	console.error(`[site-link-target-index] ERROR ${msg}`, extra ?? '');
}

function tokenize(text) {
	return String(text ?? '')
		.replace(/[^\p{L}\p{N}\s]/gu, ' ')
		.split(/\s+/)
		.filter((w) => w.length >= 2);
}

/**
 * @param {string} slug
 */
export function buildSiteLinkTargetIndex(slug = '') {
	const posts = loadAllPosts()
		.filter((p) => p.slug !== slug)
		.map((p) => ({
			href: `/blog/${p.slug}/`,
			mainKeyword: p.mainKeyword ?? '',
			title: p.title ?? '',
			secondaryKeywords: Array.isArray(p.secondaryKeywords) ? p.secondaryKeywords : [],
			category: p.category ?? '',
			tags: Array.isArray(p.tags) ? p.tags : [],
			tokens: [
				...tokenize(p.mainKeyword),
				...tokenize(p.title),
				...(Array.isArray(p.secondaryKeywords) ? p.secondaryKeywords.flatMap(tokenize) : []),
			],
		}));

	return { posts, hubs: HUB_TARGETS };
}

/**
 * @param {string} term
 * @param {{ slug?: string, category?: string, tags?: string[], mainKeyword?: string }} articleContext
 * @param {ReturnType<typeof buildSiteLinkTargetIndex>} index
 */
export function resolveHrefForStudyTerm(term, articleContext, index) {
	const termTokens = tokenize(term);
	if (!termTokens.length) {
		logErr('empty term', { term });
		return { href: '/blog/', anchor: term };
	}

	/** @type {{ href: string, score: number }[]} */
	const scored = [];

	for (const p of index.posts) {
		let score = 0;
		const termNorm = term.replace(/\s+/g, ' ');
		if (p.mainKeyword && (termNorm.includes(p.mainKeyword) || p.mainKeyword.includes(termNorm))) score += 12;
		if (p.title && termNorm.length >= 4 && p.title.includes(termNorm)) score += 8;
		for (const sk of p.secondaryKeywords) {
			if (termNorm.includes(sk) || sk.includes(termNorm)) score += 6;
		}
		for (const t of termTokens) {
			if (p.tokens.some((pt) => pt.includes(t) || t.includes(pt))) score += 2;
		}
		if (score > 0) scored.push({ href: p.href, score });
	}

	if (articleContext.category) {
		scored.push({
			href: `/categories/${articleContext.category}/`,
			score: termTokens.some((t) => t.length >= 4) ? 3 : 1,
		});
	}
	for (const tag of articleContext.tags ?? []) {
		scored.push({ href: `/tags/${tag}/`, score: 2 });
	}

	for (const hub of index.hubs) {
		let score = 0;
		for (const t of termTokens) {
			if (hub.tokens.some((ht) => ht.includes(t) || t.includes(ht))) score += 2;
		}
		if (term.includes('גיא אבני') && hub.href === '/') score += 15;
		if (score > 0) scored.push({ href: hub.href, score });
	}

	scored.sort((a, b) => b.score - a.score);
	const best = scored[0];
	if (!best) {
		logErr('no match; hub fallback', { term });
		return { href: '/blog/', anchor: trimAnchorWords(term) };
	}
	return { href: best.href, anchor: trimAnchorWords(term) };
}

/**
 * @param {string} term
 */
export function trimAnchorWords(term) {
	const words = String(term).trim().split(/\s+/);
	return words.slice(0, 7).join(' ');
}
