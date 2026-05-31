import { cosineSimilarity } from './cosine';
import { loadVectorIndex } from './load-index';
import type { SearchResult } from './types';

const OPENAI_EMBED_URL = 'https://api.openai.com/v1/embeddings';
const DEFAULT_MODEL = process.env.OPENAI_EMBED_MODEL ?? 'text-embedding-3-small';

async function embedQuery(query: string): Promise<number[] | null> {
	const apiKey = process.env.OPENAI_API_KEY?.trim();
	if (!apiKey) {
		console.error('[rag:search] OPENAI_API_KEY missing');
		return null;
	}

	let response: Response;
	try {
		response = await fetch(OPENAI_EMBED_URL, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ model: DEFAULT_MODEL, input: query }),
		});
	} catch (err) {
		console.error('[rag:search] embed fetch failed', err);
		return null;
	}

	if (!response.ok) {
		const body = await response.text();
		console.error('[rag:search] embed API error', { status: response.status, body });
		return null;
	}

	try {
		const json = (await response.json()) as { data: Array<{ embedding: number[] }> };
		return json.data[0]?.embedding ?? null;
	} catch (err) {
		console.error('[rag:search] embed JSON parse failed', err);
		return null;
	}
}

export async function searchVectorIndex(query: string, limit = 5): Promise<SearchResult[]> {
	const index = await loadVectorIndex();
	if (!index) {
		console.error('[rag:search] index not available');
		return [];
	}

	const queryEmbedding = await embedQuery(query);
	if (!queryEmbedding) return [];

	const scored = index.chunks.map((chunk) => ({
		id: chunk.id,
		url: chunk.url,
		title: chunk.title,
		snippet: chunk.text.slice(0, 280),
		score: cosineSimilarity(queryEmbedding, chunk.embedding),
	}));

	scored.sort((a, b) => b.score - a.score);

	const seen = new Set<string>();
	const results: SearchResult[] = [];
	for (const item of scored) {
		if (seen.has(item.url)) continue;
		seen.add(item.url);
		results.push(item);
		if (results.length >= limit) break;
	}

	return results;
}
