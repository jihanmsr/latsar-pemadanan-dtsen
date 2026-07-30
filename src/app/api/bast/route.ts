import { NextRequest, NextResponse } from 'next/server';

import { verifyAuth, unauthorizedResponse } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { user, error } = await verifyAuth(req);
  if (!user) return unauthorizedResponse(error ?? undefined);

  const { searchParams } = new URL(req.url);
  const submissionId = searchParams.get('submissionId');

  if (!submissionId) {
    return NextResponse.json({ success: false, error: 'submissionId diperlukan' }, { status: 400 });
  }

  // Simulated BAST Generation - in a real app this would generate a PDF
  const text = `
    BERITA ACARA SERAH TERIMA (BAST) DATA PEMADANAN
    ===============================================
    ID Pengajuan: ${submissionId}
    Instansi: ${user.instansi || 'Pemerintah Daerah'}
    Tanggal: ${new Date().toLocaleDateString('id-ID')}
    
    Dengan ini menyatakan bahwa telah dilakukan proses pemadanan data
    Kesejahteraan Sosial (PAKEWA) dan hasilnya siap diunduh.
    
    Ditandatangani oleh:
    ${user.name} (Perwakilan Instansi)
  `;

  return new NextResponse(text, {
    headers: {
      'Content-Type': 'text/plain',
      'Content-Disposition': `attachment; filename="BAST_${submissionId}.txt"`,
    },
  });
}
