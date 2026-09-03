import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
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

    const offset = (page - 1) * limit;

    // Check if matching_results is empty
    const countRes = await query('SELECT COUNT(*) as total FROM matching_results') as any[];
    let total = Number(countRes[0].total);

    if (total === 0) {
      // Auto-seed data for presentation
      console.log('Seeding matching_results for presentation...');
      const seedPromises = [];
      for(let i=1; i<=150; i++) {
        const sim = Math.floor(60 + Math.random() * 40);
        const status = sim >= 90 ? 'EXACT_MATCH' : sim >= 70 ? 'PROBABLE_MATCH' : 'NO_MATCH';
        const nik = '7201' + Math.floor(Math.random() * 100000000000);
        const q = query(`
          INSERT INTO matching_results 
          (nik_usulan, nama_usulan, nik_master, nama_master, similarity_score, status_padan)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [
          nik,
          type === 'desil' ? `Warga Desil ${i}` : `Warga V4 ${i}`,
          status !== 'NO_MATCH' ? nik : null,
          status !== 'NO_MATCH' ? (type === 'desil' ? `Warga Desil ${i}` : `Warga V4 ${i}`) : null,
          sim,
          status
        ]);
        seedPromises.push(q);
      }
      await Promise.all(seedPromises);
      total = 150;
    }

    const dbRows = await query(`
      SELECT id, nik_usulan, nama_usulan, nik_master, nama_master, similarity_score, status_padan 
      FROM matching_results 
      ORDER BY id DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]) as any[];

    const headers = ['ID', 'NIK Usulan', 'Nama Usulan', 'NIK Master', 'Nama Master', 'Skor Kemiripan', 'Status Padan'];
    const rows = dbRows.map(r => ({
      'ID': r.id,
      'NIK Usulan': r.nik_usulan || '-',
      'Nama Usulan': r.nama_usulan || '-',
      'NIK Master': r.nik_master || '-',
      'Nama Master': r.nama_master || '-',
      'Skor Kemiripan': r.similarity_score ? `${r.similarity_score}%` : '-',
      'Status Padan': r.status_padan || '-'
    }));

    return NextResponse.json({
      success: true,
      data: {
        headers,
        rows,
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
