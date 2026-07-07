#!/usr/bin/env node
/**
 * GSC URL Inspection — entity hub + top blog URLs. Skips when credentials unset.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import fg from 'fast-glob';
import matter from 'gray-matter';

const SITE_URL = process.env.SITE_URL?.trim() || 'https://avniguy.co.il';
const CONTENT_DIR = path.join(process.cwd(), 'src/content/blog');
const ENTITY_HUB = new URL('/about/', SITE_URL).toString();
const TOP_N = 20;

function logStep(step, detail) {
	console.error(`[gsc-url-inspection:${step}]`, detail);
}

function readServiceAccountPath() {
	try {
		return process.env.GSC_SERVICE_ACCOUNT_JSON?.trim() || null;
	} catch (err) {
		logStep('env', { err });
		return null;
	}
}

async function loadTopBlogUrls() {
	const files = await fg('**/*.{md,mdx}', { cwd: CONTENT_DIR, absolute: true });
	const posts = [];
	for (const file of files) {
		const raw = await fs.readFile(file, 'utf8');
		const { data } = matter(raw);
		const slug = path.basename(file).replace(/\.(md|mdx)$/, '');
		const pubDate = data.pubDate ? new Date(data.pubDate) : new Date(0);
		posts.push({ slug, pubDate });
	}
	posts.sort((a, b) => b.pubDate - a.pubDate);
	return posts.slice(0, TOP_N).map((p) => new URL(`/blog/${p.slug}/`, SITE_URL).toString());
}

async function inspectUrl(_url, _token) {
	// Placeholder: real GSC URL Inspection API requires OAuth + Search Console API client.
	return { coverageState: 'SKIPPED_NO_API_CLIENT' };
}

async function main() {
	const saPath = readServiceAccountPath();
	if (!saPath) {
		logStep('skip', 'GSC_SERVICE_ACCOUNT_JSON unset');
		process.exit(0);
	}

	let token = null;
	try {
		await fs.access(saPath);
		logStep('credentials', { path: saPath });
	} catch (err) {
		logStep('skip', { reason: 'credentials file missing', err });
		process.exit(0);
	}

	const urls = [ENTITY_HUB, ...(await loadTopBlogUrls())];
	logStep('inspect', { count: urls.length });

	for (const url of urls) {
		try {
			const result = await inspectUrl(url, token);
			if (result.coverageState !== 'SUBMITTED_AND_INDEXED' && result.coverageState !== 'SKIPPED_NO_API_CLIENT') {
				console.error(`[gsc-url-inspection] ALERT coverageState=${result.coverageState} url=${url}`);
			}
		} catch (err) {
			logStep('inspect-fail', { url, err });
		}
	}
}

main();
