import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

/**
 * @param {{ source: object, runDir: string, logger: { logStep: Function }, fetchImpl?: typeof fetch }} opts
 */
export async function prepareMedia(opts) {
	const { source, runDir, logger } = opts;
	const imageUrl = source.imageUrl || '';
	const dest = path.join(runDir, 'source.jpg');
	if (!imageUrl) {
		logger.logStep('error', 'download-image', null, 'source.json missing imageUrl');
		return { imagePath: null, videoPath: null };
	}
	try {
		const fetchImpl = opts.fetchImpl || fetch;
		const res = await fetchImpl(imageUrl);
		if (!res.ok) {
			logger.logStep('error', 'download-image', null, `status ${res.status}`);
			return { imagePath: null, videoPath: null };
		}
		const buf = Buffer.from(await res.arrayBuffer());
		fs.writeFileSync(dest, buf);
		logger.logStep('info', 'download-image', null, dest);
	} catch (err) {
		logger.logStep('error', 'download-image', null, String(err));
		return { imagePath: null, videoPath: null };
	}

	const videoPath = path.join(runDir, 'short.mp4');
	const ff = spawnSync(
		'ffmpeg',
		[
			'-y',
			'-loop',
			'1',
			'-i',
			dest,
			'-t',
			'20',
			'-vf',
			'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,format=yuv420p',
			'-c:v',
			'libx264',
			'-pix_fmt',
			'yuv420p',
			'-r',
			'30',
			'-an',
			videoPath,
		],
		{ encoding: 'utf8' },
	);
	if (ff.error || ff.status !== 0) {
		logger.logStep('error', 'ffmpeg', 'youtube', ff.error ? String(ff.error) : ff.stderr.slice(0, 400));
		return { imagePath: dest, videoPath: null };
	}
	logger.logStep('info', 'ffmpeg', 'youtube', videoPath);
	return { imagePath: dest, videoPath };
}
