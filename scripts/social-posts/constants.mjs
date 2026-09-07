/** Social-posts CLI constants. Do not put secrets here. */

export const SITE_URL = 'https://avniguy.co.il';
export const CONTACT_URL = 'https://avniguy.co.il/contact/';
export const DISCLAIMER = 'התוכן אינו ייעוץ משפטי.';
export const BRAND = 'גיא אבני';

export const NETWORKS = Object.freeze(['x', 'instagram', 'youtube', 'linkedin', 'facebook']);

export const NETWORK_ENV_KEYS = Object.freeze({
	x: Object.freeze(['X_USER_ACCESS_TOKEN']),
	instagram: Object.freeze(['IG_USER_ID', 'IG_ACCESS_TOKEN']),
	linkedin: Object.freeze(['LINKEDIN_ACCESS_TOKEN', 'LINKEDIN_AUTHOR_URN']),
	facebook: Object.freeze(['FACEBOOK_PAGE_ID', 'FACEBOOK_PAGE_ACCESS_TOKEN']),
	youtube: Object.freeze(['YOUTUBE_CLIENT_ID', 'YOUTUBE_CLIENT_SECRET', 'YOUTUBE_REFRESH_TOKEN']),
});

export const X_CHAR_LIMIT = 280;
export const X_URL_WEIGHT = 23;
export const IG_CAPTION_LIMIT = 2200;
export const LINKEDIN_LIMIT = 3000;
export const FACEBOOK_SOFT_LIMIT = 500;
export const YT_TITLE_LIMIT = 100;
export const YT_DESC_LIMIT = 5000;

export const GRAPH_API_VERSION_DEFAULT = 'v22.0';
export const LINKEDIN_VERSION_DEFAULT = '202607';

export const PROFILE_HOST_HINTS = Object.freeze({
	x: ['x.com/', 'twitter.com/'],
	instagram: ['instagram.com/'],
	youtube: ['youtube.com/'],
	linkedin: ['linkedin.com/'],
	facebook: ['facebook.com/'],
});
