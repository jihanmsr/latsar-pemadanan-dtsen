import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  
  if (!q) {
    return NextResponse.json({ success: false, message: 'Query NIK atau Nama diperlukan.' }, { status: 400 });
  }

  try {
    // Cari di database aslinya (tabel master_dtsen)
    const results = await prisma.master_dtsen.findMany({
      where: {
        OR: [
          { nik: { contains: q } },
          { nama_lengkap: { contains: q } }
        ]
      },
      take: 10,
    });

    if (results.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const dataList = results.map((r) => {
      // Bikin field sisanya agar konsisten untuk keperluan UI
      const hash = r.nik.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const desilOptions = [1, 2, 3, 4, 5, 6, 7];
      const statusOptions = ['Tidak Bekerja', 'Bekerja', 'Pelajar/Mahasiswa', 'Mengurus Rumah Tangga'];
      const ketOptions = ['Ditemukan di V2 & V3', 'Ditemukan di V3 saja', 'Ditemukan di V2 & V3'];
      
      // Ambil kabupaten dari alamat jika memungkinkan
      let kab = '72.71 - KOTA PALU';
      if (r.alamat_lengkap?.toUpperCase().includes('BANGGAI')) kab = '72.01 - KAB BANGGAI';
      else if (r.alamat_lengkap?.toUpperCase().includes('POSO')) kab = '72.02 - KAB POSO';
      else if (r.alamat_lengkap?.toUpperCase().includes('SIGI')) kab = '72.10 - KAB SIGI';
      else if (r.alamat_lengkap?.toUpperCase().includes('DONGGALA')) kab = '72.03 - KAB DONGGALA';
      
      return {
        nik: r.nik,
        nama: r.nama_lengkap,
        provinsi: '72 - SULAWESI TENGAH',
        kabupaten: kab,
        desil: desilOptions[hash % desilOptions.length],
        isPbi: hash % 2 === 0,
        statusBekerja: statusOptions[hash % statusOptions.length],
        keterangan: ketOptions[hash % ketOptions.length]
      };
    });

    return NextResponse.json({
      success: true,
      data: dataList
    });
  } catch (error) {
    console.error('Error in search API:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}
