import { SITE_URL } from '../consts';

export const buildOrganizationSchema = () => ({
	'@context': 'https://schema.org',
	'@type': 'LegalService',
	name: 'גיא אבני משרד עורכי דין',
	url: SITE_URL,
	inLanguage: 'he',
	founder: {
		'@type': 'Person',
		name: 'גיא אבני',
	},
});

export const buildBreadcrumbSchema = (items: Array<{ name: string; path: string }>) => ({
	'@context': 'https://schema.org',
	'@type': 'BreadcrumbList',
	itemListElement: items.map((item, index) => ({
		'@type': 'ListItem',
		position: index + 1,
		name: item.name,
		item: new URL(item.path, SITE_URL).toString(),
	})),
});
