import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth, unauthorizedResponse, forbiddenResponse } from '@/lib/auth';

/**
 * POST /api/finalize
 * Body: { submissionId: number, bastSigned: boolean, ndaSigned: boolean }
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
      submissionId: number;
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
    const submission = await prisma.submission.findUnique({
      where: { id: Number(submissionId) },
      include: { documents: true },
    });

    if (!submission) {
      return NextResponse.json(
        { success: false, error: 'Submission tidak ditemukan.' },
        { status: 404 }
      );
    }

    // ── 4. UPSERT DOKUMEN BAST & NDA ────────────────────────────────────
    // Cek apakah dokumen sudah ada, jika tidak buat baru
    const existingBast = submission.documents.find(d => d.doc_type === 'BAST');
    const existingNda  = submission.documents.find(d => d.doc_type === 'NDA');

    if (existingBast) {
      await prisma.document.update({
        where: { id: existingBast.id },
        data: { is_signed: bastSigned },
      });
    } else {
      await prisma.document.create({
        data: {
          submission_id: submission.id,
          doc_type: 'BAST',
          file_path: `documents/bast_${submission.id}.pdf`,
          is_signed: bastSigned,
        },
      });
    }

    if (existingNda) {
      await prisma.document.update({
        where: { id: existingNda.id },
        data: { is_signed: ndaSigned },
      });
    } else {
      await prisma.document.create({
        data: {
          submission_id: submission.id,
          doc_type: 'NDA',
          file_path: `documents/nda_${submission.id}.pdf`,
          is_signed: ndaSigned,
        },
      });
    }

    // ── 5. UPDATE STATUS SUBMISSION → COMPLETED ──────────────────────────
    await prisma.submission.update({
      where: { id: submission.id },
      data: { status: 'COMPLETED' },
    });

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
