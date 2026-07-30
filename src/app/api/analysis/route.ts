import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
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
    const matchAgg = await query(`
      SELECT 
        SUM(CASE WHEN status_padan = 'EXACT_MATCH' THEN 1 ELSE 0 END) as padanCount,
        SUM(CASE WHEN status_padan = 'PROBABLE_MATCH' THEN 1 ELSE 0 END) as anomaliCount,
        SUM(CASE WHEN status_padan = 'NO_MATCH' THEN 1 ELSE 0 END) as tidakPadanCount,
        AVG(similarity_score) as avgScore
      FROM matching_results
    `);
    const totalMatch = Number(matchAgg[0].padanCount || 0);
    const totalAnomaly = Number(matchAgg[0].anomaliCount || 0);
    const totalNotMatch = Number(matchAgg[0].tidakPadanCount || 0);
    const avgScore = Number(matchAgg[0].avgScore || 0);

    // ── 4. ANALISIS DESKRIPTIF (Pre-Matching) ────────────────────────────
    const subAgg = await query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'VALIDATED' THEN 1 ELSE 0 END) as validated,
        SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'FAILED' THEN 1 ELSE 0 END) as failed
      FROM submissions
    `);
    
    const totalSubmissions = Number(subAgg[0].total || 0);
    const validatedSubmissions = Number(subAgg[0].validated || 0);
    const completedSubmissions = Number(subAgg[0].completed || 0);
    const failedSubmissions = Number(subAgg[0].failed || 0);

    // ── 5. ANALISIS SLA ───────────────────────────────────────────────────
    const completedWithSla = await query(`
      SELECT created_at, sla_deadline 
      FROM submissions 
      WHERE status = 'COMPLETED' AND sla_deadline IS NOT NULL
    `);

    const metSla = completedWithSla.filter((s: any) =>
      s.sla_deadline && new Date(s.sla_deadline) >= new Date(s.created_at)
    ).length;

    const slaPercentage = completedWithSla.length > 0
      ? ((metSla / completedWithSla.length) * 100).toFixed(1)
      : '100.0';

    // ── 6. MASTER DTSEN STATS ─────────────────────────────────────────────
    const masterStats = await query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active
      FROM master_dtsen
    `);
    const masterTotal = Number(masterStats[0].total || 0);
    const masterActive = Number(masterStats[0].active || 0);

    return NextResponse.json({
      success: true,
      data: {
        accuracy: {
          padan: totalMatch,
          anomali: totalAnomaly,
          tidak_padan: totalNotMatch,
          total: totalMatch + totalAnomaly + totalNotMatch,
          rata_rata_skor: avgScore.toFixed(2),
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
