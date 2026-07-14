import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth, unauthorizedResponse, forbiddenResponse } from '@/lib/auth';

/**
 * GET /api/analysis
 * Hanya BPS_ADMIN yang bisa melihat statistik agregat.
 * Mengembalikan data akurasi matching, pre-matching, dan SLA.
 */
export async function GET(req: NextRequest) {
  // ── 1. AUTH CHECK ─────────────────────────────────────────────────────
  const { user, error } = await verifyAuth(req);
  if (!user) return unauthorizedResponse(error ?? undefined);

  // ── 2. ROLE CHECK: hanya BPS_ADMIN ────────────────────────────────────
  if (user.role !== 'BPS_ADMIN') {
    return forbiddenResponse('Statistik analisis hanya tersedia untuk Admin BPS.');
  }

  try {
    // ── 3. ANALISIS KUALITAS & AKURASI (Matching Engine) ─────────────────
    const [totalMatch, totalAnomaly, totalNotMatch, avgScoreAgg] = await Promise.all([
      prisma.matchingResult.count({ where: { status_padan: 'PADAN' } }),
      prisma.matchingResult.count({ where: { status_padan: 'ANOMALI' } }),
      prisma.matchingResult.count({ where: { status_padan: 'TIDAK_PADAN' } }),
      prisma.matchingResult.aggregate({ _avg: { similarity_score: true } }),
    ]);

    // ── 4. ANALISIS DESKRIPTIF (Pre-Matching) ────────────────────────────
    const [totalSubmissions, validatedSubmissions, completedSubmissions, failedSubmissions] =
      await Promise.all([
        prisma.submission.count(),
        prisma.submission.count({ where: { status: 'VALIDATED' } }),
        prisma.submission.count({ where: { status: 'COMPLETED' } }),
        prisma.submission.count({ where: { status: 'FAILED' } }),
      ]);

    // ── 5. ANALISIS SLA ───────────────────────────────────────────────────
    const completedWithSla = await prisma.submission.findMany({
      where: { status: 'COMPLETED', sla_deadline: { not: null } },
      select: { created_at: true, sla_deadline: true },
    });

    const metSla = completedWithSla.filter(s =>
      s.sla_deadline && new Date(s.sla_deadline) >= s.created_at
    ).length;

    const slaPercentage = completedWithSla.length > 0
      ? ((metSla / completedWithSla.length) * 100).toFixed(1)
      : '100.0';

    // ── 6. MASTER DTSEN STATS ─────────────────────────────────────────────
    const masterTotal = await prisma.masterDtsen.count();
    const masterActive = await prisma.masterDtsen.count({ where: { is_active: true } });

    return NextResponse.json({
      success: true,
      data: {
        accuracy: {
          padan: totalMatch,
          anomali: totalAnomaly,
          tidak_padan: totalNotMatch,
          total: totalMatch + totalAnomaly + totalNotMatch,
          rata_rata_skor: Number(avgScoreAgg._avg.similarity_score ?? 0).toFixed(2),
        },
        pre_matching: {
          total_pengajuan: totalSubmissions,
          lolos_validasi: validatedSubmissions,
          selesai: completedSubmissions,
          gagal: failedSubmissions,
          ditolak_sistem: totalSubmissions - validatedSubmissions - completedSubmissions - failedSubmissions,
        },
        sla: {
          target_hari: 2,
          persentase_tepat_waktu: `${slaPercentage}%`,
          keterangan: completedWithSla.length > 0
            ? `${metSla} dari ${completedWithSla.length} submission selesai sesuai SLA.`
            : 'Belum ada submission yang selesai.',
        },
        master_dtsen: {
          total: masterTotal,
          aktif: masterActive,
        },
      },
    });

  } catch (err) {
    console.error('[/api/analysis] Error:', err);
    // Kembalikan error yang jelas, bukan mock data
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal mengambil data analisis. Pastikan koneksi database aktif.',
        detail: process.env.NODE_ENV === 'development' ? String(err) : undefined,
      },
      { status: 500 }
    );
  }
}
