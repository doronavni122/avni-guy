import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import fg from 'fast-glob';

const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog');
const TIMEOUT_MS = 10_000;
const CONCURRENCY = 5;

function logErr(step, message, extra) {
	console.error(`[check-image-urls] ERROR step=${step} ${message}`, extra ?? '');
}

function slugFilterFromEnv() {
	const raw = process.env.CONTENT_AUDIT_SLUGS?.trim();
	if (!raw) return null;
	return new Set(raw.split(',').map((s) => s.trim()).filter(Boolean));
}

async function headWithRetry(url, retries = 1) {
	for (let attempt = 0; attempt <= retries; attempt++) {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
		try {
			const res = await fetch(url, { method: 'HEAD', signal: controller.signal, redirect: 'follow' });
			clearTimeout(timer);
			if (res.status === 405 || res.status === 501) {
				const getRes = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(TIMEOUT_MS), redirect: 'follow' });
				return getRes.status;
			}
			return res.status;
		} catch (err) {
			clearTimeout(timer);
			if (attempt === retries) throw err;
		}
	}
	return 0;
}

async function mapPool(items, limit, fn) {
	const results = [];
	let index = 0;
	async function worker() {
		while (index < items.length) {
			const i = index++;
			results[i] = await fn(items[i], i);
		}
	}
	await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
	return results;
}

/**
 * @returns {Promise<{ ok: boolean, errors: string[] }>}
 */
export async function runImageUrlChecks() {
	if (process.env.SKIP_IMAGE_AUDIT === '1') {
		console.log('[check-image-urls] step 0: SKIP_IMAGE_AUDIT=1, skipping');
		return { ok: true, errors: [] };
	}

	const filter = slugFilterFromEnv();
	const files = fg.sync('*.mdx', { cwd: BLOG_DIR, absolute: true });
	const tasks = [];

	for (const filePath of files) {
		const slug = path.basename(filePath, '.mdx');
		if (filter && !filter.has(slug)) continue;
		let images;
		try {
			const { data } = matter(fs.readFileSync(filePath, 'utf8'));
			images = Array.isArray(data.images) ? data.images : [];
		} catch (err) {
			logErr('read', `slug=${slug}`, err);
			tasks.push({ slug, url: '', error: 'failed to read frontmatter' });
			continue;
		}
		for (const img of images) {
			if (typeof img?.src === 'string' && img.src.startsWith('http')) {
				tasks.push({ slug, url: img.src, error: null });
			}
		}
	}

	const errors = [];
	await mapPool(tasks, CONCURRENCY, async (task) => {
		if (task.error) {
			errors.push(`${task.slug}: ${task.error}`);
			return;
		}
		try {
			const status = await headWithRetry(task.url);
			if (status < 200 || status >= 400) {
				errors.push(`${task.slug}: image URL ${task.url} returned HTTP ${status}`);
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			logErr('fetch', `slug=${task.slug} url=${task.url}`, message);
			errors.push(`${task.slug}: image URL ${task.url} unreachable (${message})`);
		}
	});

	return { ok: errors.length === 0, errors };
}
