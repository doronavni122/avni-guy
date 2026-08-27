/** Claimed public social profiles (operator-confirmed handles). */
export const SITE_SOCIAL_LINKS = [
	{ href: 'https://x.com/AvniGuy11492', label: 'X / Twitter' },
	{ href: 'https://www.instagram.com/guy_avni_lawyer/', label: 'Instagram' },
	{ href: 'https://www.youtube.com/@guyavni', label: 'YouTube' },
] as const;

export type SiteSocialLink = (typeof SITE_SOCIAL_LINKS)[number];
