import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of deprecated routes that should redirect to home
const DEPRECATED_ROUTES = [
  '/help',
  '/support',
  '/track',
  '/returns',
  '/stores',
  '/careers',
  '/reviews'
]

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Ignore static files and API routes
  if (
    path.startsWith('/_next/') ||
    path.startsWith('/api/') ||
    path.includes('.') // This will ignore files with extensions (e.g., .css, .js, .png)
  ) {
    return NextResponse.next()
  }

  // Check if the current path is in the deprecated routes list
  if (DEPRECATED_ROUTES.includes(path)) {
    // Redirect to home page
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// Configure matcher for the middleware
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/help',
    '/support',
    '/track',
    '/returns',
    '/stores',
    '/careers',
    '/reviews'
  ]
} 