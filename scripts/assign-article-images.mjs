#!/usr/bin/env node
/**
 * Generates image search queries and default placement metadata for article pipeline.
 * Usage: node scripts/assign-article-images.mjs <slug> <term1> <term2> <term3>
 *
 * Search rules (see .content-kit/standards/images.md):
 * - English only, macro photography
 * - Prefix every query: "macro photograph"
 */
const DEFAULT_PLACEMENTS = [2, 5, 9];

function buildSearchQuery(englishTerm) {
	const cleaned = englishTerm.trim().replace(/\s+/g, ' ');
	return `macro photograph ${cleaned}`;
}

function main() {
	const [, , slug, ...terms] = process.argv;
	if (!slug || terms.length < 3) {
		console.error(
			'Usage: node scripts/assign-article-images.mjs <slug> <english-term-1> <english-term-2> <english-term-3>',
		);
		process.exit(1);
	}

	const images = terms.slice(0, 3).map((term, index) => ({
		slot: index + 1,
		searchQuery: buildSearchQuery(term),
		filename: `${slug}-img-${index + 1}-${term.toLowerCase().replace(/\s+/g, '-')}.jpg`,
		placement: { afterParagraph: DEFAULT_PLACEMENTS[index] },
	}));

	console.log(JSON.stringify({ slug, images }, null, 2));
}

main();
