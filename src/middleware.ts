
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define protected paths
  const isProtectedPath = path.startsWith('/admin') || path === '/profile';

  // Get the token from cookies
  const token = request.cookies.get('firebaseIdToken')?.value;

  // If trying to access a protected path without a token, redirect to login
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Role-based authorization is handled client-side in the relevant layouts (e.g., AdminLayout)
  // This middleware is primarily for authentication (checking if the user is logged in).
  // This prevents users from even seeing a flash of protected content before being redirected.

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/profile'],
}
