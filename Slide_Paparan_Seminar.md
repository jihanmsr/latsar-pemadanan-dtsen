# STRUKTUR BAHAN TAYANG (PPT) SEMINAR RANCANGAN
**Waktu Paparan: Maksimal 10 Menit (Target 8-9 Menit Bicara)**
**Tips Visual:** Jangan masukkan teks panjang ke dalam *slide*. Gunakan *bullet points*, bagan, dan gambar/tangkapan layar. Biarkan teks panjangnya kamu ucapkan secara lisan sesuai naskah ini.

---

## SLIDE 1: Judul & Perkenalan (Durasi: 1 Menit)
* **Visual Slide:** Judul Laporan (Optimalisasi Mekanisme Pemadanan Data Balikan DTSEN melalui Pengembangan Sistem Terintegrasi PAKEWA), Nama Kamu, Instansi, Nama Mentor, Nama *Coach*, dan Nama Penguji.
* **Script Bicara:** 
  *"Assalamu’alaikum Wr. Wb. Yang terhormat Bapak Suhariadi selaku Penguji, Ibu Ana selaku Coach, dan Bapak Hespri selaku Mentor yang telah hadir. Perkenalkan saya Jihan Maisaroh dari BPS Provinsi Sulawesi Tengah. Hari ini saya akan memaparkan rancangan aktualisasi saya yang berjudul Optimalisasi Mekanisme Pemadanan Data Balikan DTSEN melalui Pengembangan Sistem Terintegrasi PAKEWA."*

## SLIDE 2: Identifikasi Isu-Isu Utama (Durasi: 1.5 Menit)
* **Visual Slide:** 
  - Daftar 3 Isu (DTSEN, KIPPApp, BMN).
* **Script Bicara:** 
  *"Berdasarkan Paparan BPS Pusat 6 Mei 2026 dan observasi lapangan, saya mengidentifikasi 3 isu utama di lingkungan kerja saya.*
  *Isu pertama, belum adanya infrastruktur sistem pemadanan data DTSEN yang terotomasi. Kondisi ini membuat tim terbebani pekerjaan manual yang repetitif dan memicu risiko salah sasaran bantuan sosial.*
  *Isu kedua, belum optimalnya pemantauan pengisian capaian kinerja SKP pada KIPPApp di Tim MTI. Hal ini menyebabkan penumpukan penyelesaian SKP secara terburu-buru di akhir waktu dan menurunnya kualitas dokumen bukti kinerja.*
  *Dan isu ketiga, belum optimalnya sistem pencatatan dan monitoring Barang Milik Negara (BMN) berbasis digital, sehingga riwayat peminjaman aset sulit dilacak dan rentan memicu kehilangan barang."*

## SLIDE 3: Penetapan Core Isu (APKL) (Durasi: 1 Menit)
* **Visual Slide:** Tabel Matriks APKL (sorot warna merah pada Isu 1 sebagai pemenang).
* **Script Bicara:** 
  *"Dari ketiga isu tersebut, dilakukan analisis tapisan APKL melalui Expert Judgement bersama mentor. Hasilnya, isu pertama menjadi isu yang paling mendesak (Core Isu). Jika mekanisme pemadanan DTSEN ini tidak segera ditangani, antrean permintaan Pemda akan menumpuk dan proses validasi menjadi sangat lambat."*

## SLIDE 4: Dampak Isu Terpilih (Jika Tidak Ditangani) (Durasi: 1 Menit)
* **Visual Slide:** 4 Poin Dampak (Masyarakat, Instansi Eksternal, Organisasi BPS, Individu ASN).
* **Script Bicara:** 
  *"Jika core isu ini dibiarkan, akan ada 4 dampak besar. Bagi **Masyarakat**, muncul risiko fatal salah sasaran bantuan sosial karena data kemiskinan kedaluwarsa. Bagi **Instansi Eksternal (Pemda)**, mereka akan kesulitan memadankan jutaan baris data kotor secara mandiri. Bagi **Organisasi BPS**, kredibilitas kita sebagai Pembina Data Sektoral akan menurun akibat tidak adanya jaminan SLA layanan. Dan bagi **Individu (ASN BPS)**, tim kami akan terus terbebani pekerjaan cleansing data repetitif yang rawan human error."*

