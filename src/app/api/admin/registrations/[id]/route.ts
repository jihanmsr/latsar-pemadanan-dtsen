import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { action, reason } = await request.json(); // "approve" or "reject"
    const id = params.id;

    const reg = await prisma.registration_requests.findUnique({
      where: { id },
      include: { users: true }
    });

    if (!reg) {
      return NextResponse.json({ success: false, message: "Pendaftaran tidak ditemukan." }, { status: 404 });
    }

    if (action === "approve") {
      await prisma.registration_requests.update({
        where: { id },
        data: { status: "APPROVED" }
      });
      
      const defaultPassword = "Password123!";
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      // Create users based on the registration_users array
      for (const u of reg.users) {
        const existing = await prisma.users.findUnique({ where: { email: u.email } });
        if (!existing) {
          await prisma.users.create({
            data: {
              email: u.email,
              password: hashedPassword,
              name: u.nama_lengkap,
              role: "PEMDA",
              instansi: reg.nama_instansi
            }
          });
        }
      }

    } else if (action === "reject") {
      await prisma.registration_requests.update({
        where: { id },
        data: { 
          status: "REJECTED",
          alasan_penolakan: reason || null
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: action === "approve" ? "Pendaftaran disetujui dan akun telah dibuat." : "Pendaftaran ditolak."
    });

  } catch (error: any) {
    console.error("Action Registration Error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server." }, { status: 500 });
  }
}
