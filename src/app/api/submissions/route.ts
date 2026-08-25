import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
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
    const conditions: string[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const values: any[] = [];

    if (user.role === 'PEMDA') {
      conditions.push('s.user_id = ?');
      values.push(user.id);
    } else if (user.role === 'BPS_PEGAWAI') {
      // Ekstrak nama wilayah dari "BPS Kota Palu" jadi "Kota Palu"
      let region = user.instansi || '';
      region = region.replace('BPS', '').trim();
      if (region) {
        conditions.push('u.instansi LIKE ?');
        values.push(`%${region}%`);
      }
    }

    if (status) {
      conditions.push('s.status = ?');
      values.push(status);
    }

    const whereSql = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
    
    // Get total
    const totalResult = await query(`SELECT COUNT(*) as total FROM submissions s ${whereSql}`, values);
    const total = Number(totalResult[0].total);

    // Get submissions
    const sql = `
      SELECT s.id, s.file_name, s.file_type, s.status, s.total_rows, s.valid_rows, s.sla_deadline, s.created_at,
             u.id as user_id, u.name as user_name, u.email as user_email, u.instansi as user_instansi
      FROM submissions s
      LEFT JOIN users u ON s.user_id = u.id
      ${whereSql}
      ORDER BY s.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const submissions = await query(sql, [...values, limit, offset]);

    if (submissions.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        pagination: { total, limit, offset, hasMore: false },
      });
    }

    const submissionIds = submissions.map((s: any) => s.id);
    const placeholders = submissionIds.map(() => '?').join(',');

    // Get matching results stats
    const matchStatsMap: Record<string, any> = {};
    const docsMap: Record<string, any[]> = {};
    for (const id of submissionIds) {
      matchStatsMap[id] = { padan: 0, anomali: 0, tidak_padan: 0, total_score: 0, total_count: 0 };
      docsMap[id] = [];
    }

    const matchingResults = await query(`
      SELECT submission_id, status_padan, similarity_score 
      FROM matching_results 
      WHERE submission_id IN (${placeholders})
    `, submissionIds);

    for (const row of matchingResults) {
      const stats = matchStatsMap[row.submission_id];
      if (row.status_padan === 'EXACT_MATCH') stats.padan++;
      else if (row.status_padan === 'PROBABLE_MATCH') stats.anomali++;
      else stats.tidak_padan++;
      
      stats.total_score += Number(row.similarity_score ?? 0);
      stats.total_count++;
    }

    // Get documents
    const documents = await query(`
      SELECT submission_id, doc_type, is_signed 
      FROM documents 
      WHERE submission_id IN (${placeholders})
    `, submissionIds);

    for (const doc of documents) {
      docsMap[doc.submission_id].push({
        doc_type: doc.doc_type,
        is_signed: doc.is_signed === 1 || doc.is_signed === true
      });
    }

    // ── 4. FORMAT RESPONSE ────────────────────────────────────────────────
    const formatted = submissions.map((s: any) => {
      const stats = matchStatsMap[s.id];
      const avgScore = stats.total_count > 0 ? stats.total_score / stats.total_count : null;

      return {
        id: s.id,
        file_name: s.file_name,
        file_type: s.file_type,
        status: s.status,
        total_rows: s.total_rows,
        valid_rows: s.valid_rows,
        sla_deadline: s.sla_deadline,
        created_at: s.created_at,
        user: {
          id: s.user_id,
          name: s.user_name,
          email: s.user_email,
          instansi: s.user_instansi
        },
        matching_stats: {
          padan: stats.padan,
          anomali: stats.anomali,
          tidak_padan: stats.tidak_padan,
          avg_score: avgScore !== null ? Number(avgScore.toFixed(2)) : null,
          total: stats.total_count,
        },
        documents: docsMap[s.id],
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
