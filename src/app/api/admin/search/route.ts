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

  // Generate somewhat random but consistent data based on the query string
  const hash = q.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Simulate data not found for roughly 33% of queries to show the empty state
  if (hash % 3 === 0) {
    return NextResponse.json({ success: true, data: [] });
  }

  const desilOptions = [1, 2, 3, 4, 5, 6, 7];
  const desil = desilOptions[hash % desilOptions.length];
  
  const kabOptions = ['72.71 - KOTA PALU', '72.01 - KAB BANGGAI', '72.02 - KAB POSO', '72.10 - KAB SIGI'];
  const kabupaten = kabOptions[hash % kabOptions.length];
  
  const statusOptions = ['Tidak Bekerja', 'Bekerja', 'Pelajar/Mahasiswa', 'Mengurus Rumah Tangga'];
  const statusBekerja = statusOptions[hash % statusOptions.length];
  
  const ketOptions = ['Ditemukan di V2 & V3', 'Ditemukan di V3 saja', 'Ditemukan di V2 & V3'];
  const keterangan = ketOptions[hash % ketOptions.length];

  // Generate a plausible NIK based on hash
  const randomSuffix = String(100000 + (hash % 899999)).padStart(6, '0');
  const generatedNik = `72710${(hash % 9) + 1}${randomSuffix}000${(hash % 9) + 1}`;

  return NextResponse.json({
    success: true,
    data: [
      {
        nik: generatedNik,
        nama: q.toUpperCase(),
        provinsi: '72 - SULAWESI TENGAH',
        kabupaten: kabupaten,
        desil: desil,
        isPbi: hash % 2 === 0,
        statusBekerja: statusBekerja,
        keterangan: keterangan
      }
    ]
  });
}
