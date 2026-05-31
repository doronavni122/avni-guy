import fs from 'node:fs';
import path from 'node:path';
import { MAIN_PAGE_HEROES } from '../src/lib/seo/main-page-heroes.mjs';
import { runBannedCharacterChecks } from './lib/check-banned-characters.mjs';
import { runH1Checks } from './lib/check-page-h1.mjs';
import { validateAllMainPageStyles } from './lib/main-page-style-rules.mjs';
import { runMainPageMetaChecks } from './lib/check-main-page-meta.mjs';
import { validateAllMainPageHeroes } from './lib/seo-hero-rules.mjs';
import { runArticleContentChecks } from './lib/check-article-content.mjs';
import { runTaxonomyLabelChecks } from './lib/check-taxonomy-labels.mjs';
import { runKeystaticEnvChecks } from './lib/check-keystatic-env.mjs';

const EXPECTED_HOST = 'https://avniguy.co.il';

function logStep(message, details) {
	if (details !== undefined) {
		console.log(`[seo-guardrails] ${message}`, details);
		return;
	}
	console.log(`[seo-guardrails] ${message}`);
}

function fail(message) {
	console.error(`[seo-guardrails] FAIL: ${message}`);
	process.exitCode = 1;
}

function assertIncludes(content, expected, message) {
	if (!content.includes(expected)) {
		fail(message);
	}
}

function checkSourceFiles() {
	logStep('step 1: checking source constants');
	const constsPath = path.join(process.cwd(), 'src', 'consts.ts');
	const constsContent = fs.readFileSync(constsPath, 'utf8');
	assertIncludes(constsContent, `export const SITE_URL = '${EXPECTED_HOST}';`, 'SITE_URL does not match canonical host');

	logStep('step 2: checking robots policy');
	const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
	const robotsContent = fs.readFileSync(robotsPath, 'utf8');
	assertIncludes(robotsContent, `Sitemap: ${EXPECTED_HOST}/sitemap.xml`, 'robots sitemap host mismatch');
	assertIncludes(robotsContent, 'User-agent: OAI-SearchBot', 'robots missing OAI-SearchBot policy');
	assertIncludes(robotsContent, 'User-agent: GPTBot', 'robots missing GPTBot policy');
	assertIncludes(robotsContent, 'User-agent: ClaudeBot', 'robots missing ClaudeBot policy');
	assertIncludes(robotsContent, 'User-agent: PerplexityBot', 'robots missing PerplexityBot policy');

	logStep('step 2.1: checking llms.txt (agent navigation map)');
	const llmsPath = path.join(process.cwd(), 'public', 'llms.txt');
	if (!fs.existsSync(llmsPath)) {
		fail('public/llms.txt missing (required curated agent map)');
		return;
	}
	const llmsContent = fs.readFileSync(llmsPath, 'utf8').trim();
	if (llmsContent.length < 80) {
		fail('public/llms.txt too short');
		return;
	}
	assertIncludes(llmsContent, EXPECTED_HOST, 'llms.txt missing canonical host URLs');

	logStep('step 2.2: checking Next.js app entry');
	const layoutPath = path.join(process.cwd(), 'src', 'app', 'layout.tsx');
	if (!fs.existsSync(layoutPath)) {
		fail('src/app/layout.tsx missing (Next.js App Router)');
	}
}

function checkMainPageHeroes() {
	logStep('step 2.3: validating main-menu page heroes');
	const heroes = Object.values(MAIN_PAGE_HEROES);
	const heroResult = validateAllMainPageHeroes(heroes);
	if (!heroResult.ok) {
		for (const err of heroResult.errors) {
			fail(err);
		}
	}
	logStep('step 2.3.1: validating main-menu hero style (show-dont-tell)');
	const styleResult = validateAllMainPageStyles(heroes);
	if (!styleResult.ok) {
		for (const err of styleResult.errors) {
			fail(err);
		}
	}
	logStep('step 2.3.2: validating main-menu brand and meta conventions');
	const metaResult = runMainPageMetaChecks();
	if (!metaResult.ok) {
		for (const err of metaResult.errors) {
			fail(err);
		}
	}
}

