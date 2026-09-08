import { createHash, randomBytes } from 'node:crypto';

/**
 * @param {number} [bytes]
 */
export function randomUrlSafe(bytes = 32) {
	try {
		return randomBytes(bytes).toString('base64url');
	} catch (err) {
		console.error('[social-oauth:randomUrlSafe]', { err: String(err) });
		throw err;
	}
}

/**
 * RFC 7636 S256 PKCE pair.
 */
export function createPkcePair() {
	try {
		const verifier = randomUrlSafe(32);
		const challenge = createHash('sha256').update(verifier).digest('base64url');
		return { verifier, challenge, method: 'S256' };
	} catch (err) {
		console.error('[social-oauth:createPkcePair]', { err: String(err) });
		throw err;
	}
}

/**
 * @param {string} verifier
 */
export function challengeFromVerifier(verifier) {
	return createHash('sha256').update(verifier).digest('base64url');
}
