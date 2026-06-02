/** SSOT thresholds and paths for tracked research studies (committed under content-research/). */

export const RESEARCH_MIN_DURATION_SEC = 300;
export const RESEARCH_MIN_WORDS = 2000;
export const RESEARCH_MIN_AUTHORITY_URLS = 5;
export const RESEARCH_MIN_DATED_FACTS = 3;
export const RESEARCH_MIN_LSI_TERMS = 8;

/** Git-tracked studies for CI and scheduled remediation batches. */
export const RESEARCH_DIR = 'content-research';

/** When true (default for content-research), deleteResearchStudy is a no-op unless RESEARCH_ALLOW_DELETE=1. */
export const RESEARCH_TRACKED_IN_GIT = true;

/** Required ## headings (exact match after strip). */
export const RESEARCH_REQUIRED_SECTIONS = [
	'Query intent',
	'Methodology',
	'Authority source matrix',
	'Facts',
	'SERP and content gap',
	'Contradictions and open questions',
	'Limitations',
	'Statistics 2025-2026',
	'LSI and related terms',
	'Section outline',
	'Research log',
];

/** YMYL slugs require this primary framework heading. */
export const RESEARCH_YMYL_FRAMEWORK_SECTION = 'Primary legal / regulatory framework';

/** Non-YMYL may use one of these instead of the YMYL framework heading. */
export const RESEARCH_NON_YMYL_FRAMEWORK_ALIASES = [
	'Primary legal / regulatory framework',
	'Primary regulatory framework',
	'Subject framework',
];

export const RESEARCH_YMYL_MATRIX_HOSTS = ['gov.il', 'justice.gov.il', 'israelbar.org.il'];

export const RESEARCH_LIMITATIONS_DISCLAIMER_PATTERNS = [
	/not legal advice/i,
	/לא ייעוץ משפטי/u,
	/אינו ייעוץ משפטי/u,
	/אינה ייעוץ משפטי/u,
];

export const RESEARCH_STATUTE_REF_PATTERN = /(?:סעיף|sec\.|section)\s*[\dא-ת]/iu;

export function resolveResearchMinDurationSec() {
	const override = process.env.RESEARCH_MIN_DURATION_SEC?.trim();
	if (override) {
		const n = Number(override);
		if (Number.isFinite(n) && n >= 0) return n;
	}
	return RESEARCH_MIN_DURATION_SEC;
}
