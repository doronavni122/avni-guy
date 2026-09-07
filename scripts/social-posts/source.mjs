import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { PROFILE_HOST_HINTS, SITE_URL } from './constants.mjs';
import { argvValue } from './env.mjs';

const SKIP_HOST_FRAGMENTS = ['globes.co.il', 'wikidata.org', 'wa.me', 'whatsapp', 'tiktok.com', 'threads.net'];

/**
 * @param {string} href
 */
export function classifyNetwork(href) {
	const h = href.toLowerCase();
	if (SKIP_HOST_FRAGMENTS.some((f) => h.includes(f))) return null;
	for (const [network, hints] of Object.entries(PROFILE_HOST_HINTS)) {
		if (hints.some((hint) => h.includes(hint))) return network;
	}
	return null;
}

/**
 * @param {string} html
 * @returns {string[]}
 */
export function extractProfileUrls(html) {
	const found = new Set();
	const re = /https?:\/\/[^"'\\\s>]+/g;
	let m;
	while ((m = re.exec(html))) {
		const raw = m[0].replace(/[\\]+$/, '').replace(/[.,;)]+$/, '');
		if (classifyNetwork(raw)) found.add(raw);
	}
	return [...found].sort();
}

/**
 * @param {string} root
 * @returns {string[]}
 */
export function readFooterProfileUrls(root) {
	try {
		const ts = fs.readFileSync(path.join(root, 'src/lib/nav/site-social.ts'), 'utf8');
		return [...ts.matchAll(/href:\s*'([^']+)'/g)].map((m) => m[1]);
	} catch (err) {
		console.error('[social-posts:readFooterProfileUrls]', { err: String(err) });
		return [];
	}
}

/**
 * @param {{ fetchImpl?: typeof fetch, logger: { logStep: Function }, html?: string }} opts
 */
export async function resolveLiveProfiles(opts) {
	const { logger } = opts;
	try {
		let html = opts.html;
		if (!html) {
			const fetchImpl = opts.fetchImpl || fetch;
			const res = await fetchImpl(`${SITE_URL}/`, { redirect: 'follow' });
			html = await res.text();
		}
		const found = extractProfileUrls(html);
		logger.logStep('info', 'resolve-profiles', null, `found=${found.length}`);
		return found;
	} catch (err) {
		logger.logStep('error', 'resolve-profiles', null, String(err));
		return [];
	}
}

/**
 * @param {string} raw
 */
function flattenYamlString(raw) {
	if (raw == null) return '';
	if (typeof raw === 'string') return raw.replace(/\s+/g, ' ').trim();
	return String(raw);
}

/**
 * @param {string} root
 */
export function listBlogSources(root) {
	const dir = path.join(root, 'src/content/blog');
	const posts = [];
	try {
		for (const name of fs.readdirSync(dir)) {
			if (!name.endsWith('.mdx')) continue;
			const filePath = path.join(dir, name);
			const raw = fs.readFileSync(filePath, 'utf8');
			const { data } = matter(raw);
			const pub = data.pubDate ? new Date(data.pubDate) : null;
			if (!pub || Number.isNaN(pub.getTime())) continue;
			const images = Array.isArray(data.images) ? data.images : [];
			const first = images[0] || {};
			posts.push({
				slug: name.replace(/\.mdx$/, ''),
				pubDate: pub.toISOString().slice(0, 10),
				pubMs: pub.getTime(),
				title: flattenYamlString(data.title),
				description: flattenYamlString(data.description || data.metaDescription),
				mainKeyword: flattenYamlString(data.mainKeyword),
				metaTitle: flattenYamlString(data.metaTitle),
				canonical: `${SITE_URL}/blog/${name.replace(/\.mdx$/, '')}/`,
				imageUrl: flattenYamlString(first.src),
				imageAlt: flattenYamlString(first.alt) || flattenYamlString(data.title),
				tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
				secondaryKeywords: Array.isArray(data.secondaryKeywords)
					? data.secondaryKeywords.map(String)
					: [],
				faq1:
					Array.isArray(data.faq) && data.faq[0]
						? `${flattenYamlString(data.faq[0].question)} ${flattenYamlString(data.faq[0].answer)}`
						: '',
			});
		}
	} catch (err) {
		console.error('[social-posts:listBlogSources]', { err: String(err) });
	}
	return posts.sort((a, b) => b.pubMs - a.pubMs);
}

/**
 * @param {{ root: string, argv: string[], env: NodeJS.ProcessEnv, runDir: string, logger: { logStep: Function }, fetchImpl?: typeof fetch, html?: string }} opts
 */
export async function loadSource(opts) {
	const { root, argv, logger } = opts;
	try {
		const footer = readFooterProfileUrls(root);
		const live = await resolveLiveProfiles({
			fetchImpl: opts.fetchImpl,
			logger,
			html: opts.html,
		});
		const profiles = [...new Set([...footer, ...live])];
		fs.writeFileSync(path.join(opts.runDir, 'live-profiles.json'), JSON.stringify({ found: profiles }, null, 2));

		const posts = listBlogSources(root);
		if (!posts.length) {
			logger.logStep('error', 'load-content', null, 'no blog mdx');
			return null;
		}

		const homepage = argv.includes('--homepage');
		const slug = argvValue('--slug', argv, '');
		const url = argvValue('--url', argv, '');
		let picked = posts[0];
		if (homepage) {
			picked = {
				slug: 'home',
				pubDate: '',
				title: 'גיא אבני',
				description: 'אתר תוכן מקצועי בעברית של גיא אבני',
				mainKeyword: 'גיא אבני עורך דין',
				metaTitle: 'גיא אבני',
				canonical: `${SITE_URL}/`,
				imageUrl: '',
				imageAlt: 'גיא אבני',
				tags: ['גיא אבני'],
				secondaryKeywords: [],
				faq1: '',
			};
		} else if (slug) {
			picked = posts.find((p) => p.slug === slug) || null;
		} else if (url) {
			const fromUrl = url.replace(/\/$/, '').split('/').pop();
			picked = posts.find((p) => p.slug === fromUrl) || null;
		}

		if (!picked) {
			logger.logStep('error', 'load-content', null, 'source not found');
			return null;
		}

		return { ...picked, profiles };
	} catch (err) {
		logger.logStep('error', 'load-content', null, String(err));
		return null;
	}
}
