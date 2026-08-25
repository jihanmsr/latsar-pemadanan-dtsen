import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ success: false, message: "ID dan status wajib diberikan." }, { status: 400 });
    }

    const updated = await prisma.support_tickets.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Update Ticket Error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan sistem." }, { status: 500 });
  }
}
