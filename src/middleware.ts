import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const OLD_SLUG_PREFIX = 'guy-avni-';

/**
 * Permanent redirect legacy blog slugs that used the guy-avni- filename prefix.
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
	const destination = request.nextUrl.clone();
	destination.pathname = `/blog/${newSlug}/`;
	console.info('[middleware] redirect legacy blog slug', { from: pathname, to: destination.pathname });
	return NextResponse.redirect(destination, 308);
}

export const config = {
	matcher: '/blog/:slug*',
};
