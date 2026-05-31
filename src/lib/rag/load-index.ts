import fs from 'node:fs/promises';
import path from 'node:path';
import type { VectorIndex } from './types';

const INDEX_PATH = path.join(process.cwd(), 'data/vector-index.json');

let cachedIndex: VectorIndex | null = null;
let indexExistsCache: boolean | null = null;

export async function isSearchAvailable(): Promise<boolean> {
	if (indexExistsCache === true) return true;
	try {
		await fs.access(INDEX_PATH);
		indexExistsCache = true;
		return true;
	} catch {
		indexExistsCache = false;
		return false;
	}
}

export async function loadVectorIndex(): Promise<VectorIndex | null> {
	if (cachedIndex) return cachedIndex;
	try {
		const raw = await fs.readFile(INDEX_PATH, 'utf8');
		cachedIndex = JSON.parse(raw) as VectorIndex;
		indexExistsCache = true;
		return cachedIndex;
	} catch (err) {
		console.error('[rag:load-index] failed to load index', err);
		indexExistsCache = false;
		return null;
	}
}

export function clearVectorIndexCache(): void {
	cachedIndex = null;
	indexExistsCache = null;
}

export async function listIndexUrls(section?: 'blog' | 'main'): Promise<Array<{ url: string; title: string }>> {
	const index = await loadVectorIndex();
	if (!index) return [];

	const seen = new Set<string>();
	const items: Array<{ url: string; title: string }> = [];

	for (const chunk of index.chunks) {
		if (seen.has(chunk.url)) continue;
		const isBlog = chunk.url.includes('/blog/');
		if (section === 'blog' && !isBlog) continue;
		if (section === 'main' && isBlog) continue;
		seen.add(chunk.url);
		items.push({ url: chunk.url, title: chunk.title });
	}

	return items.sort((a, b) => a.url.localeCompare(b.url));
}
