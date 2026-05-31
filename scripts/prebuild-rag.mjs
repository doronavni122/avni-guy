#!/usr/bin/env node
/**
 * Prebuild hook: sync llms files; build vector index when API keys are present.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ENV_LOCAL = path.join(process.cwd(), '.env.local');

function logStep(message, details) {
	if (details !== undefined) {
		console.log(`[prebuild:rag] ${message}`, details);
		return;
	}
	console.log(`[prebuild:rag] ${message}`);
}

async function setEnvFlag(name, value) {
	const line = `${name}=${value}`;
	let content = '';
	try {
		content = await fs.readFile(ENV_LOCAL, 'utf8');
	} catch {
		// new file
	}
	const pattern = new RegExp(`^${name}=.*$`, 'm');
	if (pattern.test(content)) {
		content = content.replace(pattern, line);
	} else {
		content = content.trimEnd() + (content.length ? '\n' : '') + `${line}\n`;
	}
	try {
		await fs.writeFile(ENV_LOCAL, content, 'utf8');
		logStep('updated .env.local', { line });
	} catch (err) {
		console.error('[prebuild:rag] failed to write .env.local', err);
	}
}

function runNodeScript(script) {
	const result = spawnSync(process.execPath, [script], {
		stdio: 'inherit',
		env: process.env,
	});
	if (result.status !== 0) {
		process.exit(result.status ?? 1);
	}
}

async function main() {
	logStep('running sync:llms');
	runNodeScript('scripts/sync-llms-txt.mjs');

	logStep('running sync:llms-full');
	runNodeScript('scripts/sync-llms-full.mjs');

	const hasOpenAi = Boolean(process.env.OPENAI_API_KEY?.trim());
	const hasTavily = Boolean(process.env.TAVILY_API_KEY?.trim());

	if (hasOpenAi && hasTavily) {
		logStep('API keys present, running vector:build');
		runNodeScript('scripts/build-vector-index.mjs');
		await setEnvFlag('RAG_INDEX_BUILT', 'true');
		logStep('vector index built');
	} else {
		logStep('skipping vector:build (set OPENAI_API_KEY and TAVILY_API_KEY to enable RAG)', {
			hasOpenAi,
			hasTavily,
		});
	}
}

main().catch((err) => {
	console.error('[prebuild:rag] fatal error', err);
	process.exit(1);
});
