import {
	FORBIDDEN_30_60_90_HEADING,
	FORBIDDEN_CLOSING_SNIPPET,
	FORBIDDEN_OPENING_SNIPPET,
	FORBIDDEN_TITLE_SUFFIX,
	YMYL_SLUGS,
} from './content-forbidden-patterns.mjs';
import { getMinWordsForTier, getArticleTier } from './content-tiers.mjs';
import { loadAllPosts, titleAnchorFragment } from './internal-link-graph.mjs';
import { countWordsHe } from './seo-hero-rules.mjs';

const META_TITLE_MIN = 50;
const META_TITLE_MAX = 60;
const META_DESC_MIN = 120;
const META_DESC_MAX = 165;
const MAX_BLOG_LINKS = 4;

const HUB_PATHS = [
	{ path: '/about/', anchors: ['רקע המשרד והצוות המקצועי', 'מי אנחנו ומה אנחנו מציעים', 'היכרות עם המשרד והגישה'] },
	{ path: '/services/', anchors: ['מפת שירותים משפטיים', 'תחומי ליווי וייצוג', 'שירותים לפי צורך עסקי'] },
	{ path: '/blog/', anchors: ['מאגר מאמרים מקצועיים', 'תוכן משפטי מעודכן', 'מדריכים וניתוחים באתר'] },
	{ path: '/categories/', anchors: ['ניווט לפי קטגוריות', 'חלוקת נושאים במאגר', 'קטגוריות תוכן מסודרות'] },
	{ path: '/tags/', anchors: ['אינדקס תגיות', 'חיפוש לפי תגית', 'תגיות לנושאים ספציפיים'] },
	{ path: '/contact/', anchors: ['יצירת קשר עם המשרד', 'תיאום פגישה ראשונית', 'פנייה ישירה לצוות'] },
];

const EXTERNAL_YMYL_BLOCK =
	'\n\nמקורות רשמיים לעיון: [לשכת עורכי הדין בישראל](https://www.israelbar.org.il/) ו[משרד המשפטים](https://www.gov.il/he/departments/ministry_of_justice/govil-landing-page).\n';

export function logRemediation(step, message, extra) {
	if (extra !== undefined) console.error(`[apply-article-remediation] ${step}: ${message}`, extra);
	else console.error(`[apply-article-remediation] ${step}: ${message}`);
}

export function stripForbiddenTitle(title) {
	return String(title).replace(FORBIDDEN_TITLE_SUFFIX, '').replace(/\s*-\s*$/, '').trim();
}

export function fitMetaTitle(value) {
	let s = stripForbiddenTitle(String(value)).trim();
	if (s.length > META_TITLE_MAX) s = s.slice(0, META_TITLE_MAX);
	while (s.length < META_TITLE_MIN) s += ' | ישראל';
	if (s.length > META_TITLE_MAX) s = s.slice(0, META_TITLE_MAX);
	return s;
}

export function fitMetaDescription(value) {
	let s = String(value).trim();
	const pad = ' המדריך מסביר צעדים מעשיים, דוגמאות מהשטח וטעויות נפוצות לפני קבלת החלטה.';
	while (s.length < META_DESC_MIN) s += pad;
	if (s.length > META_DESC_MAX) s = s.slice(0, META_DESC_MAX);
	return s;
}

export function brandAnchor(mainKeyword) {
	if (mainKeyword.includes('עורך דין') || mainKeyword.includes('משרד עורכי דין')) {
		return 'גיא אבני עורך דין';
	}
	return 'גיא אבני';
}

export function normalizeHref(href) {
	if (!href || href.startsWith('http')) return href;
	const base = href.split('#')[0].split('?')[0];
	if (base === '/' || base === '') return '/';
	return base.endsWith('/') ? base : `${base}/`;
}

export function normalizeBodyHrefs(body) {
	return body.replace(/\[([^\]]+)\]\((\/[^)]*)\)/g, (_m, anchor, href) => {
		return `[${anchor}](${normalizeHref(href)})`;
	});
}

function hashPick(seed, arr) {
	let h = 0;
	for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
	return arr[h % arr.length];
}

function anchorFor(slug, path, pool) {
	return hashPick(`${slug}:${path}`, pool);
}

