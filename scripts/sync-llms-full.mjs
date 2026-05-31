#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { loadMainPageDocuments, loadMdxDocuments, SITE_URL } from './lib/mdx-ingest.mjs';
import { stripMarkdownForEmbed } from './lib/chunk-hebrew.mjs';

const OUTPUT_PATH = path.join(process.cwd(), 'public/llms-full.txt');

function logStep(message, details) {
	if (details !== undefined) {
		console.log(`[sync:llms-full] ${message}`, details);
		return;
	}
	console.log(`[sync:llms-full] ${message}`);
}

function formatPage(title, url, body) {
	return `## ${title}\n\nURL: ${url}\n\n${body}\n`;
}

async function main() {
	logStep('loading documents');
	const mdxDocs = await loadMdxDocuments();
	const heroDocs = loadMainPageDocuments();
	const allDocs = [...heroDocs, ...mdxDocs];

	const sections = allDocs.map((doc) => {
		const body = stripMarkdownForEmbed(doc.text);
		return formatPage(doc.title, doc.url, body);
	});

	const body = `# גיא אבני עו״ד: תוכן מלא לאינדוקס AI

> מאגר תוכן מלא של האתר לשימוש בכלי AI.
> התוכן הוא למידע כללי בלבד ואינו מהווה ייעוץ משפטי אישי.
> מקור: ${SITE_URL}

${sections.join('\n---\n\n')}
`;

	await fs.writeFile(OUTPUT_PATH, body, 'utf8');
	logStep('written', { path: OUTPUT_PATH, pages: allDocs.length, chars: body.length });
}

main().catch((err) => {
	console.error('[sync:llms-full] fatal error', err);
	process.exit(1);
});
