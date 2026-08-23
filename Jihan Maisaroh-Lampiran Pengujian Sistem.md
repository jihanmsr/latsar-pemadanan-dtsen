# DOKUMEN LAPORAN HASIL PENGUJIAN SISTEM (SYSTEM TESTING)
**Nama Aplikasi:** Padanan Kesejahteraan Warga (PAKEWA)
**Penyusun:** Jihan Maisaroh

---

## 1. Skenario Pengujian & Hasil Blackbox Testing
Pengujian Blackbox dilakukan di lingkungan lokal (*localhost*) untuk memastikan fungsi utama sistem berjalan sesuai ekspektasi tanpa melihat struktur internal kode (fokus pada input dan output pengguna).

| No | Modul | Deskripsi Skenario (Test Case) | Langkah Pengujian | Ekspektasi Hasil | Hasil Aktual | Status |
|----|-------|--------------------------------|-------------------|------------------|--------------|--------|
| 1 | **Registrasi** | Pendaftaran instansi dengan data valid | Mengisi form registrasi (Nama Instansi, NIK, Jabatan, Dokumen BAST) dan klik "Daftar". | Data tersimpan ke tabel `registration_requests` dengan status `PENDING`. | Data berhasil tersimpan, muncul notifikasi sukses. | ✅ **PASS** |
| 2 | **Registrasi** | Validasi NIK kurang/lebih dari 16 digit | Mengisi form registrasi dengan NIK 10 digit. | Sistem menolak dengan pesan *error* "NIK harus 16 digit". | Muncul peringatan validasi pada kolom NIK. | ✅ **PASS** |
| 3 | **Otorisasi (Admin)** | Menyetujui pendaftaran akun Instansi Daerah | Login sebagai super-admin, masuk ke Dashboard Pendaftar, klik "Setujui" pada akun baru. | Akun instansi otomatis dibuat di tabel `users`, status registrasi menjadi `APPROVED`. | Akun pengguna otomatis terbuat, dan instansi bisa langsung login. | ✅ **PASS** |
| 4 | **Pemadanan (Upload)**| Upload file Excel/CSV format kotor (baris kosong) | Mengunggah file Excel berisi baris kosong di tengah data. | Sistem secara otomatis mengabaikan/membersihkan baris kosong dan melanjutkan proses. | Sistem berhasil melakukan *parsing* hanya pada baris yang memiliki isi. | ✅ **PASS** |
| 5 | **Pemadanan (Engine)**| Menguji kalkulasi algoritma kecocokan (Levenshtein) | Mengunggah NIK yang salah satu digitnya sengaja disalahkan (contoh: 720... vs 721...). | Algoritma memberikan persentase kemiripan di bawah 100% dan masuk ke kategori "Perlu Validasi Manual" atau "Tidak Valid". | Sistem mencatat status "Tidak Valid" dengan skor kemiripan 92%. | ✅ **PASS** |
| 6 | **Antarmuka UI/UX** | Pengujian Mode Terang dan Gelap (*Light/Dark Mode*) | Mengklik ikon bulan/matahari pada pojok kanan atas Navbar. | Seluruh palet warna, teks, dan *Grid* belakang (*background*) berubah sesuai tema tanpa menghilangkan keterbacaan. | Tema berubah dengan mulus (transisi), grid CSS terlihat jelas pada mode terang maupun gelap. | ✅ **PASS** |

---

## 2. Bukti Pelaksanaan User Acceptance Test (UAT)
Simulasi UAT dilakukan secara internal (mandiri/tim teknis) untuk memastikan antarmuka mudah digunakan (User Friendly) oleh pengguna instansi K/L/D.

**Rangkuman Umpan Balik (Feedback) UAT:**
1. **Aspek Visibilitas:** Pada Hero Section (Halaman Utama), warna judul terasa terlalu tebal (*font-black*) dan *grid* kotak-kotak tidak muncul sehingga terlihat kurang estetik.
2. **Aspek Navigasi:** Pengguna membutuhkan logo instansi (PAKEWA) pada modul label/badge agar terlihat lebih resmi dibandingkan ikon tameng biasa.
3. **Aspek Keamanan & Error:** Terjadi *error* asinkronus (Params Promise) pada rute dinamis persetujuan admin ketika memproses pendaftaran baru di *framework* Next.js 16.

**Tindak Lanjut UAT:**
Seluruh umpan balik telah diidentifikasi sebagai *bug/issue* dan langsung diselesaikan pada Tahapan Debugging.

---

## 3. Log Perbaikan Bug (Debugging Log)
Berdasarkan temuan selama Blackbox Testing dan UAT, berikut adalah catatan perbaikan koding (*git commit history*) yang telah berhasil dieksekusi:

* **[BUG-01] Hilangnya SVG Grid pada Background (Error 404)**
  * **Masalah:** File `grid.svg` gagal dimuat di server karena file tidak eksis di *public repository*, menyebabkan layar Hero kehilangan elemen kotak-kotak.
  * **Tindakan (Debugging):** Mengganti pendekatan pemanggilan *file image* menjadi *Pure CSS Linear-Gradient* yang di-render langsung oleh *browser*, sehingga 100% *bulletproof*.
  * **Status:** Selesai. (Commit: `UI: Replace missing grid.svg with Pure CSS grid`)

* **[BUG-02] Bentrok Warna Teks dan Background di Dark Mode**
  * **Masalah:** Komponen *FAQ* dan beberapa *Card* statis memiliki *class* warna latar belakang yang di-*hardcode* (`bg-white`), sehingga saat beralih ke *Dark Mode*, teks putih menjadi tidak terbaca.
  * **Tindakan (Debugging):** Menambahkan *modifier* `dark:bg-slate-950` dan `dark:text-slate-300` secara dinamis pada komponen *Tailwind CSS*.
  * **Status:** Selesai. (Commit: `UI: Fix FAQ component dark mode and reduce font weight`)

* **[BUG-03] Next.js 16 Route Handler Promise Error pada API Registrasi**
  * **Masalah:** Vercel *build engine* gagal melakukan kompilasi tipe data (*Type error*) pada `src/app/api/admin/registrations/[id]/route.ts` karena perubahan aturan Next.js 16 di mana parameter *dynamic route* harus diperlakukan secara asinkronus (sebagai *Promise*).
  * **Tindakan (Debugging):** Memodifikasi *signature* parameter dari `{ params: { id: string } }` menjadi `{ params: Promise<{ id: string }> }` lalu meng-*await* parameter tersebut sebelum diproses ke *database* Prisma.
  * **Status:** Selesai. (Commit: `Fix: Next.js 16 dynamic route params promise in admin registrations API`)

* **[BUG-04] Penyesuaian Estetika UI/UX Berdasarkan Feedback**
  * **Masalah:** Tipografi teks pahlawan (*Hero title*) terlalu menumpuk dan logo navigasi kurang merepresentasikan identitas PAKEWA.
  * **Tindakan (Debugging):** Mengurangi *font-weight* dari `font-black` menjadi `font-extrabold`, serta mengganti pustaka *Lucide Icon* dengan logo instansi kustom (`logo-pakewa.png`).
  * **Status:** Selesai. (Commit: `UI: Adjust Hero title aesthetics and replace badge icon with logo`)
