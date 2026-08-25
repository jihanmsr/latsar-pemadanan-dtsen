import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth';
import * as xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';

export async function GET(req: NextRequest) {
  const { user, error } = await verifyAuth(req);
  if (!user || user.role !== 'BPS_ADMIN') {
    return unauthorizedResponse(error ?? 'Akses ditolak. Hanya BPS_ADMIN.');
  }

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type'); // 'desil' | 'v4'
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    let fileName = '';
    if (type === 'desil') {
      fileName = 'Hasil Cek Desil All.xlsx';
    } else if (type === 'v4') {
      fileName = 'Hasil_Pemadanan_V4.xlsx';
    } else {
      return NextResponse.json({ success: false, message: 'Tipe file tidak valid.' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), fileName);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ success: false, message: `File ${fileName} tidak ditemukan di root folder.` }, { status: 404 });
    }

    // Read excel file
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const allData = xlsx.utils.sheet_to_json(worksheet, { defval: "" });
    
    const total = allData.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    // Slice data for pagination
    const paginatedData = allData.slice(startIndex, endIndex);

    // Get headers
    const headers = allData.length > 0 ? Object.keys(allData[0] as object) : [];

    return NextResponse.json({
      success: true,
      data: {
        headers,
        rows: paginatedData,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (err: any) {
    console.error('[/api/admin/excel-data] Error:', err);
    return NextResponse.json({ success: false, message: 'Gagal memproses file Excel', error: err.message }, { status: 500 });
  }
}
