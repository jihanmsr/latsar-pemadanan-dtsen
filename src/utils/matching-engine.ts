import levenshtein from 'fast-levenshtein';

/**
 * Menghitung skor kemiripan antara dua string menggunakan formula Levenshtein.
 * Rumus: (1 - (cost / maxLen)) * 100%
 */
export function calculateLevenshteinSimilarity(str1: string, str2: string): number {
  if (!str1 && !str2) return 100;
  if (!str1 || !str2) return 0;

  const cost = levenshtein.get(str1.toLowerCase(), str2.toLowerCase());
  const maxLen = Math.max(str1.length, str2.length);

  if (maxLen === 0) return 100;

  const similarity = (1 - (cost / maxLen)) * 100;
  return Number(similarity.toFixed(2));
}
