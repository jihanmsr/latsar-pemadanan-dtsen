import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  const cookie = serialize('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return NextResponse.json(
    { message: 'Logout berhasil' },
    { 
      status: 200,
      headers: { 'Set-Cookie': cookie }
    }
  );
}
