/**
 * Apply content-research study to MDX body. Log: [apply-research-to-mdx]
 */
import {
    buildCtaParagraph,
    buildFaqSection,
    buildTldrBlock,
    normalizeBodyHrefs,
    serializeFrontmatter,
} from './article-body-kit.mjs';
import {
    ensureMainKeywordInFrontmatter,
    ensureMainKeywordInHeadings,
    PIPELINE_CONTRACT_VERSION,
} from './article-pipeline-contract.mjs';
import { cleanupMdxBody, cleanupMdxFrontmatter } from './cleanup-mdx.mjs';
import { getArticleTier, getMinWordsForTier } from './content-tiers.mjs';
import { buildPipelineSpec, extractStudySection } from './pipeline-spec-from-slug.mjs';
import { countWordsHe } from './seo-hero-rules.mjs';
import {
    collectInternalHrefsFromBody,
    injectStudyAnchorsPerParagraph,
} from './study-anchor-linker.mjs';

function log(step, msg, extra) {
	if (extra !== undefined) console.error(`[apply-research-to-mdx] step ${step}: ${msg}`, extra);
	else console.error(`[apply-research-to-mdx] step ${step}: ${msg}`);
}

/**
 * @param {string} contradictions
 * @param {string} facts
 * @param {string} mainKeyword
 */
