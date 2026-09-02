const BRAND_ONCE = 'גיא אבני';

/** Topic title + brand once. Use with absoluteTitle so the layout template does not append SITE_TITLE. */
export function articleDocumentTitle(topicTitle: string): string {
	try {
		const topic = topicTitle.trim();
		if (!topic) {
			console.error('[seo] articleDocumentTitle empty topic', { topicTitle });
			return BRAND_ONCE;
		}
		if (topic.includes(BRAND_ONCE)) {
			return topic;
		}
		return `${topic} | ${BRAND_ONCE}`;
	} catch (err) {
		console.error('[seo] articleDocumentTitle failed', { topicTitle, err });
		return topicTitle;
	}
}
