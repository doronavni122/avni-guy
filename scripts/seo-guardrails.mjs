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
}

function checkBuiltOutputIfPresent() {
	logStep('step 3: checking built output if available');
	const requireDist = process.env.SEO_GUARDRAILS_REQUIRE_DIST === '1';
	const distPath = path.join(process.cwd(), 'dist');
	if (!fs.existsSync(distPath)) {
		if (requireDist) {
			fail('dist directory not found while SEO_GUARDRAILS_REQUIRE_DIST=1');
			return;
		}
		logStep('step 3.1: dist directory not found, skipping built-output checks');
		return;
	}

	const indexPath = path.join(distPath, 'index.html');
	if (!fs.existsSync(indexPath)) {
		if (requireDist) {
			fail('dist/index.html missing while SEO_GUARDRAILS_REQUIRE_DIST=1');
		}
		return;
	}

	const indexContent = fs.readFileSync(indexPath, 'utf8');
	if (!requireDist) {
		logStep('step 3.2: dist checks are optional (set SEO_GUARDRAILS_REQUIRE_DIST=1 to enforce)');
		return;
	}
	assertIncludes(indexContent, `<link rel="canonical" href="${EXPECTED_HOST}/">`, 'index canonical host mismatch');
	assertIncludes(indexContent, `<meta property="og:url" content="${EXPECTED_HOST}/">`, 'index og:url host mismatch');
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
