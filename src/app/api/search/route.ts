import { z } from 'zod';
import { NextResponse } from 'next/server';
import { handleSearchRequest, parseSearchFromUrl } from '@/lib/rag/search-handler';

export const dynamic = 'force-dynamic';

const searchSchema = z.object({
	query: z.string().min(2).max(500),
	limit: z.number().int().min(1).max(10).optional(),
});

export async function GET(request: Request) {
	try {
		const parsed = parseSearchFromUrl(new URL(request.url));
		if (!parsed) {
			return NextResponse.json(
				{ error: 'פרמטר q חסר. דוגמה: /api/search/?q=חוזה' },
				{ status: 400 },
			);
		}
		return handleSearchRequest(request, parsed);
	} catch (err) {
		console.error('[api/search] GET unhandled error', err);
		return NextResponse.json({ error: 'שגיאה פנימית בחיפוש.' }, { status: 500 });
	}
}

export async function POST(request: Request) {
	try {
		let body: unknown;
		try {
			body = await request.json();
		} catch (err) {
			console.error('[api/search] invalid JSON body', err);
			return NextResponse.json({ error: 'גוף הבקשה אינו תקין.' }, { status: 400 });
		}

		const parsed = searchSchema.safeParse(body);
		if (!parsed.success) {
			console.error('[api/search] validation failed', parsed.error.flatten());
			return NextResponse.json({ error: 'פרמטרים לא תקינים.' }, { status: 400 });
		}

		return handleSearchRequest(request, parsed.data);
	} catch (err) {
		console.error('[api/search] POST unhandled error', err);
		return NextResponse.json({ error: 'שגיאה פנימית בחיפוש.' }, { status: 500 });
	}
}