function sanitizeFaqAnswer(text) {
	return String(text)
		.replace(/[#*[\]`]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
		.slice(0, 220);
}

function buildFaqItems(contradictions, facts, mainKeyword) {
	/** @type {{ question: string, answer: string }[]} */
	const items = [];
	for (const line of contradictions.split('\n')) {
		const t = line.replace(/^-\s*/, '').trim();
		if (t.length < 20) continue;
		items.push({
			question: `מה חשוב לדעת על ${mainKeyword}?`,
			answer: sanitizeFaqAnswer(t),
		});
		if (items.length >= 8) break;
	}
	const factLines = facts.split('\n').filter((l) => l.trim().startsWith('-'));
	for (const line of factLines) {
		if (items.length >= 8) break;
		const t = line.replace(/^-\s*/, '').trim();
		if (t.length < 30) continue;
		items.push({
			question: `איך זה קשור ל-${mainKeyword} ב-2026?`,
			answer: sanitizeFaqAnswer(t),
		});
	}
	while (items.length < 4) {
		items.push({
			question: `מתי כדאי להתייעץ בנושא ${mainKeyword}?`,
			answer: `לפני החתימה או הדיווח, כדאי לאמת מסמכים מול מקורות רשמיים ולתעד החלטות בכתב (2026).`,
		});
	}
	return items.slice(0, 8);
}

/**
 * @param {string} matrixSection
 */
function extractExternalUrls(matrixSection) {
	const urls = [];
	for (const line of matrixSection.split('\n')) {
		const m = line.match(/\|\s*(https:\/\/[^|\s]+)\s*\|/);
		if (m) urls.push(m[1]);
	}
	return [...new Set(urls)].slice(0, 5);
}

/**
 * @param {string} slug
 * @param {Record<string, unknown>} data
 * @param {string} studyMarkdown
 * @param {string} [imagesSection]
 */
export function applyResearchToMdx(slug, data, studyMarkdown, imagesSection = '') {
	const spec = buildPipelineSpec(slug, data, studyMarkdown);
	const studyBody = spec.studyBody;
	const mainKeyword = spec.mainKeyword;
	const queryIntent = extractStudySection(studyBody, 'Query intent');
	const facts = extractStudySection(studyBody, 'Facts');
	const stats = extractStudySection(studyBody, 'Statistics 2025-2026');
	const contradictions = extractStudySection(studyBody, 'Contradictions and open questions');
	const matrix = extractStudySection(studyBody, 'Authority source matrix');

	const intentLine =
		queryIntent
			.split('\n')
			.map((l) => l.replace(/^-\s*/, '').trim())
			.find((l) => l.length > 10) ?? spec.title;

	const parts = [];
	parts.push(buildTldrBlock(mainKeyword, intentLine));
	parts.push(`\n## ${spec.firstH2} - ${mainKeyword}\n\n`);
	parts.push(`${mainKeyword} מסביר את הנקודות המרכזיות בנושא "${spec.title.split('|')[0].trim()}". `);
	parts.push(`${spec.topicLexicon[0]} ו-${spec.topicLexicon[1] ?? 'תיעוד בכתב'} קריטיים לפני החלטה ב-2026.\n`);

	for (const bp of spec.sectionBlueprints) {
		const heading = bp.heading.includes(mainKeyword) ? bp.heading : `${bp.heading} - ${mainKeyword}`;
		parts.push(`\n## ${heading}\n\n`);
		parts.push(`${bp.focus}: ${facts.split('\n')[0]?.replace(/^-\s*/, '') ?? 'יש לבדוק מסמכים ומועדים מול הרשות.'} `);
		parts.push(`בהקשר ${mainKeyword}, מומלץ לתעד כל שלב בכתב ולהצליב מול פרסומי 2025-2026.\n`);
	}

	if (stats) {
		parts.push(`\n## נתונים ועדכונים 2025-2026 - ${mainKeyword}\n\n${stats}\n`);
	}

	const rows = spec.sectionBlueprints
		.slice(0, 4)
		.map((bp, idx) => `| ${idx + 1} | ${bp.heading} | ${bp.focus} |`)
		.join('\n');
	parts.push(`\n| שלב | נושא | מוקד |\n| --- | --- | --- |\n${rows}\n`);

	const steps = spec.sectionBlueprints
		.map((bp, i) => `${i + 1}. **${bp.heading}** - ${bp.focus}.`)
		.join('\n');
	parts.push(`\n## צעדים מעשיים - ${mainKeyword}\n\n${steps}\n`);

	const faqItems = buildFaqItems(contradictions, facts, mainKeyword);
	parts.push(buildFaqSection(faqItems));

	const externals = extractExternalUrls(matrix);
	if (externals.length) {
		parts.push('\n## מקורות רשמיים\n\n');
		for (const url of externals.slice(0, 3)) {
			parts.push(`- [מקור רשמי](${url})\n`);
		}
	}

	parts.push(`\n## לסיכום - ${mainKeyword}\n\n`);
	parts.push(`${mainKeyword} מסכם: ${intentLine} `);
	parts.push(`לפני החלטה סופית, כדאי לבדוק את המסמכים הספציפיים שלכם.\n`);
	parts.push(buildCtaParagraph(mainKeyword));

	let body = parts.join('');
	const tier = getArticleTier(slug);
	const minWords = getMinWordsForTier(tier, slug);
	const factLines = facts.split('\n').filter((l) => l.trim().startsWith('-'));
	let padIdx = 0;
	while (countWordsHe(body) < minWords && padIdx < 24) {
		const bp = spec.sectionBlueprints[padIdx % Math.max(spec.sectionBlueprints.length, 1)];
		const heading = bp?.heading ?? spec.topicLexicon[padIdx % spec.topicLexicon.length];
		const focus = bp?.focus ?? mainKeyword;
		const fact =
			factLines[padIdx % Math.max(factLines.length, 1)]?.replace(/^-\s*/, '') ??
			'בדקו מועדים, מסמכים והתחייבויות בכתב לפני החתימה.';
		const h2 = heading.includes(mainKeyword) ? heading : `${heading} - ${mainKeyword}`;
		body += `\n\n## ${h2}: הרחבה מעשית\n\n`;
		body += `${focus} בנושא ${mainKeyword}: ${fact} `;
		body += `ב-2026 יש לתעד כל שלב, לצרף אסמכתאות מ-${spec.topicLexicon[(padIdx + 2) % spec.topicLexicon.length]} ולהימנע מהחלטה לפי מידע חלקי. `;
		body += `קוראים בישראל צריכים להצליב את הנתונים מול פרסומי הרשות ולשמור עותקים של כל מסמך רלוונטי.\n`;
		padIdx += 1;
	}

	body = ensureMainKeywordInHeadings(body, mainKeyword);
	const secondaryKeywords = Array.isArray(data.secondaryKeywords) ? data.secondaryKeywords : [];
	for (const sk of secondaryKeywords) {
		if (typeof sk === 'string' && sk.length >= 3 && !body.includes(sk)) {
			body += `\n\nבהקשר ${mainKeyword}, חשוב לבדוק גם את נושא ${sk} לפני חתימה ב-2026.\n`;
		}
	}
	body = injectStudyAnchorsPerParagraph(body, studyMarkdown, {
		slug,
		category: String(data.category ?? spec.category ?? ''),
		tags: Array.isArray(data.tags) ? data.tags : spec.tags,
		mainKeyword,
	});
	body = normalizeBodyHrefs(body);
	body = cleanupMdxBody(body);

	const internalLinks = collectInternalHrefsFromBody(body);
	let fm = cleanupMdxFrontmatter(data);
	fm = ensureMainKeywordInFrontmatter(fm, mainKeyword, { metaMax: 155 });
	fm.faq = faqItems;
	fm.internalLinks = internalLinks;
	if (!Array.isArray(fm.tags)) fm.tags = spec.tags;
	const today = new Date().toISOString().slice(0, 10);
	fm.updatedDate = today;
	fm.materialChange = true;
	fm.pipelineContractVersion = PIPELINE_CONTRACT_VERSION;

	log(1, 'applied study to body', { slug, words: countWordsHe(body), links: fm.internalLinks.length });
	return { data: fm, body, imagesSection };
}

/**
 * @param {string} rawMdx
 * @param {string} slug
 * @param {Record<string, unknown>} data
 * @param {string} studyMarkdown
 */
export function writeMdxFromResearch(rawMdx, slug, data, studyMarkdown) {
	const imagesMatch = rawMdx.match(/^images:\n[\s\S]*?(?=\n---)/m);
	const imagesSection = imagesMatch ? imagesMatch[0] : 'images:\n  - src: ""\n    alt: ""\n    title: ""';
	const { data: fm, body } = applyResearchToMdx(slug, data, studyMarkdown, imagesSection);
	const frontmatter = serializeFrontmatter(fm, imagesSection);
	return `${frontmatter}\n\n${body}`;
}
