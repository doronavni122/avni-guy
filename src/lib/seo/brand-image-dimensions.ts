/** Known raster dimensions for JSON-LD ImageObject (pixels). */
export const BRAND_ORG_LOGO_RASTER_PATH =
	'/images/shared/guy-avni-avni-guy-law-firm-lawyer-og-law-fallback-photo-1.jpg';

export const IMAGE_OBJECT_DIMENSIONS: Record<string, { width: number; height: number }> = {
	[BRAND_ORG_LOGO_RASTER_PATH]: { width: 1200, height: 800 },
	'/images/shared/guy-avni-avni-guy-law-firm-lawyer-brand-portrait-photo-2.jpg': { width: 1024, height: 1024 },
	'/images/shared/guy-avni-avni-guy-law-firm-lawyer-office-interior-photo-3.jpg': { width: 1400, height: 900 },
};

export function imageObjectWithDimensions(
	url: string,
	extra?: Record<string, unknown>,
): Record<string, unknown> {
	try {
		const parsed = new URL(url);
		const pathKey = parsed.pathname;
		const dims = IMAGE_OBJECT_DIMENSIONS[pathKey];
		const node: Record<string, unknown> = {
			'@type': 'ImageObject',
			url,
			...extra,
		};
		if (dims) {
			node.width = dims.width;
			node.height = dims.height;
		}
		return node;
	} catch (err) {
		console.error('[brand-image-dimensions] imageObjectWithDimensions failed', { url, err });
		return { '@type': 'ImageObject', url, ...extra };
	}
}