import fs from 'node:fs';
import path from 'node:path';

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
	assertIncludes(robotsContent, `Sitemap: ${EXPECTED_HOST}/sitemap-index.xml`, 'robots sitemap host mismatch');
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
}

function extractFirstLoc(xml) {
	const m = xml.match(/<loc>(.*?)<\/loc>/);
	return m ? m[1] : '';
}

function checkDistSitemapArtifacts(distPath) {
	logStep('step 3: checking dist sitemap artifacts');
	const sitemapIndexPath = path.join(distPath, 'sitemap-index.xml');
	if (!fs.existsSync(sitemapIndexPath)) {
		console.error('[seo-guardrails] dist/sitemap-index.xml missing', { distPath });
		fail('dist/sitemap-index.xml missing after build');
		return;
	}
	const indexXml = fs.readFileSync(sitemapIndexPath, 'utf8');
	assertIncludes(indexXml, `${EXPECTED_HOST}/`, 'sitemap index missing expected absolute host');
	const firstChild = extractFirstLoc(indexXml);
	if (!firstChild) {
		console.error('[seo-guardrails] sitemap index has no loc entries', { sitemapIndexPath });
		fail('sitemap index has no loc entries');
		return;
	}
	logStep('step 3.1: sitemap index references child', { firstChild });
	try {
		const childRel = new URL(firstChild).pathname.replace(/^\//, '');
		const childFile = path.join(distPath, childRel);
		if (!fs.existsSync(childFile)) {
			console.error('[seo-guardrails] child sitemap file missing on disk', { childFile, firstChild });
			fail('child sitemap file missing in dist');
			return;
		}
		const childXml = fs.readFileSync(childFile, 'utf8');
		assertIncludes(childXml, `${EXPECTED_HOST}/`, 'child sitemap missing expected absolute host');
		logStep('step 3.2: child sitemap validated', { childFile });
	} catch (err) {
		console.error('[seo-guardrails] failed to validate child sitemap', err);
		fail('failed to validate child sitemap file');
	}
}

function checkDistIndexHtmlCanonical() {
	logStep('step 4: checking dist index.html canonical (SEO_GUARDRAILS_REQUIRE_DIST=1)');
	const requireDist = process.env.SEO_GUARDRAILS_REQUIRE_DIST === '1';
	if (!requireDist) {
		logStep('step 4.1: skipping index.html canonical check (set SEO_GUARDRAILS_REQUIRE_DIST=1 to enforce)');
		return;
	}
	const distPath = path.join(process.cwd(), 'dist');
	const indexPath = path.join(distPath, 'index.html');
	if (!fs.existsSync(indexPath)) {
		console.error('[seo-guardrails] dist/index.html missing', { indexPath });
		fail('dist/index.html missing while SEO_GUARDRAILS_REQUIRE_DIST=1');
		return;
	}
	const indexContent = fs.readFileSync(indexPath, 'utf8');
	assertIncludes(indexContent, `<link rel="canonical" href="${EXPECTED_HOST}/">`, 'index canonical host mismatch');
	assertIncludes(indexContent, `<meta property="og:url" content="${EXPECTED_HOST}/">`, 'index og:url host mismatch');
}

function checkBuiltOutputIfPresent() {
	const requireDist = process.env.SEO_GUARDRAILS_REQUIRE_DIST === '1';
	const distPath = path.join(process.cwd(), 'dist');
	if (!fs.existsSync(distPath)) {
		if (requireDist) {
			console.error('[seo-guardrails] dist directory missing with SEO_GUARDRAILS_REQUIRE_DIST=1', { distPath });
			fail('dist directory not found while SEO_GUARDRAILS_REQUIRE_DIST=1');
		} else {
			logStep('step 3.0: dist directory not found, skipping dist checks', { distPath });
		}
		return;
	}

	checkDistSitemapArtifacts(distPath);
	checkDistIndexHtmlCanonical();
}

function main() {
	logStep('step 0: starting SEO guardrails');
	checkSourceFiles();
	checkBuiltOutputIfPresent();
	if (process.exitCode && process.exitCode !== 0) {
		logStep('done: guardrails completed with failures');
		return;
	}
	logStep('done: all guardrails passed');
}

main();