function checkTaxonomyLabelsIfEnabled() {
	if (process.env.CONTENT_AUDIT_ENFORCE !== '1') {
		logStep('step 2.36: skipping taxonomy label audit (set CONTENT_AUDIT_ENFORCE=1 to enable)');
		return;
	}
	logStep('step 2.36: running taxonomy label audit');
	try {
		const result = runTaxonomyLabelChecks();
		if (!result.ok) {
			for (const err of result.errors.slice(0, 20)) {
				fail(err);
			}
			if (result.errors.length > 20) {
				fail(`... and ${result.errors.length - 20} more taxonomy label issues (run pnpm run taxonomy:audit)`);
			}
		}
	} catch (err) {
		console.error('[seo-guardrails] checkTaxonomyLabelsIfEnabled failed', err);
		fail('Taxonomy label audit failed');
	}
}

function checkKeystaticEnvIfCi() {
	if (process.env.CI !== '1') {
		logStep('step 2.37: skipping Keystatic env check (CI=1 required)');
		return;
	}
	logStep('step 2.37: running Keystatic env validation');
	try {
		const result = runKeystaticEnvChecks({ enforce: true });
		if (!result.ok) {
			for (const err of result.errors) {
				fail(err);
			}
		}
	} catch (err) {
		console.error('[seo-guardrails] checkKeystaticEnvIfCi failed', err);
		fail('Keystatic env validation failed');
	}
}

function checkArticleContentIfEnabled() {
	if (process.env.CONTENT_AUDIT_ENFORCE !== '1') {
		logStep('step 2.35: skipping article content audit (set CONTENT_AUDIT_ENFORCE=1 to enable)');
		return;
	}
	logStep('step 2.35: running article content audit');
	try {
		const result = runArticleContentChecks();
		if (!result.ok) {
			for (const err of result.errors.slice(0, 20)) {
				fail(err);
			}
			if (result.errors.length > 20) {
				fail(`... and ${result.errors.length - 20} more article content issues (run pnpm run content:audit)`);
			}
		}
	} catch (err) {
		console.error('[seo-guardrails] checkArticleContentIfEnabled failed', err);
		fail('Article content audit failed');
	}
}

function checkPageH1Rules() {
	logStep('step 2.4: checking single-H1 rules for blog');
	try {
		runH1Checks();
	} catch (err) {
		console.error('[seo-guardrails] checkPageH1Rules failed', err);
		fail('H1 structural checks failed');
	}
}

function checkNextBuildOutputIfPresent() {
	const requireDist = process.env.SEO_GUARDRAILS_REQUIRE_DIST === '1';
	const nextDir = path.join(process.cwd(), '.next');
	if (!fs.existsSync(nextDir)) {
		if (requireDist) {
			console.error('[seo-guardrails] .next directory missing with SEO_GUARDRAILS_REQUIRE_DIST=1', { nextDir });
			fail('.next directory not found while SEO_GUARDRAILS_REQUIRE_DIST=1');
		} else {
			logStep('step 3.0: .next not found, skipping build output checks');
		}
		return;
	}
	logStep('step 3: Next build output directory present', { nextDir });
}

function main() {
	logStep('step 0: starting SEO guardrails (Next.js)');
	checkSourceFiles();
	checkMainPageHeroes();
	checkArticleContentIfEnabled();
	checkTaxonomyLabelsIfEnabled();
	checkKeystaticEnvIfCi();
	checkPageH1Rules();
	try {
		runBannedCharacterChecks();
	} catch (err) {
		console.error('[seo-guardrails] runBannedCharacterChecks failed', err);
		fail('Banned character check failed (em dash U+2014)');
	}
	checkNextBuildOutputIfPresent();
	if (process.exitCode && process.exitCode !== 0) {
		logStep('done: guardrails completed with failures');
		return;
	}
	logStep('done: all guardrails passed');
}

main();
