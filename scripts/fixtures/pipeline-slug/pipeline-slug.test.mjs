import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { applyResearchToMdx } from '../../lib/apply-research-to-mdx.mjs';
import {
    anchorMustBeStudyTerm,
    extractStudyTerms,
    isProseParagraph,
    paragraphHasInternalLink,
    runPipelineContractChecks,
} from '../../lib/article-pipeline-contract.mjs';
import { cleanupMdxBody, cleanupMdxFrontmatter } from '../../lib/cleanup-mdx.mjs';
import { backfillKeywordsFromStudy, parseLsiTermsFromStudy } from '../../lib/keywords-backfill.mjs';
import { validateKeywordsGate } from '../../lib/keywords-gate.mjs';
import { buildPipelineSpec } from '../../lib/pipeline-spec-from-slug.mjs';
import { countWordsHe } from '../../lib/seo-hero-rules.mjs';
import { injectStudyAnchorsPerParagraph } from '../../lib/study-anchor-linker.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const studyFixture = fs.readFileSync(path.join(__dirname, 'study.fixture.md'), 'utf8');

const baseData = {
	title: 'בדיקת חוזה לפני חתימה | גיא אבני',
	description: 'מדריך מעשי לבדיקת חוזה לפני חתימה בישראל.',
	metaTitle: 'גיא אבני עורך דין | בדיקת חוזה לפני חתימה | ישראל',
	metaDescription:
		'גיא אבני עורך דין: מה לבדוק בחוזה לפני חתימה בישראל. מסמכים, מועדים וזכויות. מדריך מעודכן ל-2026.',
	mainKeyword: 'גיא אבני עורך דין',
	category: 'real-estate',
	tags: ['contracts', 'buyers'],
	internalLinks: ['/'],
};

test('extractStudyTerms parses LSI and facts', () => {
	const terms = extractStudyTerms(studyFixture);
	assert.ok(terms.length >= 4);
	assert.ok(terms.includes('בדיקת חוזה'));
	assert.ok(terms.includes('גיא אבני'));
});

test('parseLsiTermsFromStudy extracts terms', () => {
	const terms = parseLsiTermsFromStudy(studyFixture);
	assert.ok(terms.length >= 4);
	assert.ok(terms.includes('בדיקת חוזה'));
});

test('backfillKeywordsFromStudy fills secondaryKeywords', () => {
	const { data, changed } = backfillKeywordsFromStudy('pipeline-fixture-slug', { ...baseData }, studyFixture);
	assert.equal(changed, true);
	assert.ok(Array.isArray(data.secondaryKeywords));
	assert.ok(data.secondaryKeywords.length >= 4);
	assert.equal(data.contentType, 'cluster');
});

test('cleanupMdxBody strips forbidden filler heading', () => {
	const raw = '## פירוט נוסף\n\nטקסט מיותר.\n\n## סיכום\n\nתקין.';
	const cleaned = cleanupMdxBody(raw);
	assert.ok(!cleaned.includes('פירוט נוסף'));
});

test('cleanupMdxFrontmatter fits meta fields', () => {
	const fm = cleanupMdxFrontmatter({
		...baseData,
		title: `${baseData.title} מדריך מעשי, שיטות יישום וטעויות שכדאי למנוע`,
	});
	assert.ok(!fm.title.includes('מדריך מעשי, שיטות יישום'));
	assert.ok(fm.metaTitle.length >= 50);
});

test('buildPipelineSpec from study', () => {
	const spec = buildPipelineSpec('pipeline-fixture-slug', baseData, studyFixture);
	assert.ok(spec.relatedBlogSlugs.length > 0);
	assert.ok(spec.sectionBlueprints.length > 0);
});

test('injectStudyAnchorsPerParagraph links every prose paragraph', () => {
	const body = 'פסקה ראשונה על חוק המכר.\n\nפסקה שנייה על בדיקת חוזה.\n\n## כותרת\n\nלא פרוזה.';
	const out = injectStudyAnchorsPerParagraph(body, studyFixture, {
		slug: 'pipeline-fixture-slug',
		category: 'real-estate',
		tags: ['contracts'],
		mainKeyword: baseData.mainKeyword,
	});
	const blocks = out.split(/\n\n+/).filter(isProseParagraph);
	for (const b of blocks) {
		assert.ok(paragraphHasInternalLink(b), `missing link in: ${b.slice(0, 40)}`);
	}
});

test('anchorMustBeStudyTerm accepts study LSI', () => {
	const terms = extractStudyTerms(studyFixture);
	assert.ok(anchorMustBeStudyTerm('בדיקת חוזה', terms));
});

test('applyResearchToMdx produces contract-shaped body', () => {
	const data = { ...baseData, secondaryKeywords: ['חוק המכר', 'בדיקת חוזה', 'זכויות צרכן', 'תיעוד בכתב'] };
	const { body, data: fm } = applyResearchToMdx('pipeline-fixture-slug', data, studyFixture);
	assert.ok(body.includes('**'));
	assert.ok(body.includes('## שאלות נפוצות'));
	assert.ok(body.includes('/contact/'));
	assert.ok(body.includes('2026'));
	assert.ok(body.includes('| שלב |'));
	assert.ok(countWordsHe(body) >= 800);
	assert.ok(Array.isArray(fm.faq) && fm.faq.length >= 4);
	assert.ok(!body.includes('פירוט נוסף'));
	assert.ok(!body.includes('לעיון נוסף'));
	const contract = runPipelineContractChecks({
		slug: 'pipeline-fixture-slug',
		studyMarkdown: studyFixture,
		data: fm,
		body,
	});
	if (!contract.ok) {
		console.error(contract.errors);
	}
	assert.equal(contract.ok, true, contract.errors.join('; '));
});

test('runPipelineContractChecks fails without paragraph links', () => {
	const bad = runPipelineContractChecks({
		slug: 'x',
		studyMarkdown: studyFixture,
		data: baseData,
		body: 'פסקה בלי קישור פנימי.\n\n## נושא - גיא אבני עורך דין\n\nעוד פסקה.',
	});
	assert.equal(bad.ok, false);
});

test('validateKeywordsGate fails for missing slug file', () => {
	const result = validateKeywordsGate('this-slug-does-not-exist-xyz');
	assert.equal(result.ok, false);
});
