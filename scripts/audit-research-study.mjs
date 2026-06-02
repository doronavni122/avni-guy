#!/usr/bin/env node
/**
 * Research study audit CLI. Log prefix: [research-audit]
 */
import {
	checkResearchStudy,
	checkResearchStudyFile,
	formatResearchErrors,
} from './lib/check-research-study.mjs';
import { BANNED_EM_DASH } from './lib/check-banned-characters.mjs';
import {
	RESEARCH_MIN_AUTHORITY_URLS,
	RESEARCH_MIN_DATED_FACTS,
	RESEARCH_MIN_LSI_TERMS,
	RESEARCH_MIN_WORDS,
	RESEARCH_YMYL_FRAMEWORK_SECTION,
} from './lib/research-study-rules.mjs';

function log(msg, extra) {
	if (extra !== undefined) console.error(`[research-audit] ${msg}`, extra);
	else console.error(`[research-audit] ${msg}`);
}

function logErr(msg, extra) {
	console.error(`[research-audit] ERROR ${msg}`, extra ?? '');
}

function resolveSlugs(argv) {
	const slugs = argv.filter((a) => !a.startsWith('--'));
	if (slugs.length) return slugs;
	const env =
		process.env.RESEARCH_AUDIT_SLUGS?.trim() || process.env.PIPELINE_SLUGS?.trim() || '';
	if (env) return env.split(',').map((s) => s.trim()).filter(Boolean);
	return [];
}

function buildPassFixture() {
	const filler =
		'מחקר משפטי מעמיק על איחור במסירת דירה מקבלן בישראל לפי חוק המכר ותקנות 2025 ו-2026. '.repeat(
			120,
		);
	const started = new Date('2026-01-01T10:00:00.000Z');
	const completed = new Date(started.getTime() + 310_000);

	return `---
research_started_at: ${started.toISOString()}
research_completed_at: ${completed.toISOString()}
slug: guy-avni-israel-real-estate-delay-delivery-research
main_keyword: גיא אבני עורך דין
---

# Research: self-test-pass

## Query intent
- Primary question: איחור במסירה
- Audience: רוכשי דירות

## Methodology
- Primary statute review via gov.il and justice.gov.il (2026).

## Authority source matrix
| URL | host | date accessed | claim |
| --- | --- | --- | --- |
| https://www.gov.il/he/departments/israel_tax_authority/govil-landing-page | gov.il | 2026-01-01 | מסגרת רגולטורית |
| https://www.justice.gov.il/Units/LegalInfo/Pages/default.aspx | justice.gov.il | 2026-01-01 | מידע משפטי |
| https://www.israelbar.org.il/ | israelbar.org.il | 2026-01-01 | הנחיות לשכה |
| https://www.gov.il/he/pages/apartment-sale-law | gov.il | 2026-01-01 | חוק המכר |
| https://unsplash.com/license | unsplash.com | 2026-01-01 | רישיון תמונה |

## ${RESEARCH_YMYL_FRAMEWORK_SECTION}
- חוק המכר (דירות), סעיף 5א: פיצוי על איחור (2025).
- sec. 7A: ויתור בלתי תקף (2026).

## Facts
- פיצוי statutory ללא הוכחת נזק (2025).
- מודל 100%-125%-150% לחוזים מ-2022 (2026).
- הגבלת גביית מקדמה 7% (2025).

## SERP and content gap
- מתחרים מציגים סיכום קצר ללא מטריצת מקורות (2026).

## Contradictions and open questions
- פרשנות force majeure ב-2025 מול 2026.

## Limitations
- מסמך מחקר; not legal advice; אינו ייעוץ משפטי.

## Statistics 2025-2026
- רפורמת 2022 חלה על חוזים מ-7.7.2022 (2025).
- תקרת מס יסף 721,560 ש"ח (2026).

## LSI and related terms
- איחור מסירה
- פיצוי שכר דירה
- חוק המכר דירות
- קבלן מפתח
- מועד מסירה חוזי
- הבטחת השקעות
- רוכש דירה
- ליקויי בנייה
- ויתור על זכויות
- מדד תשומות הבנייה

## Section outline
1. זכויות רוכש
2. חישוב פיצוי
3. צעדים מעשיים

## Research log
- 2026-01-01T10:00:00Z fetched gov.il landing page
- 2026-01-01T10:05:00Z fetched justice.gov.il legal info
- 2026-01-01T10:10:00Z synthesized findings

${filler}
`;
}

