import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-me'
);

export interface AuthPayload {
  id: number;
  email: string;
  role: 'PEMDA' | 'BPS_ADMIN' | 'BPS_PEGAWAI';
  name: string;
  instansi?: string;
}

export interface AuthResult {
  user: AuthPayload | null;
  error: string | null;
}

/**
 * Verifikasi JWT dari cookie `auth_token`.
 * Bisa dipanggil dari Route Handler (pakai NextRequest) atau Server Action (pakai cookies()).
 */
export async function verifyAuth(req?: NextRequest): Promise<AuthResult> {
  try {
    let token: string | undefined;

    if (req) {
      // Dari NextRequest (Route Handler)
      token = req.cookies.get('auth_token')?.value;
    } else {
      // Dari Server Component / Action — pakai next/headers
      const cookieStore = await cookies();
      token = cookieStore.get('auth_token')?.value;
    }

    if (!token) {
      return { user: null, error: 'Token tidak ditemukan. Silakan login ulang.' };
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Cast payload ke AuthPayload
    const user: AuthPayload = {
      id: payload.id as number,
      email: payload.email as string,
      role: payload.role as 'PEMDA' | 'BPS_ADMIN' | 'BPS_PEGAWAI',
      name: payload.name as string,
      instansi: payload.instansi as string | undefined,
    };

    return { user, error: null };
  } catch {
    return { user: null, error: 'Token tidak valid atau sudah kedaluwarsa.' };
  }
}

/**
 * Helper: kembalikan 401 JSON jika tidak terautentikasi.
 * Gunakan di awal setiap protected Route Handler.
 */
export function unauthorizedResponse(message?: string) {
  const { NextResponse } = require('next/server');
  return NextResponse.json(
    { success: false, error: message || 'Tidak terautentikasi. Silakan login.' },
    { status: 401 }
  );
}

/**
 * Helper: kembalikan 403 JSON jika tidak punya hak akses (role salah).
 */
export function forbiddenResponse(message?: string) {
  const { NextResponse } = require('next/server');
  return NextResponse.json(
    { success: false, error: message || 'Akses ditolak. Anda tidak memiliki izin.' },
    { status: 403 }
  );
}
