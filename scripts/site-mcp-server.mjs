#!/usr/bin/env node
/**
 * Stdio MCP server proxying avniguy site search REST API.
 * Cursor config: node scripts/site-mcp-server.mjs (env SITE_URL)
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const SITE_URL = (process.env.SITE_URL ?? 'http://localhost:3001').replace(/\/$/, '');

function logStep(message, details) {
	if (details !== undefined) {
		console.error(`[mcp:site] ${message}`, details);
		return;
	}
	console.error(`[mcp:site] ${message}`);
}

async function searchSite(query, limit = 6) {
	const url = `${SITE_URL}/api/search/`;
	let response;
	try {
		response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ query, limit }),
		});
	} catch (err) {
		logStep('search fetch failed', err);
		throw err;
	}

	let data;
	try {
		data = await response.json();
	} catch (err) {
		logStep('search JSON parse failed', err);
		throw err;
	}

	if (!response.ok) {
		throw new Error(data?.error ?? `Search failed: ${response.status}`);
	}

	return data;
}

async function listSiteUrls(section) {
	const params = new URLSearchParams();
	if (section) params.set('section', section);
	const url = `${SITE_URL}/api/site-urls/?${params.toString()}`;

	let response;
	try {
		response = await fetch(url);
	} catch (err) {
		logStep('list-urls fetch failed, falling back to search index unavailable message', err);
		return { count: 0, urls: [], note: 'list-urls helper unavailable; use search_site instead.' };
	}

	if (!response.ok) {
		return { count: 0, urls: [], note: `list-urls returned ${response.status}` };
	}

	return response.json();
}

async function main() {
	logStep('starting stdio MCP', { siteUrl: SITE_URL });

	const server = new McpServer({ name: 'avniguy-site-local', version: '1.0.0' });

	server.registerTool(
		'search_site',
		{
			description: 'Semantic search over avniguy.co.il content via REST API.',
			inputSchema: {
				query: z.string().min(2).max(500),
				limit: z.number().int().min(1).max(10).optional(),
			},
		},
		async ({ query, limit }) => {
			try {
				const data = await searchSite(query, limit ?? 6);
				return {
					content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
				};
			} catch (err) {
				logStep('search_site tool error', err);
				return {
					content: [{ type: 'text', text: err instanceof Error ? err.message : 'search failed' }],
					isError: true,
				};
			}
		},
	);

	server.registerTool(
		'list_site_urls',
		{
			description: 'List indexed site URLs (blog or main sections).',
			inputSchema: {
				section: z.enum(['blog', 'main']).optional(),
			},
		},
		async ({ section }) => {
			try {
				const data = await listSiteUrls(section);
				return {
					content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
				};
			} catch (err) {
				logStep('list_site_urls tool error', err);
				return {
					content: [{ type: 'text', text: err instanceof Error ? err.message : 'list failed' }],
					isError: true,
				};
			}
		},
	);

	const transport = new StdioServerTransport();
	await server.connect(transport);
	logStep('stdio MCP connected');
}

main().catch((err) => {
	console.error('[mcp:site] fatal error', err);
	process.exit(1);
});
