import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  
  if (!q) {
    return NextResponse.json({ success: false, message: 'Query NIK atau Nama diperlukan.' }, { status: 400 });
  }

  // Simulasi penundaan pencarian (karena aslinya akan mencari di CSV)
  await new Promise(resolve => setTimeout(resolve, 800));

  // Simulasi hasil dummy untuk UAT
  if (q.length === 16 && q.startsWith('72')) {
    return NextResponse.json({
      success: true,
      data: [
        {
          nik: q,
          nama: 'BUDI SANTOSO',
          provinsi: '72 - SULAWESI TENGAH',
          kabupaten: '72.71 - KOTA PALU',
          desil: 2,
          isPbi: true,
          statusBekerja: 'Bekerja',
          keterangan: 'Ditemukan di V3'
        }
      ]
    });
  }

  // Jika tidak ditemukan
  if (q === '123') {
    return NextResponse.json({ success: true, data: [] });
  }

  // Pencarian nama (dummy)
  return NextResponse.json({
    success: true,
    data: [
      {
        nik: '7271012304500001',
        nama: q.toUpperCase(),
        provinsi: '72 - SULAWESI TENGAH',
        kabupaten: '72.71 - KOTA PALU',
        desil: 3,
        isPbi: false,
        statusBekerja: 'Tidak Bekerja',
        keterangan: 'Ditemukan di V2 & V3'
      }
    ]
  });
}
