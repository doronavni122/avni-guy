import { z } from 'zod';
import { NextResponse } from 'next/server';
import { SITE_URL } from '@/consts';

export const dynamic = 'force-dynamic';

const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const ALLOWED_HOST = new URL(SITE_URL).host;

const actionSchema = z.enum(['update', 'redirect', 'gone']);

const bodySchema = z.object({
	urls: z.array(z.string().url()).min(1).max(100),
	action: actionSchema.optional(),
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

function urlsMatchSiteHost(urls: string[]): { ok: true } | { ok: false; bad: string } {
	for (const url of urls) {
		try {
			const host = new URL(url).host;
			if (host !== ALLOWED_HOST) {
				return { ok: false, bad: url };
			}
		} catch (err) {
			console.error('[api/indexnow] url parse failed', { url, err });
			return { ok: false, bad: url };
		}
	}
	return { ok: true };
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

		const hostCheck = urlsMatchSiteHost(parsed.data.urls);
		if (!hostCheck.ok) {
			console.error('[api/indexnow] host mismatch', { bad: hostCheck.bad, allowed: ALLOWED_HOST });
			return NextResponse.json({ error: 'URL host not allowed.' }, { status: 400 });
		}

		const action = parsed.data.action ?? 'update';
		const host = ALLOWED_HOST;
		const payload = {
			host,
			key,
			keyLocation: `https://${host}/${key}.txt`,
			urlList: parsed.data.urls,
		};

		console.error('[api/indexnow] upstream request', {
			action,
			count: parsed.data.urls.length,
			host,
		});

		const res = await fetch(INDEXNOW_ENDPOINT, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json; charset=utf-8' },
			body: JSON.stringify(payload),
		});

		if (!res.ok) {
			const text = await res.text().catch(() => '');
			console.error('[api/indexnow] upstream failed', {
				action,
				status: res.status,
				text,
			});
			return NextResponse.json({ error: 'IndexNow upstream error.' }, { status: 502 });
		}

		return NextResponse.json({
			ok: true,
			action,
			count: parsed.data.urls.length,
		});
	} catch (err) {
		console.error('[api/indexnow] POST unhandled error', err);
		return NextResponse.json({ error: 'Internal error.' }, { status: 500 });
	}
}
