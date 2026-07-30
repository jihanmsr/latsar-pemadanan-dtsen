import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth, unauthorizedResponse, forbiddenResponse } from '@/lib/auth';

/**
 * POST /api/finalize
 * Body: { submissionId: string, bastSigned: boolean, ndaSigned: boolean }
 *
 * Hanya BPS_ADMIN yang boleh menfinalisasi.
 * Tandai dokumen BAST dan NDA sebagai signed, update status → COMPLETED.
 */
export async function POST(req: NextRequest) {
  // ── 1. AUTH CHECK ─────────────────────────────────────────────────────
  const { user, error } = await verifyAuth(req);
  if (!user) return unauthorizedResponse(error ?? undefined);

  // ── 2. ROLE CHECK: hanya BPS_ADMIN ────────────────────────────────────
  if (user.role !== 'BPS_ADMIN') {
    return forbiddenResponse('Hanya Admin BPS yang dapat memfinalisasi pengajuan.');
  }

  try {
    const body = await req.json() as {
      submissionId: string;
      bastSigned: boolean;
      ndaSigned: boolean;
    };

    const { submissionId, bastSigned, ndaSigned } = body;

    if (!submissionId) {
      return NextResponse.json(
        { success: false, error: 'submissionId diperlukan.' },
        { status: 400 }
      );
    }

    if (!bastSigned || !ndaSigned) {
      return NextResponse.json(
        {
          success: false,
          unlocked: false,
          error: 'Dokumen BAST dan NDA keduanya harus ditandatangani sebelum finalisasi.',
        },
        { status: 400 }
      );
    }

    // ── 3. CEK SUBMISSION ────────────────────────────────────────────────
    const subRows = await query(`SELECT id FROM submissions WHERE id = ? LIMIT 1`, [submissionId]);

    if (subRows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Submission tidak ditemukan.' },
        { status: 404 }
      );
    }
    
    const submission = subRows[0];
    const docs = await query(`SELECT id, doc_type FROM documents WHERE submission_id = ?`, [submissionId]);

    // ── 4. UPSERT DOKUMEN BAST & NDA ────────────────────────────────────
    // Cek apakah dokumen sudah ada, jika tidak buat baru
    const existingBast = docs.find((d: any) => d.doc_type === 'BAST');
    const existingNda  = docs.find((d: any) => d.doc_type === 'NDA');

    if (existingBast) {
      await query(`UPDATE documents SET is_signed = ? WHERE id = ?`, [bastSigned ? 1 : 0, existingBast.id]);
    } else {
      await query(`
        INSERT INTO documents (submission_id, doc_type, file_path, is_signed) 
        VALUES (?, 'BAST', ?, ?)
      `, [submission.id, `documents/bast_${submission.id}.pdf`, bastSigned ? 1 : 0]);
    }

    if (existingNda) {
      await query(`UPDATE documents SET is_signed = ? WHERE id = ?`, [ndaSigned ? 1 : 0, existingNda.id]);
    } else {
      await query(`
        INSERT INTO documents (submission_id, doc_type, file_path, is_signed) 
        VALUES (?, 'NDA', ?, ?)
      `, [submission.id, `documents/nda_${submission.id}.pdf`, ndaSigned ? 1 : 0]);
    }

    // ── 5. UPDATE STATUS SUBMISSION → COMPLETED ──────────────────────────
    await query(`UPDATE submissions SET status = 'COMPLETED' WHERE id = ?`, [submission.id]);

    return NextResponse.json({
      success: true,
      unlocked: true,
      submissionId: submission.id,
      message: 'Finalisasi berhasil. Dokumen BAST dan NDA telah ditandatangani.',
    });

  } catch (err) {
    console.error('[/api/finalize] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan pada server.' },
      { status: 500 }
    );
  }
}