function buildFailFixtures() {
	const shortBody = `---
research_started_at: 2026-01-01T10:00:00.000Z
research_completed_at: 2026-01-01T10:01:00.000Z
slug: self-test-fail-short
main_keyword: test
---
# Research: fail
## Query intent
- x
`;
	return [
		{
			name: 'short words + duration',
			slug: 'self-test-fail-short',
			content: shortBody,
			expectRules: ['RESEARCH_WORDS_MIN', 'RESEARCH_DURATION_MIN'],
		},
		{
			name: 'missing sections',
			slug: 'self-test-fail-sections',
			content: `---
research_started_at: 2026-01-01T10:00:00.000Z
research_completed_at: 2026-01-01T15:00:00.000Z
slug: self-test-fail-sections
main_keyword: test
---
# Research: fail
## Query intent
- only one section
`,
			expectRules: ['RESEARCH_SECTION_MISSING'],
		},
		{
			name: 'two urls only',
			slug: 'self-test-fail-urls',
			content: buildPartialFixture(2),
			expectRules: ['RESEARCH_URL_COUNT'],
		},
	];
}

function buildPartialFixture(urlCount) {
	const urls = [
		'https://www.gov.il/he/pages/a',
		'https://www.gov.il/he/pages/b',
		'https://www.justice.gov.il/x',
		'https://www.israelbar.org.il/y',
		'https://unsplash.com/license',
	];
	const matrixRows = urls
		.slice(0, urlCount)
		.map((u) => `| ${u} | gov.il | 2026-01-01 | claim |`)
		.join('\n');
	const filler = 'עובדה משפטית עם תאריך 2025. '.repeat(400);
	return `---
research_started_at: 2026-01-01T10:00:00.000Z
research_completed_at: 2026-01-01T15:00:00.000Z
slug: self-test-fail-urls
main_keyword: kw
---
# Research: fail-urls

## Query intent
- q

## Methodology
- manual review only (no extra URLs in this section)

## Authority source matrix
${matrixRows}

## ${RESEARCH_YMYL_FRAMEWORK_SECTION}
- סעיף 5א (2025)

## Facts
- f1 2025
- f2 2026
- f3 2025

## SERP and content gap
- g 2026

## Contradictions and open questions
- c

## Limitations
- not legal advice

## Statistics 2025-2026
- s 2025

## LSI and related terms
- term-alpha
- term-beta
- term-gamma
- term-delta
- term-epsilon
- term-zeta
- term-eta
- term-theta

## Section outline
- 1

## Research log
- step 2026-01-01

${filler}
`;
}

function runSelfTest() {
	log('self-test start');
	let failed = false;

	const pass = checkResearchStudy({ slug: 'guy-avni-israel-real-estate-delay-delivery-research', content: buildPassFixture(), minDurationSec: 300 });
	if (!pass.ok) {
		logErr('pass fixture expected ok', formatResearchErrors(pass.errors));
		failed = true;
	} else if ((pass.wordCount ?? 0) < RESEARCH_MIN_WORDS) {
		logErr('pass fixture word count', pass.wordCount);
		failed = true;
	} else {
		log('pass fixture ok', { wordCount: pass.wordCount });
	}

	for (const fx of buildFailFixtures()) {
		const result = checkResearchStudy({ slug: fx.slug, content: fx.content, minDurationSec: 300 });
		if (result.ok) {
			logErr(`fail fixture "${fx.name}" expected failure`);
			failed = true;
			continue;
		}
		const ids = new Set(result.errors.map((e) => e.ruleId));
		const matched = fx.expectRules.some((r) => ids.has(r));
		if (!matched) {
			logErr(`fail fixture "${fx.name}" missing expected rules`, {
				expected: fx.expectRules,
				got: [...ids],
			});
			failed = true;
		} else {
			log(`fail fixture ok: ${fx.name}`);
		}
	}

	if (buildPassFixture().includes(BANNED_EM_DASH)) {
		logErr('pass fixture contains em dash');
		failed = true;
	}

	log('self-test constants', {
		RESEARCH_MIN_WORDS,
		RESEARCH_MIN_AUTHORITY_URLS,
		RESEARCH_MIN_DATED_FACTS,
		RESEARCH_MIN_LSI_TERMS,
	});

	if (failed) {
		logErr('self-test FAILED');
		process.exit(1);
	}
	log('self-test PASSED');
}

function auditSlugs(slugs) {
	let failed = false;
	for (const slug of slugs) {
		log('auditing', { slug });
		const result = checkResearchStudyFile(slug);
		if (!result.ok) {
			failed = true;
			for (const line of formatResearchErrors(result.errors).split('\n')) {
				logErr(line);
			}
		} else {
			log('pass', { slug, wordCount: result.wordCount });
		}
	}
	if (failed) process.exit(1);
	log('done', { count: slugs.length });
}

function main() {
	const argv = process.argv.slice(2);
	if (argv.includes('--self-test')) {
		runSelfTest();
		return;
	}

	const slugs = resolveSlugs(argv);
	if (!slugs.length) {
		logErr('no slugs (argv, RESEARCH_AUDIT_SLUGS, or PIPELINE_SLUGS)');
		process.exit(1);
	}
	auditSlugs(slugs);
}

main();
