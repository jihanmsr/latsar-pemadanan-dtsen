import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import stringSimilarity from 'string-similarity';

const prisma = new PrismaClient();

function getSim(s1?: string | null, s2?: string | null): number {
  if (!s1 || !s2) return 0.0;
  return stringSimilarity.compareTwoStrings(s1.trim().toUpperCase(), s2.trim().toUpperCase());
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama, tanggal_lahir, jenis_kelamin, alamat } = body;

    if (!nama || !tanggal_lahir) {
      return NextResponse.json({ error: 'Nama dan Tanggal Lahir diperlukan' }, { status: 400 });
    }

    // TEKNIK BLOCKING (Sesuai Panduan BPS Halaman 4 & 6)
    // Filter kandidat yang HANYA memiliki Tanggal Lahir dan Jenis Kelamin yang sama.
    // Ini mempersempit pencarian dari 387.000 data menjadi belasan/puluhan kandidat saja
    // tanpa merusak fungsi pencarian typo (salah ketik) pada bagian Nama.
    
    const targetDate = new Date(tanggal_lahir + "T00:00:00.000Z");

    let candidates = await prisma.dtsenMaster.findMany({
      where: {
        tanggal_lahir: targetDate,
        jenis_kelamin: String(jenis_kelamin)
      },
      take: 200 // Batasi untuk berjaga-jaga
    });

    // Jika tidak ditemukan dengan tanggal lahir + gender, coba relaksasi dengan cari nama (3 huruf pertama)
    if (candidates.length === 0) {
      const first3Chars = nama.substring(0, 3);
      candidates = await prisma.dtsenMaster.findMany({
        where: {
          nama: {
            startsWith: first3Chars
          },
          jenis_kelamin: String(jenis_kelamin)
        },
        take: 200
      });
    }

    let bestMatch = null;
    let highestScore = 0.0;

    for (const master of candidates) {
      // Menghitung Levenshtein Similarity (sesuai BPS Halaman 9)
      const nameSim = getSim(nama, master.nama);
      
      const masterTglLahir = master.tanggal_lahir.toISOString().split('T')[0];
      const dobSim = (tanggal_lahir === masterTglLahir) ? 1.0 : getSim(tanggal_lahir, masterTglLahir);
      
      const masterAlamat = `${master.alamat_lengkap} ${master.desa_kelurahan} ${master.kecamatan}`;
      const addrSim = getSim(alamat, masterAlamat);

      // Pembobotan: Nama 50%, Tgl Lahir 30%, Alamat 20%
      let totalScore = (nameSim * 50) + (dobSim * 30) + (addrSim * 20);
      
      if (String(jenis_kelamin) !== String(master.jenis_kelamin)) {
        totalScore -= 10;
      }

      totalScore = Math.max(0.0, Math.min(100.0, totalScore));

      if (totalScore > highestScore) {
        highestScore = totalScore;
        bestMatch = {
          ...master,
          tanggal_lahir: masterTglLahir
        };
      }
    }

    let status = 'NO_MATCH';
    if (highestScore >= 80.0) status = 'EXACT_MATCH';
    else if (highestScore >= 60.0) status = 'PROBABLE_MATCH';
    else if (highestScore >= 40.0) status = 'WEAK_MATCH';

    return NextResponse.json({
      status,
      score: Number(highestScore.toFixed(2)),
      matched_data: bestMatch,
      total_candidates_checked: candidates.length
    });

  } catch (error: any) {
    console.error('Match API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
