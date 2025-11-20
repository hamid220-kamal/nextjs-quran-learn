import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to add security headers and optimizations
 * Ensures SEO-friendly headers and security best practices
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // ✅ Security Headers
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // Control referrer information
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Control browser features and APIs
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  // ✅ Performance Headers
  // Enable compression
  response.headers.set('Accept-Encoding', 'gzip, deflate, br');

  // ✅ SEO Headers
  // Allow search engines to crawl (unless noindex is set in robots.txt)
  response.headers.set('X-Robots-Tag', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

  // Canonical URL enforcement
  if (!response.headers.has('Link')) {
    response.headers.set('Link', `<${request.nextUrl.origin}${request.nextUrl.pathname}>; rel="canonical"`);
  }

  return response;
}

/**
 * Configure which routes the middleware runs on
 * Exclude static assets, API routes for brevity
 */
export const config = {
  matcher: [
    // Match all pages except those starting with:
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
