/**
 * Paragraph-first text chunking for Hebrew/RTL content.
 */

const DEFAULT_CHUNK_SIZE = 800;
const DEFAULT_OVERLAP = 100;

/**
 * Strip MDX/markdown noise for embedding.
 * @param {string} text
 * @returns {string}
 */
export function stripMarkdownForEmbed(text) {
	if (!text) return '';
	return text
		.replace(/^---[\s\S]*?---\n/m, '')
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/`[^`]+`/g, ' ')
		.replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/^#{1,6}\s+/gm, '')
		.replace(/^\s*[-*+]\s+/gm, '')
		.replace(/\s+/g, ' ')
		.trim();
}

/**
 * @param {string} text
 * @param {{ chunkSize?: number; overlap?: number }} [opts]
 * @returns {string[]}
 */
export function chunkText(text, opts = {}) {
	const chunkSize = opts.chunkSize ?? DEFAULT_CHUNK_SIZE;
	const overlap = opts.overlap ?? DEFAULT_OVERLAP;
	const cleaned = stripMarkdownForEmbed(text);
	if (!cleaned) return [];

	const paragraphs = cleaned.split(/\n{2,}|\.\s+/).map((p) => p.trim()).filter(Boolean);
	const chunks = [];
	let current = '';

	for (const para of paragraphs) {
		if (current.length + para.length + 1 <= chunkSize) {
			current = current ? `${current} ${para}` : para;
			continue;
		}
		if (current) chunks.push(current);
		if (para.length <= chunkSize) {
			current = para;
			continue;
		}
		let start = 0;
		while (start < para.length) {
			const end = Math.min(start + chunkSize, para.length);
			chunks.push(para.slice(start, end));
			if (end >= para.length) break;
			start = end - overlap;
		}
		current = '';
	}
	if (current) chunks.push(current);

	if (chunks.length === 0 && cleaned.length > 0) {
		let start = 0;
		while (start < cleaned.length) {
			const end = Math.min(start + chunkSize, cleaned.length);
			chunks.push(cleaned.slice(start, end));
			if (end >= cleaned.length) break;
			start = end - overlap;
		}
	}

	return chunks.filter((c) => c.length >= 40);
}
