function calculateLevenshteinSimilarity(a, b) {
  if (a.length === 0) return b.length === 0 ? 100 : 0;
  if (b.length === 0) return 0;
  const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  const distance = matrix[a.length][b.length];
  const maxLength = Math.max(a.length, b.length);
  return Math.round(((maxLength - distance) / maxLength) * 100);
}
// Fungsi yang kita buat tadi
const parseNik = (nik) => {
  if (!nik || nik.length !== 16) return null;
  const wilayah = nik.substring(0, 6);
  let dd = parseInt(nik.substring(6, 8), 10);
  const mm = parseInt(nik.substring(8, 10), 10);
  const yy = parseInt(nik.substring(10, 12), 10);
  if (isNaN(dd) || isNaN(mm) || isNaN(yy)) return null;
  let gender = 'Laki-Laki';
  if (dd > 40) {
    gender = 'Perempuan';
    dd -= 40;
  }
  return { wilayah, dd, mm, yy, gender };
};

// Simulasi Data Master (DtsenMaster)
const masterData = [
  { nik: '7271011212800001', nama: 'BUDI SANTOSO' }, 
  { nik: '7271015212800002', nama: 'SITI AMINAH' }   
];

// Simulasi NIK Usulan Pemda yang ada TYPO
const usulanData = [
  // 1. NIK benar, Nama Typo sedikit
  { nik: '7271011212800001', nama: 'BUDI SANTUSO' }, 
  
  // 2. NIK Typo di nomor urut (ujung), Nama benar
  { nik: '7271011212800009', nama: 'BUDI SANTOSO' }, 
  
  // 3. NIK Typo di kode Kecamatan (digit 5-6), Tgl Lahir Bener, Nama Typo dikit
  { nik: '7271991212800001', nama: 'BUDI SANTOSO' },

  // 4. NIK berantakan (kurang digit), Nama benar
  { nik: '7271', nama: 'SITI AMINAH' } 
];

console.log("=== HASIL SIMULASI ALGORITMA BARU ===\n");

usulanData.forEach(usulan => {
  const parsedUsulan = parseNik(usulan.nik);
  let bestScore = -1;
  let bestCandidate = null;
  let status = "TIDAK_PADAN";

  // Cek Exact Match
  const exact = masterData.find(m => m.nik === usulan.nik);
  if (exact) {
      bestScore = calculateLevenshteinSimilarity(usulan.nama, exact.nama);
      bestCandidate = exact;
  } else {
      // Probabilistik
      if (parsedUsulan) {
          masterData.forEach(m => {
              const parsedMaster = parseNik(m.nik);
              if(parsedMaster) {
                  const isSameDOB = parsedUsulan.dd === parsedMaster.dd && 
                                    parsedUsulan.mm === parsedMaster.mm && 
                                    parsedUsulan.yy === parsedMaster.yy && 
                                    parsedUsulan.gender === parsedMaster.gender;
                  const isSameWilayah = parsedUsulan.wilayah === parsedMaster.wilayah;
                  
                  if (isSameDOB || isSameWilayah) {
                      let score = calculateLevenshteinSimilarity(usulan.nama, m.nama);
                      if (isSameDOB && score >= 50) score = Math.min(100, score + 15);
                      else if (isSameWilayah && score >= 60) score = Math.min(100, score + 5);
                      
                      if (score > bestScore) {
                          bestScore = score;
                          bestCandidate = m;
                      }
                  }
              }
          });
      } else {
          // Fallback (berdasarkan nama saja)
          masterData.forEach(m => {
              let score = calculateLevenshteinSimilarity(usulan.nama, m.nama);
              if (score > bestScore) {
                  bestScore = score;
                  bestCandidate = m;
              }
          });
      }
  }

  if (bestScore >= 80) status = "PADAN";
  else if (bestScore >= 60) status = "ANOMALI";

  console.log(`Usulan: ${usulan.nik} | ${usulan.nama}`);
  if(bestCandidate) {
     console.log(`  -> Ketemu: ${bestCandidate.nik} | ${bestCandidate.nama} (Score: ${bestScore} - ${status})\n`);
  } else {
     console.log(`  -> Ketemu: TIDAK ADA (Score: 0 - TIDAK_PADAN)\n`);
  }
});
