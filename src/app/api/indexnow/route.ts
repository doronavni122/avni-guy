import { z } from 'zod';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

const bodySchema = z.object({
	urls: z.array(z.string().url()).min(1).max(100),
});

function readIndexNowKey(): string | null {
	try {
		const key = process.env.INDEXNOW_KEY?.trim();
		return key || null;
	} catch (err) {
		console.error('[api/indexnow] readIndexNowKey failed', err);
		return null;
	}
}

export async function POST(request: Request) {
	try {
		const key = readIndexNowKey();
		if (!key) {
			console.error('[api/indexnow] INDEXNOW_KEY unset');
			return NextResponse.json({ error: 'IndexNow not configured.' }, { status: 503 });
		}

		let raw: unknown;
		try {
			raw = await request.json();
		} catch (err) {
			console.error('[api/indexnow] invalid JSON', err);
			return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
		}

		const parsed = bodySchema.safeParse(raw);
		if (!parsed.success) {
			console.error('[api/indexnow] validation failed', parsed.error.flatten());
			return NextResponse.json({ error: 'Invalid URL list.' }, { status: 400 });
		}

		const host = new URL(parsed.data.urls[0]).host;
		const payload = {
			host,
			key,
			keyLocation: `https://${host}/${key}.txt`,
			urlList: parsed.data.urls,
		};

		const res = await fetch(INDEXNOW_ENDPOINT, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json; charset=utf-8' },
			body: JSON.stringify(payload),
		});

		if (!res.ok) {
			const text = await res.text().catch(() => '');
			console.error('[api/indexnow] upstream failed', { status: res.status, text });
			return NextResponse.json({ error: 'IndexNow upstream error.' }, { status: 502 });
		}

		return NextResponse.json({ ok: true, count: parsed.data.urls.length });
	} catch (err) {
		console.error('[api/indexnow] POST unhandled error', err);
		return NextResponse.json({ error: 'Internal error.' }, { status: 500 });
	}
}
