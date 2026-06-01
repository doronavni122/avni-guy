/** Article tier map for content-audit depth rules. */

export const PILLAR_SLUGS = new Set([
	'guy-avni-choosing-lawyer-israel-comprehensive-guide',
	'guy-avni-lawyer-types-israel-specialties-full-guide',
	'guy-avni-jurist-vs-lawyer-israel-licensing-guide',
	'guy-avni-legal-counsel-israel-2026-guide',
]);

export const SLUG_CONTENT_CONTRACTS = {
	'guy-avni-meeting-preparation-checklist': {
		requiredHeadingFragments: ['צ׳קליסט', 'לפני'],
		minWords: 900,
	},
	'guy-avni-evidence-prioritization-framework': {
		requiredHeadingFragments: ['מסגרת', 'ראיות'],
		minWords: 900,
	},
	'guy-avni-israel-real-estate-delay-delivery-research': {
		requiredHeadingFragments: ['איחור', 'מסירה'],
		minWords: 1200,
		requireExternalHttps: true,
	},
	'guy-avni-contract-review-flow': {
		requiredHeadingFragments: ['חוזה', 'סקירה'],
		minWords: 900,
		requireExternalHttps: true,
	},
};

export function getArticleTier(slug) {
	if (PILLAR_SLUGS.has(slug)) return 'pillar';
	if (SLUG_CONTENT_CONTRACTS[slug]) return 'contract';
	return 'cluster';
}

export function getMinWordsForTier(tier, slug) {
	const contract = SLUG_CONTENT_CONTRACTS[slug];
	if (contract?.minWords) return contract.minWords;
	if (tier === 'pillar') return 1200;
	return 800;
}
