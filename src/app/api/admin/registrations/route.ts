import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const registrations = await prisma.registration_requests.findMany({
      include: {
        users: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    return NextResponse.json({ success: true, data: registrations });
  } catch (error: any) {
    console.error("Fetch Registrations Error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server." }, { status: 500 });
  }
}
