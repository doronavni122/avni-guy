import type { BlogFrontmatter } from './schema';
import { DEFAULT_IMAGE_PLACEMENTS } from './images';

function escapeMdxAttr(value: string): string {
	return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function figureComponent(image: BlogFrontmatter['images'][number], index: number): string {
	const src = escapeMdxAttr(image.src);
	const alt = escapeMdxAttr(image.alt);
	const title = escapeMdxAttr(image.title);
	return `<ArticleFigure src="${src}" alt="${alt}" title="${title}" index={${index}} />`;
}

/**
 * Inserts ArticleFigure components after configured paragraph boundaries in MDX body.
 */
export function injectArticleFigures(
	content: string,
	images: BlogFrontmatter['images'],
): string {
	if (images.length === 0) {
		return content;
	}

	const blocks = content.split(/\n\n+/);
	const insertions = new Map<number, string[]>();

	for (let i = 0; i < images.length; i++) {
		const image = images[i];
		const afterParagraph =
			image.placement?.afterParagraph ?? DEFAULT_IMAGE_PLACEMENTS[i] ?? i + 2;
		const insertAt = Math.min(Math.max(afterParagraph, 1), blocks.length);
		const existing = insertions.get(insertAt) ?? [];
		existing.push(figureComponent(image, i));
		insertions.set(insertAt, existing);
	}

	const result: string[] = [];
	for (let i = 0; i < blocks.length; i++) {
		result.push(blocks[i]);
		const toInsert = insertions.get(i + 1);
		if (toInsert) {
			result.push(...toInsert);
		}
	}

	// Append any figures scheduled beyond last paragraph
	for (const [idx, comps] of insertions) {
		if (idx > blocks.length) {
			result.push(...comps);
		}
	}

	return result.join('\n\n');
}
