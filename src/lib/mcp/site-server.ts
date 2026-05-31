import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { listIndexUrls } from '@/lib/rag/load-index';
import { checkRateLimit, rateLimitHeaders } from '@/lib/rag/rate-limit';
import { searchVectorIndex } from '@/lib/rag/search';
import { getMcpRequest } from '@/lib/mcp/request-context';

function rateLimitError(retryAfterSec: number): never {
	const err = new Error(`Rate limit exceeded. Retry after ${retryAfterSec}s.`);
	(err as Error & { retryAfterSec: number }).retryAfterSec = retryAfterSec;
	throw err;
}

async function enforceRateLimit(kind: 'search' | 'list'): Promise<void> {
	const result = await checkRateLimit(getMcpRequest(), kind);
	if (!result.allowed) {
		console.error('[api/mcp] rate limit exceeded', { kind, retryAfterSec: result.retryAfterSec });
		rateLimitError(result.retryAfterSec);
	}
}

export function createSiteMcpServer(): McpServer {
	const server = new McpServer({
		name: 'avniguy-site',
		version: '1.0.0',
	});

	server.registerTool(
		'search_site',
		{
			description: 'Semantic search over avniguy.co.il Hebrew legal content. Returns ranked snippets with source URLs.',
			inputSchema: {
				query: z.string().min(2).max(500),
				limit: z.number().int().min(1).max(10).optional(),
			},
		},
		async ({ query, limit }) => {
			try {
				await enforceRateLimit('search');
				const results = await searchVectorIndex(query, limit ?? 6);
				return {
					content: [
						{
							type: 'text' as const,
							text: JSON.stringify({ query, results }, null, 2),
						},
					],
				};
			} catch (err) {
				console.error('[api/mcp] search_site failed', err);
				const retryAfter = (err as Error & { retryAfterSec?: number }).retryAfterSec;
				const message = retryAfter
					? `Rate limit exceeded. Retry after ${retryAfter} seconds.`
					: err instanceof Error
						? err.message
						: 'search_site failed';
				return {
					content: [{ type: 'text' as const, text: message }],
					isError: true,
				};
			}
		},
	);

	server.registerTool(
		'list_site_urls',
		{
			description: 'List canonical URLs indexed from avniguy.co.il (blog articles and main pages). No embedding cost.',
			inputSchema: {
				section: z.enum(['blog', 'main']).optional(),
			},
		},
		async ({ section }) => {
			try {
				await enforceRateLimit('list');
				const urls = await listIndexUrls(section);
				return {
					content: [
						{
							type: 'text' as const,
							text: JSON.stringify({ count: urls.length, urls }, null, 2),
						},
					],
				};
			} catch (err) {
				console.error('[api/mcp] list_site_urls failed', err);
				return {
					content: [
						{
							type: 'text' as const,
							text: err instanceof Error ? err.message : 'list_site_urls failed',
						},
					],
					isError: true,
				};
			}
		},
	);

	return server;
}
