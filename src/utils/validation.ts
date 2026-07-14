export function validateNIK(
  nik: string | number | undefined | null,
  genderContext?: string | null,
  dobContext?: string | null
): { isValid: boolean; reason?: string } {
  if (!nik) return { isValid: false, reason: "NIK kosong" };
  
  const nikStr = nik.toString().trim();
  
  if (!/^\d{16}$/.test(nikStr)) {
    return { isValid: false, reason: "Panjang NIK wajib 16 karakter angka" };
  }

  const blockedBlocks = ['22222', '33333', '44444', '55555', '66666', '77777', '88888', '99999'];
  for (const block of blockedBlocks) {
    if (nikStr.includes(block)) {
      return { isValid: false, reason: "Format NIK tidak valid - Mengandung angka berulang" };
    }
  }

  // Aturan 11111: hanya dieksekusi pada digit ke-9 s.d 16 (index 8 s.d 15)
  const digit9_16 = nikStr.substring(8, 16);
  if (digit9_16.includes('11111')) {
    return { isValid: false, reason: "NIK tidak valid - Mengandung angka 11111 pada digit 9-16" };
  }

  // Aturan 00000: hanya dieksekusi pada digit ke-1 s.d 13 (index 0 s.d 12)
  const digit1_13 = nikStr.substring(0, 13);
  if (digit1_13.includes('00000')) {
    return { isValid: false, reason: "NIK tidak valid - Mengandung angka 00000" };
  }

  let dd = parseInt(nikStr.substring(6, 8));
  const mm = parseInt(nikStr.substring(8, 10));
  const yyStr = nikStr.substring(10, 12);
  
  let isFemaleNIK = dd > 40;
  
  // Cross check gender
  if (genderContext) {
    const gender = genderContext.toString().toLowerCase().trim();
    const isFemaleData = ['p', 'perempuan', 'female', 'wanita'].some(g => gender === g || gender.includes(g));
    const isMaleData = ['l', 'laki-laki', 'male', 'pria'].some(g => gender === g || gender.includes(g));
    
    if (isFemaleNIK && isMaleData) {
      return { isValid: false, reason: "NIK tidak valid - Gender Mismatch (NIK Perempuan, Data Laki-laki)" };
    }
    if (!isFemaleNIK && isFemaleData) {
      return { isValid: false, reason: "NIK tidak valid - Gender Mismatch (NIK Laki-laki, Data Perempuan)" };
    }
  }

  if (isFemaleNIK) {
    dd -= 40;
  }

  if (mm < 1 || mm > 12) {
    return { isValid: false, reason: "Format Tanggal Lahir NIK Tidak Valid" };
  }

  const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (dd < 1 || dd > daysInMonth[mm - 1]) {
    return { isValid: false, reason: "Format Tanggal Lahir NIK Tidak Valid" };
  }

  // Cross check Date of Birth
  if (dobContext) {
    const cleanDob = dobContext.toString().replace(/[-/\\.\\s]/g, '');
    let matched = false;
    
    if (/^\d{6,8}$/.test(cleanDob)) {
      let exDd = "", exMm = "", exYy = "";
      if (cleanDob.length === 6) {
        exDd = cleanDob.substring(0, 2);
        exMm = cleanDob.substring(2, 4);
        exYy = cleanDob.substring(4, 6);
      } else if (cleanDob.length === 8) {
        const firstTwo = parseInt(cleanDob.substring(0,2));
        if (firstTwo >= 1 && firstTwo <= 31) {
          // Asumsi DDMMYYYY
          exDd = cleanDob.substring(0, 2);
          exMm = cleanDob.substring(2, 4);
          exYy = cleanDob.substring(6, 8); 
        } else {
          // Asumsi YYYYMMDD
          exYy = cleanDob.substring(2, 4);
          exMm = cleanDob.substring(4, 6);
          exDd = cleanDob.substring(6, 8);
        }
      }
      
      const expectedDd = dd.toString().padStart(2, '0');
      const expectedMm = mm.toString().padStart(2, '0');
      
      if (exDd === expectedDd && exMm === expectedMm && exYy === yyStr) {
        matched = true;
      }
      
      if (!matched) {
        return { isValid: false, reason: "Tanggal Lahir NIK tidak cocok dengan Data Kolom Tanggal Lahir" };
      }
    }
  }

  return { isValid: true };
}
