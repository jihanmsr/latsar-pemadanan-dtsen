import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow internal Next.js paths, public assets, and auth APIs
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/images') // assuming public images
  ) {
    return NextResponse.next();
  }

  // 2. Allow public pages
  if (pathname === '/' || pathname === '/login' || pathname === '/register' || pathname === '/sop' || pathname === '/dashboard/test-match') {
    return NextResponse.next();
  }

  // 3. Check for token
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // 4. Verify token
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch (error) {
    // Token invalid or expired
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth_token');
    return response;
  }
}

export const config = {
  // Protect all routes except those filtered in step 1
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
