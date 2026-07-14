import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth';

/**
 * GET /api/submissions
 * - BPS_ADMIN: lihat semua submission
 * - PEMDA: hanya lihat submission miliknya sendiri
 *
 * Query params:
 *   ?status=PENDING|VALIDATED|MATCHING|COMPLETED|FAILED
 *   ?limit=20 (default: 20, max: 100)
 *   ?offset=0
 */
export async function GET(req: NextRequest) {
  // ── 1. AUTH CHECK ─────────────────────────────────────────────────────
  const { user, error } = await verifyAuth(req);
  if (!user) return unauthorizedResponse(error ?? undefined);

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as
      | 'PENDING' | 'VALIDATED' | 'MATCHING' | 'COMPLETED' | 'FAILED' | null;
    const limit  = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // ── 2. BANGUN WHERE CLAUSE (role-aware) ──────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = {};

    if (user.role === 'PEMDA') {
      where.user_id = user.id; // PEMDA hanya lihat submission sendiri
    }
    // BPS_ADMIN tidak ada filter user_id → lihat semua

    if (status) {
      where.status = status;
    }

    // ── 3. QUERY ──────────────────────────────────────────────────────────
    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({
        where,
        orderBy: { created_at: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          file_name: true,
          file_type: true,
          status: true,
          total_rows: true,
          valid_rows: true,
          sla_deadline: true,
          created_at: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              instansi: true,
            },
          },
          // Jangan include original_file_data (bisa sangat besar)
          matching_results: {
            select: {
              status_padan: true,
              similarity_score: true,
            },
          },
          documents: {
            select: {
              doc_type: true,
              is_signed: true,
            },
          },
        },
      }),
      prisma.submission.count({ where }),
    ]);

    // ── 4. FORMAT RESPONSE ────────────────────────────────────────────────
    const formatted = submissions.map(s => {
      const matchStats = s.matching_results.reduce(
        (acc, m) => {
          if (m.status_padan === 'PADAN') acc.padan++;
          else if (m.status_padan === 'ANOMALI') acc.anomali++;
          else acc.tidak_padan++;
          return acc;
        },
        { padan: 0, anomali: 0, tidak_padan: 0 }
      );

      const avgScore = s.matching_results.length > 0
        ? s.matching_results.reduce(
            (sum, m) => sum + Number(m.similarity_score ?? 0), 0
          ) / s.matching_results.length
        : null;

      return {
        id: s.id,
        file_name: s.file_name,
        file_type: s.file_type,
        status: s.status,
        total_rows: s.total_rows,
        valid_rows: s.valid_rows,
        sla_deadline: s.sla_deadline,
        created_at: s.created_at,
        user: s.user,
        matching_stats: {
          ...matchStats,
          avg_score: avgScore !== null ? Number(avgScore.toFixed(2)) : null,
          total: s.matching_results.length,
        },
        documents: s.documents,
      };
    });

    return NextResponse.json({
      success: true,
      data: formatted,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });

  } catch (err) {
    console.error('[/api/submissions] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data submission.' },
      { status: 500 }
    );
  }
}
