import { PORTAL_URLS, GMAIL_LOGIN_TIMEOUT_MS } from './constants.mjs';
import { waitUntil } from './wait.mjs';

/**
 * @param {string} url
 */
export function isGmailInboxUrl(url) {
	try {
		const u = String(url || '');
		if (/accounts\.google\.com/i.test(u)) return false;
		return /mail\.google\.com\/mail/i.test(u);
	} catch (err) {
		console.error('[social-oauth:isGmailInboxUrl]', { err: String(err) });
		return false;
	}
}

/**
 * Opens Gmail and waits until the headed window is past the login wall.
 * @param {{ page: import('@playwright/test').Page, logger: { logStep: Function }, timeoutMs?: number }} opts
 */
export async function waitForGmailLogin(opts) {
	const { page, logger } = opts;
	const timeoutMs = opts.timeoutMs ?? GMAIL_LOGIN_TIMEOUT_MS;
	logger.logStep('info', 'gmail-login', null, 'headed window: sign in to the owner Gmail if prompted');
	try {
		await page.goto(PORTAL_URLS.gmail, { waitUntil: 'domcontentloaded', timeout: 60000 });
	} catch (err) {
		console.error('[social-oauth:waitForGmailLogin:goto]', { err: String(err) });
		logger.logStep('error', 'gmail-login', null, String(err));
	}
	const ok = await waitUntil({
		timeoutMs,
		intervalMs: 2000,
		fn: () => isGmailInboxUrl(page.url()),
	});
	if (!ok) {
		logger.logStep('error', 'gmail-login', null, 'timeout waiting for inbox');
		throw new Error('gmail login timeout');
	}
	logger.logStep('info', 'gmail-login', null, 'session ok');
	return true;
}
