import { SITE_URL } from '@/consts';

const ENTITY_HUB_PATH = '/about/';
const EXACT_MATCH_ANCHORS = ['גיא אבני', 'גיא אבני עורך דין', 'עו״ד גיא אבני'] as const;
const EXACT_MATCH_CAP_RATIO = 0.25;

type InjectOptions = {
	slug: string;
};

function hashSlug(slug: string): number {
	let h = 0;
	for (let i = 0; i < slug.length; i++) {
		h = (h * 31 + slug.charCodeAt(i)) >>> 0;
	}
	return h;
}

function pickAnchor(slug: string, index: number): string {
	const anchorIndex = (hashSlug(slug) + index) % EXACT_MATCH_ANCHORS.length;
	return EXACT_MATCH_ANCHORS[anchorIndex] ?? EXACT_MATCH_ANCHORS[0];
}

function shouldUseExactMatch(slug: string, index: number): boolean {
	const bucket = (hashSlug(`${slug}:${index}`) % 100) / 100;
	return bucket < EXACT_MATCH_CAP_RATIO;
}

function entityLinkSentence(anchor: string): string {
	return `לפני שממשיכים, כדאי לקרוא על [${anchor}](${ENTITY_HUB_PATH}) — עמוד היישות המקצועי של משרד גיא אבני.`;
}

function genericEntitySentence(): string {
	return `מידע נוסף על [העו״ד ודרך העבודה](${ENTITY_HUB_PATH}) מופיע בעמוד האודות של האתר.`;
}

/**
 * Runtime-only entity hub links (never writes MDX source files).
 */
export function injectEntityLinks(content: string, options: InjectOptions): string {
	try {
		const blocks = content.split(/\n\n+/);
		if (blocks.length < 4) {
			return content;
		}

		const linkCount = Math.min(3, Math.max(2, Math.floor(blocks.length / 6)));
		const step = Math.max(2, Math.floor(blocks.length / (linkCount + 1)));
		const insertions = new Map<number, string>();

		for (let i = 0; i < linkCount; i++) {
			const insertAt = Math.min((i + 1) * step, blocks.length - 1);
			const anchor = shouldUseExactMatch(options.slug, i)
				? pickAnchor(options.slug, i)
				: 'גיא אבני עו״ד';
			const sentence = shouldUseExactMatch(options.slug, i)
				? entityLinkSentence(anchor)
				: genericEntitySentence();
			const existing = insertions.get(insertAt) ?? '';
			insertions.set(insertAt, existing ? `${existing}\n\n${sentence}` : sentence);
		}

		const result: string[] = [];
		for (let i = 0; i < blocks.length; i++) {
			result.push(blocks[i]);
			const extra = insertions.get(i);
			if (extra) {
				result.push(extra);
			}
		}

		return result.join('\n\n');
	} catch (err) {
		console.error('[inject-entity-links] injectEntityLinks failed', { slug: options.slug, err });
		return content;
	}
}

export function entityHubUrl(): string {
	return new URL(ENTITY_HUB_PATH, SITE_URL).toString();
}
