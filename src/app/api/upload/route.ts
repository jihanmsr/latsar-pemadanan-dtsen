import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth';
import Papa from 'papaparse';
import * as ExcelJS from 'exceljs';

/**
 * POST /api/upload
 * Menerima multipart/form-data dengan field "file" (CSV atau XLSX).
 * Parse file di memori, kembalikan rows sebagai JSON untuk kemudian dikirim ke /api/validate.
 */
export async function POST(req: NextRequest) {
  // ── 1. AUTH CHECK ────────────────────────────────────────────────────────
  const { user, error } = await verifyAuth(req);
  if (!user) return unauthorizedResponse(error ?? undefined);

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'File tidak ditemukan dalam request.' },
        { status: 400 }
      );
    }

    const fileName = file.name;
    const ext = fileName.split('.').pop()?.toLowerCase();

    // Batasi ukuran file: 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Ukuran file melebihi batas 10MB.' },
        { status: 413 }
      );
    }

    let rows: Record<string, string>[] = [];
    let fileType: 'CSV' | 'XLSX' = 'CSV';

    // ── 2. PARSE FILE ─────────────────────────────────────────────────────
    if (ext === 'csv') {
      fileType = 'CSV';
      const text = await file.text();

      const result = Papa.parse<Record<string, string>>(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, '_'),
      });

      if (result.errors.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Gagal parse CSV: ' + result.errors[0].message,
          },
          { status: 422 }
        );
      }

      rows = result.data;

    } else if (ext === 'xlsx' || ext === 'xls') {
      fileType = 'XLSX';
      const buffer = await file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);

      const worksheet = workbook.worksheets[0];
      if (!worksheet) {
        return NextResponse.json(
          { success: false, error: 'File Excel tidak memiliki sheet.' },
          { status: 422 }
        );
      }

      const headers: string[] = [];
      worksheet.eachRow((row, rowIndex) => {
        if (rowIndex === 1) {
          // Ambil header dari baris pertama
          row.eachCell((cell) => {
            headers.push(
              cell.text.trim().toLowerCase().replace(/\s+/g, '_')
            );
          });
        } else {
          const rowData: Record<string, string> = {};
          row.eachCell({ includeEmpty: true }, (cell, colIndex) => {
            const key = headers[colIndex - 1] || `col_${colIndex}`;
            rowData[key] = cell.text?.trim() ?? '';
          });
          // Lewati baris yang sepenuhnya kosong
          if (Object.values(rowData).some(v => v !== '')) {
            rows.push(rowData);
          }
        }
      });

    } else {
      return NextResponse.json(
        { success: false, error: 'Format file tidak didukung. Gunakan CSV atau XLSX.' },
        { status: 415 }
      );
    }

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'File tidak memiliki data (kosong).' },
        { status: 422 }
      );
    }

    // ── 3. RETURN PREVIEW ─────────────────────────────────────────────────
    return NextResponse.json({
      success: true,
      fileName,
      fileType,
      totalRows: rows.length,
      columns: Object.keys(rows[0] || {}),
      preview: rows.slice(0, 5), // 5 baris pertama untuk preview
      rows, // Semua rows untuk dikirim ke /api/validate
    });

  } catch (err) {
    console.error('[/api/upload] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan saat memproses file.' },
      { status: 500 }
    );
  }
}