## SLIDE 5: Akar Masalah (Fishbone) (Durasi: 1 Menit)
* **Visual Slide:** Gambar *Fishbone Diagram* (4M: Man, Machine, Method, Material). Beri **lingkaran tebal/sorotan** pada cabang *Machine* dan *Method*. Tabel justifikasi singkat.
* **Script Bicara:** 
  *"Berdasarkan analisis Fishbone, akar penyebab dominan ada pada kualitas data mentah (Material) dan minimnya kompetensi teknis daerah (Man). Namun, karena hal tersebut di luar kendali saya, intervensi difokuskan pada faktor Machine dan Method. Yaitu ketiadaan arsitektur sistem (Machine) dan belum terotomasinya prosedur pelayanan (Method). Jika dua hal ini diselesaikan, maka kendala lambatnya pemadanan bisa teratasi."*

## SLIDE 6: Gagasan Kreatif & Tapisan McNamara (Durasi: 1 Menit)
* **Visual Slide:** Tabel McNamara (sorot PAKEWA sebagai pemenang). Mockup simpel aplikasi PAKEWA.
* **Script Bicara:** 
  *"Melalui tapisan McNamara, pembangunan Arsitektur Web PAKEWA memperoleh skor efektivitas tertinggi karena mampu menyelesaikan dua akar masalah utama secara bersamaan, yaitu aspek teknologi (Machine) dan prosedur pelayanan (Method). Inovasi utamanya adalah penggunaan algoritma 'Levenshtein Similarity' untuk mencocokkan data typo secara cerdas, serta fitur SLA Tracking untuk transparansi layanan."*

## SLIDE 7: Rencana Kegiatan Aktualisasi (Durasi: 1 Menit)
* **Visual Slide:** Bagan alur panah 5 tahap SDLC (Requirement -> Design -> Development -> Testing -> Implementation).
* **Script Bicara:** 
  *"Rencana implementasi gagasan ini mengadopsi pendekatan System Development Life Cycle (SDLC) dalam rekayasa perangkat lunak agar sistem dibangun secara terstruktur. Kegiatannya dibagi menjadi 5 tahapan berurutan, yaitu: 1) Requirement Analysis; 2) System Design & Mockup UI/UX; 3) System Development (Coding); 4) System Testing; dan 5) Implementation & Deployment ke server BPS."*

## SLIDE 8: Keterkaitan Nilai BerAKHLAK (Durasi: 1 Menit)
* **Visual Slide:** Tampilkan 7 Ikon BerAKHLAK (hanya logo/ikon, jangan tabel penuh teks).
* **Script Bicara:** 
  *"Selama proses kelima tahapan tersebut, saya berkomitmen mengimplementasikan nilai BerAKHLAK. Sebagai contoh: Pada tahap desain, saya merancang antarmuka yang sangat user-friendly (Berorientasi Pelayanan) dan merancang database secara cermat (Akuntabel). Pada tahap coding, saya menjamin kerahasiaan data (Kompeten), serta berinovasi dengan algoritma terbaru (Adaptif). Semua ini dilakukan dengan terus berkolaborasi bersama mentor (Kolaboratif) untuk menjaga nama baik instansi (Loyal/Harmonis)."*

## SLIDE 9: Penutup & Penguatan Organisasi (Durasi: 1 Menit)
* **Visual Slide:** Jadwal/Gantt Chart (Juli - September 2026). Logo Budaya Organisasi BPS. Tulisan "TERIMA KASIH".
* **Script Bicara:** 
  *"Rangkaian aktualisasi ini dilaksanakan dari akhir Juli hingga awal September 2026. Gagasan PAKEWA ini tidak hanya mempercepat pencapaian Visi Misi BPS dalam menyediakan data berkualitas, namun juga sangat berkontribusi memperkuat Budaya Organisasi BPS. Sistem ini adalah wujud nyata 'Inovasi di setiap lini' dan 'Kerja Cerdas', di mana kita tak perlu lagi bekerja keras memadankan jutaan baris Excel secara manual. Demikian paparan saya, terima kasih."*

