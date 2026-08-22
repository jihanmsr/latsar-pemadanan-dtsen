import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// =====================================================================
// BANK PENGETAHUAN PAKEWA - Mode Simulasi (tanpa API Key)
// Tambahkan pertanyaan-pertanyaan baru di sini
// =====================================================================
const knowledgeBase: { keywords: string[]; reply: string }[] = [
  // --- Salam & Sapaan ---
  {
    keywords: ['halo', 'hai', 'hi', 'selamat pagi', 'selamat siang', 'selamat sore', 'selamat malam', 'hei', 'assalamu', 'permisi'],
    reply: "Halo! Selamat datang di Asisten Virtual PAKEWA 👋\nSaya siap membantu Anda seputar pemadanan data DTSEN. Silakan tanyakan apa pun!"
  },
  // --- Tentang PAKEWA ---
  {
    keywords: ['pakewa', 'apa itu pakewa', 'aplikasi ini', 'sistem ini', 'tentang pakewa'],
    reply: "PAKEWA (Padanan Kesejahteraan Warga) adalah sistem informasi resmi yang dikembangkan oleh BPS untuk memfasilitasi pemadanan data sasaran program K/L/D dengan Data Tunggal Sosial Ekonomi Nasional (DTSEN).\n\nFitur utama PAKEWA:\n📋 Unggah & validasi data sasaran\n🔍 Pemadanan otomatis berbasis NIK & probabilistik\n📊 Laporan hasil pemadanan terstruktur\n🔒 Keamanan data berlapis (JWT, enkripsi)"
  },
  // --- Tentang DTSEN ---
  {
    keywords: ['dtsen', 'data tunggal', 'sosial ekonomi nasional', 'apa itu dtsen', 'dtsen apa'],
    reply: "DTSEN (Data Tunggal Sosial Ekonomi Nasional) adalah basis data kemiskinan terpusat yang diamanatkan oleh Inpres No. 4 Tahun 2025.\n\nDTSEN mencakup:\n👤 Data individu & rumah tangga\n📍 Informasi sosial ekonomi yang terverifikasi\n🏛️ Dikelola oleh BPS sebagai walidata\n\nTujuannya: memastikan penyaluran bantuan sosial lebih tepat sasaran, tepat jumlah, dan tepat waktu."
  },
  // --- Regulasi ---
  {
    keywords: ['inpres', 'regulasi', 'aturan', 'hukum', 'dasar hukum', 'permen', 'peraturan', 'kebijakan', 'landasan', 'payung hukum'],
    reply: "Regulasi utama yang mendasari DTSEN & PAKEWA:\n\n📌 Inpres No. 4 Tahun 2025\nTentang pengelolaan data terintegrasi & kewajiban K/L/D dalam pemadanan.\n\n📌 Permen PPN/Bappenas No. 7 Tahun 2025\nTentang tata cara pemanfaatan dan pengelolaan DTSEN oleh seluruh pemangku kepentingan."
  },
  // --- Proses Pemadanan ---
  {
    keywords: ['pemadanan', 'cara padan', 'mekanisme', 'proses', 'langkah', 'tahapan', 'alur', 'cara kerja', 'bagaimana cara'],
    reply: "Alur pemadanan data di PAKEWA:\n\n1️⃣ Daftar & Login sebagai akun Pemda\n2️⃣ Unggah file data sasaran (CSV/XLSX)\n3️⃣ Sistem melakukan Pra-Validasi (cek format, kolom, dll)\n4️⃣ Proses Matching otomatis:\n   • Exact Match (NIK sama persis)\n   • Probabilistic Match (Levenshtein untuk mengatasi salah ketik)\n5️⃣ Unduh laporan hasil pemadanan\n6️⃣ BPS Admin melakukan verifikasi akhir"
  },
  // --- Format File ---
  {
    keywords: ['format file', 'template', 'kolom', 'csv', 'xlsx', 'excel', 'file apa', 'format data', 'contoh file'],
    reply: "Format file yang didukung PAKEWA:\n\n📄 CSV (.csv) atau Excel (.xlsx)\n\nKolom wajib yang harus ada:\n• NIK (16 digit)\n• Nama Lengkap\n• Tanggal Lahir (YYYY-MM-DD)\n• Jenis Kelamin (L/P)\n• Alamat\n• Kabupaten/Kota\n• Kecamatan\n\nPastikan tidak ada kolom yang kosong pada data utama untuk hasil pemadanan yang optimal."
  },
  // --- Status Pemadanan ---
  {
    keywords: ['status', 'exact match', 'probable match', 'no match', 'tidak padan', 'hasil', 'arti status'],
    reply: "Penjelasan status hasil pemadanan:\n\n✅ EXACT MATCH\nData sasaran ditemukan di DTSEN dengan NIK yang sama persis. Dapat langsung diproses.\n\n🟡 PROBABLE MATCH\nData ditemukan dengan kemiripan tinggi (nama/tanggal lahir mirip). Perlu verifikasi manual.\n\n❌ NO MATCH\nData tidak ditemukan di DTSEN. Kemungkinan: NIK tidak terdaftar, data tidak valid, atau bukan warga miskin ekstrem."
  },
  // --- Kemiskinan Ekstrem ---
  {
    keywords: ['kemiskinan ekstrem', 'miskin ekstrem', 'desil', 'p0', 'angka kemiskinan'],
    reply: "Kemiskinan ekstrem adalah kondisi ketidakmampuan individu dalam memenuhi kebutuhan dasar minimal (makanan, air bersih, sanitasi, kesehatan).\n\nIndonesia menargetkan kemiskinan ekstrem **0%** pada tahun 2024 (Perpres No. 67/2021).\n\nDTSEN memuat data desil pengeluaran per kapita yang membantu K/L/D mengidentifikasi kelompok paling rentan untuk menjadi penerima bantuan prioritas."
  },
  // --- Keamanan Data ---
  {
    keywords: ['keamanan', 'aman', 'privasi', 'enkripsi', 'data bocor', 'kerahasiaan', 'perlindungan data', 'gdpr', 'pdp'],
    reply: "Keamanan data di PAKEWA dirancang berlapis:\n\n🔐 Autentikasi JWT (JSON Web Token)\n🔒 Koneksi HTTPS terenkripsi\n👁️ Kontrol akses berbasis peran (PEMDA / BPS Admin)\n📋 Data sensitif hanya diproses di server BPS\n🚫 Data tidak disimpan di cloud publik\n\nSeluruh proses tunduk pada UU PDP (Perlindungan Data Pribadi) No. 27 Tahun 2022."
  },
  // --- Siapa yang menggunakan ---
  {
    keywords: ['siapa', 'pengguna', 'user', 'pemda', 'siapa yang bisa', 'bisa digunakan', 'instansi'],
    reply: "PAKEWA dapat digunakan oleh:\n\n🏛️ Pemerintah Daerah (Pemda)\nK/L/D yang memiliki program bantuan sosial dan ingin memadankan data sasaran dengan DTSEN.\n\n🔵 BPS Admin\nPetugas BPS yang melakukan verifikasi, pengelolaan, dan monitoring seluruh proses pemadanan.\n\nUntuk mendaftar, klik tombol **\"Daftar Instansi\"** di halaman utama."
  },
  // --- Biaya ---
  {
    keywords: ['biaya', 'bayar', 'gratis', 'tarif', 'harga', 'berbayar'],
    reply: "PAKEWA adalah layanan **GRATIS** yang disediakan oleh BPS sebagai bagian dari tugas pokok dan fungsi (tupoksi) dalam penyediaan data statistik nasional. Tidak ada biaya apapun yang dikenakan kepada K/L/D pengguna sistem ini."
  },
  // --- Kontak & Bantuan ---
  {
    keywords: ['kontak', 'hubungi', 'telepon', 'email', 'whatsapp', 'bantuan', 'support', 'helpdesk', 'kendala', 'masalah'],
    reply: "Jika Anda mengalami kendala teknis atau membutuhkan bantuan:\n\n📞 Hubungi tim kami melalui tombol **\"Hubungi Kami\"** (ikon WhatsApp hijau) di pojok kiri bawah.\n\n🏢 Atau kunjungi langsung:\nBPS Provinsi Sulawesi Tengah\nJl. Tanjung Dako No. 19, Palu\n\nKami siap membantu pada hari kerja Senin–Jumat, pukul 08.00–16.00 WITA."
  },
  // --- Tentang BPS ---
  {
    keywords: ['bps', 'badan pusat statistik', 'tentang bps', 'bps sulteng', 'bps sulawesi tengah'],
    reply: "BPS (Badan Pusat Statistik) adalah Lembaga Pemerintah Non-Kementerian yang bertanggung jawab atas penyediaan data statistik berkualitas di Indonesia.\n\nDalam konteks DTSEN, BPS berperan sebagai:\n📊 Walidata (data custodian) DTSEN\n🔍 Pengelola sistem pemadanan nasional\n✅ Penjamin kualitas & akurasi data\n\nBPS Sulawesi Tengah berkomitmen mendukung program pengentasan kemiskinan ekstrem di Sulteng."
  },
];

