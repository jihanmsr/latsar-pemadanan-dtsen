import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth, unauthorizedResponse, forbiddenResponse } from '@/lib/auth';
import { decrypt } from '@/lib/encryption';

function maskNIK(nik: string | null): string | null {
  if (!nik) return null;
  if (nik.length !== 16) return nik; // fallback
  return nik.substring(0, 6) + '********' + nik.substring(14);
}

/**
 * GET /api/results/[id]
 * Ambil semua matching results untuk submission tertentu.
 *
 * Ownership check:
 * - BPS_ADMIN: bisa akses semua
 * - PEMDA: hanya bisa akses submission miliknya sendiri
 *
 * Query params:
 *   ?status=EXACT_MATCH|PROBABLE_MATCH|NO_MATCH (filter opsional)
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
    const submissionId = id;

    if (!submissionId) {
      return NextResponse.json(
        { success: false, error: 'ID submission tidak valid.' },
        { status: 400 }
      );
    }

    // ── 2. AMBIL SUBMISSION UNTUK OWNERSHIP CHECK ─────────────────────────
    const subRows = await query(`
      SELECT s.id, s.user_id, s.file_name, s.file_type, s.status, s.total_rows, 
             s.valid_rows, s.sla_deadline, s.created_at,
             u.name as user_name, u.instansi as user_instansi, u.email as user_email
      FROM submissions s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = ? LIMIT 1
    `, [submissionId]);

    if (subRows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Submission tidak ditemukan.' },
        { status: 404 }
      );
    }
    
    const s = subRows[0];
    const docRows = await query(`SELECT doc_type, is_signed, uploaded_at FROM documents WHERE submission_id = ?`, [submissionId]);
    
    const submission = {
      id: s.id,
      user_id: s.user_id,
      file_name: s.file_name,
      file_type: s.file_type,
      status: s.status,
      total_rows: s.total_rows,
      valid_rows: s.valid_rows,
      sla_deadline: s.sla_deadline,
      created_at: s.created_at,
      user: {
        name: s.user_name,
        instansi: s.user_instansi,
        email: s.user_email
      },
      documents: docRows.map((d: any) => ({
        doc_type: d.doc_type,
        is_signed: d.is_signed === 1 || d.is_signed === true,
        uploaded_at: d.uploaded_at
      }))
    };

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
      | 'EXACT_MATCH' | 'PROBABLE_MATCH' | 'NO_MATCH' | null;
    const limit  = Math.min(parseInt(searchParams.get('limit') ?? '50'), 200);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // ── 4. AMBIL MATCHING RESULTS ─────────────────────────────────────────
    const conditions = ['submission_id = ?'];
    const values = [submissionId];
    if (filterStatus) {
      conditions.push('status_padan = ?');
      values.push(filterStatus);
    }
    const whereSql = 'WHERE ' + conditions.join(' AND ');

    const countRes = await query(`SELECT COUNT(*) as total FROM matching_results ${whereSql}`, values);
    const totalResults = Number(countRes[0].total);

    const results = await query(`
      SELECT id, nik_usulan, nama_usulan, nik_master, nama_master, similarity_score, status_padan, alasan_anomali
      FROM matching_results
      ${whereSql}
      ORDER BY FIELD(status_padan, 'PROBABLE_MATCH', 'EXACT_MATCH', 'NO_MATCH'), similarity_score DESC
      LIMIT ? OFFSET ?
    `, [...values, limit, offset]);

    // ── 5. HITUNG AGREGAT ─────────────────────────────────────────────────
    const aggRes = await query(`
      SELECT 
        SUM(CASE WHEN status_padan = 'EXACT_MATCH' THEN 1 ELSE 0 END) as padanCount,
        SUM(CASE WHEN status_padan = 'PROBABLE_MATCH' THEN 1 ELSE 0 END) as anomaliCount,
        SUM(CASE WHEN status_padan = 'NO_MATCH' THEN 1 ELSE 0 END) as tidakPadanCount,
        AVG(similarity_score) as avgScore
      FROM matching_results
      WHERE submission_id = ?
    `, [submissionId]);

    const padanCount = Number(aggRes[0].padanCount || 0);
    const anomaliCount = Number(aggRes[0].anomaliCount || 0);
    const tidakPadanCount = Number(aggRes[0].tidakPadanCount || 0);
    const avgScore = Number(aggRes[0].avgScore || 0);

    return NextResponse.json({
      success: true,
      submission: {
        ...submission,
        stats: {
          padan: padanCount,
          anomali: anomaliCount,
          tidak_padan: tidakPadanCount,
          avg_score: avgScore.toFixed(2),
        },
      },
      results: results.map((r: any) => {
        const decryptedUsulan = r.nik_usulan ? decrypt(r.nik_usulan) : null;
        const decryptedMaster = r.nik_master ? decrypt(r.nik_master) : null;
        return {
          ...r,
          nik_usulan: maskNIK(decryptedUsulan),
          nik_master: maskNIK(decryptedMaster),
          similarity_score: Number(r.similarity_score ?? 0),
        };
      }),
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