---
**TIPS TAMBAHAN:**
1. **Aturan 10 Menit:** Panjang naskah lisan di atas sudah disesuaikan agar tetap padat (sekitar 750 kata). Dengan kecepatan normal, durasinya sekitar **9 sampai 9.5 menit**!
2. Jangan membaca teks panjang di slide, tapi **baca/hafal script** ini. Slide di layar biarkan hanya berisi gambar dan poin inti.
3. Pertahankan argumen APKL pakai "Expert Judgement" jika ditanya, dan fokus ke Machine/Method pada Fishbone.

---

## SLIDE CADANGAN 1: Keterkaitan Agenda III (Manajemen & Smart ASN)
* **Visual Slide:** Poin-poin singkat Manajemen ASN & Smart ASN.
* **Script / Poin Jawaban:**
  * **MANAJEMEN ASN (Profesional & Akuntabel)**
    * Menggeser budaya kerja manual (WhatsApp) menjadi layanan terpusat (PAKEWA).
    * Kinerja Terukur dengan *SLA Tracking* dan *BAST Digital*.
  * **SMART ASN (Literasi Digital)**
    * **Digital Skill:** Inovasi *Algoritma Levenshtein*.
    * **Digital Culture:** Edukasi Pemda bertransformasi ke sistem digital.
    * **Digital Safety:** Enkripsi NIK di server (menghindari kebocoran data privasi WA).

## SLIDE CADANGAN 2: Aktualisasi Nilai Agenda II (BerAKHLAK)
* **Visual Slide:** 7 Ikon BerAKHLAK beserta ringkasan pendek.
* **Script / Poin Jawaban:**
  * **Berorientasi Pelayanan:** Mendesain portal semudah mungkin (*user-friendly*) bagi Pemda awam IT.
  * **Akuntabel:** Mengenkripsi database NIK agar rahasia penduduk aman.
  * **Kompeten:** Mengerahkan keahlian IT untuk merancang algoritma *Levenshtein*.
  * **Harmonis:** Membangun komunikasi yang saling menghargai dengan rekan MTI & Pemda.
  * **Loyal:** Mendedikasikan PAKEWA untuk instansi dan menjaga nama baik BPS.
  * **Adaptif:** Proaktif beradaptasi menggunakan tren bahasa pemrograman terkini.
  * **Kolaboratif:** Bersinergi aktif dengan mentor, coach, dan tim jaringan BPS.

## SLIDE CADANGAN 3: Proses Penemuan Isu & Aktualitas (Q1 & Q2)
* **Visual Slide:** Tanggal paparan BPS Pusat (6 Mei) & Bukti chat WhatsApp manual.
* **Script / Poin Jawaban:**
  * Berawal dari Paparan BPS Pusat 6 Mei 2026 tentang pemadanan DTSEN.
  * Observasi menunjukkan infrastruktur BPS Sulteng belum siap (masih manual via Excel & WA).
  * Dianalisis menggunakan APKL dengan *Expert Judgement* mentor.
  * Sangat aktual dan menyoroti kelemahan *Manajemen ASN* di lingkungan kerja yang butuh digitalisasi.

## SLIDE CADANGAN 4: Terobosan PAKEWA & Pemecahan Masalah (Q3)
* **Visual Slide:** Bagan Fishbone (Fokus Machine & Method) disilang (X) dengan solusi PAKEWA.
* **Script / Poin Jawaban:**
  * PAKEWA adalah terobosan mutlak; BPS Sulteng belum pernah memiliki portal otomasi serupa.
  * Memotong dua akar masalah sekaligus: ketiadaan sistem (*Machine*) dan ketiadaan standar layanan (*Method*).
  * Wujud nyata transformasi *Digital Governance*.