function getSimulatedReply(message: string): string {
  const q = message.toLowerCase().trim();
  
  for (const item of knowledgeBase) {
    if (item.keywords.some(keyword => q.includes(keyword))) {
      return item.reply;
    }
  }
  
  return "Maaf, saya belum memiliki informasi spesifik untuk pertanyaan tersebut 🙏\n\nSilakan tanyakan seputar:\n• DTSEN & Regulasi\n• Proses & Format Pemadanan\n• Status Hasil Pemadanan\n• Keamanan Data\n• Cara Penggunaan PAKEWA\n\nAtau hubungi tim kami melalui tombol **Hubungi Kami**.";
}

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Mode Simulasi (Offline/Belum ada API Key)
    if (!apiKey) {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulasi jeda AI
      const reply = getSimulatedReply(message);
      return NextResponse.json({ reply });
    }

    // Jika ada API KEY, jalankan Gemini aslinya
    const formattedHistory = (history || []).map((msg: { role: string; text: string }) => ({
      role: msg.role === 'bot' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));
    
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: "Anda adalah asisten virtual resmi PAKEWA (Padanan Kesejahteraan Warga) dari BPS. Bantu instansi pemerintah terkait pemadanan DTSEN. Gunakan bahasa Indonesia yang profesional, ramah, dan ringkas. Jawab sesuai konteks DTSEN, regulasi, dan pemadanan data." }]
        },
        ...formattedHistory,
        {
          role: 'user',
          parts: [{ text: message }]
        }
      ],
      config: {
        temperature: 0.7,
        maxOutputTokens: 600,
      }
    });
    
    return NextResponse.json({ reply: response.text });
  } catch (error) {
    console.error('Chat API Error:', error);
    // Fallback ke mode simulasi jika Gemini gagal
    const { message } = await req.json().catch(() => ({ message: '' }));
    if (message) {
      const reply = getSimulatedReply(message);
      return NextResponse.json({ reply });
    }
    return NextResponse.json(
      { error: 'Terjadi kesalahan. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}
