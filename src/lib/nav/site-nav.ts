/** Single source of truth for primary site navigation links. */
export const SITE_NAV_LINKS: ReadonlyArray<{ href: string; label: string }> = [
	{ href: '/', label: 'בית' },
	{ href: '/about/', label: 'אודות' },
	{ href: '/services/', label: 'שירותים' },
	{ href: '/blog/', label: 'מאמרים' },
	{ href: '/categories/', label: 'נושאים' },
	{ href: '/tags/', label: 'תגיות' },
	{ href: '/contact/', label: 'יצירת קשר' },
] as const;

export const FOOTER_NAV_LINKS: ReadonlyArray<{ href: string; label: string }> = [
	{ href: '/about/', label: 'אודות' },
	{ href: '/services/', label: 'שירותים' },
	{ href: '/blog/', label: 'מאמרים' },
	{ href: '/categories/', label: 'קטגוריות' },
	{ href: '/tags/', label: 'תגיות' },
	{ href: '/contact/', label: 'יצירת קשר' },
] as const;
