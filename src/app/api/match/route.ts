import { NextResponse } from 'next/server';

/**
 * @deprecated Gunakan /api/matching sebagai gantinya.
 * Endpoint ini hanya ada untuk backward compatibility.
 */
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: 'Endpoint ini sudah tidak digunakan. Gunakan POST /api/matching.',
      redirect: '/api/matching',
    },
    { status: 410 } // 410 Gone
  );
}
