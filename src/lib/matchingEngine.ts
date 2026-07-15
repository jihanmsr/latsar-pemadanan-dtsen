export interface MatchResult {
  status: 'Padan Deterministik' | 'Padan Probabilistik' | 'Tidak Padan' | 'Format Tidak Valid';
  score: number; // 0-100
  matched_nik?: string;
  matched_nama?: string;
  kategori?: string; // e.g. "Padan Deterministik 100"
}

export function validateNIK(nik: string): boolean {
  if (!nik || nik.length !== 16) return false;
  
  // Harus angka
  if (!/^\d{16}$/.test(nik)) return false;

  // Tanggal lahir (digit 7-8)
  const dd = parseInt(nik.substring(6, 8));
  // Validasi: 1-31 untuk laki-laki, 41-71 untuk perempuan
  if (dd === 0 || (dd > 31 && dd < 41) || dd > 71) return false;

  // Bulan lahir (digit 9-10)
  const mm = parseInt(nik.substring(8, 10));
  if (mm < 1 || mm > 12) return false;

  // Tidak ada angka berulang
  const invalidRepetitions = ['22222', '33333', '44444', '55555', '66666', '77777', '88888', '99999'];
  for (const rep of invalidRepetitions) {
    if (nik.includes(rep)) return false;
  }

  // Digit 9-16 tidak berulang '11111'
  if (nik.substring(8, 16).includes('11111')) return false;

  // Digit 1-13 tidak berulang '00000'
  if (nik.substring(0, 13).includes('00000')) return false;

  return true;
}

export function levenshteinDistance(s1: string, s2: string): number {
  if (!s1 || !s2) return Math.max(s1?.length || 0, s2?.length || 0);
  
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1].toLowerCase() === s2[j - 1].toLowerCase()) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // deletion
          dp[i][j - 1] + 1, // insertion
          dp[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }

  return dp[m][n];
}

export function levenshteinSimilarity(s1: string, s2: string): number {
  if (!s1 || !s2) return 0;
  const cost = levenshteinDistance(s1, s2);
  const maxLen = Math.max(s1.length, s2.length);
  if (maxLen === 0) return 100;
  return (1 - (cost / maxLen)) * 100;
}

export function determineCategory(score: number, type: 'Deterministik' | 'Probabilistik'): string {
  if (score === 100) return `NIK Padan ${type} 100`;
  if (score >= 90) return `NIK Padan ${type} 90 s.d. 99`;
  if (score >= 80) return `NIK Padan ${type} 80 s.d. 89`;
  if (score >= 70) return `NIK Padan ${type} 70 s.d. 79`;
  if (score >= 60) return `NIK Padan ${type} 60 s.d. 69`;
  if (score >= 50) return `NIK Padan ${type} 50 s.d. 59`;
  return `NIK Padan ${type} < 50`;
}

export function performMatching(
  inputNik: string, 
  inputName: string, 
  masterData: { nik: string, nama_lengkap: string }[]
): MatchResult {
  if (!validateNIK(inputNik)) {
    return { status: 'Format Tidak Valid', score: 0 };
  }

  // 1. Deterministik (Direct Match)
  const exactMatch = masterData.find(d => d.nik === inputNik);
  if (exactMatch) {
    const similarity = levenshteinSimilarity(inputName, exactMatch.nama_lengkap);
    return {
      status: 'Padan Deterministik',
      score: similarity,
      matched_nik: exactMatch.nik,
      matched_nama: exactMatch.nama_lengkap,
      kategori: determineCategory(similarity, 'Deterministik')
    };
  }

  // 2. Probabilistik
  // Filter master data that has same first 12 digits
  const first12 = inputNik.substring(0, 12);
  const candidates = masterData.filter(d => d.nik.startsWith(first12));

  let bestMatch = null;
  let highestScore = -1;

  for (const candidate of candidates) {
    const score = levenshteinSimilarity(inputName, candidate.nama_lengkap);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = candidate;
    }
  }

  if (bestMatch && highestScore >= 50) { // Threshold for considering it a match
    return {
      status: 'Padan Probabilistik',
      score: highestScore,
      matched_nik: bestMatch.nik,
      matched_nama: bestMatch.nama_lengkap,
      kategori: determineCategory(highestScore, 'Probabilistik')
    };
  }

  return {
    status: 'Tidak Padan',
    score: 0,
    kategori: 'NIK Tidak Padan'
  };
}
