import { replaceEmDashDeep } from '@/lib/content/sanitize-user-facing-text';

/** Single source of truth for primary site navigation links. */
/** Sitelink-candidate freeze: בית + אודות / שירותים / מאמרים / יצירת קשר only. */
const SITE_NAV_LINKS_RAW = [
	{ href: '/', label: 'בית' },
	{ href: '/about/', label: 'אודות' },
	{ href: '/services/', label: 'שירותים' },
	{ href: '/blog/', label: 'מאמרים' },
	{ href: '/contact/', label: 'יצירת קשר' },
] as const;

const FOOTER_NAV_LINKS_RAW = [
	{ href: '/about/', label: 'אודות' },
	{ href: '/services/', label: 'שירותים' },
	{ href: '/blog/', label: 'מאמרים' },
	{ href: '/contact/', label: 'יצירת קשר' },
] as const;

export const SITE_NAV_LINKS = replaceEmDashDeep(SITE_NAV_LINKS_RAW);

export const FOOTER_NAV_LINKS = replaceEmDashDeep(FOOTER_NAV_LINKS_RAW);
