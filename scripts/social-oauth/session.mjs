import fs from 'node:fs';
import path from 'node:path';
import { PROFILE_DIR } from './constants.mjs';

/**
 * Headed persistent Chrome (channel) so Google/Gmail accept the session.
 * Falls back to bundled Chromium if Chrome is missing.
 * @param {{ root: string, logger: { logStep: Function } }} opts
 */
export async function openOauthBrowser(opts) {
	const { root, logger } = opts;
	const userDataDir = path.join(root, PROFILE_DIR);
	try {
		fs.mkdirSync(userDataDir, { recursive: true });
	} catch (err) {
		console.error('[social-oauth:openOauthBrowser:mkdir]', { err: String(err) });
		logger.logStep('error', 'browser', null, String(err));
		throw err;
	}

	const { chromium } = await import('@playwright/test');
	const common = {
		headless: false,
		viewport: { width: 1280, height: 900 },
		locale: 'en-US',
		acceptDownloads: true,
		args: ['--disable-blink-features=AutomationControlled'],
		ignoreDefaultArgs: ['--enable-automation'],
	};

	try {
		const context = await chromium.launchPersistentContext(userDataDir, {
			...common,
			channel: 'chrome',
		});
		logger.logStep('info', 'browser', null, 'persistent chrome');
		const page = context.pages()[0] || (await context.newPage());
		return { context, page, userDataDir, channel: 'chrome' };
	} catch (err) {
		console.error('[social-oauth:openOauthBrowser:chrome]', { err: String(err) });
		logger.logStep('error', 'browser', null, `chrome channel failed; chromium fallback`);
		try {
			const context = await chromium.launchPersistentContext(userDataDir, common);
			logger.logStep('info', 'browser', null, 'persistent chromium');
			const page = context.pages()[0] || (await context.newPage());
			return { context, page, userDataDir, channel: 'chromium' };
		} catch (err2) {
			console.error('[social-oauth:openOauthBrowser:chromium]', { err: String(err2) });
			logger.logStep('error', 'browser', null, String(err2));
			throw err2;
		}
	}
}
