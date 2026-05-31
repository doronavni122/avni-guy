#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const INDEX_PATH = path.join(process.cwd(), 'data/vector-index.json');

function logStep(message, details) {
	if (details !== undefined) {
		console.log(`[vector:audit] ${message}`, details);
		return;
	}
	console.log(`[vector:audit] ${message}`);
}

async function main() {
	let raw;
	try {
		raw = await fs.readFile(INDEX_PATH, 'utf8');
	} catch (err) {
		console.error('[vector:audit] ERROR: index file missing', { path: INDEX_PATH, err });
		process.exit(1);
	}

	let index;
	try {
		index = JSON.parse(raw);
	} catch (err) {
		console.error('[vector:audit] ERROR: invalid JSON', err);
		process.exit(1);
	}

	const chunks = index.chunks ?? [];
	if (chunks.length === 0) {
		console.error('[vector:audit] ERROR: empty index');
		process.exit(1);
	}

	const dims = index.dimensions ?? chunks[0]?.embedding?.length ?? 0;
	const bad = chunks.filter((c) => !c.embedding || c.embedding.length !== dims);
	if (bad.length > 0) {
		console.error('[vector:audit] ERROR: dimension mismatch', { bad: bad.length, expected: dims });
		process.exit(1);
	}

	const urls = new Set(chunks.map((c) => c.url));
	logStep('OK', {
		chunks: chunks.length,
		uniqueUrls: urls.size,
		model: index.model,
		builtAt: index.builtAt,
		dimensions: dims,
	});
}

main().catch((err) => {
	console.error('[vector:audit] fatal error', err);
	process.exit(1);
});
