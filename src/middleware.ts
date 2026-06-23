import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const OLD_SLUG_PREFIX = 'guy-avni-';

/**
 * Permanent-redirect legacy blog slugs that used the `guy-avni-` filename prefix.
 *
 * Guards against redirect loops:
 * - only acts on single-segment /blog/<slug> paths
 * - skips when the slug does not carry the legacy prefix
 * - skips when stripping the prefix would yield an empty slug or a slug that
 *   still starts with the prefix (which would redirect to itself / loop)
 * - skips when the computed destination equals the incoming path
 *
 * In development we issue a temporary 307 instead of a permanent 308 so the
 * preview browser never hard-caches a redirect (the classic cause of
 * ERR_TOO_MANY_REDIRECTS in the live preview).
 */
export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const blogMatch = pathname.match(/^\/blog\/([^/]+)\/?$/);
	if (!blogMatch) {
		return NextResponse.next();
	}

	const segment = blogMatch[1];
	if (!segment.startsWith(OLD_SLUG_PREFIX)) {
		return NextResponse.next();
	}

	const newSlug = segment.slice(OLD_SLUG_PREFIX.length);
	// Empty result, or still-prefixed result, would loop. Bail out.
	if (newSlug.length === 0 || newSlug.startsWith(OLD_SLUG_PREFIX)) {
		return NextResponse.next();
	}

	const destinationPath = `/blog/${newSlug}/`;
	if (destinationPath === pathname) {
		return NextResponse.next();
	}

	const destination = request.nextUrl.clone();
	destination.pathname = destinationPath;
	const status = process.env.NODE_ENV === 'production' ? 308 : 307;
	console.info('[middleware] redirect legacy blog slug', { from: pathname, to: destinationPath, status });
	return NextResponse.redirect(destination, status);
}

export const config = {
	matcher: '/blog/:slug*',
};
