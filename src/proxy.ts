import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limit store (Note: In production Edge runtime, this resets often. Use Redis/Upstash for production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const MAX_REQUESTS = 5; // 5 requests
const WINDOW_MS = 60 * 1000; // 1 minute

export function proxy(request: NextRequest) {
  // Hanya terapkan rate limiter untuk endpoint sensitif
  const sensitivePaths = ['/api/auth/login', '/api/admin/verify'];
  
  if (sensitivePaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    
    const now = Date.now();
    const windowStart = now - WINDOW_MS;
    
    let record = rateLimitStore.get(ip);
    
    // Clear expired records (simple cleanup)
    if (record && record.resetTime < now) {
      rateLimitStore.delete(ip);
      record = undefined;
    }
    
    if (!record) {
      rateLimitStore.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    } else {
      record.count += 1;
      
      if (record.count > MAX_REQUESTS) {
        return NextResponse.json(
          { success: false, error: 'Terlalu banyak permintaan. Silakan coba lagi nanti.' },
          { status: 429, headers: { 'Retry-After': '60' } }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/auth/login', '/api/admin/verify'],
};