## SLIDE CADANGAN 5: Relevansi Kegiatan SDLC (Q4)
* **Visual Slide:** Bagan Rantai 5 tahapan SDLC.
* **Script / Poin Jawaban:**
  * Seluruh 5 kegiatan (Requirement, Design, Coding, Testing, Implementasi) sangat relevan dan saling mengikat.
  * Berupa rantai *System Development Life Cycle (SDLC)*: tidak bisa *coding* tanpa desain, tidak bisa rilis tanpa *testing*.

## SLIDE CADANGAN 6: Kontribusi Visi, Misi, Tusi, dan Budaya Organisasi (Q6 & Q7)
* **Visual Slide:** Teks Visi Misi BPS dan 5 Budaya Organisasi BPS terbaru.
* **Script / Poin Jawaban:**
  * **Visi BPS:** Mendukung rumusan kebijakan berbasis data yang terpercaya, karena PAKEWA menjamin validitas data kemiskinan (DTSEN) untuk Pemda.
  * **Misi BPS:** Berkontribusi pada Misi "Menyediakan Data Statistik Berkualitas" dan "Menguatkan kapasitas kelembagaan yang efektif dan efisien" melalui otomatisasi layanan.
  * **Tugas BPS:** Menguatkan tugas BPS dalam kegiatan statistik secara resmi sesuai perundang-undangan (meninggalkan aplikasi pesan non-formal).
  * **Budaya Organisasi BPS:** 
    * **Inovasi di setiap lini:** PAKEWA adalah wujud inovasi nyata berbasis AI (*Levenshtein*).
    * **Kerja Keras dan Kerja Cerdas:** Bekerja *cerdas* dengan sistem terotomasi, bukan sekadar *keras* mengecek manual di Excel.
    * **Komunikasi, Koordinasi, & Diplomasi (KKD):** Portal ini memfasilitasi alur koordinasi dan serah terima (BAST digital) yang resmi antara BPS dan Pemda.

## SLIDE CADANGAN 7: Cheatsheet Penerapan BerAKHLAK per Tahapan Kegiatan
**Catatan:** Gunakan ini jika penguji menunjuk kegiatan spesifik dan bertanya nilai apa yang diterapkan di sana.

**1. Analisis Kebutuhan (Requirement)**
* **Berorientasi Pelayanan:** Ramah saat memaparkan ide rancangan.
* **Akuntabel:** Transparan dan cermat menggali regulasi tata kelola data.
* **Kompeten:** Ahli dan teliti dalam melakukan *benchmarking* sistem pusat.
* **Harmonis:** Menghargai masukan dan arahan dari mentor tanpa mendebat.
* **Loyal:** Memastikan ide aplikasi selaras dengan tujuan besar BPS.
* **Adaptif:** Berinovasi merumuskan *flowchart* alur kerja yang baru.
* **Kolaboratif:** Diskusi terbuka lintas bidang dengan tim IT.

**2. Desain Sistem (Mockup & ERD)**
* **Berorientasi Pelayanan:** Mendesain *mockup* UI yang senyaman mungkin (*user-friendly*).
* **Akuntabel:** Bertanggung jawab merancang struktur *database* yang anti bocor.
* **Kompeten:** Mendesain ERD secara logis, presisi, dan sesuai standar IT.
* **Harmonis:** Terbuka dan lapang dada menerima kritik perbaikan *mockup*.
* **Loyal:** Berdedikasi pada pencapaian visi keamanan data institusi BPS.
* **Adaptif:** Mengadopsi tren desain *website* modern saat ini.
* **Kolaboratif:** Bersinergi aktif dengan pengelola *server* daerah.

