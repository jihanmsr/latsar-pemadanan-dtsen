import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Initialize the client. It will automatically use process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({});

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Format history for Gemini API
    const formattedHistory = history.map((msg: any) => ({
      role: msg.role === 'bot' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'system',
          parts: [{ text: "Anda adalah asisten virtual resmi untuk aplikasi PAKEWA (Padanan Kesejahteraan Warga) dari Badan Pusat Statistik (BPS) Provinsi Sulawesi Tengah. Anda bertugas membantu instansi pemerintah daerah dalam melakukan pemadanan data kemiskinan ekstrem dengan DTSEN. Berikan jawaban yang profesional, ramah, dan solutif. Jika ditanya tentang waktu pemrosesan, sebutkan SLA adalah 1 hingga 5 hari kerja. Anda harus selalu menggunakan bahasa Indonesia yang baik dan sopan." }]
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
    console.error("Chatbot API Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan saat menghubungi server AI." }, { status: 500 });
  }
}
