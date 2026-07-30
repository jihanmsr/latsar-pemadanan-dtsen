# PANDUAN PENGGUNAAN (USER MANUAL) 
**Aplikasi PAKEWA (Padanan Data Kesejahteraan Warga) / DTSEN**
**BPS Provinsi Sulawesi Tengah**

---

## DAFTAR ISI
1. [Pendahuluan](#1-pendahuluan)
2. [Persiapan dan Prasyarat Dokumen](#2-persiapan-dan-prasyarat-dokumen)
3. [Mengakses Portal PAKEWA](#3-mengakses-portal-pakewa)
4. [Prosedur Unggah (Upload) Data](#4-prosedur-unggah-upload-data)
5. [Melacak Status Pemrosesan (Tracking SLA)](#5-melacak-status-pemrosesan-tracking-sla)
6. [Mengunduh Hasil Pemadanan dan Cetak BAST](#6-mengunduh-hasil-pemadanan-dan-cetak-bast)

---

## 1. PENDAHULUAN
Aplikasi **PAKEWA** adalah portal layanan mandiri (*self-service*) terintegrasi yang dibangun oleh BPS Provinsi Sulawesi Tengah untuk memfasilitasi Pemerintah Daerah (K/L/D) dalam melakukan pemadanan data administrasi kependudukan (penerima bantuan sosial, dll) dengan basis data *master* kemiskinan ekstrem (DTSEN). Sistem ini menjamin keamanan data dan transparansi waktu layanan (*SLA*).

## 2. PERSIAPAN DAN PRASYARAT DOKUMEN
Sebelum menggunakan aplikasi, pastikan instansi Anda telah menyiapkan *file-file* berikut:
* **Dokumen MoU** (Memorandum of Understanding) yang telah ditandatangani Pimpinan.
* **Dokumen NDA** (Non-Disclosure Agreement) bermaterai untuk jaminan kerahasiaan data.
* **Manifes Data** (Form spesifikasi variabel kolom yang akan diunggah).
* **Data Utama (Excel/CSV)** yang memuat setidaknya 2 variabel wajib: **NIK (16 Digit)** dan **Nama Lengkap**.

*(Catatan: Template MoU, NDA, dan Manifes dapat diunduh pada halaman beranda portal PAKEWA).*

## 3. MENGAKSES PORTAL PAKEWA
1. Buka peramban web (*browser*) seperti Google Chrome atau Mozilla Firefox.
2. Masukkan alamat URL portal PAKEWA: `[CONTOH: https://sulteng.bps.go.id/pakewa]`
3. Pada halaman beranda, Anda akan melihat dasbor utama.
4. Klik tombol **"Mulai Pengajuan Pemadanan"** (atau masukkan kredensial/token jika instansi Anda sudah diberikan akses khusus).

## 4. PROSEDUR UNGGAH (UPLOAD) DATA
1. Setelah menekan tombol pengajuan, akan muncul form **Detail Instansi**. Isi nama instansi, nama *Person in Charge* (PIC), dan nomor WhatsApp aktif.
2. Pada sesi unggah dokumen administrasi, masukkan *file* **MoU**, **NDA**, dan **Manifes Data** (berformat `.pdf`).
3. Pada sesi unggah data, pilih *file* **Data Utama (Excel/CSV)** yang akan dipadankan.
4. Sistem akan melakukan *Pengecekan Awal* otomatis selama beberapa detik untuk memastikan kolom NIK dan Nama tersedia, dan tidak ada kolom rahasia yang melanggar privasi.
5. Jika pengecekan berhasil, klik tombol **"Kirim Request"**.
6. Anda akan mendapatkan **Nomor Tiket (Tracking ID)**. Simpan nomor ini baik-baik!

*[ TEMPATKAN SCREENSHOT HALAMAN UPLOAD DI SINI ]*

## 5. MELACAK STATUS PEMROSESAN (TRACKING SLA)
Proses pemadanan data akan memakan waktu sesuai antrean dan besaran data (SLA maksimal 3x24 jam). Anda tidak perlu menunggu di kantor BPS, cukup lakukan pelacakan (*tracking*):
1. Buka halaman utama PAKEWA.
2. Klik menu **"Cek Status (Tracking)"** di pojok kanan atas.
3. Masukkan **Nomor Tiket (Tracking ID)** Anda.
4. Sistem akan menampilkan salah satu dari status berikut:
   * **[Menunggu Validasi]:** Dokumen admin Anda sedang dicek oleh petugas.
   * **[Diproses Engine]:** Data Anda sedang dicocokkan oleh algoritma sistem.
   * **[Ditolak]:** Ada dokumen yang kurang lengkap atau format NIK salah (keterangan *error* akan dilampirkan).
   * **[Selesai]:** Data berhasil dipadankan dan siap diunduh.

*[ TEMPATKAN SCREENSHOT HALAMAN TRACKING DI SINI ]*

## 6. MENGUNDUH HASIL PEMADANAN DAN CETAK BAST
Jika status pada menu Tracking sudah berubah menjadi **[Selesai]**:
1. Akan muncul tombol hijau bertuliskan **"Unduh Hasil Padanan"**.
2. Klik tombol tersebut. Sistem akan meminta Anda memasukkan kata sandi (OTP) yang dikirim ke nomor WhatsApp PIC untuk alasan keamanan.
3. Setelah OTP benar, *file* Excel berisi hasil akhir pemadanan (keterangan Padan / Tidak Padan / Typo) akan otomatis terunduh.
4. Sistem juga akan otomatis memunculkan tombol **"Cetak BAST (Berita Acara Serah Terima)"**. Klik tombol tersebut untuk mengunduh BAST digital berformat PDF sebagai bukti sah bahwa pelayanan telah selesai.

---
**Bantuan Teknis (Helpdesk)**
Jika mengalami kendala, silakan hubungi Tim MTI BPS Provinsi Sulawesi Tengah melalui email: mti.sulteng@bps.go.id.

---
*Dibuat untuk keperluan Aktualisasi Latsar CPNS 2026 - Jihan Maisaroh*
