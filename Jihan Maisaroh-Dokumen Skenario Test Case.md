# DOKUMEN SKENARIO PENGUJIAN (TEST CASE)
**Nama Sistem**: Padanan Kesejahteraan Warga (PAKEWA)
**Penguji**: Jihan Maisaroh
**Metode Pengujian**: Blackbox Testing (Manual)

---

### 1. Modul Pendaftaran (Registrasi) Instansi
| ID | Skenario Uji | Prasyarat (Pre-condition) | Langkah-langkah | Ekspektasi Hasil |
|---|---|---|---|---|
| REG-01 | Mendaftar dengan data lengkap dan valid | Pengguna berada di halaman pendaftaran | 1. Isi semua form wajib (Nama Instansi, Email, NIK 16 digit, dll)<br>2. Upload dokumen surat permohonan<br>3. Klik Daftar | Sistem menampilkan pesan sukses. Status pendaftaran menjadi `PENDING` di database. |
| REG-02 | Gagal mendaftar karena NIK kurang dari 16 digit | Pengguna berada di form pendaftaran | 1. Isi form<br>2. Masukkan NIK "1234567890" (10 digit)<br>3. Klik Daftar | Sistem menolak proses dan memunculkan *alert/error* "NIK harus terdiri dari 16 digit". |
| REG-03 | Gagal mendaftar karena format email salah | Pengguna berada di form pendaftaran | 1. Masukkan email "pemda.sulteng.tanpa.at" (tanpa @)<br>2. Klik Daftar | Form validasi browser menahan *submit* dan meminta email yang valid. |
| REG-04 | Mendaftar dengan email yang sudah pernah terdaftar | Ada akun yang sudah disetujui sebelumnya | 1. Isi form dengan email lama<br>2. Klik Daftar | Sistem menolak dengan pesan "Email sudah digunakan". |

### 2. Modul Autentikasi (Login & Sesi)
| ID | Skenario Uji | Prasyarat (Pre-condition) | Langkah-langkah | Ekspektasi Hasil |
|---|---|---|---|---|
| AUTH-01 | Login berhasil menggunakan kredensial valid | Akun berstatus `APPROVED` | 1. Masukkan Email & Password benar<br>2. Klik Masuk | Berhasil masuk ke halaman Dashboard sesuai Role (Pemda/Admin). |
| AUTH-02 | Gagal login karena akun belum disetujui Admin | Akun berstatus `PENDING` | 1. Masukkan Email & Password benar<br>2. Klik Masuk | Ditolak dengan pesan "Akun Anda belum disetujui oleh admin BPS." |
| AUTH-03 | Mengamankan rute halaman internal (Route Protection) | Pengguna belum login (Guest) | 1. Paksa buka URL `/dashboard` lewat *address bar* | Otomatis di-lempar (*redirect*) kembali ke halaman `/login`. |

### 3. Modul Dashboard Admin (Verifikasi Pendaftar)
| ID | Skenario Uji | Prasyarat (Pre-condition) | Langkah-langkah | Ekspektasi Hasil |
|---|---|---|---|---|
| ADM-01 | Melihat daftar antrean pendaftar baru | Login sebagai `ADMIN` | 1. Buka menu Registrasi | Muncul tabel daftar pemohon dengan status `PENDING`. |
| ADM-02 | Menerima (Approve) pendaftaran instansi | Ada pemohon berstatus `PENDING` | 1. Klik tombol "Setujui"<br>2. Konfirmasi pop-up | Status berubah jadi `APPROVED`. Sistem *backend* otomatis membuatkan akun aktif (bisa login). |
| ADM-03 | Menolak (Reject) pendaftaran instansi | Ada pemohon berstatus `PENDING` | 1. Klik tombol "Tolak"<br>2. Tulis alasan penolakan "Surat tidak lengkap"<br>3. Konfirmasi | Status berubah jadi `REJECTED`. Akun login tidak dibuat. |

### 4. Modul Pemadanan Data (Upload & Validasi)
| ID | Skenario Uji | Prasyarat (Pre-condition) | Langkah-langkah | Ekspektasi Hasil |
|---|---|---|---|---|
| MAT-01 | Gagal unggah karena salah ekstensi file | Login sebagai Pemda | 1. Buka menu Padankan Data<br>2. Pilih file foto (`.jpg` / `.pdf`) | Sistem menolak dan hanya menerima ekstensi `.xlsx` atau `.csv`. |
| MAT-02 | Berhasil *parsing* file Excel kotor | Login sebagai Pemda | 1. Upload `.xlsx` yang di baris tengahnya kosong/ada kolom tak beraturan | Sistem cerdas mengabaikan baris kosong, dan hanya mengambil baris yang memiliki data NIK untuk diproses. |
| MAT-03 | Memproses file data berskala masif | Login sebagai Pemda | 1. Upload file CSV berisi 10.000+ baris data | Sistem tidak *timeout*, memproses secara *asynchronous*, dan mengembalikan hasil padanan dengan skor utuh. |

### 5. Algoritma Mesin Pencari & Kecerdasan (Engine)
| ID | Skenario Uji | Prasyarat (Pre-condition) | Langkah-langkah | Ekspektasi Hasil |
|---|---|---|---|---|
| ENG-01 | Pengujian akurasi kecocokan persis (Exact Match) | NIK di file Excel 100% sama dengan *database* DTSEN | Jalankan proses pemadanan | Baris data tersebut dikategorikan sebagai "Sangat Valid" (Skor 100%). |
| ENG-02 | Pengujian jarak Levenshtein (Salah Ketik / Typo NIK) | NIK di Excel berbeda 1 angka dengan *database* (misal: 7201... vs 7202...) | Jalankan proses pemadanan | Sistem tidak langsung membuang data, melainkan memunculkannya dengan status "Cek Manual" (Skor kemiripan ~93%). |

### 6. Modul Antarmuka Pengguna (UI/UX)
| ID | Skenario Uji | Prasyarat (Pre-condition) | Langkah-langkah | Ekspektasi Hasil |
|---|---|---|---|---|
| UI-01 | Pengujian tampilan *Responsiveness* di HP | Halaman dibuka | 1. Buka web pakai tampilan *Mobile* (lebar < 768px) | Menu *navbar* berubah jadi *hamburger menu*. Tabel data menyesuaikan layar (bisa di-*scroll* menyamping). |
| UI-02 | Pengujian transisi *Dark Mode* | Halaman Utama | 1. Klik ikon Bulan di pojok atas | Warna latar belakang berubah menjadi gelap (biru dongker), *Grid* CSS tetap terlihat manis, teks terbaca jelas (putih). |
