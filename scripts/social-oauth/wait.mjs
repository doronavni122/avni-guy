/**
 * @param {number} ms
 */
export function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @param {{ timeoutMs: number, intervalMs?: number, fn: () => Promise<boolean>|boolean, onError?: (err: unknown) => void }} opts
 */
export async function waitUntil(opts) {
	const intervalMs = opts.intervalMs ?? 1500;
	const deadline = Date.now() + opts.timeoutMs;
	try {
		while (Date.now() < deadline) {
			try {
				if (await opts.fn()) return true;
			} catch (err) {
				console.error('[social-oauth:waitUntil:tick]', { err: String(err) });
				opts.onError?.(err);
			}
			await sleep(intervalMs);
		}
	} catch (err) {
		console.error('[social-oauth:waitUntil]', { err: String(err) });
		throw err;
	}
	return false;
}
