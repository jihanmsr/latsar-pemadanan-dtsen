const xlsx = require('xlsx');
const { PrismaClient } = require('@prisma/client');
const stringSimilarity = require('string-similarity');

const prisma = new PrismaClient();

function getSim(s1, s2) {
  if (!s1 || !s2) return 0.0;
  return stringSimilarity.compareTwoStrings(String(s1).trim().toUpperCase(), String(s2).trim().toUpperCase());
}

async function bulkMatch() {
  const inputFile = 'Missing NIK.xlsx';
  const outputFile = 'Hasil_Pemadanan.xlsx';
  
  console.log(`Membaca file input: ${inputFile}...`);
  const workbook = xlsx.readFile(inputFile);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  
  // Konversi data excel menjadi array of objects
  const data = xlsx.utils.sheet_to_json(sheet);
  console.log(`Berhasil membaca ${data.length} baris data.`);

  let exactMatches = 0;
  let probableMatches = 0;
  let noMatches = 0;

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    
    // Mengekstrak field dari excel
    const nama = row['nama_dtsen'] || '';
    const jkValue = row['jk_dtsen_value'] || '';
    const alamat = row['alamat_klrg'] || '';
    const tgl = row['tgl_lahir'];
    const bln = row['bln_lahir_value'];
    const thn = row['thn_lahir'];

    // Melewati baris jika tidak ada nama
    if (!nama) {
        row['Match_Status'] = 'NO_MATCH';
        row['Match_Score'] = 0;
        noMatches++;
        continue;
    }

    // Merakit tanggal lahir
    let targetDateStr = null;
    let targetDateObj = null;
    
    if (tgl && bln && thn) {
        const paddedTgl = String(tgl).padStart(2, '0');
        const paddedBln = String(bln).padStart(2, '0');
        targetDateStr = `${thn}-${paddedBln}-${paddedTgl}`;
        targetDateObj = new Date(targetDateStr + "T00:00:00.000Z");
    }

    let candidates = [];

    // TEKNIK BLOCKING
    // Coba mencari dengan Tanggal Lahir + Jenis Kelamin
    if (targetDateObj && !isNaN(targetDateObj)) {
        candidates = await prisma.dtsenMaster.findMany({
            where: {
                tanggal_lahir: targetDateObj,
                jenis_kelamin: String(jkValue)
            },
            take: 200
        });
    }

    // Jika kosong, relaxasikan pencarian dengan nama 3 huruf pertama + Gender
    if (candidates.length === 0) {
        const first3Chars = nama.substring(0, 3);
        if (first3Chars.length === 3) {
            candidates = await prisma.dtsenMaster.findMany({
                where: {
                    nama: {
                        startsWith: first3Chars
                    },
                    jenis_kelamin: String(jkValue)
                },
                take: 200
            });
        }
    }

    let bestMatch = null;
    let highestScore = 0.0;

    for (const master of candidates) {
      const nameSim = getSim(nama, master.nama);
      
      const masterTglLahirStr = master.tanggal_lahir.toISOString().split('T')[0];
      const dobSim = (targetDateStr === masterTglLahirStr) ? 1.0 : getSim(targetDateStr, masterTglLahirStr);
      
      const masterAlamat = `${master.alamat_lengkap} ${master.desa_kelurahan} ${master.kecamatan}`;
      const addrSim = getSim(alamat, masterAlamat);

      // Pembobotan: Nama 50%, Tgl Lahir 30%, Alamat 20%
      let totalScore = (nameSim * 50) + (dobSim * 30) + (addrSim * 20);
      
      if (String(jkValue) !== String(master.jenis_kelamin)) {
        totalScore -= 10;
      }

      totalScore = Math.max(0.0, Math.min(100.0, totalScore));

      if (totalScore > highestScore) {
        highestScore = totalScore;
        bestMatch = master;
      }
    }

    let status = 'NO_MATCH';
    if (highestScore >= 80.0) status = 'EXACT_MATCH';
    else if (highestScore >= 60.0) status = 'PROBABLE_MATCH';

    // Menyisipkan hasil ke kolom baru
    row['Match_Status'] = status;
    row['Match_Score'] = Number(highestScore.toFixed(2));
    row['Matched_NIK'] = bestMatch ? bestMatch.nik : '';
    row['Matched_Nama'] = bestMatch ? bestMatch.nama : '';
    row['Matched_Tgl_Lahir'] = bestMatch ? bestMatch.tanggal_lahir.toISOString().split('T')[0] : '';
    row['Matched_JK'] = bestMatch ? bestMatch.jenis_kelamin : '';
    row['Matched_Alamat'] = bestMatch ? `${bestMatch.alamat_lengkap} ${bestMatch.desa_kelurahan} ${bestMatch.kecamatan}` : '';

    if (status === 'EXACT_MATCH') exactMatches++;
    else if (status === 'PROBABLE_MATCH') probableMatches++;
    else noMatches++;

    // Menampilkan progres setiap 500 baris
    if ((i + 1) % 500 === 0) {
        console.log(`Proses: ${i + 1} / ${data.length}`);
    }
  }

  console.log('Semua baris berhasil diproses!');
  console.log(`Hasil: EXACT: ${exactMatches}, PROBABLE: ${probableMatches}, NO MATCH: ${noMatches}`);

  // Menyimpan hasil ke file Excel baru
  console.log(`Menyimpan ke file: ${outputFile}...`);
  const newSheet = xlsx.utils.json_to_sheet(data);
  const newWorkbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(newWorkbook, newSheet, 'Hasil_Pemadanan');
  xlsx.writeFile(newWorkbook, outputFile);

  console.log('✅ SELESAI!');
}

bulkMatch()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
