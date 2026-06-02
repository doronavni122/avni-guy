/**
 * Category pillar/spoke registry for internal link graph and remediation.
 */
import { PILLAR_SLUGS } from './content-tiers.mjs';

/** @type {Record<string, string[]>} */
export const CATEGORY_PILLARS = {
	'real-estate': [
		'guy-avni-buying-from-contractor-checklist',
		'guy-avni-lawyer-required-apartment-purchase',
		'guy-avni-sale-law-guarantee-importance',
		'guy-avni-check-apartment-liens-before-purchase',
		'guy-avni-second-hand-apartment-sale-agreement',
	],
	tax: [
		'guy-avni-purchase-tax-exemption-first-apartment',
		'guy-avni-capital-gains-exemption-single-apartment-2026',
		'guy-avni-second-apartment-purchase-tax-calculation',
		'guy-avni-additional-tax-who-pays',
		'guy-avni-property-purchase-tax-legal-reduction',
	],
	litigation: [
		'guy-avni-small-claims-without-lawyer-why-lose',
		'guy-avni-contract-claim-mediation-four-thousand-six-weeks',
		'guy-avni-debt-collection-claim-minimum-amount',
		'guy-avni-defamation-claim-without-damage-proof',
		'guy-avni-enforcement-freeze-bank-account-release-48-hours',
	],
	contracts: [
		'guy-avni-contract-review-flow',
		'guy-avni-israeli-contract-red-flags-spot-three',
		'guy-avni-contract-breach-statute-limitations-seven-years',
		'guy-avni-non-compete-clause-israel-enforceability',
		'guy-avni-cancel-signed-contract-israel-fourteen-days',
	],
	service: [
		'guy-avni-choosing-lawyer-israel-comprehensive-guide',
		'guy-avni-lawyer-types-israel-specialties-full-guide',
		'guy-avni-jurist-vs-lawyer-israel-licensing-guide',
	],
};

export const SITE_KEYWORDS_BRAND = [
	'גיא אבני',
	'גיא אבני עו״ד',
	'גיא אבני עורך דין',
	'גיא אבני משרד עורכי דין',
	'אבני גיא',
	'אבני גיא עו״ד',
];

const BRAND_KW_SET = new Set(SITE_KEYWORDS_BRAND);

export function isBrandMainKeyword(mainKeyword) {
	return BRAND_KW_SET.has(String(mainKeyword ?? '').trim());
}

export function pillarsForCategory(category) {
	return CATEGORY_PILLARS[category] ?? [];
}

export function primaryPillarForCategory(category, seed = '') {
	const list = pillarsForCategory(category);
	if (!list.length) return null;
	if (!seed) return list[0];
	let h = 0;
	for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
	return list[h % list.length];
}

export function isGlobalPillarSlug(slug) {
	return PILLAR_SLUGS.has(slug);
}

export function spokesForCategory(category) {
	return pillarsForCategory(category);
}

/** Conversion and cornerstone hub paths — equity bias in remediate scoring (Scope 09). */
export const CONVERSION_CORNERSTONE_HREFS = ['/', '/contact/', '/services/', '/about/'];

/**
 * High-value pillar slugs: prioritize inbound links from overlinked hubs and orphan mesh.
 * @type {string[]}
 */
export const CONVERSION_CORNERSTONE_PILLARS = [
	'guy-avni-choosing-lawyer-israel-comprehensive-guide',
	'guy-avni-lawyer-required-apartment-purchase',
	'guy-avni-buying-from-contractor-checklist',
	'guy-avni-purchase-tax-exemption-first-apartment',
	'guy-avni-small-claims-without-lawyer-why-lose',
	'guy-avni-contract-review-flow',
];

/** Funnel intent pathway for link placement (awareness → consideration → decision). */
export const LINK_INTENT_PATHWAY = ['awareness', 'consideration', 'decision'];

const LINK_GOAL_BY_CONTENT_TYPE = {
	pillar: 'awareness',
	cluster: 'consideration',
};

/**
 * Default linkGoal when frontmatter omits it (optional field; legacy posts unchanged).
 * @param {'pillar' | 'cluster' | undefined} contentType
 * @returns {'awareness' | 'consideration' | 'decision' | undefined}
 */
export function defaultLinkGoalForContentType(contentType) {
	return LINK_GOAL_BY_CONTENT_TYPE[contentType];
}

/**
 * Suggested href targets by linkGoal (remediate + manual review).
 * @param {'awareness' | 'consideration' | 'decision'} linkGoal
 * @returns {string[]}
 */
export function cornerstoneHrefsForLinkGoal(linkGoal) {
	switch (linkGoal) {
		case 'awareness':
			return ['/', '/blog/', '/categories/'];
		case 'consideration':
			return CONVERSION_CORNERSTONE_PILLARS.slice(0, 4).map((s) => `/blog/${s}/`);
		case 'decision':
			return ['/contact/', '/services/'];
		default:
			return CONVERSION_CORNERSTONE_HREFS;
	}
}

export function isConversionCornerstonePillar(slug) {
	return CONVERSION_CORNERSTONE_PILLARS.includes(slug);
}
