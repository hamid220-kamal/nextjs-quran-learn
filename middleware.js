import { NextResponse } from 'next/server'

export function middleware(request) {
  const url = request.nextUrl.clone()
  const pathname = url.pathname
  // Only redirect if the path is /Quran (capitalized), not /quran itself
  if (pathname === '/Quran' || pathname === '/QURAN' || pathname === '/Quran/') {
    url.pathname = '/quran'
    return NextResponse.redirect(url, 307)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/Quran', '/QURAN', '/Quran/']
}
