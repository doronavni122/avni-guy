import { NextResponse } from 'next/server';
import { isSearchAvailable, loadVectorIndex } from '@/lib/rag/load-index';
import { checkRateLimit, getMaxQueryChars, rateLimitHeaders } from '@/lib/rag/rate-limit';
import { searchVectorIndex } from '@/lib/rag/search';

type SearchInput = {
	query: string;
	limit?: number;
};

function validateQuery(raw: string): { ok: true; query: string } | { ok: false; error: string } {
	const query = raw.trim();
	const maxChars = getMaxQueryChars();
	if (query.length < 2) {
		return { ok: false, error: 'שאילתה קצרה מדי.' };
	}
	if (query.length > maxChars) {
		return { ok: false, error: `שאילתה ארוכה מ-${maxChars} תווים.` };
	}
	return { ok: true, query };
}

function validateLimit(limit: unknown): number | undefined {
	if (limit === undefined || limit === null || limit === '') return undefined;
	const n = typeof limit === 'number' ? limit : Number.parseInt(String(limit), 10);
	if (!Number.isFinite(n) || n < 1 || n > 10) return undefined;
	return n;
}

export async function handleSearchRequest(request: Request, input: SearchInput): Promise<NextResponse> {
	const rate = await checkRateLimit(request, 'search');
	const headers = rateLimitHeaders(rate);
	if (!rate.allowed) {
		return NextResponse.json(
			{ error: 'חרגת ממגבלת הבקשות. נסו שוב מאוחר יותר.' },
			{ status: 429, headers },
		);
	}

	if (!(await isSearchAvailable())) {
		return NextResponse.json(
			{ error: 'חיפוש סמנטי אינו זמין כרגע.' },
			{ status: 503, headers },
		);
	}

	const index = await loadVectorIndex();
	if (!index) {
		return NextResponse.json(
			{ error: 'אינדקס החיפוש לא נמצא. הריצו vector:build ב-build.' },
			{ status: 503, headers },
		);
	}

	const validated = validateQuery(input.query);
	if (!validated.ok) {
		return NextResponse.json({ error: validated.error }, { status: 400, headers });
	}

	const limit = input.limit ?? 6;
	const results = await searchVectorIndex(validated.query, limit);

	return NextResponse.json({ query: validated.query, results }, { headers });
}

export function parseSearchFromUrl(url: URL): SearchInput | null {
	const q = url.searchParams.get('q');
	if (!q) return null;
	return {
		query: q,
		limit: validateLimit(url.searchParams.get('limit') ?? undefined),
	};
}

export { validateLimit, validateQuery };
