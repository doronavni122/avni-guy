#!/usr/bin/env node
/**
 * Generates WebP + AVIF siblings for JPEG/PNG assets under public/images/.
 * Skips files that already have up-to-date variants.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import fg from 'fast-glob';
import sharp from 'sharp';

const ROOT = path.join(process.cwd(), 'public', 'images');
const SOURCE_GLOB = '**/*.{jpg,jpeg,png}';

async function statMtime(filePath) {
	try {
		const stat = await fs.stat(filePath);
		return stat.mtimeMs;
	} catch {
		return 0;
	}
}

async function optimizeFile(sourcePath) {
	const ext = path.extname(sourcePath).toLowerCase();
	const base = sourcePath.slice(0, -ext.length);
	const webpPath = `${base}.webp`;
	const avifPath = `${base}.avif`;
	const sourceMtime = await statMtime(sourcePath);
	const webpMtime = await statMtime(webpPath);
	const avifMtime = await statMtime(avifPath);

	if (webpMtime >= sourceMtime && avifMtime >= sourceMtime) {
		return { sourcePath, skipped: true };
	}

	try {
		if (webpMtime < sourceMtime) {
			await sharp(sourcePath).webp({ quality: 80 }).toFile(webpPath);
		}
		if (avifMtime < sourceMtime) {
			await sharp(sourcePath).avif({ quality: 50 }).toFile(avifPath);
		}
		return { sourcePath, skipped: false };
	} catch (err) {
		console.error('[optimize-images] ERROR failed to optimize', { sourcePath, err });
		throw err;
	}
}

async function main() {
	console.error('[optimize-images] step 1: scanning public/images');
	const files = await fg(SOURCE_GLOB, { cwd: ROOT, absolute: true });
	if (files.length === 0) {
		console.error('[optimize-images] step 2: no raster images found, done');
		return;
	}

	console.error('[optimize-images] step 2: optimizing', { count: files.length });
	let optimized = 0;
	let skipped = 0;
	for (const file of files) {
		const result = await optimizeFile(file);
		if (result.skipped) {
			skipped += 1;
		} else {
			optimized += 1;
		}
	}
	console.error('[optimize-images] done', { optimized, skipped, total: files.length });
}

main().catch((err) => {
	console.error('[optimize-images] ERROR', err);
	process.exit(1);
});
