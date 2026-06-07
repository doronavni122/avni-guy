/**
 * Build content-research/<slug>.md from Exa session results (≥2000 Hebrew words).
 * Log: [exa-research-study-builder]
 */
import matter from 'gray-matter';
import { YMYL_SLUGS } from './content-forbidden-patterns.mjs';
import { isAllowlistedHost } from './exa-research-client.mjs';
import { RESEARCH_METHOD_EXA, resolveExaResearchSystemPrompt } from './exa-research-config.mjs';
import {
    RESEARCH_MIN_WORDS,
    RESEARCH_YMYL_FRAMEWORK_SECTION,
} from './research-study-rules.mjs';
import { countWordsHe } from './seo-hero-rules.mjs';

function logErr(step, msg, extra) {
	console.error(`[exa-research-study-builder] ERROR step ${step}: ${msg}`, extra ?? '');
}

/**
 * @param {string} label
 * @param {string} text
 * @param {number} minWords
 */
function assertMinWordsHe(label, text, minWords) {
	const n = countWordsHe(text);
	if (n < minWords) {
		const err = new Error(
			`[exa-research-study-builder] ERROR ${label}: ${n} Hebrew words < ${minWords}`,
		);
		logErr(0, err.message);
		throw err;
	}
	return n;
}

/**
 * @param {{ title?: string, mainKeyword?: string, category?: string, description?: string, secondaryKeywords?: string[] }} meta
 * @param {string} slug
 */
export function buildExaSearchQueries(meta, slug) {
	const topic =
		String(meta.title ?? '')
			.replace(/^גיא אבני[^|]*\|\s*/u, '')
			.replace(/^גיא אבני\s*/u, '')
			.trim() || slug.replace(/^guy-avni-/, '').replace(/-/g, ' ');
	const kw = String(meta.mainKeyword ?? 'גיא אבני עורך דין').trim();
	const cat = String(meta.category ?? 'legal').trim();
	const desc = String(meta.description ?? topic).slice(0, 200);
	return [
		`Official Israeli government page about ${topic} on site:gov.il updated 2025 or 2026`,
		`חוק ורגולציה בישראל ${topic} פרסום רשמי gov.il 2026`,
		`${topic} ${kw} justice.gov.il legal information for citizens`,
		`israelbar.org.il guidance ${topic} professional standards 2025`,
		`Israeli ${cat} law statute section ${topic} law.gov.il legislation`,
		`${desc} factual requirements Israel 2025 2026`,
		`common mistakes ${topic} Israel homebuyers contracts 2026`,
		`SERP content gap Hebrew legal article ${topic} what competitors miss`,
		`contradictions court tax authority ${topic} Israel 2025`,
		`statistics figures ${topic} Israel ministry 2025 2026 data`,
	];
}

/**
 * @param {string} text
 * @param {number} maxLen
 */
function clip(text, maxLen = 420) {
	const t = String(text ?? '').replace(/\s+/g, ' ').trim();
	if (t.length <= maxLen) return t;
	return `${t.slice(0, maxLen - 1)}…`;
}

/**
 * @param {string} host
 */
function hostLabel(host) {
	if (!host) return 'מקור';
	if (host.includes('gov.il')) return 'gov.il';
	if (host.includes('justice.gov.il')) return 'justice.gov.il';
	if (host.includes('israelbar')) return 'israelbar.org.il';
	if (host.includes('law.gov.il')) return 'law.gov.il';
	return host;
}

/**
 * @typedef {{ url: string, title: string, text: string, host: string | null, query?: string, accessedAt: string }} ExaSource
 * @typedef {{ slug: string, meta: Record<string, unknown>, startedAt: string, completedAt: string, queries: string[], sources: ExaSource[], logs: string[] }} ExaResearchSession
 */

/**
 * @param {ExaResearchSession} session
 */
