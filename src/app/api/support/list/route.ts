import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tickets = await prisma.support_tickets.findMany({
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json({ success: true, data: tickets });
  } catch (error: any) {
    console.error("List Tickets Error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan sistem." }, { status: 500 });
  }
}