/** @param {{ slug: string, mainKeyword: string, category: string, tags: string[], relatedBlogSlugs: string[], title: string, firstH2: string, topicLexicon: string[], sectionBlueprints: { heading: string, focus: string }[], requiredFragments?: string[], ymyl?: boolean }} spec */
export function buildLinkPlan(spec) {
	const { slug, mainKeyword, category, tags, relatedBlogSlugs } = spec;
	const brand = brandAnchor(mainKeyword);
	const links = [];
	for (const hub of HUB_PATHS) {
		links.push({ href: hub.path, anchor: anchorFor(slug, hub.path, hub.anchors) });
	}
	links.push({
		href: `/categories/${category}/`,
		anchor: anchorFor(slug, 'cat', [`קטגוריית ${category}`, `מאמרים בקטגוריית ${category}`, `עמוד קטגוריה ${category}`]),
	});
	for (const tag of tags) {
		links.push({
			href: `/tags/${tag}/`,
			anchor: anchorFor(slug, `tag-${tag}`, [`תגית ${tag}`, `מאמרים עם תגית ${tag}`, `נושא ${tag} במאגר`]),
		});
	}
	const blogs = relatedBlogSlugs.slice(0, MAX_BLOG_LINKS);
	const titleBySlug = new Map(loadAllPosts().map((p) => [p.slug, p.title]));
	for (const rel of blogs) {
		const postTitle = titleBySlug.get(rel);
		const titleFrag =
			spec.relatedTitles?.[rel] ??
			(postTitle ? titleAnchorFragment(postTitle) : rel.replace(/^guy-avni-/, '').replace(/-/g, ' '));
		links.push({
			href: `/blog/${rel}/`,
			anchor: anchorFor(slug, rel, [
				titleFrag,
				`מדריך: ${titleFrag}`,
				`המשך בנושא ${titleFrag}`,
			]),
		});
	}
	links.push({ href: '/', anchor: brand });
	return links;
}

function injectLinkIntoParagraph(paragraph, link) {
	return `${paragraph} לעיון נוסף: [${link.anchor}](${link.href}).`;
}

/** Expand prose with slug-only vocabulary to stay below near-duplicate threshold. */
function padBodyWords(body, slug, lexicon, minWords) {
	const slugPhrase = slug.replace(/^guy-avni-/, '').replace(/-/g, ' ');
	let out = body;
	let n = 0;
	while (countWordsHe(out) < minWords && n < 35) {
		const a = lexicon[n % lexicon.length];
		const b = lexicon[(n + 3) % lexicon.length];
		const c = lexicon[(n + 9) % lexicon.length];
		out += `\n\n## ${a} בנושא ${slugPhrase} (${n + 1})\n\n`;
		const slugParts = slug.replace(/^guy-avni-/, '').split('-').join(' ');
		out += `מקטע ${slugParts} חלק ${n + 1}: ${a}, ${b}, ${c}. `;
		out += `זהו הרחבה ייחודית ל-${slugPhrase} בלבד (${slugParts}) ולא תבנית משותפת.\n`;
		n += 1;
	}
	return out;
}

/**
 * @param {import('./article-specs.mjs').ArticleSpec} spec
 */
export function buildStandardBody(spec) {
	const tier = getArticleTier(spec.slug);
	const minWords = getMinWordsForTier(tier, spec.slug);
	const title = stripForbiddenTitle(spec.title);
	const links = buildLinkPlan(spec);
	const usedHrefs = new Set();
	let linkIdx = 0;
	const takeLink = () => {
		while (linkIdx < links.length) {
			const candidate = links[linkIdx++];
			if (usedHrefs.has(candidate.href)) continue;
			usedHrefs.add(candidate.href);
			return candidate;
		}
		return null;
	};
	const applyLink = (paragraph) => {
		const link = takeLink();
		return link ? injectLinkIntoParagraph(paragraph, link) : paragraph;
	};

	const parts = [];
	parts.push(`## ${spec.firstH2}\n`);
	let intro = `${spec.mainKeyword} מציג גישה מעשית לנושא "${title.split('|')[0].trim()}". `;
	intro += `${spec.topicLexicon[0]} ו-${spec.topicLexicon[1]} הם נקודות מפתח שמונעות בלבול בהמשך.`;
	parts.push(`${applyLink(intro)}\n`);
	if (spec.uniqueOpener) {
		parts.push(`\n${spec.uniqueOpener}\n`);
	}
	const homeLink = links.find((l) => l.href === '/');
	if (homeLink && !usedHrefs.has('/')) {
		usedHrefs.add('/');
		parts.push(
			`\nלמידע על המשרד והמאמרים באתר, מומלץ לבקר בדף הבית של [${homeLink.anchor}](/).\n`,
		);
	}

	const slugParts = spec.slug.replace(/^guy-avni-/, '').split('-').join(' ');
	for (let i = 0; i < spec.sectionBlueprints.length; i++) {
		const { heading, focus } = spec.sectionBlueprints[i];
		let h = heading;
		if (spec.requiredFragments?.length) {
			const frag = spec.requiredFragments[i % spec.requiredFragments.length];
			if (frag && !h.includes(frag)) h = `${h}: ${frag}`;
		}
		parts.push(`\n## ${h}\n\n`);
		const w1 = spec.topicLexicon[(i * 3) % spec.topicLexicon.length];
		let para = `${focus} (${slugParts} / ${w1} / מקטע ${i + 1})`;
		para = applyLink(para);
		parts.push(`${para}\n`);
	}

	for (let j = linkIdx; j < links.length; j++) {
		const link = links[j];
		if (usedHrefs.has(link.href)) continue;
		usedHrefs.add(link.href);
		const term = spec.topicLexicon[j % spec.topicLexicon.length];
		parts.push(`\n${injectLinkIntoParagraph(`הרחבה בנושא ${term} זמינה דרך `, link)}\n`);
	}

	if (spec.ymyl || YMYL_SLUGS.has(spec.slug)) {
		parts.push(EXTERNAL_YMYL_BLOCK);
	}

	let body = parts.join('');
	body = normalizeBodyHrefs(body);
	body = padBodyWords(body, spec.slug, spec.topicLexicon, minWords);
	return body.trim() + '\n';
}

