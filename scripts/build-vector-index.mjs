#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { chunkText } from './lib/chunk-hebrew.mjs';
import { embedTexts, OPENAI_EMBED_MODEL_DEFAULT } from './lib/openai-embeddings.mjs';
import {
	findExtractGapUrls,
	loadMainPageDocuments,
	loadMdxDocuments,
	SITE_URL,
} from './lib/mdx-ingest.mjs';
import { extractUrls, mapSite } from './lib/tavily-client.mjs';

const INDEX_PATH = path.join(process.cwd(), 'data/vector-index.json');
const EMBED_MODEL = process.env.OPENAI_EMBED_MODEL ?? OPENAI_EMBED_MODEL_DEFAULT;

function logStep(message, details) {
	if (details !== undefined) {
		console.log(`[vector:index] ${message}`, details);
		return;
	}
	console.log(`[vector:index] ${message}`);
}

/**
 * @param {Array<{ id: string; title: string; url: string; text: string; source: string }>} documents
 * @returns {Array<{ id: string; title: string; url: string; text: string; source: string }>}
 */
function documentsToChunks(documents) {
	const chunks = [];
	for (const doc of documents) {
		const parts = chunkText(doc.text);
		parts.forEach((text, index) => {
			chunks.push({
				id: `${doc.id}#${index}`,
				title: doc.title,
				url: doc.url,
				text,
				source: doc.source,
			});
		});
	}
	return chunks;
}

async function main() {
	const tavilyKey = process.env.TAVILY_API_KEY?.trim();
	const openaiKey = process.env.OPENAI_API_KEY?.trim();

	if (!openaiKey) {
		console.error('[vector:index] ERROR: OPENAI_API_KEY missing');
		process.exit(1);
	}
	if (!tavilyKey) {
		console.error('[vector:index] ERROR: TAVILY_API_KEY missing');
		process.exit(1);
	}

	logStep('step 1: loading MDX documents');
	const mdxDocs = await loadMdxDocuments();
	logStep('step 2: loading main page heroes');
	const heroDocs = loadMainPageDocuments();
	const documents = [...mdxDocs, ...heroDocs];
	const coveredUrls = new Set(documents.map((d) => d.url));

	logStep('step 3: Tavily map', { siteUrl: SITE_URL });
	let mappedUrls = [];
	try {
		mappedUrls = await mapSite(tavilyKey, SITE_URL);
	} catch (err) {
		console.error('[vector:index] map failed, continuing with MDX only', err);
	}

	const gapUrls = findExtractGapUrls(mappedUrls, coveredUrls);
	logStep('coverage report', {
		mapped: mappedUrls.length,
		mdx: mdxDocs.length,
		hero: heroDocs.length,
		extractGaps: gapUrls.length,
		gaps: gapUrls,
	});

	if (gapUrls.length > 0) {
		logStep('step 4: Tavily extract for main page gaps');
		try {
			const extracted = await extractUrls(tavilyKey, gapUrls);
			for (const item of extracted) {
				const pathname = new URL(item.url).pathname;
				const id = `extract${pathname.replace(/\//g, '-')}`;
				documents.push({
					id,
					title: pathname,
					url: item.url.endsWith('/') ? item.url : `${item.url}/`,
					text: item.rawContent,
					source: 'tavily-extract',
				});
			}
		} catch (err) {
			console.error('[vector:index] extract failed, continuing', err);
		}
	}

	logStep('step 5: chunking documents', { documents: documents.length });
	const textChunks = documentsToChunks(documents);
	if (textChunks.length === 0) {
		console.error('[vector:index] ERROR: no chunks produced');
		process.exit(1);
	}

	logStep('step 6: embedding chunks', { chunks: textChunks.length, model: EMBED_MODEL });
	let embeddings;
	try {
		embeddings = await embedTexts(
			openaiKey,
			textChunks.map((c) => c.text),
			EMBED_MODEL,
		);
	} catch (err) {
		console.error('[vector:index] embedding failed', err);
		process.exit(1);
	}

	const dimensions = embeddings[0]?.length ?? 0;
	const index = {
		version: 1,
		builtAt: new Date().toISOString(),
		model: EMBED_MODEL,
		dimensions,
		chunks: textChunks.map((chunk, i) => ({
			id: chunk.id,
			text: chunk.text,
			url: chunk.url,
			title: chunk.title,
			source: chunk.source,
			embedding: embeddings[i],
		})),
	};

	await fs.mkdir(path.dirname(INDEX_PATH), { recursive: true });
	await fs.writeFile(INDEX_PATH, JSON.stringify(index), 'utf8');
	logStep('step 7: index written', {
		path: INDEX_PATH,
		chunks: index.chunks.length,
		dimensions,
	});
}

main().catch((err) => {
	console.error('[vector:index] fatal error', err);
	process.exit(1);
});
