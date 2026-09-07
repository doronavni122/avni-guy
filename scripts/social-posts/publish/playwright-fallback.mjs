import fs from 'node:fs';

/**
 * Last-resort UI post. No 2FA pause. Missing/expired state → skip.
 * @param {object} ctx
 */
export async function publishWithPlaywright(ctx) {
	const { network, statePath, caption, startUrl, logger, env, runDir } = ctx;
	try {
		if (!statePath || !fs.existsSync(statePath)) {
			return logger.failNet('publish', network, `no storageState at ${statePath || '(empty)'}`);
		}
		const { chromium } = await import('@playwright/test');
		const browser = await chromium.launch({ headless: true });
		try {
			const browserCtx = await browser.newContext({ storageState: statePath });
			const page = await browserCtx.newPage();
			await page.goto(startUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
			const login = page.getByRole('button', { name: /log in|התחבר/i });
			if ((await login.count()) > 0) {
				return logger.failNet('publish', network, 'session expired');
			}
			const composer = page.getByRole('button', { name: /what.?s on your mind|מה בא לך/i }).first();
			await composer.click({ timeout: 15000 });
			const box = page.locator('[contenteditable="true"]').last();
			await box.fill(caption || '');
			const imagePath = env.FB_IMAGE_PATH || `${runDir}/source.jpg`;
			if (fs.existsSync(imagePath)) {
				const input = page.locator('input[type="file"]').first();
				await input.setInputFiles(imagePath);
			}
			await page.getByRole('button', { name: /post|פרסם|שיתוף/i }).last().click({ timeout: 15000 });
			logger.logStep('info', 'publish', network, 'playwright click-post attempted');
			return {
				ok: true,
				network,
				method: 'playwright',
				result: 'ok',
				url: null,
				msg: 'playwright click-post attempted',
			};
		} finally {
			await browser.close();
		}
	} catch (err) {
		return logger.failNet('publish', network, String(err));
	}
}
