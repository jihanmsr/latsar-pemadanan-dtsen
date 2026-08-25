import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ success: false, message: "ID Tiket tidak diberikan." }, { status: 400 });
  }

  try {
    const registration = await prisma.registration_requests.findUnique({
      where: { id },
      select: {
        id: true,
        nama_instansi: true,
        kategori_instansi: true,
        status: true,
        alasan_penolakan: true,
        created_at: true,
      }
    });

    if (!registration) {
      return NextResponse.json({ success: false, message: "Tiket pengajuan tidak ditemukan. Pastikan ID Tiket sudah benar." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: registration });
  } catch (error) {
    console.error("Cek Status Error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan sistem. Silakan coba lagi nanti." }, { status: 500 });
  }
}
