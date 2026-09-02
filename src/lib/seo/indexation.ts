/** Categories with fewer published posts than this are noindex,follow. */
export const THIN_CATEGORY_INDEX_MIN_POSTS = 4;

/** Overlapping hubs that stay published but must not compete in the index. */
export const NOINDEX_OVERLAP_CATEGORIES = new Set<string>(['real-estate-law']);

/** Scaled/template posts with leftover tokens — quarantine (noindex) until rewritten from practice. */
export const QUARANTINED_BLOG_SLUGS = new Set<string>([
	'time-management-for-legal-work',
	'process-improvement-for-legal-teams',
	'wrong-page-signature-checks-initials',
	'workplace-harassment-complaint-filing',
	'wage-delay-penalty-clock-start',
	'unregistered-lease-contract-saving-clause',
	'travel-ban-order-cancel-urgent',
	'third-party-car-insurance-denial-overturn',
	'rent-increase-over-five-percent-consent',
	'questions-expose-bad-lawyer-first-meeting',
	'property-purchase-tax-legal-reduction',
	'prenuptial-agreement-cost-divorce-savings',
	'non-compete-clause-israel-enforceability',
	'national-insurance-appeal-approval-reason',
	'mediation-cheaper-than-lawsuit-why-not-offered',
	'maternity-benefits-fifteen-weeks-three-conditions',
	'legal-retainer-eight-deliverables',
	'lawyer-dual-representation-ethics-complaint',
	'israeli-lease-contract-traps',
	'income-tax-refund-who-misses',
	'enforcement-freeze-bank-account-release-48-hours',
	'divorce-mediation-cost-vs-litigation',
	'defamation-claim-without-damage-proof',
	'debt-collection-claim-minimum-amount',
	'criminal-record-sealing-seven-years',
	'criminal-case-closure-no-record',
]);

export function isQuarantinedBlogSlug(slug: string): boolean {
	try {
		return QUARANTINED_BLOG_SLUGS.has(slug);
	} catch (err) {
		console.error('[seo] isQuarantinedBlogSlug failed', { slug, err });
		return true;
	}
}

export function shouldIndexCategory(category: string, postCount: number): boolean {
	try {
		if (NOINDEX_OVERLAP_CATEGORIES.has(category)) {
			return false;
		}
		if (postCount < THIN_CATEGORY_INDEX_MIN_POSTS) {
			return false;
		}
		return true;
	} catch (err) {
		console.error('[seo] shouldIndexCategory failed', { category, postCount, err });
		return false;
	}
}
