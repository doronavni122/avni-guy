/** Maps internal hrefs to short Hebrew labels for navigation UI. */
export function labelForInternalLink(href: string): string {
	try {
		const normalized = href.replace(/\/+$/, '') || '/';
		const staticLabels: Record<string, string> = {
			'/': 'דף הבית',
			'/about': 'אודות',
			'/services': 'שירותים',
			'/blog': 'מאמרים',
			'/categories': 'קטגוריות',
			'/tags': 'תגיות',
			'/contact': 'יצירת קשר',
		};
		if (staticLabels[normalized]) return staticLabels[normalized];
		if (normalized.startsWith('/blog/')) {
			const slug = normalized.replace(/^\/blog\//, '').replace(/\/$/, '');
			return `מאמר: ${slug}`;
		}
		return href;
	} catch (err) {
		console.error('[link-labels] labelForInternalLink failed', { href, err });
		return href;
	}
}
