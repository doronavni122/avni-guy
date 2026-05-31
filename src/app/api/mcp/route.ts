import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { createSiteMcpServer } from '@/lib/mcp/site-server';
import { mcpRequestStore } from '@/lib/mcp/request-context';
import { isSearchAvailable } from '@/lib/rag/load-index';

export const dynamic = 'force-dynamic';

let transport: WebStandardStreamableHTTPServerTransport | null = null;
let initPromise: Promise<void> | null = null;

async function ensureMcpReady(): Promise<WebStandardStreamableHTTPServerTransport> {
	if (transport) return transport;

	if (!initPromise) {
		initPromise = (async () => {
			transport = new WebStandardStreamableHTTPServerTransport({
				sessionIdGenerator: undefined,
			});
			const server = createSiteMcpServer();
			await server.connect(transport);
		})().catch((err) => {
			console.error('[api/mcp] initialization failed', err);
			initPromise = null;
			transport = null;
			throw err;
		});
	}

	await initPromise;
	if (!transport) {
		throw new Error('MCP transport failed to initialize');
	}
	return transport;
}

async function handleMcpRequest(request: Request): Promise<Response> {
	try {
		if (!(await isSearchAvailable())) {
			return Response.json(
				{ error: 'MCP search index not available. Run vector:build during deploy.' },
				{ status: 503 },
			);
		}

		const activeTransport = await ensureMcpReady();
		return await mcpRequestStore.run({ request }, () => activeTransport.handleRequest(request));
	} catch (err) {
		console.error('[api/mcp] handleMcpRequest failed', err);
		return Response.json({ error: 'MCP internal error.' }, { status: 500 });
	}
}

export async function GET(request: Request) {
	return handleMcpRequest(request);
}

export async function POST(request: Request) {
	return handleMcpRequest(request);
}

export async function DELETE(request: Request) {
	return handleMcpRequest(request);
}
