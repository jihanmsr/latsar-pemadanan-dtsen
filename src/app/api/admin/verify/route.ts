import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { performMatching } from '@/lib/matchingEngine';

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await verifyAuth(request);
    
    // Pastikan user adalah Admin BPS
    if (!user || user.role !== 'BPS_ADMIN') {
      return NextResponse.json({ message: 'Unauthorized. Akses ditolak.' }, { status: 401 });
    }

    const { submissionId } = await request.json();

    if (!submissionId) {
      return NextResponse.json({ message: 'Submission ID diperlukan' }, { status: 400 });
    }

    // Ambil data submission
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: { user: true }
    });

    if (!submission) {
      return NextResponse.json({ message: 'Submission tidak ditemukan' }, { status: 404 });
    }

    if (submission.status !== 'PENDING') {
      return NextResponse.json({ message: 'Submission ini sudah diverifikasi atau dalam proses' }, { status: 400 });
    }

    // Ubah status ke MATCHING (sedang diproses)
    await prisma.submission.update({
      where: { id: submissionId },
      data: { status: 'MATCHING' }
    });

    // Ambil data master DTSEN
    const masterData = await prisma.masterDtsen.findMany({
      where: { is_active: true },
      select: { nik: true, nama_lengkap: true }
    });

    // Ambil data original yang disubmit (dari JSON payload file upload)
    const fileData = submission.original_file_data as any;
    if (!fileData || !Array.isArray(fileData)) {
       // Jika tidak ada data
       await prisma.submission.update({
        where: { id: submissionId },
        data: { status: 'FAILED' }
      });
      return NextResponse.json({ message: 'Data submission tidak valid atau kosong' }, { status: 400 });
    }

    // Proses matching baris per baris
    // Note: Ini bisa sangat berat jika ribuan data.
    // Ideally kita proses menggunakan queue system (Redis/Bull) atau background job.
    // Tapi untuk keperluan MVP ini, kita jalankan di sini.

    let totalValid = 0;

    for (const row of fileData) {
      const inputNik = row.nik?.toString().trim() || '';
      const inputName = row.nama?.toString().trim() || row.nama_lengkap?.toString().trim() || '';

      const matchResult = performMatching(inputNik, inputName, masterData as any);
      
      let statusPadan: any = 'TIDAK_PADAN';
      if (matchResult.status === 'Padan Deterministik' || matchResult.status === 'Padan Probabilistik') {
        statusPadan = 'PADAN';
        totalValid++;
      } else if (matchResult.status === 'Format Tidak Valid') {
        statusPadan = 'ANOMALI';
      }

      await prisma.matchingResult.create({
        data: {
          submission_id: submissionId,
          nik_usulan: inputNik.substring(0, 16),
          nama_usulan: inputName,
          nik_master: matchResult.matched_nik,
          nama_master: matchResult.matched_nama,
          similarity_score: matchResult.score,
          status_padan: statusPadan
        }
      });
    }

    // Update status submission ke COMPLETED (Terverifikasi)
    const updated = await prisma.submission.update({
      where: { id: submissionId },
      data: { 
        status: 'VALIDATED', // Validated in Admin POV
        valid_rows: totalValid,
        total_rows: fileData.length
      }
    });

    return NextResponse.json({ 
      message: 'Verifikasi selesai', 
      submission: updated,
      total_rows: fileData.length,
      valid_rows: totalValid
    }, { status: 200 });

  } catch (error: any) {
    console.error('Verifikasi Error:', error);
    return NextResponse.json({ message: error.message || 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}
