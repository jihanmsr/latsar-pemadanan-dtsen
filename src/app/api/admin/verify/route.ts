import { NextRequest, NextResponse } from 'next/server';
import { query, batch } from '@/lib/db';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth';
import { performMatching } from '@/lib/matchingEngine';
import { decrypt, encrypt } from '@/lib/encryption';

export async function POST(req: NextRequest) {
  const { user, error } = await verifyAuth(req);
  if (!user || (user.role !== 'BPS_ADMIN' && user.role !== 'BPS_PEGAWAI')) return unauthorizedResponse(error ?? 'Hanya Admin BPS yang bisa melakukan verifikasi.');

  try {
    const body = await req.json() as { submissionId: string };
    const { submissionId } = body;

    if (!submissionId) {
      return NextResponse.json({ success: false, error: 'submissionId tidak valid.' }, { status: 400 });
    }

    const submissionRows = await query(`SELECT id, original_file_data FROM submissions WHERE id = ? LIMIT 1`, [submissionId]);

    if (submissionRows.length === 0) {
      return NextResponse.json({ success: false, error: 'Submission tidak ditemukan.' }, { status: 404 });
    }
    
    const submission = submissionRows[0];
    
    // Parse JSON safely since MariaDB might return string or object
    if (typeof submission.original_file_data === 'string') {
      try {
        submission.original_file_data = JSON.parse(submission.original_file_data);
      } catch(e) {
        submission.original_file_data = [];
      }
    }

    await query(`UPDATE submissions SET status = 'MATCHING' WHERE id = ?`, [submission.id]);

    type UploadedRow = { nik?: string; nama?: string; nama_lengkap?: string; [key: string]: unknown; };
    const uploadedRows = (submission.original_file_data as UploadedRow[]) ?? [];

    if (uploadedRows.length === 0) {
      await query(`UPDATE submissions SET status = 'FAILED' WHERE id = ?`, [submission.id]);
      return NextResponse.json({ success: false, error: 'Tidak ada data dalam submission ini.' }, { status: 422 });
    }

    // 1. Ambil semua Master DTSEN
    const masterDataEncrypted = await query(`SELECT nik, nama_lengkap FROM master_dtsen WHERE is_active = 1`);

    // Decrypt NIKs for matching engine
    const masterData = masterDataEncrypted.map((m: any) => {
      try {
        return { nik: decrypt(m.nik), nama_lengkap: m.nama_lengkap || '' };
      } catch (e) {
        return { nik: '', nama_lengkap: m.nama_lengkap || '' }; // Fallback if decryption fails
      }
    }).filter((m: any) => m.nik !== '');

    const resultsToInsert = [];

    let padanCount = 0;
    let anomaliCount = 0;
    let tidakPadanCount = 0;
    let totalScore = 0;

    for (const row of uploadedRows) {
      const nikUsulan = (row.nik ?? '').toString().trim();
      const namaUsulan = (row.nama ?? row.nama_lengkap ?? '').toString().trim();

      const matchRes = performMatching(nikUsulan, namaUsulan, masterData);

      let statusPadan: 'EXACT_MATCH' | 'PROBABLE_MATCH' | 'NO_MATCH' = 'NO_MATCH';
      
      if (matchRes.status === 'Padan Deterministik' || matchRes.score >= 80) {
        statusPadan = 'EXACT_MATCH';
        padanCount++;
      } else if (matchRes.score >= 60) {
        statusPadan = 'PROBABLE_MATCH';
        anomaliCount++;
      } else {
        tidakPadanCount++;
      }
      
      totalScore += matchRes.score;

      resultsToInsert.push([
        submission.id,
        encrypt(nikUsulan), // Encrypted NIK
        namaUsulan,
        matchRes.matched_nik ? encrypt(matchRes.matched_nik) : null, // Encrypted NIK
        matchRes.matched_nama || null,
        matchRes.score,
        statusPadan
      ]);
    }

    // Delete old if re-verifying
    await query(`DELETE FROM matching_results WHERE submission_id = ?`, [submission.id]);

    if (resultsToInsert.length > 0) {
      await batch(`
        INSERT INTO matching_results (submission_id, nik_usulan, nama_usulan, nik_master, nama_master, similarity_score, status_padan)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, resultsToInsert);
    }

    await query(`UPDATE submissions SET status = 'COMPLETED' WHERE id = ?`, [submission.id]);

    const avgScore = resultsToInsert.length > 0 ? totalScore / resultsToInsert.length : 0;

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      stats: {
        totalDiproses: resultsToInsert.length,
        padan: padanCount,
        anomali: anomaliCount,
        tidakPadan: tidakPadanCount,
        avgScore: Number(avgScore.toFixed(2)),
      },
      message: `Verifikasi selesai. ${padanCount} EXACT_MATCH, ${anomaliCount} PROBABLE_MATCH, ${tidakPadanCount} TIDAK EXACT_MATCH.`,
    });

  } catch (err) {
    console.error('[/api/admin/verify] Error:', err);
    return NextResponse.json({ success: false, error: 'Terjadi kesalahan saat verifikasi admin.' }, { status: 500 });
  }
}
