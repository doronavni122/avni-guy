import matter from 'gray-matter';
import fs from 'node:fs';
import path from 'node:path';
import { runPipelineContractChecks } from './article-pipeline-contract.mjs';
import {
    BANNED_ANCHOR_PATTERNS,
    FLUFF_BODY_PATTERNS,
    FORBIDDEN_30_60_90_HEADING,
    FORBIDDEN_CLOSING_SNIPPET,
    FORBIDDEN_OPENING_SNIPPET,
    FORBIDDEN_TITLE_SUFFIX,
    STANDARD_NAV_LINK_PATHS,
    YMYL_EXTERNAL_ALLOWLIST_HOSTS,
    YMYL_SLUGS,
} from './content-forbidden-patterns.mjs';
import { getArticleTier, getMinWordsForTier, SLUG_CONTENT_CONTRACTS } from './content-tiers.mjs';
import {
    anchorMatchesTarget,
    anchorWordCount,
    auditLinkSpacing,
    buildLinkGraph,
    computeBlogLinkDensityBounds,
    computeLinkDensityBounds,
    CONTEXTUAL_WORD_THRESHOLD,
    countContextualBlogLinks,
    ENGLISH_SLUG_ANCHOR_PATTERNS,
    findSectionDuplicateHrefs,
    GARBAGE_ANCHOR_PATTERNS,
    isAnchorTooLong,
    loadAllPosts,
    MAX_ANCHOR_WORDS,
    MAX_BLOG_LINKS,
    slugFromBlogHref,
} from './internal-link-graph.mjs';
import { KEYWORD_STUB_SLUGS_SET } from './keyword-stub-slugs.mjs';
import { isBrandMainKeyword } from './pillar-cluster-registry.mjs';
import { countWordsHe, SITE_KEYWORDS } from './seo-hero-rules.mjs';

const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog');
function usesPipelineContract(data) {
	if (process.env.PIPELINE_CONTRACT === '1') return true;
	const v = data?.pipelineContractVersion;
	return typeof v === 'number' && v >= 1;
}
const FIRST_100_WORDS_MAIN_KEYWORD_STRICT =
	process.env.CONTENT_LINKS_STRICT === '1' || process.env.CONTENT_STRICT === '1';
const LINKS_STRICT = process.env.CONTENT_LINKS_STRICT === '1';
const CONTENT_STRICT = process.env.CONTENT_STRICT === '1';
const META_TITLE_MIN = 50;
const META_TITLE_MAX = 60;
const META_DESC_MIN = 120;
const META_DESC_MAX = CONTENT_STRICT ? 155 : 165;
const NEAR_DUPLICATE_JACCARD_THRESHOLD = CONTENT_STRICT ? 0.38 : 0.42;
const BATCH_UPDATED_DATE = '2026-05-05';
const TOPICAL_BLOG_MIN = 3;
const TOPICAL_BLOG_MAX = 5;
const EXTERNAL_STRICT_MIN = 3;
const EXTERNAL_STRICT_MAX = 5;
const FAQ_STRICT_MIN = 4;
const FAQ_STRICT_MAX = 8;
const SECONDARY_KW_MIN = 4;
const SECONDARY_KW_MAX = 6;

function logErr(step, message, extra) {
	console.error(`[check-article-content] ERROR step=${step} ${message}`, extra ?? '');
}

function normalizePath(href) {
	if (!href || href.startsWith('http')) return href;
	const base = href.split('#')[0].split('?')[0];
	if (base === '/') return '/';
	return base.endsWith('/') ? base : `${base}/`;
}

function parseInternalLinksYaml(head) {
	const m = head.match(/^internalLinks:\s*\[([\s\S]*?)\]\s*$/m);
	if (!m) return [];
	return [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
}

function extractParagraphMarkdownLinks(body) {
	const links = [];
	const lines = body.split('\n');
	for (const line of lines) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('#')) continue;
		if (/^[-*+]\s/.test(trimmed)) continue;
		if (/^\d+\.\s/.test(trimmed)) continue;
		const re = /\[([^\]]+)\]\(([^)]+)\)/g;
		let match;
		while ((match = re.exec(line)) !== null) {
			const href = match[2].trim();
			if (href.startsWith('/') || href.startsWith('https://avniguy.co.il')) {
				links.push({ anchor: match[1].trim(), href: normalizePath(href.replace(/^https:\/\/avniguy\.co\.il/, '')) });
			}
		}
	}
	return links;
}

