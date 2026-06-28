import { expect, test, type Page } from '@playwright/test';

/**
 * Parallel workers with distinct entry parameters (query, UTM, viewport, user-agent).
 * Flow: Google SERP click-through when possible, else simulated organic entry with referer + UTM.
 * Template pattern: Playwright fullyParallel + per-test scenario matrix (no in-repo template existed).
 */
test.describe.configure({ mode: 'parallel' });

const SITE_HOST = 'avniguy.co.il';
const BROWSE_ROUTES = ['/', '/blog/', '/about/', '/services/', '/contact/'] as const;
const BRAND = 'גיא אבני';

type WorkerScenario = {
	id: string;
	searchQuery: string;
	utm: string;
	viewport: { width: number; height: number };
	userAgent: string;
	locale: string;
};

const WORKER_SCENARIOS: WorkerScenario[] = [
	{
		id: 'worker-he-brand',
		searchQuery: 'גיא אבני עורך דין',
		utm: 'utm_source=google&utm_medium=organic&utm_campaign=parallel-he-brand',
		viewport: { width: 1366, height: 768 },
		userAgent:
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
		locale: 'he-IL',
	},
	{
		id: 'worker-site-query',
		searchQuery: 'site:avniguy.co.il עורך דין נדלן',
		utm: 'utm_source=google&utm_medium=organic&utm_campaign=parallel-site-query',
		viewport: { width: 390, height: 844 },
		userAgent:
			'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
		locale: 'he-IL',
	},
	{
		id: 'worker-real-estate',
		searchQuery: 'עורך דין נדלן תל אביב גיא אבני',
		utm: 'utm_source=google&utm_medium=cpc&utm_campaign=parallel-real-estate',
		viewport: { width: 1280, height: 800 },
		userAgent:
			'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
		locale: 'he-IL',
	},
];

async function dismissGoogleConsent(page: Page): Promise<void> {
	const accept = page.locator(
		'button:has-text("Accept all"), button:has-text("אני מסכים"), button:has-text("קבל הכל"), form[action*="consent"] button',
	);
	if (await accept.first().isVisible({ timeout: 3000 }).catch(() => false)) {
		await accept.first().click({ timeout: 5000 }).catch(() => undefined);
	}
}

function isBlockedGooglePage(url: string, bodyText: string): boolean {
	const lower = bodyText.toLowerCase();
	return (
		url.includes('/sorry/') ||
		lower.includes('unusual traffic') ||
		lower.includes('captcha') ||
		lower.includes('לא רגיל') ||
		lower.includes('אימות')
	);
}

async function tryGoogleSerpClick(page: Page, scenario: WorkerScenario): Promise<'serp-click' | 'blocked'> {
	const searchUrl = new URL('https://www.google.com/search');
	searchUrl.searchParams.set('q', scenario.searchQuery);
	searchUrl.searchParams.set('hl', 'he');
	searchUrl.searchParams.set('gl', 'il');
	searchUrl.searchParams.set('num', '10');

	await page.goto(searchUrl.toString(), { waitUntil: 'domcontentloaded', timeout: 45000 });
	await dismissGoogleConsent(page);
	await page.waitForTimeout(1500);

	const bodyText = await page.locator('body').innerText().catch(() => '');
	if (isBlockedGooglePage(page.url(), bodyText)) {
		return 'blocked';
	}

	const resultLink = page.locator(`a[href*="${SITE_HOST}"]`).first();
	const visible = await resultLink.isVisible({ timeout: 8000 }).catch(() => false);
	if (!visible) {
		return 'blocked';
	}

	await resultLink.click({ timeout: 10000 });
	await page.waitForLoadState('domcontentloaded');
	if (!page.url().includes(SITE_HOST)) {
		return 'blocked';
	}
	return 'serp-click';
}

async function simulatedOrganicEntry(page: Page, scenario: WorkerScenario, baseURL: string): Promise<void> {
	const target = new URL(BROWSE_ROUTES[0], baseURL);
	for (const part of scenario.utm.split('&')) {
		const [key, value] = part.split('=');
		if (key && value) target.searchParams.set(key, value);
	}
	await page.goto(target.toString(), {
		waitUntil: 'domcontentloaded',
		timeout: 45000,
		referer: 'https://www.google.com/',
	});
}

async function browseSite(page: Page, baseURL: string): Promise<string[]> {
	const visited: string[] = [];
	for (const route of BROWSE_ROUTES) {
		const url = new URL(route, baseURL).toString();
		const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
		expect(response?.status(), `HTTP status for ${route}`).toBe(200);
		await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
		await expect(page.locator('body')).toContainText(BRAND);
		visited.push(route);
	}
	return visited;
}

for (const scenario of WORKER_SCENARIOS) {
	test(`parallel entry browse: ${scenario.id}`, async ({ browser, baseURL }, testInfo) => {
		testInfo.annotations.push({ type: 'worker-id', description: scenario.id });
		testInfo.annotations.push({ type: 'search-query', description: scenario.searchQuery });
		testInfo.annotations.push({ type: 'utm', description: scenario.utm });
		testInfo.annotations.push({ type: 'user-agent', description: scenario.userAgent.slice(0, 80) });
		testInfo.annotations.push({
			type: 'viewport',
			description: `${scenario.viewport.width}x${scenario.viewport.height}`,
		});

		const context = await browser.newContext({
			viewport: scenario.viewport,
			userAgent: scenario.userAgent,
			locale: scenario.locale,
			extraHTTPHeaders: { 'Accept-Language': scenario.locale },
		});
		const page = await context.newPage();

		let entryMode: 'serp-click' | 'simulated-organic' = 'simulated-organic';

		try {
			const serpResult = await tryGoogleSerpClick(page, scenario).catch(() => 'blocked' as const);
			if (serpResult === 'serp-click') {
				entryMode = 'serp-click';
			} else {
				await simulatedOrganicEntry(page, scenario, baseURL!);
				entryMode = 'simulated-organic';
			}

			testInfo.annotations.push({ type: 'entry-mode', description: entryMode });

			const visited = await browseSite(page, baseURL!);
			testInfo.annotations.push({ type: 'visited-routes', description: visited.join(',') });

			expect(page.url()).toContain(SITE_HOST);
		} catch (error) {
			const screenshotPath = testInfo.outputPath(`${scenario.id}-failure.png`);
			await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => undefined);
			testInfo.attach('failure-screenshot', { path: screenshotPath, contentType: 'image/png' });
			throw error;
		} finally {
			await context.close();
		}
	});
}
