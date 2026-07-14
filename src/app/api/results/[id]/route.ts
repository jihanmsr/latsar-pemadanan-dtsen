import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth, unauthorizedResponse, forbiddenResponse } from '@/lib/auth';

/**
 * GET /api/results/[id]
 * Ambil semua matching results untuk submission tertentu.
 *
 * Ownership check:
 * - BPS_ADMIN: bisa akses semua
 * - PEMDA: hanya bisa akses submission miliknya sendiri
 *
 * Query params:
 *   ?status=PADAN|ANOMALI|TIDAK_PADAN (filter opsional)
 *   ?limit=50 (default 50, max 200)
 *   ?offset=0
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // ── 1. AUTH CHECK ─────────────────────────────────────────────────────
  const { user, error } = await verifyAuth(req);
  if (!user) return unauthorizedResponse(error ?? undefined);

  try {
    const { id } = await params;
    const submissionId = parseInt(id);

    if (isNaN(submissionId)) {
      return NextResponse.json(
        { success: false, error: 'ID submission tidak valid.' },
        { status: 400 }
      );
    }

    // ── 2. AMBIL SUBMISSION UNTUK OWNERSHIP CHECK ─────────────────────────
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      select: {
        id: true,
        user_id: true,
        file_name: true,
        file_type: true,
        status: true,
        total_rows: true,
        valid_rows: true,
        sla_deadline: true,
        created_at: true,
        user: {
          select: { name: true, instansi: true, email: true },
        },
        documents: {
          select: { doc_type: true, is_signed: true, uploaded_at: true },
        },
      },
    });

    if (!submission) {
      return NextResponse.json(
        { success: false, error: 'Submission tidak ditemukan.' },
        { status: 404 }
      );
    }

    // PEMDA hanya bisa akses submission miliknya sendiri
    if (user.role === 'PEMDA' && submission.user_id !== user.id) {
      return forbiddenResponse('Anda tidak memiliki akses ke submission ini.');
    }

    // ── 3. QUERY PARAMS ───────────────────────────────────────────────────
    const { searchParams } = new URL(req.url);
    const filterStatus = searchParams.get('status') as
      | 'PADAN' | 'ANOMALI' | 'TIDAK_PADAN' | null;
    const limit  = Math.min(parseInt(searchParams.get('limit') ?? '50'), 200);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // ── 4. AMBIL MATCHING RESULTS ─────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = { submission_id: submissionId };
    if (filterStatus) where.status_padan = filterStatus;

    const [results, totalResults] = await Promise.all([
      prisma.matchingResult.findMany({
        where,
        orderBy: [
          { status_padan: 'asc' }, // ANOMALI dulu, lalu PADAN, lalu TIDAK_PADAN
          { similarity_score: 'desc' },
        ],
        take: limit,
        skip: offset,
        select: {
          id: true,
          nik_usulan: true,
          nama_usulan: true,
          nik_master: true,
          nama_master: true,
          similarity_score: true,
          status_padan: true,
        },
      }),
      prisma.matchingResult.count({ where }),
    ]);

    // ── 5. HITUNG AGREGAT ─────────────────────────────────────────────────
    const [padanCount, anomaliCount, tidakPadanCount, avgScore] = await Promise.all([
      prisma.matchingResult.count({ where: { submission_id: submissionId, status_padan: 'PADAN' } }),
      prisma.matchingResult.count({ where: { submission_id: submissionId, status_padan: 'ANOMALI' } }),
      prisma.matchingResult.count({ where: { submission_id: submissionId, status_padan: 'TIDAK_PADAN' } }),
      prisma.matchingResult.aggregate({
        where: { submission_id: submissionId },
        _avg: { similarity_score: true },
      }),
    ]);

    return NextResponse.json({
      success: true,
      submission: {
        ...submission,
        stats: {
          padan: padanCount,
          anomali: anomaliCount,
          tidak_padan: tidakPadanCount,
          avg_score: Number(avgScore._avg.similarity_score ?? 0).toFixed(2),
        },
      },
      results: results.map(r => ({
        ...r,
        similarity_score: Number(r.similarity_score ?? 0),
      })),
      pagination: {
        total: totalResults,
        limit,
        offset,
        hasMore: offset + limit < totalResults,
      },
    });

  } catch (err) {
    console.error('[/api/results] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil hasil pemadanan.' },
      { status: 500 }
    );
  }
}
