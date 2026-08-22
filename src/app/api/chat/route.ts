import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Mode Simulasi (Offline/Belum ada API Key)
    if (!apiKey) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi jeda AI
      
      const q = message.toLowerCase();
      let reply = "Maaf, saya tidak memahami pertanyaan tersebut. Silakan tanyakan seputar DTSEN, pemadanan, atau regulasi (Inpres No.4 / Permen PPN No.7).";

      if (q.includes('dtsen apa') || q.includes('apa itu dtsen') || q.includes('dtsen')) {
        reply = "DTSEN (Data Tunggal Sosial Ekonomi Nasional) adalah basis data terpusat yang diamanatkan oleh Inpres No. 4 Tahun 2025. DTSEN mencakup kondisi sosial ekonomi rumah tangga di Indonesia untuk mendukung penyaluran bantuan yang lebih tepat sasaran.";
      } else if (q.includes('inpres') || q.includes('aturan') || q.includes('regulasi') || q.includes('permen') || q.includes('hukum')) {
        reply = "Regulasi utama DTSEN meliputi: \n1. **Inpres No. 4 Tahun 2025** tentang pengelolaan data terintegrasi. \n2. **Permen PPN Bappenas Nomor 7 Tahun 2025** tentang kewajiban seluruh pihak dalam pemanfaatan dan pengelolaan DTSEN.";
      } else if (q.includes('pemadanan') || q.includes('cara padan') || q.includes('mekanisme')) {
        reply = "Proses pemadanan dilakukan dengan cara K/L atau Pemda mengirimkan file data sasaran ke sistem PAKEWA (BPS). Sistem kemudian memverifikasi struktur file (Pra-validasi) lalu memadankannya (Matching) menggunakan algoritma berbasis NIK dan Probabilistik (Levenshtein) untuk mengatasi salah ketik atau data hilang (sebagaimana tertuang dalam pedoman BPS).";
      } else if (q.includes('halo') || q.includes('hai') || q.includes('pagi') || q.includes('siang') || q.includes('malam')) {
        reply = "Halo! Saya adalah Asisten AI PAKEWA. Karena saat ini API Key belum tersedia, saya memuat pengetahuan dasar secara luring mengenai DTSEN dan Pemadanan. Ada yang bisa saya bantu terkait hal tersebut?";
      }

      return NextResponse.json({ reply });
    }

    // Format history for Gemini API
    const formattedHistory = history.map((msg: any) => ({
      role: msg.role === 'bot' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));
    
    // Jika ada API KEY, jalankan Gemini aslinya
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'system',
          parts: [{ text: "Anda adalah asisten virtual resmi untuk aplikasi PAKEWA (Padanan Kesejahteraan Warga) dari Badan Pusat Statistik (BPS). Anda bertugas membantu instansi pemerintah daerah dalam melakukan pemadanan data kemiskinan ekstrem dengan DTSEN. Berikan jawaban yang profesional, ramah, dan solutif. Anda harus selalu menggunakan bahasa Indonesia yang baik dan sopan." }]
        },
        ...formattedHistory,
        {
          role: 'user',
          parts: [{ text: message }]
        }
      ],
      config: {
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });
    
    return NextResponse.json({ reply: response.text });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memproses pesan atau menghubungi AI.' },
      { status: 500 }
    );
  }
}