**3. Pengembangan Sistem (Coding)**
* **Berorientasi Pelayanan:** Mengoding *frontend* web agar sangat responsif saat diakses.
* **Akuntabel:** Mengerjakan *setup* server dengan hati-hati untuk mencegah malfungsi.
* **Kompeten:** Mengerahkan *best-practice* koding untuk algoritma *Levenshtein*.
* **Harmonis:** Menjaga keselarasan agar integrasi *frontend* dan *backend* tidak bentrok.
* **Loyal:** Pengabdian penuh untuk memajukan infrastruktur digital BPS.
* **Adaptif:** Proaktif mempelajari *library* atau *framework* pemrograman terbaru.
* **Kolaboratif:** Koordinasi teknis berkesinambungan bersama tim jaringan.

**4. Pengujian Sistem (Testing)**
* **Berorientasi Pelayanan:** Sabar dan solutif mendampingi calon pengguna saat UAT.
* **Akuntabel:** Disiplin dan jujur mencatat *error* sekecil apa pun saat *Blackbox testing*.
* **Kompeten:** Mengerahkan kemampuan *problem-solving* mumpuni saat memperbaiki *bug*.
* **Harmonis:** Tetap tenang dan tidak menyalahkan pihak lain saat sistem gagal uji.
* **Loyal:** Mencegah sistem cacat (*error*) rilis demi menjaga kualitas aplikasi BPS.
* **Adaptif:** Mengantisipasi berbagai kendala sistem di masa depan sejak dini.
* **Kolaboratif:** Melakukan uji coba lintas instansi bersama pegawai daerah.

**5. Sosialisasi & Implementasi (Deployment)**
* **Berorientasi Pelayanan:** Menyusun buku panduan (*User Manual*) dengan bahasa orang awam.
* **Akuntabel:** Melakukan proses *deploy* dengan konfigurasi perlindungan (enkripsi) yang aman.
* **Kompeten:** Mendemonstrasikan fitur-fitur aplikasi secara fasih dan ahli di depan audiens.
* **Harmonis:** Bersikap sopan, santun, dan menghargai audiens saat sosialisasi ke Pemda.
* **Loyal:** Membangun citra dan kepercayaan Pemda terhadap keprofesionalan BPS.
* **Adaptif:** Proaktif menyediakan panduan dalam bentuk *e-book* yang fleksibel dibaca.
* **Kolaboratif:** Melakukan serah terima (*handover*) sistem kepada Tim Infrastruktur.

## SLIDE CADANGAN 8: Konsep Levenshtein Similarity & Keamanan Data
**Catatan:** Gunakan ini jika penguji bertanya hal teknis tentang algoritma kecerdasan buatan yang dipakai atau privasi DTSEN.

**1. Konsep Levenshtein Similarity (Pemadanan Probabilistik)**
* **Definisi:** Teknik untuk mengukur kemiripan antara dua teks (misal: Nama orang) berdasarkan jumlah pengeditan karakter (*cost*) yang diperlukan untuk mengubah satu kata menjadi kata lainnya.
* **Fungsi Utama:** Sangat cerdas dan berguna untuk menangani kesalahan ketik (*typo*), variasi ejaan, atau data mentah dari Pemda yang tidak konsisten.
* **Cara Kerja:** Algoritma ini menghitung 3 operasi dasar pengeditan, yaitu: *Insertion* (Penyisipan karakter), *Deletion* (Penghapusan karakter), dan *Substitution* (Penggantian karakter).

**2. Syarat Keamanan & Kerahasiaan Data DTSEN**
* **Dasar Aturan:** Mematuhi Surat Deputi Bidang Statistik Sosial No. B-314/04200/KS.000/2025 tanggal 29 Oktober 2025.
* **Prinsip Penggunaan:** Data DTSEN wajib digunakan secara **terbatas**, **sesuai kebutuhan**, dan mematuhi ketentuan kerahasiaan data nasional.
* **Solusi via PAKEWA:** Kehadiran sistem PAKEWA ini justru menguatkan protokol keamanan tersebut dengan melarang keras pengiriman data DTSEN (berisi NIK warga miskin) melalui aplikasi pesan instan (WhatsApp), dan memindahkannya ke dalam *server* BPS yang terenkripsi dan terlacak via BAST Digital.
