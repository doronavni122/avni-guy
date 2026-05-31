const OPENAI_EMBED_URL = 'https://api.openai.com/v1/embeddings';
const DEFAULT_MODEL = 'text-embedding-3-small';
const BATCH_SIZE = 64;

/**
 * @param {string} apiKey
 * @param {string[]} inputs
 * @param {string} [model]
 * @returns {Promise<number[][]>}
 */
export async function embedTexts(apiKey, inputs, model = DEFAULT_MODEL) {
	if (!apiKey) {
		throw new Error('OPENAI_API_KEY is required for embeddings');
	}
	if (inputs.length === 0) return [];

	const allEmbeddings = [];

	for (let i = 0; i < inputs.length; i += BATCH_SIZE) {
		const batch = inputs.slice(i, i + BATCH_SIZE);
		let response;
		try {
			response = await fetch(OPENAI_EMBED_URL, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${apiKey}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ model, input: batch }),
			});
		} catch (err) {
			console.error('[openai-embeddings] fetch failed', { batchStart: i, err });
			throw err;
		}

		if (!response.ok) {
			const body = await response.text();
			console.error('[openai-embeddings] API error', { status: response.status, body });
			throw new Error(`OpenAI embeddings failed: ${response.status}`);
		}

		let json;
		try {
			json = await response.json();
		} catch (err) {
			console.error('[openai-embeddings] JSON parse failed', err);
			throw err;
		}

		const sorted = [...json.data].sort((a, b) => a.index - b.index);
		for (const item of sorted) {
			allEmbeddings.push(item.embedding);
		}
	}

	return allEmbeddings;
}

export { DEFAULT_MODEL as OPENAI_EMBED_MODEL_DEFAULT };
