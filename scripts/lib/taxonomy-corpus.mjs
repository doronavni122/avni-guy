import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import fg from 'fast-glob';

const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog');
const TAXONOMY_LABELS_PATH = path.join(process.cwd(), 'src', 'utils', 'taxonomy-labels.ts');

function logErr(message, extra) {
	console.error(`[taxonomy-corpus] ERROR ${message}`, extra ?? '');
}

/** @returns {Set<string>} */
function parseRecordKeys(source, recordName) {
	const blockRe = new RegExp(`export const ${recordName}[^=]+=\\s*\\{([\\s\\S]*?)\\n\\};`, 'm');
	const block = source.match(blockRe)?.[1] ?? '';
	const keys = new Set();
	for (const match of block.matchAll(/^\t'?([a-z0-9-]+)'?:/gm)) {
		keys.add(match[1]);
	}
	return keys;
}

/**
 * Scan blog MDX frontmatter for unique category and tag slugs.
 * @returns {{ categories: string[], tags: string[] }}
 */
export function loadTaxonomyCorpus() {
	const categories = new Set();
	const tags = new Set();
	let files;
	try {
		files = fg.sync('*.mdx', { cwd: BLOG_DIR, absolute: true });
	} catch (err) {
		logErr('loadTaxonomyCorpus glob failed', err);
		throw err;
	}
	for (const filePath of files) {
		try {
			const raw = fs.readFileSync(filePath, 'utf8');
			const { data } = matter(raw);
			if (typeof data.category === 'string' && data.category.trim()) {
				categories.add(data.category.trim());
			}
			if (Array.isArray(data.tags)) {
				for (const tag of data.tags) {
					if (typeof tag === 'string' && tag.trim()) tags.add(tag.trim());
				}
			}
		} catch (err) {
			logErr('loadTaxonomyCorpus read failed', { filePath, err });
			throw err;
		}
	}
	return {
		categories: [...categories].sort(),
		tags: [...tags].sort(),
	};
}

/**
 * Parse TAG_LABELS / CATEGORY_LABELS keys from taxonomy-labels.ts.
 * @returns {{ tagKeys: Set<string>, categoryKeys: Set<string> }}
 */
export function loadLabelKeys() {
	let source;
	try {
		source = fs.readFileSync(TAXONOMY_LABELS_PATH, 'utf8');
	} catch (err) {
		logErr('loadLabelKeys read failed', { path: TAXONOMY_LABELS_PATH, err });
		throw err;
	}
	return {
		tagKeys: parseRecordKeys(source, 'TAG_LABELS'),
		categoryKeys: parseRecordKeys(source, 'CATEGORY_LABELS'),
	};
}

/**
 * @returns {{ ok: boolean, missingCategories: string[], missingTags: string[], categories: string[], tags: string[] }}
 */
export function findMissingLabels() {
	const corpus = loadTaxonomyCorpus();
	const { tagKeys, categoryKeys } = loadLabelKeys();
	const missingCategories = corpus.categories.filter((slug) => !categoryKeys.has(slug));
	const missingTags = corpus.tags.filter((slug) => !tagKeys.has(slug));
	return {
		ok: missingCategories.length === 0 && missingTags.length === 0,
		missingCategories,
		missingTags,
		categories: corpus.categories,
		tags: corpus.tags,
	};
}
