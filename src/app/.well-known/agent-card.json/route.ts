import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const dynamic = 'force-static';

const AGENT_CARD_PATH = path.join(process.cwd(), 'public', 'agent-card.json');

export async function GET() {
	try {
		const body = await readFile(AGENT_CARD_PATH, 'utf8');
		return new Response(body, {
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				'Cache-Control': 'public, max-age=3600, s-maxage=86400',
			},
		});
	} catch (err) {
		console.error('[.well-known/agent-card.json] GET failed', { err });
		return new Response(JSON.stringify({ error: 'agent card unavailable' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json; charset=utf-8' },
		});
	}
}