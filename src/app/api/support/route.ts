import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { nama, email, pesan } = await request.json();

    if (!nama || !email || !pesan) {
      return NextResponse.json({ success: false, message: "Semua field wajib diisi." }, { status: 400 });
    }

    const newTicket = await prisma.support_tickets.create({
      data: {
        nama,
        email,
        pesan
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Pesan berhasil dikirim ke Admin. Kami akan membalas melalui email Anda." 
    });

  } catch (error: any) {
    console.error("Support API Error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan sistem. Silakan coba lagi." }, { status: 500 });
  }
}
