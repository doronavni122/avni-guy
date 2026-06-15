import { expect, test } from '@playwright/test';

const ROUTES = [
	'/',
	'/blog/',
	'/about/',
	'/services/',
	'/contact/',
	'/categories/',
	'/blog/guy-avni-tenant-rights-israel/',
] as const;

const BRAND = 'גיא אבני';

for (const route of ROUTES) {
	test(`loads ${route} with RTL and no console errors`, async ({ page }) => {
		const consoleErrors: string[] = [];
		page.on('console', (msg) => {
			if (msg.type() === 'error') consoleErrors.push(msg.text());
		});
		page.on('pageerror', (err) => consoleErrors.push(err.message));

		const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
		expect(response?.status(), `${route} HTTP status`).toBe(200);

		await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
		await expect(page.locator('html')).toHaveAttribute('lang', 'he');
		await expect(page.locator('body')).toContainText(BRAND);

		expect(consoleErrors, `console errors on ${route}`).toEqual([]);
	});
}