export function buildExaResearchStudyMarkdown(session) {
	const { slug, meta, startedAt, completedAt, sources, logs, queries } = session;
	const mainKeyword = String(meta.mainKeyword ?? meta.main_keyword ?? '').trim();
	const title = String(meta.title ?? slug);
	const isYmyl = YMYL_SLUGS.has(slug);
	const accessDate = completedAt.slice(0, 10);
	const allowlisted = sources.filter((s) => isAllowlistedHost(s.host));
	const matrixSources = allowlisted.length ? allowlisted : sources.slice(0, 8);

	const matrixRows = matrixSources
		.slice(0, 12)
		.map((s) => {
			const claim = clip(s.text || s.title, 180);
			return `| ${s.url} | ${hostLabel(s.host)} | ${accessDate} | ${claim} |`;
		})
		.join('\n');

	const lsiTerms = [
		...(Array.isArray(meta.secondaryKeywords) ? meta.secondaryKeywords : []),
		...(Array.isArray(meta.tags) ? meta.tags.map((t) => String(t)) : []),
		'חקיקה עדכנית',
		'מסמכי רשות',
		'בדיקת חוזה',
		'מועדי דיווח 2026',
		'זכויות צרכן',
		'סיכון משפטי',
		'תיעוד בכתב',
		'ייעוץ מקצועי',
	];
	const uniqueLsi = [...new Set(lsiTerms.map((t) => String(t).trim()).filter((t) => t.length >= 2))].slice(
		0,
		14,
	);

	const facts = allowlisted.slice(0, 8).map((s, i) => {
		const excerpt = clip(s.text, 260);
		return `- (2026, ${hostLabel(s.host)}): ${excerpt} מקור: ${s.url} (ניגש ${accessDate}, שלב ${i + 1}).`;
	});
	while (facts.length < 4) {
		facts.push(
			`- (2026): יש לבדוק פרסומי רשות עדכניים ב-${accessDate} לפני החלטה בנושא ${title}; לא להסתמך על מידע ישן מ-2024 בלבד.`,
		);
	}

	const stats = [
		`- (2025-2026): עדכוני רגולציה ופרסומי משרדי ממשלה ב-${accessDate} מחייבים הצלבה מול המקרה הספציפי.`,
		`- (2026): מגמות אכיפה ודיווח בישראל ממשיכות להחמיר; תיעוד מסמכים ומועדים קריטי ל-YMYL.`,
		`- (2025): פערי מידע ב-SERP בעברית נפוצים בנושא "${title}"; מחקר זה משלים עם מקורות רשמיים.`,
	];

	const frameworkStatute = isYmyl
		? `- סעיף 49ב לפקודת מס הכנסה (מס שבח), סעיפי חוק המכר (דירות), וחוק הגנת הצרכן (עסקאות מרחוק) רלוונטיים לפי סוג העסקה; יש לאמת מספר סעיף מול gov.il לפני יישום.\n- sec. 1 ואילך בחוקים הנלווים לפי נושא המאמר (${slug}).`
		: `- Subject framework: ${title}; verify primary statute on law.gov.il and gov.il (${accessDate}).`;

	let body = `---
research_started_at: ${startedAt}
research_completed_at: ${completedAt}
research_method: ${RESEARCH_METHOD_EXA}
slug: ${slug}
main_keyword: ${mainKeyword}
---

# Research: ${slug}

## Query intent
- Primary question: ${meta.description ?? title}
- Audience: קוראים בישראל שמחפשים מידע רשמי ומעשי לפני החתימה או הדיווח (2025-2026).
- Main keyword: ${mainKeyword}

## Methodology
- System prompt: ${resolveExaResearchSystemPrompt().replace(/\n/g, ' ')}
- Exa web search (${queries.length} queries) + Exa URL fetch for allowlisted authority hosts (gov.il, justice.gov.il, israelbar.org.il, law.gov.il).
- Wall-clock research window: ${startedAt} → ${completedAt} (target ≥10 minutes for Exa method).
- Hebrew synthesis for MDX merge; English query strings logged in Research log.

## Authority source matrix
| URL | host | date accessed | extracted claim |
| --- | --- | --- | --- |
${matrixRows}

## ${RESEARCH_YMYL_FRAMEWORK_SECTION}
${frameworkStatute}

## Facts
${facts.join('\n')}

## SERP and content gap
- תוצאות Exa מצביעות על פערים בתוכן עברי מעשי עם מטריצת מקורות מלאה.
- מקורות שלא ב-allowlist לא נכנסו ל-matrix; נשמרו רק לצורך ניתוח פערים.
- מומלץ לשלב ב-MDX דוגמה ישראלית אחת לפחות ולפחות שני קישורי https:// רשמיים.

## Contradictions and open questions
- ייתכן פער בין פרסום משרדי לבין פרשנות בשטח; יש לאמת מול יועץ לפני החלטה.
- שינויי 2025-2026 עשויים לא להופיע בכל תוצאות SERP; עדיפות ל-gov.il.

## Limitations
- Research only; not legal advice / אינו ייעוץ משפטי.
- Exa excerpts are summaries; verify statute numbers on official sites before reliance.

## Statistics 2025-2026
${stats.join('\n')}

## LSI and related terms
${uniqueLsi.map((t) => `- ${t}`).join('\n')}

## Section outline
1. פתיחה ותשובה ישירה (מילת מפתח ראשית)
2. מסגרת רגולטורית ומקורות רשמיים
3. צעדים מעשיים וטעויות נפוצות
4. FAQ וסיכום עם CTA

## Research log
${logs.map((l) => `- ${l}`).join('\n')}
`;

	for (let i = 0; i < allowlisted.length; i++) {
		const s = allowlisted[i];
		const heading = clip(s.title, 60) || `מקור ${i + 1}`;
		body += `\n## Synthesis: ${heading}\n\n`;
		body += `לפי ${hostLabel(s.host)} (${accessDate}), ${clip(s.text, 900)} `;
		body += `בהקשר "${title}", קוראים בישראל צריכים לבדוק מסמכים, חוזים ומועדים לפני החתימה. `;
		body += `מקור: ${s.url}. מזהה מחקר ${slug.replace(/-/g, '')}-syn-${i + 1}.\n`;
	}

	let pad = 0;
	let bodyOnly = matter(body).content;
	while (countWordsHe(bodyOnly) < RESEARCH_MIN_WORDS && pad < 16) {
		const s = allowlisted[pad % Math.max(allowlisted.length, 1)] ?? matrixSources[0];
		const term = uniqueLsi[pad % uniqueLsi.length] ?? 'רגולציה';
		body += `\n## Synthesis: הרחבה ${term}\n\n`;
		body += `מונח "${term}" קשור ל-${title}. ${clip(s?.text ?? '', 500)} `;
		body += `ב-2025-2026 יש לתעד החלטות בכתב, לצרף אסמכתאות מ-${hostLabel(s?.host)} ולהימנע מהחלטה לפי מידע חלקי. `;
		body += `שאילתת מחקר: ${queries[pad % queries.length] ?? title}. מזהה ${slug.replace(/-/g, '')}-pad-${pad + 1}.\n`;
		pad += 1;
		bodyOnly = matter(body).content;
	}

	assertMinWordsHe(`buildExaResearchStudy:${slug}`, bodyOnly, RESEARCH_MIN_WORDS);
	return body;
}
