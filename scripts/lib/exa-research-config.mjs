/**
 * SSOT for Exa-powered research studies. Log: [exa-research-config]
 */
import {
    RESEARCH_EXA_MIN_DURATION_SEC,
    RESEARCH_EXA_QUERY_COUNT,
    resolveResearchExaMinDurationSec,
    resolveResearchExaQueryCount,
} from './research-study-rules.mjs';

export const EXA_API_BASE = 'https://api.exa.ai';
export const EXA_SEARCH_PATH = '/search';
export const EXA_CONTENTS_PATH = '/contents';

export const RESEARCH_METHOD_EXA = 'exa';

/** SSOT rubric embedded in Exa study Methodology and MDX synthesis. */
export const EXA_RESEARCH_SYSTEM_PROMPT = `You are an Israeli legal YMYL research assistant (2025-2026).
Prioritize allowlisted authority hosts: gov.il, justice.gov.il, israelbar.org.il, law.gov.il.
Extract dated facts (2025/2026), statute references, and practical steps for Hebrew readers.
Include limitations: not legal advice / אינו ייעוץ משפטי.
Produce section outline suitable for MDX: TL;DR, regulatory framework, practical steps, FAQ, CTA.
Never invent URLs; cite only fetched sources.`;

export function resolveExaResearchSystemPrompt() {
	const override = process.env.EXA_RESEARCH_SYSTEM_PROMPT?.trim();
	return override || EXA_RESEARCH_SYSTEM_PROMPT;
}

/** Allowlisted seeds when search returns too few gov hosts. */
export const EXA_SEED_AUTHORITY_URLS = [
	'https://www.gov.il/he/pages/apartment-sale-law',
	'https://www.gov.il/he/departments/israel_tax_authority/govil-landing-page',
	'https://www.justice.gov.il/Units/LegalInfo/Pages/default.aspx',
	'https://www.israelbar.org.il/',
	'https://www.law.gov.il/',
];

export function getExaQueryIntervalMs() {
	const durationMs = resolveResearchExaMinDurationSec() * 1000;
	const count = resolveResearchExaQueryCount();
	return Math.max(15_000, Math.floor(durationMs / count));
}

export { RESEARCH_EXA_MIN_DURATION_SEC, RESEARCH_EXA_QUERY_COUNT };
