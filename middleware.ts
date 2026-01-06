import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Validate URL to prevent SSRF
const validateRedirectUrl = (url: string, baseUrl: string): boolean => {
  try {
    const parsedUrl = new URL(url)
    const baseUrlParsed = new URL(baseUrl)
    
    // Only allow same origin redirects
    return parsedUrl.origin === baseUrlParsed.origin
  } catch {
    return false
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl
  const baseUrl = request.url

  // Protected routes
  if (pathname.startsWith('/profile')) {
    if (!token) {
      const loginUrl = new URL('/login', baseUrl)
      if (validateRedirectUrl(loginUrl.toString(), baseUrl)) {
        return NextResponse.redirect(loginUrl)
      }
    }
  }

  // Redirect authenticated users away from login
  if (pathname.startsWith('/login') && token) {
    const homeUrl = new URL('/', baseUrl)
    if (validateRedirectUrl(homeUrl.toString(), baseUrl)) {
      return NextResponse.redirect(homeUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/profile/:path*', '/login']
}