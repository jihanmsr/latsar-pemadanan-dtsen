import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

import fs from 'fs';
import path from 'path';

// =====================================================================
// BANK PENGETAHUAN PAKEWA - Mode Simulasi (tanpa API Key)
// Membaca dari file JSON agar bisa di-manage oleh Admin
// =====================================================================

function getSimulatedReply(message: string): string {
  const q = message.toLowerCase().trim();
  
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'knowledge.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const knowledgeBase = JSON.parse(fileContent);
    
    for (const item of knowledgeBase) {
      if (item.keywords && item.keywords.some((keyword: string) => q.includes(keyword.toLowerCase()))) {
        return item.reply;
      }
    }
  } catch (error) {
    console.error("Error reading knowledge base:", error);
  }
  
  return "Maaf, saya belum memiliki informasi spesifik untuk pertanyaan tersebut 🙏\n\nSilakan tanyakan seputar:\n• DTSEN & Regulasi\n• Proses & Format Pemadanan\n• Status Hasil Pemadanan\n• Keamanan Data\n• Cara Penggunaan PAKEWA\n\nAtau hubungi tim kami melalui tombol **Hubungi Kami**.";
}

export async function POST(req: NextRequest) {
  let message = '';
  let history = [];
  
  try {
    const body = await req.json();
    message = body.message;
    history = body.history;

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