function bodyHasStandardNavBlock(body) {
	const count = STANDARD_NAV_LINK_PATHS.filter((p) => body.includes(`](${p})`) || body.includes(`](${p.replace(/\/$/, '')})`)).length;
	return count >= 6 && body.includes(FORBIDDEN_OPENING_SNIPPET);
}

function tokenizeForSimilarity(text) {
	return new Set(
		text
			.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
			.replace(/#+\s/g, ' ')
			.replace(/[^\p{L}\p{N}\s]/gu, ' ')
			.toLowerCase()
			.split(/\s+/)
			.filter((w) => w.length > 3),
	);
}

function jaccard(a, b) {
	if (a.size === 0 && b.size === 0) return 1;
	let inter = 0;
	for (const t of a) {
		if (b.has(t)) inter += 1;
	}
	const union = a.size + b.size - inter;
	return union === 0 ? 0 : inter / union;
}

function firstH2Text(body) {
	const m = body.match(/^##\s+(.+)$/m);
	return m ? m[1].trim() : '';
}

function first100WordsText(body) {
	const plain = body
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/^#+\s+/gm, '')
		.replace(/^\s*[-*+]\s+/gm, '');
	const words = plain.split(/\s+/).filter(Boolean);
	return words.slice(0, 100).join(' ');
}

function lastParagraphText(body) {
	const lines = body.split('\n');
	const paragraphs = [];
	let current = [];
	for (const line of lines) {
		const trimmed = line.trim();
		if (!trimmed) {
			if (current.length) {
				paragraphs.push(current.join(' '));
				current = [];
			}
			continue;
		}
		if (trimmed.startsWith('#')) continue;
		if (/^[-*+]\s/.test(trimmed)) continue;
		if (/^\d+\.\s/.test(trimmed)) continue;
		current.push(trimmed);
	}
	if (current.length) paragraphs.push(current.join(' '));
	const last = paragraphs[paragraphs.length - 1] ?? '';
	return last
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/\*\*/g, '')
		.trim();
}

function hasTldrPattern(body) {
	if (/^##\s+סיכום\b/m.test(body)) return true;
	const intro = body
		.replace(/^#+\s.+$/gm, '')
		.split('\n')
		.map((l) => l.trim())
		.filter((l) => l && !l.startsWith('#') && !/^[-*+]\s/.test(l) && !/^\d+\.\s/.test(l))
		.slice(0, 3)
		.join(' ');
	if (/\*\*[^*]{8,}\*\*/.test(intro)) return true;
	const sentences = intro.split(/(?<=[.!?])\s+/u).filter(Boolean);
	return sentences.length >= 1 && sentences.length <= 4 && intro.length >= 40;
}

function parseFaqFromBody(body) {
	const sectionMatch = body.match(/##\s+שאלות נפוצות[\s\S]*/u);
	if (!sectionMatch) return [];
	const section = sectionMatch[0];
	const items = [];
	const re = /\*\*([^*]+?\?)\*\*\s*([^\n*]+(?:\n(?![*#])[^\n*]+)*)/gu;
	let match;
	while ((match = re.exec(section)) !== null) {
		const question = match[1].trim();
		const answer = match[2].trim().replace(/\n+/g, ' ');
		if (question.length >= 8 && answer.length >= 20) items.push({ question, answer });
	}
	return items;
}

function countFaqItems(data, body) {
	if (Array.isArray(data.faq) && data.faq.length) return data.faq.length;
	return parseFaqFromBody(body).length;
}

function hasScannableStructure(body) {
	if (/^\s*[-*+]\s/m.test(body)) return true;
	if (/^\s*\d+\.\s/m.test(body)) return true;
	if (/\|.+\|/.test(body)) return true;
	return false;
}

function hasRecentStatsOrExamples(body) {
	return /202[56]/u.test(body);
}

function hasCtaPattern(body) {
	return (
		/(יצירת קשר|תיאום פגישה|פנו אלינו|לתיאום|לפנייה)/u.test(body) &&
		/\]\(\/contact\//.test(body)
	);
}

function contentTypeMatchesTier(dataContentType, tier) {
	if (!dataContentType) return true;
	if (tier === 'contract') return dataContentType === 'cluster';
	if (tier === 'pillar') return dataContentType === 'pillar';
	return dataContentType === 'cluster';
}

/** @type {Map<string, { slug: string, mainKeyword: string, title: string }> | null} */
let postsBySlugCache = null;

function getPostsBySlug() {
	if (!postsBySlugCache) {
		postsBySlugCache = new Map(
			loadAllPosts().map((p) => [
				p.slug,
				{
					slug: p.slug,
					mainKeyword: p.mainKeyword,
					title: p.title,
					description: String(p.data?.description ?? '').trim(),
				},
			]),
		);
	}
	return postsBySlugCache;
}

function auditPost(slug, raw, allBodies) {
	const errors = [];
	const { data, content: body } = matter(raw);
	const title = data.title ?? '';
	const metaTitle = data.metaTitle ?? '';
	const metaDescription = data.metaDescription ?? '';
	const mainKeyword = data.mainKeyword ?? '';
	const internalLinks = Array.isArray(data.internalLinks) ? data.internalLinks : parseInternalLinksYaml(raw.split('---')[1] ?? '');
	const tier = getArticleTier(slug);
	const minWords = getMinWordsForTier(tier, slug);

	if (title.includes(FORBIDDEN_TITLE_SUFFIX)) {
		errors.push(`${slug}: title contains forbidden shared suffix`);
	}
	if (body.includes(FORBIDDEN_OPENING_SNIPPET)) {
		errors.push(`${slug}: body contains forbidden shared opening paragraph`);
	}
	if (body.includes(FORBIDDEN_CLOSING_SNIPPET)) {
		errors.push(`${slug}: body contains forbidden shared closing checklist block`);
	}
	if (body.includes(FORBIDDEN_30_60_90_HEADING)) {
		errors.push(`${slug}: body contains forbidden 30/60/90 template section`);
	}
	if (CONTENT_STRICT) {
		for (const re of FLUFF_BODY_PATTERNS) {
			if (re.test(body)) {
				errors.push(`${slug}: body matches fluff/stuffing pattern ${re.source}`);
				break;
			}
		}
	}
	if (/^#\s+/m.test(body)) {
		errors.push(`${slug}: MDX body must not contain H1 (# heading)`);
	}
	const h2 = firstH2Text(body);
	if (h2 && title && h2.replace(/\s+/g, ' ') === title.replace(/\s+/g, ' ')) {
		errors.push(`${slug}: first H2 duplicates layout title`);
	}
	if (metaTitle.length < META_TITLE_MIN || metaTitle.length > META_TITLE_MAX) {
		errors.push(`${slug}: metaTitle length ${metaTitle.length} outside ${META_TITLE_MIN}-${META_TITLE_MAX}`);
	}
	if (metaDescription.length < META_DESC_MIN || metaDescription.length > META_DESC_MAX) {
		errors.push(`${slug}: metaDescription length ${metaDescription.length} outside ${META_DESC_MIN}-${META_DESC_MAX}`);
	}
	if (!SITE_KEYWORDS.includes(mainKeyword)) {
		errors.push(`${slug}: mainKeyword not in SITE_KEYWORDS`);
	} else if (!body.includes(mainKeyword)) {
		errors.push(`${slug}: body missing mainKeyword phrase`);
	}
	if (FIRST_100_WORDS_MAIN_KEYWORD_STRICT && mainKeyword && !first100WordsText(body).includes(mainKeyword)) {
		errors.push(`${slug}: mainKeyword missing from first 100 words`);
	}
	if (CONTENT_STRICT && mainKeyword) {
		const lastPara = lastParagraphText(body);
		if (lastPara && !lastPara.includes(mainKeyword)) {
			errors.push(`${slug}: mainKeyword missing from last paragraph`);
		}
		if (!title.includes(mainKeyword)) {
			errors.push(`${slug}: mainKeyword missing from title`);
		}
	}
	if (CONTENT_STRICT && data.contentType && !contentTypeMatchesTier(data.contentType, tier)) {
		errors.push(`${slug}: contentType "${data.contentType}" mismatches tier "${tier}"`);
	}
	const secondaryKeywords = Array.isArray(data.secondaryKeywords) ? data.secondaryKeywords : [];
	if (CONTENT_STRICT) {
		if (secondaryKeywords.length < SECONDARY_KW_MIN || secondaryKeywords.length > SECONDARY_KW_MAX) {
			errors.push(
				`${slug}: secondaryKeywords count ${secondaryKeywords.length} outside ${SECONDARY_KW_MIN}-${SECONDARY_KW_MAX}`,
			);
		}
		for (const sk of secondaryKeywords) {
			if (!body.includes(sk)) {
				errors.push(`${slug}: secondaryKeyword "${sk}" missing from body`);
				break;
			}
		}
	}
	if (CONTENT_STRICT && !hasTldrPattern(body)) {
		errors.push(`${slug}: missing TL;DR pattern (## סיכום or bold lead in opening)`);
	}
	if (CONTENT_STRICT) {
		const faqCount = countFaqItems(data, body);
		if (faqCount < FAQ_STRICT_MIN || faqCount > FAQ_STRICT_MAX) {
			errors.push(`${slug}: FAQ count ${faqCount} outside ${FAQ_STRICT_MIN}-${FAQ_STRICT_MAX}`);
		}
	}
	if (CONTENT_STRICT && !hasScannableStructure(body)) {
		errors.push(`${slug}: missing scannable structure (list, numbered list, or table)`);
	}
	if (CONTENT_STRICT && !hasRecentStatsOrExamples(body)) {
		errors.push(`${slug}: missing 2025-2026 statistics or dated examples`);
	}
	if (CONTENT_STRICT && !hasCtaPattern(body)) {
		errors.push(`${slug}: missing CTA paragraph with link to /contact/`);
	}
	const words = countWordsHe(body);
	if (words < minWords) {
		errors.push(`${slug}: body word count ${words} below tier minimum ${minWords}`);
	}
	const contract = SLUG_CONTENT_CONTRACTS[slug];
	if (contract?.requiredHeadingFragments) {
		const missing = contract.requiredHeadingFragments.filter((f) => !body.includes(f));
		if (missing.length) {
			errors.push(`${slug}: missing required topic fragments: ${missing.join(', ')}`);
		}
	}
	if (bodyHasStandardNavBlock(body)) {
		errors.push(`${slug}: body uses forbidden standard 7-nav link boilerplate block`);
	}
	const paragraphLinks = extractParagraphMarkdownLinks(body);
	const hrefs = paragraphLinks.map((l) => l.href);
	const anchors = paragraphLinks.map((l) => l.anchor);

	const pipelineContract = usesPipelineContract(data);
	if (!pipelineContract) {
		const totalDensity = computeLinkDensityBounds(words);
		if (paragraphLinks.length < totalDensity.min) {
			errors.push(
				`${slug}: paragraph internal links ${paragraphLinks.length} below density minimum ${totalDensity.min} (${words} words, 3-7/1000)`,
			);
		}
		if (paragraphLinks.length > totalDensity.max) {
			errors.push(
				`${slug}: paragraph internal links ${paragraphLinks.length} exceed density maximum ${totalDensity.max} (${words} words, 3-7/1000)`,
			);
		}
		const spacing = auditLinkSpacing(words, paragraphLinks.length);
		if (!spacing.ok && paragraphLinks.length > 0) {
			const withinBounds =
				paragraphLinks.length >= totalDensity.min && paragraphLinks.length <= totalDensity.max;
			if (!withinBounds) {
				errors.push(
					`${slug}: link spacing ${spacing.wordsPerLink?.toFixed(0) ?? 'n/a'} words/link outside ${spacing.minWords}-${spacing.maxWords} target`,
				);
			}
		}
		const dupHref = hrefs.find((h, i) => hrefs.indexOf(h) !== i);
		if (dupHref) errors.push(`${slug}: duplicate paragraph link target ${dupHref}`);
		const dupAnchor = anchors.find((a, i) => anchors.indexOf(a) !== i);
		if (dupAnchor) errors.push(`${slug}: duplicate paragraph link anchor "${dupAnchor}"`);
		const blogLinks = paragraphLinks.filter((l) => l.href.startsWith('/blog/') && l.href !== '/blog/');
		const blogDensity = computeBlogLinkDensityBounds(words);
		const topicalBlogMax = CONTENT_STRICT ? TOPICAL_BLOG_MAX : blogDensity.max;
		if (blogLinks.length > topicalBlogMax) {
			errors.push(`${slug}: blog paragraph links ${blogLinks.length} exceed max ${topicalBlogMax}`);
		}
		if (CONTENT_STRICT && blogLinks.length < TOPICAL_BLOG_MIN) {
			errors.push(`${slug}: topical blog links ${blogLinks.length} below min ${TOPICAL_BLOG_MIN}`);
		}
		const contextualCount = countContextualBlogLinks(paragraphLinks);
		if (words > CONTEXTUAL_WORD_THRESHOLD) {
			if (contextualCount < blogDensity.min) {
				errors.push(
					`${slug}: contextual blog links ${contextualCount} below min ${blogDensity.min} (words>${CONTEXTUAL_WORD_THRESHOLD}, silo cap ${MAX_BLOG_LINKS})`,
				);
			}
			if (contextualCount > blogDensity.max) {
				errors.push(
					`${slug}: contextual blog links ${contextualCount} exceed max ${blogDensity.max} (density max ${blogDensity.densityMax}, silo cap ${blogDensity.siloCap})`,
				);
			}
		}
		const sectionDup = findSectionDuplicateHrefs(body);
		if (sectionDup.length && LINKS_STRICT) {
			errors.push(`${slug}: duplicate href in same H2 section: ${sectionDup[0]}`);
		}
		if (LINKS_STRICT) {
			const bySlug = getPostsBySlug();
			for (const link of blogLinks) {
				const targetSlug = slugFromBlogHref(link.href);
				const target = targetSlug ? bySlug.get(targetSlug) : null;
				if (target && !anchorMatchesTarget(link.anchor, target)) {
					errors.push(`${slug}: blog anchor "${link.anchor}" lacks target keyword/title tokens -> ${link.href}`);
					break;
				}
			}
		}
	}

	if (pipelineContract) {
		const contract = runPipelineContractChecks({ slug, data, body });
		errors.push(...contract.errors);
	}
	for (const { anchor } of paragraphLinks) {
		if (isAnchorTooLong(anchor)) {
			errors.push(`${slug}: anchor exceeds ${MAX_ANCHOR_WORDS} words (${anchorWordCount(anchor)}): "${anchor}"`);
			break;
		}
		if (BANNED_ANCHOR_PATTERNS.some((re) => re.test(anchor))) {
			errors.push(`${slug}: banned generic anchor "${anchor}"`);
			break;
		}
		if (ENGLISH_SLUG_ANCHOR_PATTERNS.some((re) => re.test(anchor))) {
			errors.push(`${slug}: english-slug anchor pattern "${anchor}"`);
			break;
		}
		if (GARBAGE_ANCHOR_PATTERNS.some((re) => re.test(anchor))) {
			errors.push(`${slug}: garbage anchor pattern "${anchor}"`);
			break;
		}
	}
	for (const href of hrefs) {
		if (href.startsWith('/') && href !== '/' && !href.endsWith('/')) {
			errors.push(`${slug}: internal href missing trailing slash: ${href}`);
			break;
		}
	}
	const fmNormalized = internalLinks.map((p) => normalizePath(p));
	for (const fmPath of fmNormalized) {
		if (fmPath.startsWith('/') && !fmPath.startsWith('http') && !hrefs.includes(fmPath)) {
			const alt = fmPath.endsWith('/') ? fmPath.slice(0, -1) : `${fmPath}/`;
			if (!hrefs.includes(alt)) {
				errors.push(`${slug}: internalLinks path not in body paragraphs: ${fmPath}`);
				break;
			}
		}
	}
	const bodyHrefSet = new Set(hrefs);
	for (const h of bodyHrefSet) {
		if (!fmNormalized.includes(h)) {
			errors.push(`${slug}: body paragraph href ${h} missing from internalLinks frontmatter`);
			break;
		}
	}
	const externalHttps = (body.match(/https:\/\/[^\s)]+/g) ?? []).filter((u) => !u.includes('avniguy.co.il'));
	const needsExternal = contract?.requireExternalHttps || YMYL_SLUGS.has(slug);
	const externalMin = CONTENT_STRICT ? EXTERNAL_STRICT_MIN : 2;
	if ((needsExternal || CONTENT_STRICT) && externalHttps.length < externalMin) {
		errors.push(`${slug}: external https links ${externalHttps.length} below minimum ${externalMin}`);
	}
	if (CONTENT_STRICT && externalHttps.length > EXTERNAL_STRICT_MAX) {
		console.warn(
			`[check-article-content] WARN ${slug}: external links ${externalHttps.length} exceed recommended max ${EXTERNAL_STRICT_MAX}`,
		);
	}
	if (needsExternal || CONTENT_STRICT) {
		const allowed = externalHttps.filter((u) =>
			YMYL_EXTERNAL_ALLOWLIST_HOSTS.some((host) => u.includes(host)),
		);
		const allowedMin = CONTENT_STRICT ? EXTERNAL_STRICT_MIN : 1;
		if (allowed.length < allowedMin) {
			errors.push(`${slug}: allowlisted authority external links ${allowed.length} below ${allowedMin}`);
		}
	}
	if (data.updatedDate) {
		const d = String(data.updatedDate).slice(0, 10);
		if (d === BATCH_UPDATED_DATE) {
			errors.push(`${slug}: updatedDate batch stamp ${BATCH_UPDATED_DATE} without materialChange flag`);
		}
	}
	const tokens = tokenizeForSimilarity(body);
	for (const other of allBodies) {
		if (other.slug === slug) continue;
		// Auto-generated keyword stubs may share structure; enforce uniqueness vs legacy corpus only.
		if (KEYWORD_STUB_SLUGS_SET.has(slug) && KEYWORD_STUB_SLUGS_SET.has(other.slug)) continue;
		const score = jaccard(tokens, other.tokens);
		if (score >= NEAR_DUPLICATE_JACCARD_THRESHOLD) {
			errors.push(`${slug}: near-duplicate body vs ${other.slug} (jaccard ${score.toFixed(2)})`);
			break;
		}
	}
	return errors;
}

/**
 * @param {{ slugFilter?: string[] }} [options]
 * @returns {{ ok: boolean, errors: string[] }}
 */
function collectTopicCannibalizationErrors(posts) {
	if (!LINKS_STRICT) return [];
	const errors = [];
	const byKw = new Map();
	for (const p of posts) {
		const kw = String(p.mainKeyword ?? '').trim();
		if (!kw || isBrandMainKeyword(kw)) continue;
		if (!byKw.has(kw)) byKw.set(kw, []);
		byKw.get(kw).push(p.slug);
	}
	for (const [kw, slugs] of byKw) {
		if (slugs.length > 1) {
			errors.push(`cannibalization: mainKeyword "${kw}" shared by ${slugs.join(', ')}`);
		}
	}
	return errors;
}

export function runArticleContentChecks(options = {}) {
	const errors = [];
	try {
		postsBySlugCache = null;
		const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'));
		const raws = files.map((f) => {
			const slug = f.replace(/\.mdx$/, '');
			return { slug, raw: fs.readFileSync(path.join(BLOG_DIR, f), 'utf8') };
		});
		const filter = options.slugFilter;
		const selected = filter ? raws.filter((r) => filter.includes(r.slug)) : raws;
		const allBodies = raws.map(({ slug, raw }) => ({
			slug,
			tokens: tokenizeForSimilarity(matter(raw).content),
		}));
		for (const { slug, raw } of selected) {
			try {
				errors.push(...auditPost(slug, raw, allBodies));
			} catch (err) {
				logErr('auditPost', slug, err);
				errors.push(`${slug}: audit threw ${err.message}`);
			}
		}
		if (!options.slugFilter) {
			errors.push(...collectTopicCannibalizationErrors(loadAllPosts()));
		}
		if (process.env.LINKS_AUDIT_ENFORCE === '1' && !options.slugFilter) {
			const posts = loadAllPosts();
			const { inbound } = buildLinkGraph(posts);
			const orphans = posts.filter((p) => (inbound.get(p.slug) ?? []).length === 0);
			for (const o of orphans) {
				errors.push(`${o.slug}: orphan (zero inbound blog links)`);
			}
		}
	} catch (err) {
		logErr('runArticleContentChecks', 'fatal', err);
		errors.push(`fatal: ${err.message}`);
	}
	return { ok: errors.length === 0, errors };
}
