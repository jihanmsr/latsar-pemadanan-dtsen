import { NextRequest, NextResponse } from 'next/server';
import { query, batch } from '@/lib/db';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth';
import { calculateLevenshteinSimilarity } from '@/utils/matching-engine';

const THRESHOLD_EXACT = 80;      // skor ≥ 80 → EXACT_MATCH
const THRESHOLD_PROBABLE = 60;    // 60 ≤ skor < 80 → PROBABLE_MATCH
                                  // skor < 60 → NO_MATCH

/**
 * POST /api/matching
 * Body: { submissionId: string }
 * 
 * Proses pemadanan:
 * 1. Ambil data valid dari submission (original_file_data)
 * 2. Untuk setiap NIK usulan, cari kandidat terbaik di master_dtsen
 * 3. Hitung similarity score dengan Levenshtein (nama)
 * 4. Simpan hasil ke matching_results
 * 5. Update status submission → COMPLETED
 */
export async function POST(req: NextRequest) {
  // ── 1. AUTH CHECK ────────────────────────────────────────────────────────
  const { user, error } = await verifyAuth(req);
  if (!user) return unauthorizedResponse(error ?? undefined);

  try {
    const body = await req.json() as { submissionId: string };
    const { submissionId } = body;

    if (!submissionId) {
      return NextResponse.json(
        { success: false, error: 'submissionId tidak valid.' },
        { status: 400 }
      );
    }

    // ── 2. AMBIL SUBMISSION ──────────────────────────────────────────────
    const submissionRows = await query(`SELECT id, user_id, original_file_data FROM submissions WHERE id = ? LIMIT 1`, [submissionId]);

    if (submissionRows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Submission tidak ditemukan.' },
        { status: 404 }
      );
    }
    
    const submission = submissionRows[0];
    
    if (typeof submission.original_file_data === 'string') {
      try {
        submission.original_file_data = JSON.parse(submission.original_file_data);
      } catch(e) {
        submission.original_file_data = [];
      }
    }

    // PEMDA hanya bisa proses submission milik sendiri
    if (user.role === 'PEMDA' && submission.user_id !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Akses ditolak.' },
        { status: 403 }
      );
    }

    // Update status → MATCHING saat sedang diproses
    await query(`UPDATE submissions SET status = 'MATCHING' WHERE id = ?`, [submission.id]);

    // ── 3. AMBIL DATA USULAN ─────────────────────────────────────────────
    type UploadedRow = {
      nik?: string;
      nama?: string;
      nama_lengkap?: string;
      [key: string]: unknown;
    };

    const uploadedRows = (submission.original_file_data as UploadedRow[]) ?? [];

    if (uploadedRows.length === 0) {
      await query(`UPDATE submissions SET status = 'FAILED' WHERE id = ?`, [submission.id]);
      return NextResponse.json(
        { success: false, error: 'Tidak ada data dalam submission ini.' },
        { status: 422 }
      );
    }

    // ── 4. AMBIL SEMUA MASTER DTSEN (VERSI 3) ────────────────────────────
    const masterData = await query(`SELECT nik, nama, tanggal_lahir, jenis_kelamin FROM DtsenMaster`);

    // Buat Map NIK → data master untuk lookup cepat O(1)
    const masterMap = new Map<string, any>();
    masterData.forEach((m: any) => {
      if (m.nik) masterMap.set(m.nik, m);
    });

    // Fungsi utilitas untuk memecah NIK menjadi wilayah, tanggal, dan gender
    const parseNik = (nik: string) => {
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

    // ── 5. PROSES MATCHING ───────────────────────────────────────────────
    const results: {
      submission_id: string;
      nik_usulan: string;
      nama_usulan: string;
      nik_master: string | null;
      nama_master: string | null;
      similarity_score: number;
      status_padan: 'PADAN' | 'ANOMALI' | 'TIDAK_PADAN' | 'EXACT_MATCH' | 'PROBABLE_MATCH' | 'NO_MATCH';
      alasan_anomali: string | null;
    }[] = [];

    for (const row of uploadedRows) {
      const nikUsulan = (row.nik ?? '').toString().trim();
      const namaUsulan = (row.nama ?? row.nama_lengkap ?? '').toString().trim();
      const parsedUsulan = parseNik(nikUsulan);

      // Ekstrak Tanggal Lahir dari file upload (jika ada) untuk validasi ekstra
      let usulanDD = parsedUsulan?.dd;
      let usulanMM = parsedUsulan?.mm;
      let usulanYY = parsedUsulan?.yy;

      const rowTgl = parseInt(row.tgl_lahir ?? row.tanggal_lahir, 10);
      const rowBln = parseInt(row.bln_lahir ?? row.bulan_lahir, 10);
      const rowThn = parseInt(row.thn_lahir ?? row.tahun_lahir, 10);
      
      if (!isNaN(rowTgl) && !isNaN(rowBln) && !isNaN(rowThn)) {
        usulanDD = rowTgl;
        usulanMM = rowBln;
        usulanYY = rowThn % 100;
      } else if (row.tanggal_lahir && typeof row.tanggal_lahir === 'string') {
        const parts = row.tanggal_lahir.split('-');
        if (parts.length === 3) {
          usulanYY = parseInt(parts[0], 10) % 100;
          usulanMM = parseInt(parts[1], 10);
          usulanDD = parseInt(parts[2], 10);
        }
      }

      const usulanWilayah = nikUsulan.length >= 6 ? nikUsulan.substring(0, 6) : null;

      // Cek apakah NIK ada di master (exact match)
      const masterExact = masterMap.get(nikUsulan);

      if (masterExact) {
        // TAHAP 1: DETERMINISTIK (NIK 100% Cocok)
        const score = calculateLevenshteinSimilarity(namaUsulan, masterExact.nama);
        let status: 'EXACT_MATCH' | 'PROBABLE_MATCH' | 'NO_MATCH';

        if (score >= THRESHOLD_EXACT) {
          status = 'EXACT_MATCH';
        } else if (score >= THRESHOLD_PROBABLE) {
          status = 'PROBABLE_MATCH';
        } else {
          status = 'NO_MATCH';
        }

        results.push({
          submission_id: submission.id,
          nik_usulan: nikUsulan,
          nama_usulan: namaUsulan,
          nik_master: nikUsulan,
          nama_master: masterExact.nama,
          similarity_score: score,
          status_padan: status,
          alasan_anomali: score >= THRESHOLD_EXACT ? null : "Ditemukan NIK persis sama, tapi nama kurang cocok.",
        });
      } else {
        // TAHAP 2: PROBABILISTIK BERDASARKAN RUMUS NIK DAN NAMA
        let bestCandidateNik: string | null = null;
        let bestCandidateNama: string | null = null;
        let bestScore = -1;
        let bestReason: string | null = null;

        if (parsedUsulan) {
          for (const m of masterMap.values()) {
            const parsedMaster = parseNik(m.nik);
            if (!parsedMaster) continue;

            const isSameDOB = parsedUsulan.dd === parsedMaster.dd && 
                              parsedUsulan.mm === parsedMaster.mm && 
                              parsedUsulan.yy === parsedMaster.yy && 
                              parsedUsulan.gender === parsedMaster.gender;
            const isSameWilayah = parsedUsulan.wilayah === parsedMaster.wilayah;

            // Hanya evaluasi jika minimal salah satu (Wilayah atau DOB) sama, 
            // untuk memangkas waktu eksekusi.
            if (isSameDOB || isSameWilayah) {
              const score = calculateLevenshteinSimilarity(namaUsulan, m.nama);
              
              let finalScore = score;
              // Jika Tanggal Lahir sama dan skor awal cukup tinggi, kita beri bonus
              if (isSameDOB && score >= 50) {
                finalScore = Math.min(100, score + 15); 
              } else if (isSameWilayah && score >= 60) {
                finalScore = Math.min(100, score + 5);
              }

              if (finalScore > bestScore) {
                bestScore = finalScore;
                bestCandidateNik = m.nik;
                bestCandidateNama = m.nama;
                bestReason = isSameDOB ? "Pencarian fallback NIK dengan Tanggal Lahir & Kelamin cocok." : "Pencarian fallback NIK (Tanggal Lahir berbeda).";
              }
              if (bestScore === 100) break; // Perfect match found
            }
          }
        } else {
          // Jika NIK usulan sama sekali tidak valid formatnya, fallback cari berdasarkan kata pertama nama
          const firstWord = namaUsulan.split(' ')[0] || namaUsulan;
          let count = 0;
          for (const m of masterMap.values()) {
            // Cepat filter apakah nama di master mengandung kata pertama dari nama usulan
            if (!m.nama.includes(firstWord)) continue;
            
            let score = calculateLevenshteinSimilarity(namaUsulan, m.nama);
            let currentReason = "";
            
            // Validasi DOB untuk menghindari salah orang pada nama pasaran (misal: Joko Santoso)
            if (usulanDD !== undefined && usulanMM !== undefined && usulanYY !== undefined) {
              const parsedMaster = parseNik(m.nik);
              if (parsedMaster) {
                const isSameDOB = usulanDD === parsedMaster.dd && 
                                  usulanMM === parsedMaster.mm && 
                                  usulanYY === parsedMaster.yy;
                
                const isSameWilayah = usulanWilayah && usulanWilayah === parsedMaster.wilayah;

                // Jika nama mirip tapi DOB beda, berikan penalti agar tidak salah orang
                if (score >= 80 && !isSameDOB) {
                  score -= 30; // Turunkan skor (misal 100 -> 70, akan jadi PROBABLE atau NO_MATCH)
                  currentReason = "Nama mirip, tetapi Tanggal Lahir berbeda.";
                  if (isSameWilayah) {
                    score += 15; // Tertolong karena wilayahnya sama
                    currentReason += " (Terselamatkan karena 1 Kecamatan).";
                  }
                } else if (score >= 60 && isSameDOB) {
                  if (isSameWilayah) {
                    score = Math.min(100, score + 30); // Bonus maksimal jika DOB dan Wilayah sama
                    currentReason = "Nama mirip, Tanggal Lahir & Kecamatan sama persis.";
                  } else {
                    score = Math.min(100, score + 15); // Bonus standar
                    currentReason = "Nama mirip dan Tanggal Lahir sama (Beda Kecamatan).";
                  }
                } else {
                  currentReason = isSameDOB ? "Nama agak berbeda, tapi Tanggal Lahir sama." : "Nama mirip, Tanggal Lahir berbeda.";
                }
              }
            } else {
              currentReason = "Pencarian nama murni (Tanpa info Tanggal Lahir).";
            }

            if (score > bestScore) {
              bestScore = score;
              bestCandidateNik = m.nik;
              bestCandidateNama = m.nama;
              bestReason = currentReason;
            }
            if (bestScore === 100) break; 
            
            count++;
            if (count > 25000) break; // Batasi max 25k evaluasi Levenshtein
          }
        }

        if (bestCandidateNik && bestScore >= THRESHOLD_EXACT) {
          results.push({
            submission_id: submission.id,
            nik_usulan: nikUsulan,
            nama_usulan: namaUsulan,
            nik_master: bestCandidateNik,
            nama_master: bestCandidateNama,
            similarity_score: bestScore,
            status_padan: 'EXACT_MATCH',
            alasan_anomali: bestReason,
          });
        } else if (bestCandidateNik && bestScore >= THRESHOLD_PROBABLE) {
          results.push({
            submission_id: submission.id,
            nik_usulan: nikUsulan,
            nama_usulan: namaUsulan,
            nik_master: bestCandidateNik,
            nama_master: bestCandidateNama,
            similarity_score: bestScore,
            status_padan: 'PROBABLE_MATCH',
            alasan_anomali: bestReason,
          });
        } else {
          // NIK tidak ada di master dan tidak ada yang mendekati → TIDAK_PADAN
          results.push({
            submission_id: submission.id,
            nik_usulan: nikUsulan,
            nama_usulan: namaUsulan,
            nik_master: null,
            nama_master: null,
            similarity_score: 0,
            status_padan: 'NO_MATCH',
            alasan_anomali: 'Tidak ada kecocokan pada Master Data.',
          });
        }
      }
    }

    // ── 6. HAPUS HASIL LAMA (jika re-matching) & INSERT BARU ────────────
    await query(`DELETE FROM matching_results WHERE submission_id = ?`, [submission.id]);

    const resultsToInsert = results.map(r => [
      r.submission_id,
      r.nik_usulan,
      r.nama_usulan,
      r.nik_master,
      r.nama_master,
      r.similarity_score,
      r.status_padan,
      r.alasan_anomali
    ]);

    if (resultsToInsert.length > 0) {
      await batch(`
        INSERT INTO matching_results (submission_id, nik_usulan, nama_usulan, nik_master, nama_master, similarity_score, status_padan, alasan_anomali)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, resultsToInsert);
    }

    // ── 7. HITUNG STATISTIK ──────────────────────────────────────────────
    const padanCount    = results.filter(r => r.status_padan === 'EXACT_MATCH').length;
    const anomaliCount  = results.filter(r => r.status_padan === 'PROBABLE_MATCH').length;
    const tidakPadanCount = results.filter(r => r.status_padan === 'NO_MATCH').length;

    const avgScore = results.length > 0
      ? results.reduce((sum, r) => sum + r.similarity_score, 0) / results.length
      : 0;

    // ── 8. UPDATE STATUS SUBMISSION → COMPLETED ──────────────────────────
    await query(`UPDATE submissions SET status = 'COMPLETED' WHERE id = ?`, [submission.id]);

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      message: `Pemadanan selesai. ${padanCount} EXACT_MATCH, ${anomaliCount} PROBABLE_MATCH, ${tidakPadanCount} NO_MATCH.`,
      stats: {
        totalDiproses: results.length,
        padan: padanCount,
        anomali: anomaliCount,
        tidakPadan: tidakPadanCount,
        avgScore: Number(avgScore.toFixed(2)),
      },
    });

  } catch (err) {
    console.error('[/api/matching] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan saat proses matching.' },
      { status: 500 }
    );
  }
}
