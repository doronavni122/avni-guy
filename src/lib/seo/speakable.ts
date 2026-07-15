/**
 * SpeakableSpecification helpers (schema.org speakable).
 * Only attach where visible DOM text under the cssSelector matches the intended voice answer.
 */

export const SPEAKABLE_VOICE_CLASS = 'speakable-voice';

/** CSS selector for visible short HE voice-answer blocks. */
export const SPEAKABLE_VOICE_SELECTOR = `.${SPEAKABLE_VOICE_CLASS}`;

export type SpeakableSpecification = {
	'@type': 'SpeakableSpecification';
	cssSelector: string[];
};

export function buildSpeakableSpecification(
	cssSelectors: string[] = [SPEAKABLE_VOICE_SELECTOR],
): SpeakableSpecification {
	if (!cssSelectors.length) {
		console.error('[speakable] buildSpeakableSpecification called with empty selectors');
	}
	return {
		'@type': 'SpeakableSpecification',
		cssSelector: cssSelectors.length ? cssSelectors : [SPEAKABLE_VOICE_SELECTOR],
	};
}

/** Attach speakable to an existing WebPage/Article JSON-LD node (no FAQ inventation). */
export function attachSpeakable<T extends Record<string, unknown>>(
	webPageSchema: T,
	cssSelectors: string[] = [SPEAKABLE_VOICE_SELECTOR],
): T & { speakable: SpeakableSpecification } {
	try {
		return {
			...webPageSchema,
			speakable: buildSpeakableSpecification(cssSelectors),
		};
	} catch (err) {
		console.error('[speakable] attachSpeakable failed', { err });
		return {
			...webPageSchema,
			speakable: buildSpeakableSpecification([SPEAKABLE_VOICE_SELECTOR]),
		};
	}
}
