/** U+2014 em dash → ASCII hyphen in user-facing copy. */
export const EM_DASH = '\u2014';

const EM_DASH_RE = /\u2014/g;

/** Replace every em dash (—) with a hyphen (-) in a string. */
export function replaceEmDashInText(text: string): string {
	if (!text.includes(EM_DASH)) return text;
	return text.replace(EM_DASH_RE, '-');
}

/** Recursively replace em dashes in all string leaves (objects, arrays, primitives). */
export function replaceEmDashDeep<T>(value: T): T {
	if (typeof value === 'string') return replaceEmDashInText(value) as T;
	if (Array.isArray(value)) return value.map((item) => replaceEmDashDeep(item)) as T;
	if (value instanceof Date) return value;
	if (value !== null && typeof value === 'object') {
		const out: Record<string, unknown> = {};
		for (const [key, nested] of Object.entries(value)) {
			out[key] = replaceEmDashDeep(nested);
		}
		return out as T;
	}
	return value;
}
