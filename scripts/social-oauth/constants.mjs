/** Local OAuth bootstrap constants. Do not put secrets here. */

export const APP_NAME = 'avniguy-social';
export const SITE_URL = 'https://avniguy.co.il';

export const LOOPBACK_HOST = '127.0.0.1';
export const LOOPBACK_PORT_DEFAULT = 8788;
export const LOOPBACK_PATH = '/callback';

export const PROFILE_DIR = '.playwright/social-oauth-profile';
export const CLIENTS_DIR = '.playwright/oauth-clients';
export const FB_STORAGE_STATE = '.playwright/facebook-storage.json';

export const GMAIL_LOGIN_TIMEOUT_MS = 15 * 60 * 1000;
export const PORTAL_WAIT_MS = 10 * 60 * 1000;
export const CONSENT_WAIT_MS = 5 * 60 * 1000;

export const OAUTH_NETWORKS = Object.freeze(['youtube', 'x', 'linkedin', 'meta']);

export const YOUTUBE_SCOPE = 'https://www.googleapis.com/auth/youtube.upload';
export const X_SCOPES = 'tweet.read tweet.write users.read offline.access media.write';
export const LINKEDIN_SCOPES = 'openid profile w_member_social';
export const META_SCOPES = [
	'pages_show_list',
	'pages_read_engagement',
	'pages_manage_posts',
	'pages_manage_metadata',
	'instagram_basic',
	'instagram_content_publish',
	'business_management',
].join(',');

export const PORTAL_URLS = Object.freeze({
	gmail: 'https://mail.google.com/',
	youtubeCredentials: 'https://console.cloud.google.com/apis/credentials',
	youtubeApi: 'https://console.cloud.google.com/apis/library/youtube.googleapis.com',
	youtubeConsent: 'https://console.cloud.google.com/apis/credentials/consent',
	xPortal: 'https://developer.x.com/en/portal/dashboard',
	linkedinApps: 'https://www.linkedin.com/developers/apps',
	metaApps: 'https://developers.facebook.com/apps/',
	facebookPagesCreate: 'https://www.facebook.com/pages/create',
	instagramConvert: 'https://www.instagram.com/accounts/convert_to_professional_account/',
});
