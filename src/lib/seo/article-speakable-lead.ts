/**
 * Derive a short Hebrew voice-answer lead for article SpeakableSpecification.
 * Prefer ## בקצרה / TL;DR bullets; else meta description; else first prose paragraph.
 */

const TLDR_HEADING = /##\s*(?:בקצרה|TL;DR)[^\n]*\n([\s\S]*?)(?=\n##\s|\n*$)/u;

export function extractArticleSpeakableLead(body: string, fallbackDescription: string): string {
	try {
		const tldr = body.match(TLDR_HEADING);
		if (tldr?.[1]) {
			const bullets = [...tldr[1].matchAll(/^[-*]\s+(.+)$/gmu)]
				.map((m) => m[1].trim())
				.filter((line) => line.length > 8 && !line.includes('](/contact'));
			if (bullets.length >= 2) {
				return bullets.slice(0, 3).join(' ').replace(/\s+/g, ' ').trim();
			}
			const prose = tldr[1]
				.replace(/^[-*]\s+/gmu, '')
				.replace(/\n+/g, ' ')
				.trim();
			if (prose.length >= 40) {
				return prose.slice(0, 320).trim();
			}
		}

		const withoutHeadings = body
			.replace(/^---[\s\S]*?---\n*/u, '')
			.replace(/^##\s.+$/gmu, '')
			.trim();
		const firstPara = withoutHeadings.split(/\n\n+/)[0]?.replace(/\n/g, ' ').trim() ?? '';
		if (firstPara.length >= 40) {
			return firstPara.slice(0, 320).trim();
		}

		const desc = fallbackDescription.trim();
		if (desc.length >= 20) {
			return desc.slice(0, 320).trim();
		}

		console.error('[article-speakable-lead] no usable lead', {
			bodyLen: body.length,
			descLen: fallbackDescription.length,
		});
		return desc || firstPara.slice(0, 320).trim();
	} catch (err) {
		console.error('[article-speakable-lead] extract failed', { err });
		return fallbackDescription.trim().slice(0, 320);
	}
}