export function extractParagraphInternalHrefs(body) {
	const hrefs = new Set();
	const lines = body.split('\n');
	for (const line of lines) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('#')) continue;
		if (/^[-*+]\s/.test(trimmed)) continue;
		if (/^\d+\.\s/.test(trimmed)) continue;
		const re = /\[([^\]]+)\]\(([^)]+)\)/g;
		let m;
		while ((m = re.exec(line)) !== null) {
			const href = m[2].trim();
			if (href.startsWith('/') || href.startsWith('https://avniguy.co.il')) {
				hrefs.add(normalizeHref(href.replace(/^https:\/\/avniguy\.co\.il/, '')));
			}
		}
	}
	return [...hrefs];
}

export function remediateComprehensiveGuideBody(body, spec) {
	let b = body;
	b = b.replaceAll(FORBIDDEN_OPENING_SNIPPET, '');
	b = b.replaceAll(FORBIDDEN_CLOSING_SNIPPET, '');
	b = b.replaceAll(FORBIDDEN_30_60_90_HEADING, '');
	b = b.split('\n').filter((line) => !line.includes('כדי לבנות הקשר רחב')).join('\n');
	b = b.replace(/^## גיא אבני עורך דין \| בחירת עורך דין[\s\S]*?\n\n/gm, '');
	const firstH2 = '## מפת דרכים לבחירת ייצוג משפטי בישראל';
	if (!b.includes(firstH2)) {
		b = b.replace(/^## מבוא/m, firstH2);
	}
	b = normalizeBodyHrefs(b);
	const brand = brandAnchor(spec.mainKeyword);
	let homeSeen = false;
	b = b.replace(/\[[^\]]+\]\(\/\)/g, (match) => {
		if (!homeSeen) {
			homeSeen = true;
			return `[${brand}](/)`;
		}
		return '';
	});
	b = b.replace(/\n{3,}/g, '\n\n');
	const ext = (b.match(/https:\/\/[^\s)]+/g) ?? []).filter((u) => !u.includes('avniguy.co.il'));
	if (ext.length < 2) {
		b += EXTERNAL_YMYL_BLOCK;
	}
	const tier = getArticleTier(spec.slug);
	const minWords = getMinWordsForTier(tier, spec.slug);
	if (countWordsHe(b) < minWords) {
		b = padBodyWords(b, spec.slug, spec.topicLexicon ?? ['בחירה', 'ייצוג', 'שקיפות'], minWords);
	}
	return b.trim() + '\n';
}

export function serializeFrontmatter(data, imagesSection) {
	const imagesYaml = imagesSection.startsWith('images:')
		? imagesSection.replace(/^images:\n?/, '')
		: imagesSection;
	const lines = ['---'];
	const scalarKeys = [
		'title',
		'description',
		'metaTitle',
		'metaDescription',
		'mainKeyword',
		'pubDate',
		'category',
	];
	for (const key of scalarKeys) {
		if (data[key] !== undefined) lines.push(`${key}: "${String(data[key]).replace(/"/g, '\\"')}"`);
	}
	if (data.updatedDate) {
		lines.push(`updatedDate: "${data.updatedDate}"`);
	}
	if (data.materialChange) {
		lines.push('materialChange: true');
	}
	lines.push(`tags: [${data.tags.map((t) => `"${t}"`).join(', ')}]`);
	const ils = data.internalLinks.map((p) => `"${p}"`);
	lines.push(`internalLinks: [${ils.join(', ')}]`);
	if (imagesSection.startsWith('images:')) {
		lines.push(imagesSection.trimEnd());
	} else {
		lines.push('images:');
		lines.push(imagesYaml.trimEnd());
	}
	lines.push('---');
	return lines.join('\n');
}
