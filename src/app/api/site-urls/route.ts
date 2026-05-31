import { NextResponse } from 'next/server';
import { isSearchAvailable, listIndexUrls } from '@/lib/rag/load-index';
import { checkRateLimit, rateLimitHeaders } from '@/lib/rag/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
	try {
		const rate = await checkRateLimit(request, 'list');
		const headers = rateLimitHeaders(rate);
		if (!rate.allowed) {
			return NextResponse.json(
				{ error: 'חרגת ממגבלת הבקשות.' },
				{ status: 429, headers },
			);
		}

		if (!(await isSearchAvailable())) {
			return NextResponse.json({ error: 'אינדקס לא זמין.' }, { status: 503, headers });
		}

		const sectionParam = new URL(request.url).searchParams.get('section');
		const section =
			sectionParam === 'blog' || sectionParam === 'main' ? sectionParam : undefined;

		const urls = await listIndexUrls(section);
		return NextResponse.json({ count: urls.length, urls }, { headers });
	} catch (err) {
		console.error('[api/site-urls] GET failed', err);
		return NextResponse.json({ error: 'שגיאה פנימית.' }, { status: 500 });
	}
}
