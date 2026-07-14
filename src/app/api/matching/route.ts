import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth';
import { calculateLevenshteinSimilarity } from '@/utils/matching-engine';

const THRESHOLD_PADAN = 80;      // skor ≥ 80 → PADAN
const THRESHOLD_ANOMALI = 60;    // 60 ≤ skor < 80 → ANOMALI
                                  // skor < 60 → TIDAK_PADAN

/**
 * POST /api/matching
 * Body: { submissionId: number }
 * 
 * Proses pemadanan:
 * 1. Ambil data valid dari submission (original_file_data)
 * 2. Untuk setiap NIK usulan, cari kandidat terbaik di master_dtsen
 * 3. Hitung similarity score dengan Levenshtein (nama)
 * 4. Simpan hasil ke matching_results
 * 5. Update status submission → COMPLETED
 */
export async function POST(req: NextRequest) {
  // ── 1. AUTH CHECK ────────────────────────────────────────────────────────
  const { user, error } = await verifyAuth(req);
  if (!user) return unauthorizedResponse(error ?? undefined);

  try {
    const body = await req.json() as { submissionId: number };
    const { submissionId } = body;

    if (!submissionId || isNaN(Number(submissionId))) {
      return NextResponse.json(
        { success: false, error: 'submissionId tidak valid.' },
        { status: 400 }
      );
    }

    // ── 2. AMBIL SUBMISSION ──────────────────────────────────────────────
    const submission = await prisma.submission.findUnique({
      where: { id: Number(submissionId) },
    });

    if (!submission) {
      return NextResponse.json(
        { success: false, error: 'Submission tidak ditemukan.' },
        { status: 404 }
      );
    }

    // PEMDA hanya bisa proses submission milik sendiri
    if (user.role === 'PEMDA' && submission.user_id !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Akses ditolak.' },
        { status: 403 }
      );
    }

    // Update status → MATCHING saat sedang diproses
    await prisma.submission.update({
      where: { id: submission.id },
      data: { status: 'MATCHING' },
    });

    // ── 3. AMBIL DATA USULAN ─────────────────────────────────────────────
    type UploadedRow = {
      nik?: string;
      nama?: string;
      nama_lengkap?: string;
      [key: string]: unknown;
    };

    const uploadedRows = (submission.original_file_data as UploadedRow[]) ?? [];

    if (uploadedRows.length === 0) {
      await prisma.submission.update({
        where: { id: submission.id },
        data: { status: 'FAILED' },
      });
      return NextResponse.json(
        { success: false, error: 'Tidak ada data dalam submission ini.' },
        { status: 422 }
      );
    }

    // ── 4. AMBIL SEMUA MASTER DTSEN ──────────────────────────────────────
    const masterData = await prisma.masterDtsen.findMany({
      where: { is_active: true },
      select: { nik: true, nama_lengkap: true },
    });

    // Buat Map NIK → nama untuk lookup cepat O(1)
    const masterMap = new Map<string, string>();
    masterData.forEach(m => {
      if (m.nik && m.nama_lengkap) masterMap.set(m.nik, m.nama_lengkap);
    });

    // ── 5. PROSES MATCHING ───────────────────────────────────────────────
    const results: {
      submission_id: number;
      nik_usulan: string;
      nama_usulan: string;
      nik_master: string | null;
      nama_master: string | null;
      similarity_score: number;
      status_padan: 'PADAN' | 'ANOMALI' | 'TIDAK_PADAN';
    }[] = [];

    for (const row of uploadedRows) {
      const nikUsulan = (row.nik ?? '').toString().trim();
      const namaUsulan = (row.nama ?? row.nama_lengkap ?? '').toString().trim();

      // Cek apakah NIK ada di master (exact match)
      const namaMaster = masterMap.get(nikUsulan);

      if (namaMaster) {
        // TAHAP 1: DETERMINISTIK (NIK 100% Cocok)
        const score = calculateLevenshteinSimilarity(namaUsulan, namaMaster);
        let status: 'PADAN' | 'ANOMALI' | 'TIDAK_PADAN';

        if (score >= THRESHOLD_PADAN) {
          status = 'PADAN';
        } else if (score >= THRESHOLD_ANOMALI) {
          status = 'ANOMALI';
        } else {
          status = 'TIDAK_PADAN';
        }

        results.push({
          submission_id: submission.id,
          nik_usulan: nikUsulan,
          nama_usulan: namaUsulan,
          nik_master: nikUsulan,
          nama_master: namaMaster,
          similarity_score: score,
          status_padan: status,
        });
      } else {
        // TAHAP 2: PROBABILISTIK (Cari NIK dengan 12 digit pertama sama)
        const prefix12 = nikUsulan.substring(0, 12);
        let bestCandidateNik: string | null = null;
        let bestCandidateNama: string | null = null;
        let bestScore = -1;

        if (prefix12.length === 12) {
          for (const [nikMasterItem, namaMasterItem] of masterMap.entries()) {
            if (nikMasterItem.startsWith(prefix12)) {
              const score = calculateLevenshteinSimilarity(namaUsulan, namaMasterItem);
              if (score > bestScore) {
                bestScore = score;
                bestCandidateNik = nikMasterItem;
                bestCandidateNama = namaMasterItem;
              }
            }
          }
        }

        if (bestCandidateNik && bestScore >= THRESHOLD_PADAN) {
          results.push({
            submission_id: submission.id,
            nik_usulan: nikUsulan,
            nama_usulan: namaUsulan,
            nik_master: bestCandidateNik,
            nama_master: bestCandidateNama,
            similarity_score: bestScore,
            status_padan: 'PADAN',
          });
        } else if (bestCandidateNik && bestScore >= THRESHOLD_ANOMALI) {
          results.push({
            submission_id: submission.id,
            nik_usulan: nikUsulan,
            nama_usulan: namaUsulan,
            nik_master: bestCandidateNik,
            nama_master: bestCandidateNama,
            similarity_score: bestScore,
            status_padan: 'ANOMALI',
          });
        } else {
          // NIK tidak ada di master dan tidak ada yang mendekati → TIDAK_PADAN
          results.push({
            submission_id: submission.id,
            nik_usulan: nikUsulan,
            nama_usulan: namaUsulan,
            nik_master: null,
            nama_master: null,
            similarity_score: 0,
            status_padan: 'TIDAK_PADAN',
          });
        }
      }
    }

    // ── 6. HAPUS HASIL LAMA (jika re-matching) & INSERT BARU ────────────
    await prisma.matchingResult.deleteMany({
      where: { submission_id: submission.id },
    });

    await prisma.matchingResult.createMany({
      data: results.map(r => ({
        ...r,
        similarity_score: r.similarity_score,
      })),
    });

    // ── 7. HITUNG STATISTIK ──────────────────────────────────────────────
    const padanCount    = results.filter(r => r.status_padan === 'PADAN').length;
    const anomaliCount  = results.filter(r => r.status_padan === 'ANOMALI').length;
    const tidakPadanCount = results.filter(r => r.status_padan === 'TIDAK_PADAN').length;
    const avgScore = results.length > 0
      ? results.reduce((sum, r) => sum + r.similarity_score, 0) / results.length
      : 0;

    // ── 8. UPDATE STATUS SUBMISSION → COMPLETED ──────────────────────────
    await prisma.submission.update({
      where: { id: submission.id },
      data: { status: 'COMPLETED' },
    });

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      stats: {
        totalDiproses: results.length,
        padan: padanCount,
        anomali: anomaliCount,
        tidakPadan: tidakPadanCount,
        avgScore: Number(avgScore.toFixed(2)),
      },
      message: `Pemadanan selesai. ${padanCount} PADAN, ${anomaliCount} ANOMALI, ${tidakPadanCount} TIDAK PADAN.`,
    });

  } catch (err) {
    console.error('[/api/matching] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan saat proses matching.' },
      { status: 500 }
    );
  }
}
