import { SITE_URL } from '@/consts';

const ENTITY_HUB_PATH = '/about/';

type InjectOptions = {
	slug: string;
};

/**
 * Pass-through: AuthorBio already links /about/. Runtime /about/ clones are disabled.
 */
export function injectEntityLinks(content: string, options: InjectOptions): string {
	try {
		if (!options.slug) {
			console.error('[inject-entity-links] injectEntityLinks missing slug');
		}
		return content;
	} catch (err) {
		console.error('[inject-entity-links] injectEntityLinks failed', { slug: options.slug, err });
		return content;
	}
}

export function entityHubUrl(): string {
	try {
		return new URL(ENTITY_HUB_PATH, SITE_URL).toString();
	} catch (err) {
		console.error('[inject-entity-links] entityHubUrl failed', err);
		return ENTITY_HUB_PATH;
	}
}
