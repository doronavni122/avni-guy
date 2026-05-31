export type RateLimitKind = 'search' | 'list';

export type RateLimitResult = {
	allowed: boolean;
	limit: number;
	remaining: number;
	resetAt: number;
	retryAfterSec: number;
};

type WindowEntry = {
	timestamps: number[];
};

const memoryWindows = new Map<string, WindowEntry>();
let upstashLogged = false;

function envInt(name: string, fallback: number): number {
	const raw = process.env[name];
	if (!raw) return fallback;
	const n = Number.parseInt(raw, 10);
	return Number.isFinite(n) && n > 0 ? n : fallback;
}

export function getMaxQueryChars(): number {
	return envInt('RAG_MAX_QUERY_CHARS', 300);
}

function perMinuteLimit(kind: RateLimitKind): number {
	if (kind === 'list') return envInt('RAG_RATE_LIMIT_LIST_PER_MINUTE', 30);
	return envInt('RAG_RATE_LIMIT_PER_MINUTE', 10);
}

function perDayLimit(): number {
	return envInt('RAG_RATE_LIMIT_PER_DAY', 200);
}

function globalDailyCap(): number {
	return envInt('RAG_GLOBAL_DAILY_CAP', 5000);
}

export function getClientIp(request: Request): string {
	const forwarded = request.headers.get('x-forwarded-for');
	if (forwarded) {
		return forwarded.split(',')[0]?.trim() || 'unknown';
	}
	const realIp = request.headers.get('x-real-ip');
	if (realIp) return realIp.trim();
	return 'unknown';
}

function memoryRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
	const now = Date.now();
	const entry = memoryWindows.get(key) ?? { timestamps: [] };
	entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

	if (entry.timestamps.length >= limit) {
		const oldest = entry.timestamps[0] ?? now;
		const resetAt = oldest + windowMs;
		const retryAfterSec = Math.max(1, Math.ceil((resetAt - now) / 1000));
		memoryWindows.set(key, entry);
		return {
			allowed: false,
			limit,
			remaining: 0,
			resetAt,
			retryAfterSec,
		};
	}

	entry.timestamps.push(now);
	memoryWindows.set(key, entry);
	return {
		allowed: true,
		limit,
		remaining: Math.max(0, limit - entry.timestamps.length),
		resetAt: now + windowMs,
		retryAfterSec: 0,
	};
}

async function upstashRateLimit(
	key: string,
	limit: number,
	windowSec: number,
): Promise<RateLimitResult | null> {
	const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
	const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
	if (!url || !token) {
		if (!upstashLogged) {
			console.log('[rag:rate-limit] Upstash not configured, using in-process limits');
			upstashLogged = true;
		}
		return null;
	}

	try {
		const { Ratelimit } = await import('@upstash/ratelimit');
		const { Redis } = await import('@upstash/redis');
		const redis = new Redis({ url, token });
		const ratelimit = new Ratelimit({
			redis,
			limiter: Ratelimit.slidingWindow(limit, `${windowSec} s`),
			prefix: 'rag',
		});
		const result = await ratelimit.limit(key);
		const resetAt = result.reset;
		const retryAfterSec = Math.max(0, Math.ceil((resetAt - Date.now()) / 1000));
		return {
			allowed: result.success,
			limit,
			remaining: result.remaining,
			resetAt,
			retryAfterSec,
		};
	} catch (err) {
		console.error('[rag:rate-limit] Upstash check failed', err);
		return null;
	}
}

async function applyLimit(
	key: string,
	limit: number,
	windowSec: number,
): Promise<RateLimitResult> {
	const upstash = await upstashRateLimit(key, limit, windowSec);
	if (upstash) return upstash;
	return memoryRateLimit(key, limit, windowSec * 1000);
}

export async function checkRateLimit(
	request: Request,
	kind: RateLimitKind,
): Promise<RateLimitResult> {
	const ip = getClientIp(request);
	const minuteKey = `${kind}:${ip}:minute`;
	const minute = await applyLimit(minuteKey, perMinuteLimit(kind), 60);

	if (!minute.allowed) return minute;

	if (kind === 'search') {
		const dayKey = `search:${ip}:day`;
		const day = await applyLimit(dayKey, perDayLimit(), 86_400);
		if (!day.allowed) return day;

		const globalKey = 'search:global:day';
		const global = await applyLimit(globalKey, globalDailyCap(), 86_400);
		if (!global.allowed) return global;
	}

	return minute;
}

export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
	return {
		'X-Ratelimit-Limit': String(result.limit),
		'X-Ratelimit-Remaining': String(result.remaining),
		'X-Ratelimit-Reset': String(Math.ceil(result.resetAt / 1000)),
		...(result.allowed ? {} : { 'Retry-After': String(result.retryAfterSec) }),
	};
}
