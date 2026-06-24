import { expect, test } from '@playwright/test';

const ROUTES = [
	'/',
	'/blog/',
	'/about/',
	'/services/',
	'/contact/',
	'/categories/',
	'/blog/tenant-rights-israel/',
] as const;

const BRAND = 'גיא אבני';

test('sitemap.xml is valid and complete', async ({ request }) => {
	const response = await request.get('/sitemap.xml');
	expect(response.status()).toBe(200);
	const body = await response.text();
	expect(body).toContain('<urlset');
	const locCount = (body.match(/<loc>/g) ?? []).length;
	expect(locCount).toBeGreaterThanOrEqual(132);
	expect(body).not.toContain('/blog/guy-avni-');
});

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
