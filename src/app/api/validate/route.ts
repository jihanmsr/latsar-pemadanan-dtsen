import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth';
import { validateNIK } from '@/utils/validation';

export interface UploadRow {
  nik?: string | number;
  nama?: string;
  gender?: string;
  tanggal_lahir?: string;
  [key: string]: unknown;
}

export async function POST(req: NextRequest) {
  // ── 1. AUTH CHECK ────────────────────────────────────────────────────────
  const { user, error } = await verifyAuth(req);
  if (!user) return unauthorizedResponse(error ?? undefined);

  try {
    const body = await req.json() as {
      fileName: string;
      fileType: 'CSV' | 'XLSX' | 'IMAGE';
      rows: UploadRow[];
    };

    const { fileName, fileType, rows } = body;

    if (!fileName || !fileType || !rows || !Array.isArray(rows)) {
      return NextResponse.json(
        { success: false, error: 'Payload tidak valid. Diperlukan fileName, fileType, dan rows.' },
        { status: 400 }
      );
    }

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'File tidak memiliki data.' },
        { status: 400 }
      );
    }

    // ── 2. VALIDASI SETIAP ROW ────────────────────────────────────────────
    const validRows: UploadRow[] = [];
    const invalidRows: { row: number; nik: string; reason: string }[] = [];

    rows.forEach((row, index) => {
      const nikStr = row.nik?.toString().trim() ?? '';
      const result = validateNIK(nikStr, row.gender?.toString(), row.tanggal_lahir?.toString());

      if (result.isValid) {
        validRows.push(row);
      } else {
        invalidRows.push({
          row: index + 1,
          nik: nikStr || '(kosong)',
          reason: result.reason ?? 'Tidak valid',
        });
      }
    });

    // ── 3. SIMPAN SUBMISSION KE DATABASE ─────────────────────────────────
    const slaDeadline = new Date();
    slaDeadline.setDate(slaDeadline.getDate() + 2); // SLA Target: 2 hari

    const submission = await prisma.submission.create({
      data: {
        user_id: user.id,
        file_name: fileName,
        file_type: fileType,
        status: 'VALIDATED',
        sla_deadline: slaDeadline,
        total_rows: rows.length,
        valid_rows: validRows.length,
        original_file_data: validRows as never, // simpan hanya baris valid
      },
    });

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      summary: {
        totalRows: rows.length,
        validRows: validRows.length,
        invalidRows: invalidRows.length,
        slaDeadline: slaDeadline.toISOString(),
      },
      errors: invalidRows,
      message: `Validasi selesai. ${validRows.length} dari ${rows.length} baris valid.`,
    });

  } catch (err) {
    console.error('[/api/validate] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan pada server.' },
      { status: 500 }
    );
  }
}
